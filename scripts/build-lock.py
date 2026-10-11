#!/usr/bin/env python3
"""Serialize complete builds across checkouts, including the self-hosted runner."""
import argparse
import errno
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import tempfile
import time


WAIT_SECONDS = 45 * 60
LOCK_FILE = Path('/Users/Shared/memlia-landing-build.lock') if sys.platform == 'darwin' else Path(tempfile.gettempdir()) / 'memlia-landing-build.lock'


def log(message):
    print(f'build-lock : {message}', file=sys.stderr, flush=True)


def run(command, lock=None):
    interrupted = None
    deadline = None
    child = None

    def interrupt(signum, _frame):
        nonlocal interrupted, deadline
        interrupted = signum
        deadline = time.monotonic() + 5
        if child is not None:
            try:
                os.killpg(child.pid, signum)
            except ProcessLookupError:
                pass

    for signum in (signal.SIGINT, signal.SIGTERM, signal.SIGHUP):
        signal.signal(signum, interrupt)
    if interrupted is not None:
        return 128 + interrupted
    child = subprocess.Popen(command, start_new_session=True, pass_fds=() if lock is None else (lock.fileno(),))
    if lock is not None:
        lock.seek(0)
        lock.truncate()
        json.dump({'pid': os.getpid(), 'childPid': child.pid, 'cwd': os.getcwd()}, lock)
        lock.flush()
    while child.poll() is None:
        if interrupted is not None:
            # Also covers a signal arriving between Popen and assignment to child.
            try:
                os.killpg(child.pid, signal.SIGKILL if deadline is not None and time.monotonic() >= deadline else interrupted)
            except ProcessLookupError:
                pass
        time.sleep(0.05)
    # An interrupted shell may exit before its descendants. Stop the whole group
    # before closing our descriptor; inherited descriptors protect abrupt death.
    if interrupted is not None:
        try:
            os.killpg(child.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
        return 128 + interrupted
    return child.returncode if child.returncode >= 0 else 128 - child.returncode


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--lock-file', type=Path, default=LOCK_FILE)
    parser.add_argument('--wait-seconds', type=float, default=WAIT_SECONDS)
    parser.add_argument('command', nargs=argparse.REMAINDER)
    args = parser.parse_args()
    command = args.command[1:] if args.command[:1] == ['--'] else args.command
    if not command or args.wait_seconds < 0:
        parser.error('commande requise et attente positive ou nulle')
    if os.environ.get('MEMLIA_BUILD_LOCK') == '0':
        if sys.platform == 'darwin':
            log('désactivation refusée sur le Mac ; agents et CI partagent le même verrou')
            return 2
        log('désactivé explicitement hors du Mac (MEMLIA_BUILD_LOCK=0)')
        return run(command)

    # Import only on the locked path: hosted Windows builds can opt out.
    import fcntl

    for signum in (signal.SIGINT, signal.SIGTERM, signal.SIGHUP):
        signal.signal(signum, lambda received, _frame: sys.exit(128 + received))
    started = time.monotonic()
    announced = False
    # Never unlink this file: deleting an inode still held by another build would
    # allow two independent locks. Stale metadata is informational, not ownership.
    with args.lock_file.open('a+', encoding='utf-8') as lock:
        while True:
            try:
                fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
                break
            except OSError as error:
                if error.errno not in (errno.EACCES, errno.EAGAIN):
                    raise
                if not announced:
                    log(f'attente du build actif ({args.lock_file}), limite {args.wait_seconds:g} s')
                    announced = True
                remaining = args.wait_seconds - (time.monotonic() - started)
                if remaining <= 0:
                    log(f'délai d’attente dépassé ({args.wait_seconds:g} s) ; aucun build lancé')
                    return 75
                time.sleep(min(0.2, remaining))
        log(f'verrou acquis ({args.lock_file})')
        try:
            return run(command, lock)
        finally:
            log('build terminé ; fermeture du verrou')


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (OSError, ValueError) as error:
        log(f'échec : {error}')
        sys.exit(1)
