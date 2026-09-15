import sqlite3,json,os,shutil
from pathlib import Path
p=Path(os.environ.get('HERMES_KANBAN_DB',str(Path.home()/'.hermes/kanban.db')))
c=sqlite3.connect(f'file:{p}?mode=ro',uri=True);c.row_factory=sqlite3.Row
print('TABLES',[r[0] for r in c.execute("select name from sqlite_master where type='table'")]);print('TASK_SCHEMA',[dict(r) for r in c.execute('pragma table_info(tasks)')])
rows=[dict(r) for r in c.execute("select id,title,status,assignee,workspace_path from tasks where status not in ('done','archived')")]
rows=[r for r in rows if any(x in str(r).lower() for x in ['landing','ressources','site-v2','seo'])]
Path(__file__).with_name('existing-cards.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2));print(json.dumps(rows,ensure_ascii=False,indent=2))
print('HERMES',Path(shutil.which('hermes')).resolve())
