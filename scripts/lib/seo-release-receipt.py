"""Procedural SEO receipt: called only by the authenticated Telegram callback.

The callback MUST authenticate the update before calling ingest_telegram_choice.
This is not a signature: an administrator who controls the gateway and its DB can
forge receipts. Ordinary Kanban comments and run metadata cannot create one.
"""
import json
import re
import sqlite3
from contextlib import closing
from pathlib import Path

REPO = "saphiron222/memlia-landing"
SHA = re.compile(r"[0-9a-f]{40}\Z")
TASK = re.compile(r"t_[0-9a-f]+\Z")
AUTHORIZE = "Autoriser cette release SEO"
REFUSE = "Refuser cette release SEO"
FIELDS = {"repo", "pr", "pr_head", "main_sha", "scope", "qa_task"}


def _home():
    return Path.home() / ".hermes"


def _request(conn, task_id, event_id):
    task = conn.execute("SELECT status, block_kind FROM tasks WHERE id=?", (task_id,)).fetchone()
    event = conn.execute("SELECT id, payload FROM task_events WHERE task_id=? AND kind IN "
                         "('blocked','block_loop_detected','gave_up') ORDER BY id DESC LIMIT 1",
                         (task_id,)).fetchone()
    if not task or not event or event[0] != event_id:
        return None
    try:
        reason = json.loads(event[1] or "{}")["reason"]
        assert reason.startswith("DECISION_JSON:")
        raw = json.loads(reason[len("DECISION_JSON:"):].strip())
        release = raw["seo_release"]
    except (ValueError, TypeError, KeyError, AssertionError):
        return None
    if (not isinstance(release, dict) or set(release) != FIELDS or
        release.get("repo") != REPO or release.get("scope") != "seo-measures" or
        type(release.get("pr")) is not int or release["pr"] < 1 or
        not SHA.fullmatch(str(release.get("pr_head"))) or
        not SHA.fullmatch(str(release.get("main_sha"))) or
        not TASK.fullmatch(str(release.get("qa_task"))) or
        release["qa_task"] == task_id or
        not isinstance(raw.get("options"), list) or len(raw["options"]) != 2 or
        [option.get("label") for option in raw["options"] if isinstance(option, dict)] !=
        [AUTHORIZE, REFUSE]):
        return None
    return release, task


def _subscribed(conn, task_id, chat_id, user_id):
    row = conn.execute("SELECT user_id,user_id_alt,chat_type FROM kanban_notify_subs "
                       "WHERE task_id=? AND chat_id=? AND platform='telegram' LIMIT 1",
                       (task_id, chat_id)).fetchone()
    if not row:
        return False
    allowed = {str(value) for value in row[:2] if value not in (None, "")}
    return user_id in allowed if allowed else row[2] in ("dm", "private") and user_id == chat_id


def _delivered(task_id, event_id):
    try:
        item = json.loads((_home() / "state/block-resolver.json").read_text())["tasks"][task_id]
        return (item["telegram_message_id"] if item["event_id"] == event_id and
                item["outcome"] == "waiting_decision" else None)
    except (OSError, ValueError, KeyError, TypeError):
        return None


def ingest_telegram_choice(task_id, event_id, option, chat_id, user_id, callback_id, message_id):
    """Call after the gateway's callback authorization and current-decision check.

    Return False for non-SEO decisions; raise for an invalid SEO decision so the
    gateway does not unblock the card or claim that a receipt was recorded.
    """
    with closing(sqlite3.connect(_home() / "kanban.db")) as conn:
        with conn:
            found = _request(conn, task_id, event_id)
            if not found:
                latest = conn.execute("SELECT payload FROM task_events WHERE task_id=? "
                                      "ORDER BY id DESC LIMIT 1", (task_id,)).fetchone()
                try:
                    reason = json.loads(latest[0] or "{}").get("reason", "") if latest else ""
                except (ValueError, TypeError):
                    reason = ""
                if '"seo_release"' in reason:
                    raise ValueError("SEO decision: malformed or stale request")
                return False
            release, task = found
            if (task != ("blocked", "needs_input") or option not in (0, 1) or
                not _subscribed(conn, task_id, str(chat_id), str(user_id)) or
                not callback_id or _delivered(task_id, event_id) != message_id or
                not isinstance(message_id, int) or message_id < 1):
                raise ValueError("SEO decision: unverified callback, identity or delivery")
            conn.execute("CREATE TABLE IF NOT EXISTS seo_release_receipts ("
                         "event_id INTEGER PRIMARY KEY, task_id TEXT NOT NULL, request_json TEXT NOT NULL, "
                         "option INTEGER NOT NULL, chat_id TEXT NOT NULL, user_id TEXT NOT NULL, "
                         "callback_id TEXT NOT NULL UNIQUE, message_id INTEGER NOT NULL)")
            existing = conn.execute("SELECT task_id, request_json, option, chat_id, user_id, "
                                    "callback_id, message_id FROM seo_release_receipts WHERE event_id=?",
                                    (event_id,)).fetchone()
            if existing:
                if existing == (task_id, json.dumps(release, sort_keys=True), option,
                                str(chat_id), str(user_id), callback_id, message_id):
                    return True  # same callback may retry if Kanban unblock failed
                raise ValueError("SEO decision: event already recorded by another callback")
            conn.execute("INSERT INTO seo_release_receipts VALUES (?,?,?,?,?,?,?,?)",
                         (event_id, task_id, json.dumps(release, sort_keys=True), option,
                          str(chat_id), str(user_id), callback_id, message_id))
    return True


def verified_receipt(task_id):
    """Read only the local gateway ledger and re-check its event and request."""
    uri = (_home() / "kanban.db").resolve().as_uri() + "?mode=ro"
    with closing(sqlite3.connect(uri, uri=True)) as conn:
        row = conn.execute("SELECT name FROM sqlite_master WHERE type='table' "
                           "AND name='seo_release_receipts'").fetchone()
        if not row:
            return None
        row = conn.execute("SELECT event_id, request_json, option, chat_id, user_id, message_id "
                           "FROM seo_release_receipts WHERE task_id=? ORDER BY event_id DESC LIMIT 1",
                           (task_id,)).fetchone()
        if not row:
            return None
        event_id, recorded, option, chat_id, user_id, message_id = row
        found = _request(conn, task_id, event_id)
        if not found or found[0] != json.loads(recorded) or not _subscribed(
                conn, task_id, chat_id, user_id):
            return None
        # Never turn an old decision into authorization for a later blocked event.
        if option != 0:
            return None
        return {**found[0], "verified": True, "channel": "telegram",
                "decision": "AUTHORIZE", "authorization_task": task_id}


if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2 or not TASK.fullmatch(sys.argv[1]):
        raise SystemExit(2)
    print(json.dumps(verified_receipt(sys.argv[1])))
