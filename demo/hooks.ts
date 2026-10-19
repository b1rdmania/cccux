// Writes ccmux's Claude hook scripts and a settings file into the demo root,
// so the demo agents report state without touching ~/.claude/settings.json.
import { chmodSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import {
  SESSION_END_HOOK_SCRIPT,
  SESSION_START_HOOK_SCRIPT,
  STATE_NOTIFY_HOOK_SCRIPT,
} from "../src/daemon/adapters/claude/hook-scripts";

const root = process.argv[2]!;
const dir = join(root, ".hooks");
mkdirSync(dir, { recursive: true });
const scripts = {
  "ccmux-session-start.sh": SESSION_START_HOOK_SCRIPT,
  "ccmux-session-end.sh": SESSION_END_HOOK_SCRIPT,
  "ccmux-state-notify.sh": STATE_NOTIFY_HOOK_SCRIPT,
};
for (const [name, body] of Object.entries(scripts)) {
  writeFileSync(join(dir, name), body);
  chmodSync(join(dir, name), 0o755);
}
const hook = (name: string, matcher = "") => [
  { matcher, hooks: [{ type: "command", command: join(dir, name) }] },
];
writeFileSync(
  join(root, "settings.json"),
  JSON.stringify(
    {
      hooks: {
        SessionStart: hook("ccmux-session-start.sh"),
        SessionEnd: hook("ccmux-session-end.sh"),
        Notification: hook("ccmux-state-notify.sh", "idle_prompt|permission_prompt"),
      },
    },
    null,
    2,
  ),
);
