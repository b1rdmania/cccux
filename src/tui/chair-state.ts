/**
 * Live state for the chair: what you've been allowed to do, what you tried
 * to do, and the receipt for both. Only read when `CHAIR` is on.
 */
import { readFileSync, realpathSync, statSync } from "fs";
import { join } from "path";
import { createSignal } from "solid-js";
import { receipt } from "../lib/chair";

const startedAt = Date.now();
const [blocked, setBlocked] = createSignal(0);
const [yes, setYes] = createSignal(0);
const [no, setNo] = createSignal(0);
const [sent, setSent] = createSignal(0);
const [sitDown, setSitDown] = createSignal(false);
const [wobble, setWobble] = createSignal(false);
const [buffer, setBuffer] = createSignal("");
const [armed, setArmed] = createSignal(false);

const cwds = new Set<string>();
let recentBlocks: number[] = [];
let pickerRan = false;

export const chair = {
  blocked,
  yes,
  no,
  sent,
  sitDown,
  wobble,
  buffer,
  setBuffer,
  armed,
  setArmed,
  minutes: () => Math.floor((Date.now() - startedAt) / 60_000),
  /** "41s" under a minute, "12m" after. */
  sat: () => {
    const secs = Math.floor((Date.now() - startedAt) / 1000);
    return secs < 60 ? `${secs}s` : `${Math.floor(secs / 60)}m`;
  },

  /** A key that didn't get through. Three inside two seconds earns the
   *  full-screen SIT. DOWN. */
  block() {
    setBlocked((n) => n + 1);
    setWobble(true);
    setTimeout(() => setWobble(false), 250);
    const now = Date.now();
    recentBlocks = [...recentBlocks.filter((t) => now - t < 2000), now];
    if (recentBlocks.length >= 3) {
      recentBlocks = [];
      setSitDown(true);
      setTimeout(() => setSitDown(false), 700);
    }
  },
  answered(kind: "yes" | "no") {
    if (kind === "yes") setYes((n) => n + 1);
    else setNo((n) => n + 1);
  },
  messageSent() {
    setSent((n) => n + 1);
  },
  saw(cwd: string | undefined) {
    if (!cwd) return;
    try {
      cwds.add(realpathSync(cwd));
    } catch {
      cwds.add(cwd);
    }
  },
  pickerStarted() {
    pickerRan = true;
  },
};

/** Lines added in each watched repo since the picker opened: commits made
 *  since then plus whatever is still uncommitted. Null when git can't say. */
function theirLines(): number | null {
  const since = `@${Math.floor(startedAt / 1000)}`;
  let total = 0;
  let any = false;
  for (const cwd of [...cwds].slice(0, 12)) {
    for (const args of [
      ["log", `--since=${since}`, "--numstat", "--format="],
      ["diff", "HEAD", "--numstat"],
    ]) {
      const out = Bun.spawnSync(["git", "-C", cwd, ...args], {
        stdout: "pipe",
        stderr: "ignore",
        timeout: 2000,
      });
      if (out.exitCode !== 0) continue;
      any = true;
      for (const line of out.stdout.toString().split("\n")) {
        const added = Number.parseInt(line.split("\t")[0] ?? "", 10);
        if (Number.isFinite(added)) total += added;
      }
    }
  }
  for (const cwd of [...cwds].slice(0, 12)) total += untrackedLines(cwd);
  return any ? total : null;
}

/** New files git isn't tracking yet still count: agents write those too. */
function untrackedLines(cwd: string): number {
  const out = Bun.spawnSync(["git", "-C", cwd, "ls-files", "--others", "--exclude-standard"], {
    stdout: "pipe",
    stderr: "ignore",
    timeout: 2000,
  });
  if (out.exitCode !== 0) return 0;
  let lines = 0;
  for (const file of out.stdout.toString().split("\n").filter(Boolean).slice(0, 200)) {
    try {
      const path = join(cwd, file);
      if (statSync(path).size > 1_000_000) continue;
      lines += readFileSync(path, "utf8").split("\n").length - 1;
    } catch {}
  }
  return lines;
}

export function chairReceipt(): string | null {
  if (!pickerRan) return null;
  return receipt({
    sat: chair.sat(),
    agents: cwds.size,
    yes: yes(),
    no: no(),
    blocked: blocked(),
    sent: sent(),
    theirLines: theirLines(),
  });
}
