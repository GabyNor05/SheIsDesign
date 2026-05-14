import { T } from "../theme";
import Icon from "./Icon";

export default function MetaRow({ icon, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        color: T.textSecond,
      }}
    >
      <Icon name={icon} size={14} color={T.textMuted} />
      <span>{text}</span>
    </div>
  );
}
