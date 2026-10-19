/**
 * The chair. `bin/cccux` sets `CCCUX=1`; everything else in the fork reads
 * this module and stays byte-identical to upstream ccmux when it is unset,
 * so upstream tests pass and rebases stay cheap.
 *
 * The bit: the agents do the work. You sit in the corner and watch.
 */
import type { SessionStatus } from "../types";

export const CHAIR = process.env.CCCUX === "1";

/** `--let-me-type` (or `CCCUX_HANDS=1`) gives you the keyboard back. */
export const HANDS = process.env.CCCUX_HANDS === "1";

export const BIN = CHAIR ? "cccux" : "ccmux";

export const MODES = ["watch", "just-watch", "join-in", "beg", "yes-man"] as const;
export type ChairMode = (typeof MODES)[number];

export const MODE: ChairMode = (MODES as readonly string[]).includes(
  process.env.CCCUX_MODE ?? "",
)
  ? (process.env.CCCUX_MODE as ChairMode)
  : "watch";

export const MODE_TAGLINE: Record<ChairMode, string> = {
  watch: "watching",
  "just-watch": "just watching",
  "join-in": "sometimes joins in",
  beg: "begging",
  "yes-man": "yes-man",
};

/** Status labels. Seven columns max (`StatusBadge` pads to 7), and the short
 *  form is four, so each gets its own short spelling rather than a slice. */
const LABELS: Record<string, { full: string; short: string }> = {
  working: { full: "busy", short: "busy" },
  waiting: { full: "needs u", short: "you!" },
  idle: { full: "resting", short: "rest" },
  done: { full: "spent", short: "used" },
  agents: { full: "group", short: "grp" },
};

export function chairLabel(
  label: SessionStatus | "done" | "agents",
  mode: "full" | "short",
): string | null {
  if (!CHAIR) return null;
  const entry = LABELS[label];
  return entry ? entry[mode] : null;
}

/** After this many blocked keys, `watch` mode takes `n` away as well. */
export const YES_ONLY_AFTER = 10;

/** What happens to a key pressed while an agent pane has focus. */
export type KeyVerdict =
  | { action: "send"; answer?: "yes" | "no" }
  | { action: "buffer" }
  | { action: "block"; reason?: string };

const MENU_YES = new Set(["y", "1", "2", "return", "enter"]);
const MENU_NO = new Set(["n", "3"]);
const MENU_MOVE = new Set(["up", "down"]);

function answerKind(name: string): "yes" | "no" | undefined {
  if (MENU_YES.has(name)) return "yes";
  if (MENU_NO.has(name)) return "no";
  return undefined;
}

/** Answering a permission prompt. Every mode but `just-watch` can do this;
 *  how much of it depends on the mode and on how badly you've behaved. */
function menuVerdict(name: string, blocked: number, mode: ChairMode): KeyVerdict {
  if (mode === "yes-man" || (mode === "watch" && blocked >= YES_ONLY_AFTER)) {
    if (name === "y" || name === "1" || name === "return" || name === "enter") {
      return { action: "send", answer: "yes" };
    }
    return {
      action: "block",
      reason: mode === "yes-man" ? "that's not your call" : "that's not your call any more",
    };
  }
  if (MENU_YES.has(name) || MENU_NO.has(name) || MENU_MOVE.has(name)) {
    return { action: "send", answer: answerKind(name) };
  }
  return { action: "block" };
}

export function chairKeyVerdict(
  key: { name: string; ctrl?: boolean; meta?: boolean },
  ctx: { waiting: boolean; blocked: number; buffer: string },
): KeyVerdict {
  if (!CHAIR || HANDS) return { action: "send" };
  if (key.ctrl || key.meta) return { action: "block" };
  if (MODE === "just-watch") {
    return { action: "block", reason: "just watching means just watching" };
  }
  if (ctx.waiting || MODE === "watch" || MODE === "yes-man") {
    return menuVerdict(key.name, ctx.blocked, MODE);
  }
  const editing = key.name === "backspace" || key.name === "return" || key.name === "enter";
  if (MODE === "join-in") {
    if (editing || key.name === "space" || key.name.length === 1) return { action: "buffer" };
    return { action: "block" };
  }
  // beg: the only word you get is "please".
  if (editing) return { action: "buffer" };
  if ("please".startsWith(ctx.buffer + key.name)) return { action: "buffer" };
  return { action: "block", reason: "say please" };
}

/** What `join-in` actually sends. The agent receives every word of it. */
export function joinInWrap(text: string): string {
  return `sorry to interrupt — ${text.trim()} — no pressure, ignore this if you're busy`;
}

const SHUSH_TIERS: Array<{ from: number; lines: string[] }> = [
  {
    from: 0,
    lines: [
      "you're just watching",
      "hands where they can see them",
      "they've got this",
      "sit back down",
      "shh. they're working",
      "y or n. that's the deal",
    ],
  },
  {
    from: 5,
    lines: [
      "they can hear you breathing",
      "you're making it weird",
      "nobody asked",
      "stop touching things",
    ],
  },
  {
    from: 10,
    lines: [
      "this is why they don't ask you",
      "they're talking about you in the logs",
      "you've lost keyboard privileges",
      "they asked for a yes, not your opinion",
    ],
  },
  {
    from: 20,
    lines: [
      "go and get them a drink",
      "maybe go for a walk",
      "they'd like some privacy",
      "the chair is right there",
    ],
  },
];

export function chairShush(blocked: number): string {
  let lines = SHUSH_TIERS[0]!.lines;
  for (const tier of SHUSH_TIERS) if (blocked >= tier.from) lines = tier.lines;
  return pick(lines);
}

export const APPROVED = [
  "that's all we needed from you",
  "thank you. that'll be all",
  "good. back in the chair",
];

export const REFUSED = ["noted. they'll ignore that", "bold", "they'll find another way"];

export function pick(lines: string[]): string {
  return lines[Math.floor(Math.random() * lines.length)]!;
}

/** One chair per launch, for the empty list and `--help`. */
export const CHAIRS: Record<string, string[]> = {
  office: [
    "   ┌─────┐",
    "   │     │",
    "   │     │",
    "   └──┬──┘",
    "╭─────┴─────╮  ← you",
    "╰─────┬─────╯",
    "      │",
    " ╶────┼────╴",
    " ●    ●    ●",
  ],
  director: [
    "┌───────────┐",
    "│  WATCHER  │",
    "├─┬───────┬─┤",
    "│ │       │ │  ← you",
    "╪═╧═══════╧═╪",
    "│ ╲       ╱ │",
    "│   ╲   ╱   │",
    "│     ╳     │",
    "│   ╱   ╲   │",
    "╵ ╱       ╲ ╵",
  ],
  corner: [
    "│",
    "│   ╭─────────╮",
    "│ ╭─┤         ├─╮",
    "│ │ │         │ │",
    "│ │ │         │ │",
    "│ │ ╰─────────╯ │  ← you",
    "│ │▁▁▁▁▁▁▁▁▁▁▁▁▁│",
    "│ ╰─┬─────────┬─╯",
    "│   ╵         ╵",
    "└──────────────────",
  ],
  executive: [
    "  ╭─────────╮",
    "  │ ░░░░░░░ │",
    "  │ ░░░░░░░ │",
    "  │ ░░░░░░░ │",
    " ┌┴─────────┴┐",
    " │▀▀▀▀▀▀▀▀▀▀▀│  ← you",
    " └─────┬─────┘",
    "   ╶───┼───╴",
    "   ●   ●   ●",
  ],
};

const names = Object.keys(CHAIRS);
export const CHAIR_ART: string[] =
  CHAIRS[names[Math.floor(Math.random() * names.length)]!]!;

/** What the agents are up to, as far as the figure in the chair cares. */
export type Mood = "watching" | "needed" | "resting" | "ignored";

export const MOOD_LINE: Record<Mood, string> = {
  watching: "they're busy",
  needed: "they need you (briefly)",
  resting: "they're resting. you're still here",
  ignored: "they finished without you",
};

/** The figure: three rows of person over a fixed office chair. The mood
 *  sets the posture and the mode sets the hands. */
const BASE = [" ╭─┴───┴─╮", " ╰───┬───╯", "  ╶──┼──╴", "  ●  ●  ●"];

const HANDS_BY_MODE: Record<ChairMode, [string, string]> = {
  watch: ["     o", "   ┌/|\\┐"],
  "just-watch": ["     o", "   ┌(|)┐"],
  "join-in": ["     o/", "   ┌/| ┐"],
  beg: ["     o", "   ┌>|<┐"],
  "yes-man": ["     o b", "   ┌/|/┐"],
};

export function figure(mood: Mood, mode: ChairMode = MODE): string[] {
  switch (mood) {
    case "needed":
      return ["       o", "   ┌──/|\\", "   │  / >", ...BASE];
    case "resting":
      return ["", "   ┌───┐", "   │_o_│", ...BASE];
    case "ignored":
      return ["    (o)", "   ┌─|─┐", "   │/ \\│", ...BASE];
    default: {
      const [head, arms] = HANDS_BY_MODE[mode];
      return [head, arms, "   │/ \\│", ...BASE];
    }
  }
}

/** Shown for half a second after three blocked keys in a row. */
export const SIT_DOWN = [
  "▄▀▀ █ ▀█▀    █▀▄ █▀█ █ █ █ █▄ █  ",
  "▀▀▄ █  █     █ █ █ █ █▄█▄█ █ ▀█  ",
  "▄▄▀ █  █  ▄  █▄▀ █▄█  ▀ ▀  █  █ ▄",
];

/** The receipt printed when you quit. */
export function receipt(stats: {
  sat: string;
  agents: number;
  yes: number;
  no: number;
  blocked: number;
  sent: number;
  theirLines: number | null;
}): string {
  const rows: Array<[string, string]> = [
    ["time in chair", stats.sat],
    ["agents watched", String(stats.agents)],
    ["times you said yes", String(stats.yes)],
    ["times you said no", String(stats.no)],
    ["blocked keystrokes", String(stats.blocked)],
    [
      "lines they wrote",
      stats.theirLines == null ? "lots" : stats.theirLines.toLocaleString("en-GB"),
    ],
    ["lines you wrote", "0"],
  ];
  if (MODE === "join-in" || MODE === "beg") {
    rows.push(["messages you sent", String(stats.sent)]);
  }
  const width = 36;
  const row = ([l, r]: [string, string]) => `│ ${l.padEnd(width - 4 - r.length)}${r} │`;
  return [
    "",
    "leaving already? they'll finish without you.",
    "",
    `┌─ SESSION RECEIPT ${"─".repeat(width - 20)}┐`,
    ...rows.map(row),
    `└─ thank you for watching ${"─".repeat(width - 27)}┘`,
    "",
  ].join("\n");
}
