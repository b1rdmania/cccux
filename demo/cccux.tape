# Records demo/cccux.gif and demo/cccux.mp4 against real Claude Code agents.
# Run from the repo root: vhs demo/cccux.tape (needs Claude Code, tmux, Bun).
Output demo/cccux.gif
Output demo/cccux.mp4

Set Shell zsh
Set FontSize 15
Set Width 1400
Set Height 820
Set Padding 24
Set Theme "Catppuccin Mocha"
Set TypingSpeed 60ms

Hide
Sleep 3s
Type "export CCMUX_HOME=/tmp/cccux-demo/ccmux CCMUX_TMUX_SOCKET=cccux-demo CCMUX_PORT=2272 PATH=$PWD/bin:$PATH" Enter
Type "PROMPT_DELAY=6 demo/setup.sh >/dev/null 2>&1; echo READY-$((40+2))" Enter
Wait+Screen@120s /READY-42/
Type "tmux -L cccux-demo new-session -A -s chair \; set status off" Enter
Sleep 1.5s
Type "export PATH=$PWD/bin:$PATH PROMPT='$ ' RPROMPT=''; clear" Enter
Sleep 1s
Show

# Watch mode: the agents work, one needs you.
Type "cccux" Sleep 300ms Enter
Sleep 5s
Wait+Screen@90s /needs u/
Sleep 2.5s
Type "j"
Sleep 800ms
Tab
Sleep 1.2s

# Try to help.
Type@110ms "let me just fix"
Sleep 2s
Type@400ms "it"
Sleep 1.5s

# Say yes. That's all they needed.
Type "1"
Sleep 2.5s
Tab
Sleep 1.5s

# Try to stop one.
Type "x"
Sleep 2s
Type "y"
Sleep 2.5s
Type "n"
Sleep 1.5s

# Leave.
Type "q"
Sleep 4s

# join-in mode: you can talk to them, politely.
Type "cccux --mode join-in" Sleep 300ms Enter
Wait+Screen@30s /Watching \(4\)/
Sleep 2s
Type "G"
Sleep 800ms
Tab
Sleep 1s
Type@120ms "can I help"
Sleep 1.2s
Enter
Sleep 7s
Escape
Sleep 500ms
Type "q"
Sleep 5s
