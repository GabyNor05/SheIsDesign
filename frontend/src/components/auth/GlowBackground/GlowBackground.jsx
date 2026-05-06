import "./GlowBackground.css";

function GlowBackground() {
  return (
    <div className="glow-bg" aria-hidden="true">
      <div className="glow-bg__blob glow-bg__blob--1" />
      <div className="glow-bg__blob glow-bg__blob--2" />
      <div className="glow-bg__blob glow-bg__blob--3" />
    </div>
  );
}

export default GlowBackground;