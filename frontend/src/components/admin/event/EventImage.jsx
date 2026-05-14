import { T } from "../theme";
import {Image} from "@phosphor-icons/react";
import Icon from "./Icon";

export default function EventImage({ url, height = 180 }) {
  return (
    <div
      style={{
        height,
        background: T.surfaceBord,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {url ? (
        <img
          src={url}
          alt="Event"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div style={{ textAlign: "center", color: T.textMuted }}>
          <Image size={32} color={T.textMuted} />
          <div style={{ fontSize: 12, marginTop: 8 }}>No image</div>
        </div>
      )}
    </div>
  );
}
