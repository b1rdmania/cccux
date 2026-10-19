# cccux

Your agents do the work. You sit in the corner and watch.

cccux is a fork of [ccmux](https://github.com/epilande/ccmux), the tmux session manager for AI coding agents. It keeps everything ccmux does and takes away your keyboard.

<p align="center">
  <img alt="cccux watching four Claude Code agents. One asks for permission. The human tries to type and is told to sit back down." src="demo/cccux.gif" width="900">
</p>

The recording shows four real Claude Code agents. [demo/](demo/) has the script that made it.

## Install

You need Bun and tmux.

```sh
git clone https://github.com/b1rdmania/cccux.git
cd cccux
bun install
ln -s "$PWD/bin/cccux" ~/.local/bin/cccux
cccux setup
```

`cccux setup` installs the ccmux agent hooks. Without them, cccux cannot see when an agent asks for permission.

## Usage

Start your agents in tmux, then run:

```sh
cccux
```

Press Tab to open the selected agent's pane. These are the only keys that get through:

| Key | Use |
| :-- | :-- |
| `y` `n` | Answer a yes/no prompt |
| `1` `2` `3` | Pick an option in a Claude Code permission menu |
| `↑` `↓` `enter` | Move through a menu and confirm |

Any other key stays in cccux, and cccux tells you to sit back down.

To get the keyboard back:

```sh
cccux --let-me-type
```

## The chairs

cccux picks a chair at random each time it starts. You see it on the empty session list and in `cccux --help`. To print one, run `cccux chair office` (or `director`, `corner`, `executive`). `cccux chair all` prints all four.

<table>
<tr>
<td>
<pre>
   ┌─────┐
   │     │
   │     │
   └──┬──┘
╭─────┴─────╮  ← you
╰─────┬─────╯
      │
 ╶────┼────╴
 ●    ●    ●
</pre>
<p align="center">office</p>
</td>
<td>
<pre>
┌───────────┐
│  WATCHER  │
├─┬───────┬─┤
│ │       │ │  ← you
╪═╧═══════╧═╪
│ ╲       ╱ │
│   ╲   ╱   │
│     ╳     │
│   ╱   ╲   │
╵ ╱       ╲ ╵
</pre>
<p align="center">director</p>
</td>
</tr>
<tr>
<td>
<pre>
│
│   ╭─────────╮
│ ╭─┤         ├─╮
│ │ │         │ │
│ │ │         │ │
│ │ ╰─────────╯ │  ← you
│ │▁▁▁▁▁▁▁▁▁▁▁▁▁│
│ ╰─┬─────────┬─╯
│   ╵         ╵
└──────────────────
</pre>
<p align="center">corner</p>
</td>
<td>
<pre>
  ╭─────────╮
  │ ░░░░░░░ │
  │ ░░░░░░░ │
  │ ░░░░░░░ │
 ┌┴─────────┴┐
 │▀▀▀▀▀▀▀▀▀▀▀│  ← you
 └─────┬─────┘
   ╶───┼───╴
   ●   ●   ●
</pre>
<p align="center">executive</p>
</td>
</tr>
</table>

## Differences from ccmux

| ccmux | cccux |
| :-- | :-- |
| Sessions | Watching · 1 human observing |
| working | busy |
| waiting | needs u |
| idle | resting |
| done | spent |
| x kill | x intervene |
| Kill Session? | Intervene? are you sure? they seemed happy |
| y confirm · n cancel | y do it · n let them be |
| keys sent to pane | y/n/1-3/enter only |
| No sessions found | a chair, and "Nobody's working. Sit down anyway." |

The daemon, hooks, worktrees, handoffs, notifications and every other command are unchanged. See the [ccmux README](docs/ccmux-README.md) for the full reference.

## How it works

`bin/cccux` sets `CCCUX=1` and runs ccmux. All the changes are in [src/lib/chair.ts](src/lib/chair.ts): the labels, the chairs and the key filter. Without `CCCUX=1`, the code behaves as ccmux and passes the upstream tests. `bin/ccmux` is still there.

cccux uses the same config, port and hooks as ccmux. Do not run the two daemons at the same time.

## Credit

[epilande/ccmux](https://github.com/epilande/ccmux) did all of the real work. Go and star it.

## Licence

MIT. See [LICENSE](LICENSE). The original copyright notice is kept.
