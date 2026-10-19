# Demo

`cccux.gif` and `cccux.mp4` are recordings of four real Claude Code agents (Haiku) in throwaway repos.

To record them again, run this from the repo root:

```sh
vhs docs/demo/cccux.tape
```

You need [VHS](https://github.com/charmbracelet/vhs), Claude Code, tmux and Bun.

| File | What it does |
| :-- | :-- |
| `setup.sh` | Makes four repos in `/tmp/cccux-demo`, starts an agent in each on a separate tmux server, and sends each a prompt. |
| `hooks.ts` | Writes the ccmux hook scripts and a settings file into `/tmp/cccux-demo`. |
| `cccux.tape` | Prints a chair, opens cccux, tries to type, says yes, tries to stop an agent, quits, joins in, then asks for the keyboard back. |
| `*.png` | Frames from the recording, used in the main README. |

The demo does not change `~/.claude` or `~/.config/ccmux`. The agents skip your user settings, so they ask for permission like a new install. The demo daemon uses its own home folder, tmux server and port (2272).
