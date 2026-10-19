# Records demo/cccux.gif and demo/cccux.mp4 against real Claude Code agents.
# Run from the repo root: vhs demo/cccux.tape (needs Claude Code, tmux, Bun).
Output demo/cccux.gif
Output demo/cccux.mp4

Set Shell zsh
Set FontSize 15
Set Width 1400
Set Height 780
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
Type "export PATH=$PWD/bin:$PATH; clear" Enter
Sleep 1s
Show

Type "cccux chair office" Sleep 400ms Enter
Sleep 2s
Type "cccux" Sleep 400ms Enter
Sleep 4s

Wait+Screen@90s /needs u/
Sleep 2s
Type "j"
Sleep 1s
Tab
Sleep 1.5s
Type@250ms "let me just"
Sleep 1.5s
Type "1"
Sleep 3s
Tab
Sleep 2s

Type "x"
Sleep 4s
Type "n"
Sleep 4s

Type "q"
Sleep 500ms
Type "cccux chair corner" Sleep 400ms Enter
Sleep 3s
