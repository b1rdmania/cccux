# Records docs/demo/cccux.gif and docs/demo/cccux.mp4 against real Claude Code agents.
# Run from the repo root: vhs docs/demo/cccux.tape (needs Claude Code, tmux, Bun).
Output docs/demo/cccux.gif
Output docs/demo/cccux.mp4

Set Shell zsh
Set FontSize 15
Set Width 1400
Set Height 820
Set Padding 24
Set Theme "Catppuccin Mocha"
Set TypingSpeed 55ms

Hide
Sleep 3s
Type "export CCMUX_HOME=/tmp/cccux-demo/ccmux CCMUX_TMUX_SOCKET=cccux-demo CCMUX_PORT=2272 PATH=$PWD/bin:$PATH" Enter
Type "PROMPT_DELAY=14 docs/demo/setup.sh >/dev/null 2>&1; echo READY-$((40+2))" Enter
Wait+Screen@120s /READY-42/
Type "tmux -L cccux-demo new-session -A -s chair \; set status off" Enter
Sleep 1.5s
Type "export PATH=$PWD/bin:$PATH PROMPT='$ ' RPROMPT=''; setopt interactivecomments; clear" Enter
Sleep 1s
Show

# The chair.
Type "# this is your chair" Sleep 300ms Enter
Sleep 600ms
Type "cccux chair corner" Sleep 300ms Enter
Sleep 2.5s
Type "# these are your agents. you watch them." Sleep 300ms Enter
Sleep 600ms
Type "cccux" Sleep 300ms Enter
Sleep 6s

# One needs you.
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
Sleep 4.5s

Hide
Type "clear" Enter
Sleep 300ms
Show

# join-in: you may speak, politely.
Type "# join-in mode. you may speak. politely." Sleep 300ms Enter
Sleep 600ms
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
Sleep 4s

Hide
Type "clear" Enter
Sleep 300ms
Show

# The keyboard.
Type "# want your keyboard back?" Sleep 300ms Enter
Sleep 600ms
Type "cccux --let-me-type" Sleep 300ms Enter
Sleep 1.5s
Type@150ms "no"
Sleep 400ms
Enter
Sleep 3.5s
