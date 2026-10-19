# cccux

```
   ┌─────┐
   │     │
   │     │
   └──┬──┘
╭─────┴─────╮  ← you
╰─────┬─────╯
      │
 ╶────┼────╴
 ●    ●    ●
```

Your agents do the work. You sit in the corner and watch.

cccux is [ccmux](https://github.com/epilande/ccmux) with one change: you're in the chair.

```
 ● Watching (4) · 1 human observing
 1 ⠹ busy    api:main               Claude
 2 ● needs u web:fix-auth           Claude
 3 ● resting docs:main              Codex
 4 ● spent   infra:terraform        Claude
```

## What you can do

- Watch.
- Press `y` or `n` when they need you.
- Press `1`, `2`, `3`, the arrow keys or enter, if their menu asks for that.

That's all. Tab into a pane and type anything else, and cccux tells you to sit back down.

## What changed

| ccmux | cccux |
| :-- | :-- |
| Sessions | Watching · 1 human observing |
| working | busy |
| waiting | needs u |
| idle | resting |
| done | spent |
| x kill | x intervene |
| Kill Session? | Intervene? are you sure? they seemed happy |
| keys sent to pane | y/n/1-3/enter only |

Everything else is ccmux: the daemon, the hooks, the worktrees, the handoffs. It all still works. You just don't get to touch much of it.

## Install

Requires Bun and tmux.

```sh
git clone https://github.com/b1rdmania/cccux.git
cd cccux
bun install
ln -s "$PWD/bin/cccux" ~/.local/bin/cccux
cccux setup
```

Start your agents in tmux as usual, then:

```sh
cccux
```

## Getting the keyboard back

```sh
cccux --let-me-type
```

Nobody will think less of you.

## How it works

`bin/cccux` sets `CCCUX=1` and runs ccmux. `src/lib/chair.ts` holds the labels and the key filter. Without `CCCUX=1`, it behaves exactly like ccmux, and the upstream tests pass.

## Credit

All the real work is [epilande/ccmux](https://github.com/epilande/ccmux), MIT licensed. Its README is at [docs/ccmux-README.md](docs/ccmux-README.md). Go and star it. They did the work. We just watched.

## Licence

MIT. See [LICENSE](LICENSE).
