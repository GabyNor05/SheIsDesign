import { T } from "../theme";

function Card({ children, style = {}, glow = false }) {
  return (
    <div style={{
      background: T.pinkDim,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: "20px 22px",
      transition: "border-color 0.2s",
      ...(glow ? { boxShadow: `0 0 0 1px ${T.pink}22` } : {}),
      ...style,
    }}>
      {children}
    </div>
  );
}

export default Card;