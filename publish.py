"""Publish Everyone Who Ever Lived to https://everyone-who-ever-lived.pages.dev.

1. Copies the game from its source in the Drive (pessoal/games/any-human-ever/) into site/ and SOURCES.md to the root.
2. Runs `wrangler pages deploy` from this folder, so the counter function and its D1 binding go with the page.
3. Prints the git status; committing and pushing the GitHub copy stays a separate, manual step.

Needs the wrangler login done once on this machine by Daniel (`npx wrangler login`). The script never handles a token.
Usage: python publish.py [--preview NAME]   (--preview publishes to NAME.everyone-who-ever-lived.pages.dev, same database)
"""
import argparse
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = Path.home() / "Meu Drive" / "Claude Cowork" / "pessoal" / "games" / "any-human-ever"
PROJECT = "everyone-who-ever-lived"
WRANGLER = "wrangler@4.152.0"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--preview", metavar="NAME", help="branch alias for a test deploy instead of production")
    args = ap.parse_args()

    shutil.copy2(SOURCE / "index.html", ROOT / "site" / "index.html")
    shutil.copy2(SOURCE / "SOURCES.md", ROOT / "SOURCES.md")
    branch = args.preview or "main"
    npx = shutil.which("npx") or shutil.which("npx.cmd")
    cmd = [npx, "--yes", WRANGLER, "pages", "deploy", "--project-name", PROJECT, "--branch", branch, "--commit-dirty=true"]
    p = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace")
    out = (p.stdout + p.stderr).encode("ascii", "replace").decode("ascii")   # the Windows console chokes on wrangler's emoji
    print(out[-1500:])
    if p.returncode:
        sys.exit(p.returncode)
    print(subprocess.run(["git", "status", "-s"], cwd=ROOT, capture_output=True, text=True).stdout)


if __name__ == "__main__":
    main()
