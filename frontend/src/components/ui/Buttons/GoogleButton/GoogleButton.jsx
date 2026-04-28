import { FcGoogle } from "react-icons/fc";
import "./GoogleButton.css";

function GoogleButton({ onClick, label = "Continue with Google" }) {
  return (
    <button type="button" onClick={onClick} className="google-btn">
      <FcGoogle size={18} />
      <span>{label}</span>
    </button>
  );
}

export default GoogleButton;