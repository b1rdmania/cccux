/**
 * The chair. `bin/cccux` sets `CCCUX=1`; everything else in the fork reads
 * this module and stays byte-identical to upstream ccmux when it is unset,
 * so upstream tests pass and rebases stay cheap.
 *
 * The bit: the agents do the work. You sit in the corner and watch. Your
 * only input is yes or no.
 */
import type { SessionStatus } from "../types";

export const CHAIR = process.env.CCCUX === "1";

/** `--let-me-type` (or `CCCUX_HANDS=1`) gives you the keyboard back. */
export const HANDS = process.env.CCCUX_HANDS === "1";

export const BIN = CHAIR ? "cccux" : "ccmux";

/** Status labels. Seven columns max (`StatusBadge` pads to 7), and the short
 *  form is four, so each gets its own short spelling rather than a slice. */
const LABELS: Record<string, { full: string; short: string }> = {
  working: { full: "busy", short: "busy" },
  waiting: { full: "needs u", short: "you!" },
  idle: { full: "resting", short: "rest" },
  done: { full: "spent", short: "sped" },
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

/** Keys the chair lets through to an agent pane: enough to answer a
 *  permission prompt (Claude's numbered menu, y/n prompts elsewhere, arrows
 *  and enter to pick), and nothing you could write a prompt with. */
const ALLOWED = new Set(["y", "n", "1", "2", "3", "return", "enter", "up", "down"]);

export function chairAllowsKey(name: string, ctrl: boolean, meta: boolean): boolean {
  if (!CHAIR || HANDS) return true;
  if (ctrl || meta) return false;
  return ALLOWED.has(name);
}

const SHUSH = [
  "you're just watching",
  "hands where they can see them",
  "they've got this",
  "sit back down",
  "shh. they're working",
  "y or n. that's the deal",
];

export function chairShush(): string {
  return SHUSH[Math.floor(Math.random() * SHUSH.length)]!;
}
