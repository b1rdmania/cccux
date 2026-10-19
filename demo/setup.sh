#!/usr/bin/env bash
# Starts four real Claude Code agents (Haiku) in throwaway repos on an
# isolated tmux server, for recording demo/cccux.tape. User settings are
# skipped so the agents ask permission the way a stock install does.
set -euo pipefail
ROOT="${DEMO_ROOT:-/tmp/cccux-demo}"
SOCK=cccux-demo
export CCMUX_TMUX_SOCKET=$SOCK CCMUX_PORT=2272 CCMUX_HOME="$ROOT/ccmux"
HERE="$(cd "$(dirname "$0")/.." && pwd)"
t() { tmux -L "$SOCK" "$@"; }

"$HERE/bin/ccmux" daemon stop >/dev/null 2>&1 || true
t kill-server 2>/dev/null || true
rm -rf "$ROOT" && mkdir -p "$ROOT/ccmux"


for p in api-server web-app infra docs; do
  mkdir "$ROOT/$p"
  (cd "$ROOT/$p" && git init -q && echo "# $p" > README.md \
    && git add . && git -c commit.gpgsign=false commit -qm init)
done
printf 'const http = require("http");\nhttp.createServer((q, s) => s.end("ok")).listen(3000);\n' > "$ROOT/api-server/server.js"
printf '<!doctype html><title>web</title><h1>Hello</h1>\n' > "$ROOT/web-app/index.html"

bun "$HERE/demo/hooks.ts" "$ROOT"

t new-session -d -s agents -x 200 -y 50 -c "$ROOT/api-server"
t split-window -h -t agents -c "$ROOT/web-app"
t split-window -v -t agents.0 -c "$ROOT/infra"
t split-window -v -t agents.2 -c "$ROOT/docs"
for i in 0 1 2 3; do
  t send-keys -t agents.$i "clear && claude --model haiku --setting-sources project,local --permission-mode default --settings $ROOT/settings.json" Enter
done
sleep 7
for i in 0 1 2 3; do t send-keys -t agents.$i Down; sleep 0.3; t send-keys -t agents.$i C-m; done
sleep 5
# The daemon only trusts hook markers when it finds the hooks in
# $HOME/.claude/settings.json. Give it a home of its own that has them.
FAKE="$ROOT/home"
mkdir -p "$FAKE/.claude"
cp "$ROOT/settings.json" "$FAKE/.claude/settings.json"
ln -s "$HOME/.claude/projects" "$FAKE/.claude/projects"
HOME="$FAKE" "$HERE/bin/ccmux" daemon start -b >/dev/null
sleep 2

printf '{"groupBy":"none","showPreview":true}\n' > "$CCMUX_HOME/ccmux.json"

prompt() { t send-keys -t "agents.$1" -l "$2"; sleep 1; t send-keys -t "agents.$1" C-m; }
# Pane 0 edits a file, so it stops to ask. The others only read and write
# long answers, so they stay busy and then finish on their own.
# PROMPT_DELAY holds the prompts back so a recording can open the picker first.
send_prompts() {
sleep "${PROMPT_DELAY:-0}"
prompt 0 "Add a /health endpoint to server.js that returns JSON with uptime."
prompt 3 "Read README.md. Then write about 600 words on how to structure docs for a three-service app: api, web, worker. Answer here, do not write files."
prompt 2 "Read index.html. Then explain in about 400 words how you would add a dark mode toggle. Answer here, do not edit."
prompt 1 "Explain in about 500 words what a good Dockerfile and fly.toml look like for a node app on port 3000. Answer here, do not write files."
}
send_prompts </dev/null >/dev/null 2>&1 &
echo "agents running on tmux -L $SOCK"
