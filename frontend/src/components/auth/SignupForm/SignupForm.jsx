// ─────────────────────────────────────────────────────────────────────────────
// SignupForm.jsx — Glassy signup form card
// Mirrors LoginForm structure exactly — same card, same glass, same layout
// Fields: First Name, Last Name, Email, Password
// On submit: POST /api/auth/register → navigate to /signup/details
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowForward, MdPersonAdd } from "react-icons/md";
import { FiMail } from "react-icons/fi";
import { Field, PasswordField, OrDivider, GoogleButton } from "../../../components/ui/Fields/Field/Field";
import "../LoginForm/LoginForm.css";

export default function SignupForm() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: POST /api/auth/register → creates User + Mentee records
    // ERD: User { email, password, role } + Mentee { fullname, userID FK }
    navigate("/signup/details", { state: { firstName, email } });
  }

  return (
    <div className="login-form-panel">
      <div className="login-form-panel__glow" />

      <div className="login-form-card">
        <div className="login-form-card__glow-line" />

        {/* Header */}
        <div className="login-form-card__header">
          <div className="login-form-card__eyebrow">
            <div className="login-form-card__eyebrow-dot" />
            <span>Create your account</span>
          </div>
          <h1 className="login-form-card__heading">Join SheIsDesign</h1>
          <p className="login-form-card__subtext">
            It only takes a minute. Join 1,200+ women in design.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form-card__form">

          {/* Name row — two fields side by side */}
          <div className="login-form-card__name-row">
            <Field
              label="First Name"
              name="firstName"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Field
              label="Last Name"
              name="lastName"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <Field
            label="Email Address"
            type="email"
            name="email"
            placeholder="you@university.ac.za"
            icon={FiMail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordField
            label="Password"
            placeholder="Create a password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Primary button — swap for <PrimaryButton> when wiring up */}
          <button type="submit" className="login-form-card__submit">
            <MdPersonAdd size={18} />
            Sign Up
          </button>
        </form>

        <OrDivider />
        <GoogleButton label="Sign up with Google" />

        {/* Switch to login */}
        <p className="login-form-card__switch">
          Already have an account?{" "}
          <Link to="/login" className="login-form-card__switch-link">
            Log in
            <MdArrowForward size={13} />
          </Link>
        </p>

        {/* Terms */}
        <p className="login-form-card__terms">
          By signing up you agree to our{" "}
          <a href="/terms" className="login-form-card__terms-link">Terms of Service</a>
          {" "}and{" "}
          <a href="/privacy" className="login-form-card__terms-link">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}