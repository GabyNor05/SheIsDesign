import "./PrimaryButton.css";

function PrimaryButton({ children, onClick, type = "button", disabled, fullWidth = true }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        "primary-btn",
        disabled  ? "primary-btn--disabled" : "",
        fullWidth ? "primary-btn--full"     : "",
      ].join(" ").trim()}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;