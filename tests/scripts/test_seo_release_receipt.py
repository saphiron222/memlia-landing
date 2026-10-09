"""Isolated gateway-ledger ingestion tests; no live Telegram message or Kevin identity."""
import importlib.util
import json
import sqlite3
import tempfile
import unittest
from contextlib import closing
from pathlib import Path
from unittest.mock import patch

SOURCE = Path(__file__).resolve().parents[2] / "scripts/lib/seo-release-receipt.py"
spec = importlib.util.spec_from_file_location("seo_release_receipt", SOURCE)
assert spec is not None and spec.loader is not None
receipts = importlib.util.module_from_spec(spec)
spec.loader.exec_module(receipts)
HEAD, MAIN = "a" * 40, "b" * 40
RELEASE = {"repo": receipts.REPO, "pr": 12, "pr_head": HEAD, "main_sha": MAIN,
           "scope": "seo-measures", "qa_task": "t_aa"}


class ReceiptTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.home = Path(self.temp.name) / ".hermes"
        (self.home / "state").mkdir(parents=True)
        self.scope = patch.object(receipts, "_home", return_value=self.home)
        self.scope.start()
        self.addCleanup(self.scope.stop)
        self.db = self.home / "kanban.db"
        with closing(sqlite3.connect(self.db)) as db, db:
            db.executescript("CREATE TABLE tasks (id TEXT, status TEXT, block_kind TEXT);"
                             "CREATE TABLE task_events (id INTEGER, task_id TEXT, kind TEXT, payload TEXT);"
                             "CREATE TABLE kanban_notify_subs (task_id TEXT, chat_id TEXT, "
                             "platform TEXT, user_id TEXT, user_id_alt TEXT, chat_type TEXT);")
            db.execute("INSERT INTO tasks VALUES ('t_bb','blocked','needs_input')")
            db.execute("INSERT INTO kanban_notify_subs VALUES ('t_bb','chat','telegram','human',NULL,'private')")
        self.propose()
        self.deliver()

    def propose(self, release=RELEASE, event_id=42, options=None):
        proposal = {"seo_release": release,
                    "question": "Autoriser cette release SEO après la QA indépendante ?",
                    "context": "La release SEO reste suspendue en attente de votre décision.",
                    "evidence": "La QA et les contrôles du dépôt sont à revalider.",
                    "rationale": "Sans votre accord Telegram la release reste fermée.",
                    "recommended": 1,
                    "options": options or [
                        {"label": receipts.AUTHORIZE, "impact": "Permet la release SEO après les autres contrôles."},
                        {"label": receipts.REFUSE, "impact": "Maintient la suspension de la release SEO."}]}
        with closing(sqlite3.connect(self.db)) as db, db:
            db.execute("INSERT INTO task_events VALUES (?, 't_bb', 'blocked', ?)",
                       (event_id, json.dumps({"reason": "DECISION_JSON: " + json.dumps(proposal)})))

    def deliver(self, event_id=42, message_id=77):
        (self.home / "state/block-resolver.json").write_text(json.dumps({"tasks": {
            "t_bb": {"event_id": event_id, "outcome": "waiting_decision",
                     "telegram_message_id": message_id}}}))

    def ingest(self, option=0, user="human", chat="chat", event=42, callback="cb1", message=77):
        return receipts.ingest_telegram_choice("t_bb", event, option, chat, user, callback, message)

    def test_real_ingestion_and_readback_binds_exact_request(self):
        self.assertIsNone(receipts.verified_receipt("t_bb"))
        self.assertTrue(self.ingest())
        actual = receipts.verified_receipt("t_bb")
        self.assertEqual({key: actual[key] for key in RELEASE}, RELEASE)
        self.assertEqual((actual["channel"], actual["decision"]), ("telegram", "AUTHORIZE"))
        self.assertTrue(self.ingest())  # retry after failed Kanban unblock
        with self.assertRaises(ValueError):
            self.ingest(callback="cb2")  # replay of the same blocked event
        with closing(sqlite3.connect(self.db)) as db, db:
            db.execute("INSERT INTO task_events VALUES (43,'t_bb','blocked','{}')")
        self.assertIsNone(receipts.verified_receipt("t_bb"))  # new decision required

    def test_receipt_survives_resolver_state_change_after_unblock(self):
        self.assertTrue(self.ingest())
        with closing(sqlite3.connect(self.db)) as db, db:
            db.execute("UPDATE tasks SET status='ready', block_kind=NULL WHERE id='t_bb'")
        self.deliver(message_id=78)  # resolver may advance past waiting_decision
        self.assertEqual(receipts.verified_receipt("t_bb")["decision"], "AUTHORIZE")

    def test_refusal_never_authorizes(self):
        self.assertTrue(self.ingest(option=1))
        self.assertIsNone(receipts.verified_receipt("t_bb"))

    def test_unknown_identity_chat_and_delivery_never_create_receipt(self):
        for user, chat, message in (("forged", "chat", 77), ("human", "other", 77),
                                    ("human", "chat", 78)):
            with self.subTest(user=user, chat=chat, message=message), self.assertRaises(ValueError):
                self.ingest(user=user, chat=chat, message=message)
        self.assertIsNone(receipts.verified_receipt("t_bb"))

    def test_other_repo_scope_or_qa_and_expired_event_never_create_receipt(self):
        with self.assertRaises(ValueError):
            self.ingest(event=1)
        for key, value in (("repo", "outsider/site"), ("scope", "blog"), ("qa_task", "t_bb")):
            for audit in (False, True):
                with self.subTest(key=key, audit=audit):
                    with closing(sqlite3.connect(self.db)) as db, db:
                        db.execute("DELETE FROM task_events")
                    self.propose({**RELEASE, key: value})
                    if audit:
                        with closing(sqlite3.connect(self.db)) as db, db:
                            db.execute("INSERT INTO task_events VALUES (43,'t_bb','commented','{}')")
                    with self.assertRaises(ValueError):
                        self.ingest()
                    self.assertIsNone(receipts.verified_receipt("t_bb"))
                    with closing(sqlite3.connect(self.db)) as db:
                        self.assertEqual(db.execute("SELECT name FROM sqlite_master WHERE "
                                                    "name='seo_release_receipts'").fetchall(), [])

    def test_self_declared_comment_and_metadata_are_not_a_receipt(self):
        with closing(sqlite3.connect(self.db)) as db, db:
            db.execute("CREATE TABLE task_comments (task_id TEXT, author TEXT, body TEXT)")
            db.execute("INSERT INTO task_comments VALUES ('t_bb','Kevin','AUTHORIZE')")
        self.assertIsNone(receipts.verified_receipt("t_bb"))


if __name__ == "__main__":
    unittest.main()
