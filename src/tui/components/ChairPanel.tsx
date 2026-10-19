import type { Component } from "solid-js";
import { For, createMemo } from "solid-js";
import { getEffectiveStatus } from "../../daemon/status-machine";
import type { FilteredSession } from "../utils/grouping";
import { figure, MODE, MODE_TAGLINE, MOOD_LINE, type Mood } from "../../lib/chair";
import { chair } from "../chair-state";
import { useTick } from "../store";
import { theme } from "../theme";
import { Text } from "./Text";

export const CHAIR_PANEL_HEIGHT = 8;

/** The person in the chair, always in the corner of the list. */
export const ChairPanel: Component<{ sessions: FilteredSession[] }> = (props) => {
  const { tick } = useTick();

  const mood = createMemo((): Mood => {
    const sessions = props.sessions.map((f) => f.session);
    const statuses = sessions.map((s) => getEffectiveStatus(s).status);
    for (const s of sessions) chair.saw(s.cwd);
    if (statuses.includes("waiting")) return "needed";
    if (statuses.includes("working")) return "watching";
    if (sessions.some((s) => s.attentionState)) return "ignored";
    return "resting";
  });

  const side = () => {
    tick();
    return [
      "← you",
      MODE_TAGLINE[MODE],
      MOOD_LINE[mood()],
      "",
      `in chair     ${chair.sat()}`,
      `said yes     ${chair.yes()}`,
      `said no      ${chair.no()}`,
      `blocked      ${chair.blocked()}`,
    ];
  };

  const rows = () => {
    const pad = chair.wobble() ? " " : "";
    const fig = figure(mood());
    const info = side();
    return Array.from(
      { length: CHAIR_PANEL_HEIGHT },
      (_, i) => `${pad}${(fig[i] ?? "").padEnd(14)}${info[i] ?? ""}`,
    );
  };

  return (
    <box flexDirection="column" height={CHAIR_PANEL_HEIGHT} flexShrink={0} paddingLeft={1}>
      <For each={rows()}>
        {(line, i) => (
          <Text fg={i() === 0 || mood() === "needed" ? theme.subtext : theme.overlay}>
            {line}
          </Text>
        )}
      </For>
    </box>
  );
};
