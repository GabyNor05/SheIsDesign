// ─────────────────────────────────────────────────────────────────────────────
// SignupDetailsPage.jsx — SheIsDesign sign up step 2 (about you)
// Centred layout, Student / Industry Professional toggle
// First name passed via location.state from SignupBasicPage
// API-ready: all handlers stubbed with TODO comments
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { generateOtp, getExpiryTimestamp, sendVerificationEmail } from "../../../services/emailService";
import {
  FiMail, FiBriefcase, // FiUpload, FiFile, — CV upload not yet implemented
} from "react-icons/fi";
import { MdBusiness, MdBadge, MdPalette, MdCheckCircle } from "react-icons/md";
import { Field, SelectField, TagInput } from "../../../components/ui/Fields/Field/Field";
import "./SignupDetailsPage.css";

// CV upload — not yet implemented
// function CVUploadZone({ file, onFile }) { ... }

// ─────────────────────────────────────────────────────────────────────────────
// Volunteer checkbox
// ─────────────────────────────────────────────────────────────────────────────
function VolunteerToggle({ checked, onChange }) {
  return (
    <div className="sdp-volunteer">
      <label className="sdp-volunteer__label" onClick={() => onChange(!checked)}>
        <div className={`sdp-volunteer__box ${checked ? "sdp-volunteer__box--checked" : ""}`}>
          {checked && <span className="material-icons" style={{ fontSize: "13px", color: "white" }}>check</span>}
        </div>
        <span className="sdp-volunteer__text">I'd like to volunteer for SheIsDesign events too</span>
      </label>
      {checked && (
        <div className="sdp-volunteer__note">
          <span className="material-icons sdp-volunteer__note-icon">volunteer_activism</span>
          <p className="sdp-volunteer__note-text">
            Great! You'll be notified about volunteer opportunities after your account is verified.
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Student form fields
// ─────────────────────────────────────────────────────────────────────────────
function StudentForm({ email, fields, onChange }) {
  return (
    <div className="sdp-fields">
      {/* ERD: User.email — disabled, pre-filled from step 1 */}
      <Field
        label="Email Address"
        type="email"
        staticValue={email}
        disabled
        icon={FiMail}
      />

      {/* ERD: Mentee.university */}
      <SelectField
        label="University"
        name="university"
        placeholder="Select your university"
        value={fields.university}
        onChange={(e) => onChange("university", e.target.value)}
        options={[
          "Open Window",
          "University of Cape Town",
          "University of Johannesburg",
          "Stellenbosch University",
          "Rhodes University",
          "Wits University",
          "CPUT",
          "Other",
        ]}
      />

      {/* ERD: Mentee.student_number */}
      <Field
        label="Student Number"
        name="studentNumber"
        placeholder="e.g. STU2024001"
        icon={MdBadge}
        value={fields.studentNumber}
        onChange={(e) => onChange("studentNumber", e.target.value)}
      />

      {/* ERD: Mentee.year_of_study */}
      <SelectField
        label="Year of Study"
        name="yearOfStudy"
        placeholder="Select year"
        value={fields.yearOfStudy}
        onChange={(e) => onChange("yearOfStudy", e.target.value)}
        options={["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate"]}
      />

      {/* ERD: Mentee.field_of_study */}
      <Field
        label="Field of Study"
        name="fieldOfStudy"
        placeholder="e.g. Graphic Design, UX Design…"
        icon={MdPalette}
        value={fields.fieldOfStudy}
        onChange={(e) => onChange("fieldOfStudy", e.target.value)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Industry Professional form fields
// ─────────────────────────────────────────────────────────────────────────────
function IndustryForm({ email, fields, onChange }) {
  return (
    <div className="sdp-fields">
      {/* ERD: User.email — disabled */}
      <Field
        label="Email Address"
        type="email"
        staticValue={email}
        disabled
        icon={FiMail}
      />

      {/* ERD: IndustryProfessional.institution (future table) */}
      <Field
        label="Institution / Organisation"
        name="institution"
        placeholder="Where do you currently work or teach?"
        icon={MdBusiness}
        value={fields.institution}
        onChange={(e) => onChange("institution", e.target.value)}
      />

      {/* ERD: IndustryProfessional.job_title */}
      <Field
        label="Job Title"
        name="jobTitle"
        placeholder="e.g. Senior UX Designer"
        icon={FiBriefcase}
        value={fields.jobTitle}
        onChange={(e) => onChange("jobTitle", e.target.value)}
      />

      {/* ERD: IndustryProfessional.skills (array / junction table) */}
      <TagInput
        label="Skills & Specialities"
        initialTags={["UX Design", "Service Design", "JavaScript"]}
      />

      {/* CV upload — not yet implemented */}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root page
// ─────────────────────────────────────────────────────────────────────────────
export default function SignupDetailsPage() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const firstName = location.state?.firstName || "there";
  const lastName  = location.state?.lastName  || "";
  const email     = location.state?.email     || "";
  const password  = location.state?.password  || "";

  const [tab, setTab] = useState("student");
  const [submitError, setSubmitError] = useState("");

  const [studentFields, setStudentFields] = useState({
    university:    "",
    studentNumber: "",
    yearOfStudy:   "",
    fieldOfStudy:  "",
  });
  const [wantsVolunteer, setWantsVolunteer] = useState(false);

  const [industryFields, setIndustryFields] = useState({
    institution: "",
    jobTitle:    "",
  });

  function handleStudentChange(key, val) {
    setStudentFields((p) => ({ ...p, [key]: val }));
  }

  function handleIndustryChange(key, val) {
    setIndustryFields((p) => ({ ...p, [key]: val }));
  }

const YEAR_MAP = {
  "1st Year": 1, "2nd Year": 2, "3rd Year": 3,
  "4th Year": 4, "Postgraduate": 5,
};

async function handleSubmit(e) {
  e.preventDefault();
  setSubmitError("");

  const code   = generateOtp();
  const expiry = getExpiryTimestamp();
  try {
    await sendVerificationEmail(email, firstName, code, expiry);
  } catch {
    // email failed — continue, user can resend on the OTP page
  }

  navigate("/signup/verify", {
    state: {
      firstName,
      lastName,
      email,
      password,
      code,
      expiry,
      tab,
      studentFields: {
        ...studentFields,
        year_of_study: YEAR_MAP[studentFields.yearOfStudy] ?? 1,
      },
      wantsVolunteer,
      industryFields,
    },
  });
}

  return (
    <div className="sdp-root">
      {/* Background glows */}
      <div className="sdp-glow sdp-glow--1" />
      <div className="sdp-glow sdp-glow--2" />
      <div className="sdp-dots" />

      {/* Nav */}
      <nav className="sdp-nav">
        <Link to="/" className="sdp-nav__logo">
          <div className="sdp-nav__logo-mark">
            <span className="material-icons" style={{ fontSize: "18px", color: "white" }}>brush</span>
          </div>
          <span className="sdp-nav__logo-text">SheisDesign</span>
        </Link>

        {/* Step indicator */}
        <div className="sdp-steps">
          <div className="sdp-step sdp-step--done">
            <div className="sdp-step__dot sdp-step__dot--done">
              <span className="material-icons" style={{ fontSize: "12px" }}>check</span>
            </div>
            <span className="sdp-step__label">Account</span>
          </div>
          <div className="sdp-step__connector sdp-step__connector--done" />
          <div className="sdp-step sdp-step--active">
            <div className="sdp-step__dot sdp-step__dot--active">2</div>
            <span className="sdp-step__label sdp-step__label--active">About you</span>
          </div>
        </div>

        <Link to="/login" className="sdp-nav__back">
          <span className="material-icons" style={{ fontSize: "15px" }}>arrow_back</span>
          Back to Login
        </Link>
      </nav>

      {/* Centred form card */}
      <main className="sdp-main">
        <div className="sdp-card">
          <div className="sdp-card__glow-line" />

          {/* Header — first name from step 1 */}
          <div className="sdp-card__header">
            <h1 className="sdp-card__heading">
              Welcome, <span className="sdp-card__heading-name">{firstName}.</span>
              <br />Tell us a little about yourself.
            </h1>
            <p className="sdp-card__subtext">This helps us personalise your experience.</p>
          </div>

          {/* Toggle */}
          <div className="sdp-toggle">
            <button
              type="button"
              className={`sdp-toggle__btn ${tab === "student" ? "sdp-toggle__btn--active" : ""}`}
              onClick={() => setTab("student")}
            >
              Student
            </button>
            <button
              type="button"
              className={`sdp-toggle__btn ${tab === "industry" ? "sdp-toggle__btn--active" : ""}`}
              onClick={() => setTab("industry")}
            >
              Industry Professional
            </button>
          </div>

          <div className="sdp-card__divider" />

          {/* Dynamic form body */}
          <form onSubmit={handleSubmit} className="sdp-card__form">
            {tab === "student" ? (
              <>
                <StudentForm
                  email={email}
                  fields={studentFields}
                  onChange={handleStudentChange}
                />
                <VolunteerToggle
                  checked={wantsVolunteer}
                  onChange={setWantsVolunteer}
                />
                <div className="sdp-info-notice">
                  <span className="material-icons sdp-info-notice__icon">info_outline</span>
                  <p className="sdp-info-notice__text">
                    Your details will be reviewed before your account is fully activated. This usually takes 1–2 business days.
                  </p>
                </div>
              </>
            ) : (
              <IndustryForm
                email={email}
                fields={industryFields}
                onChange={handleIndustryChange}
              />
            )}

            {submitError && (
              <p className="auth-card__error">{submitError}</p>
            )}

            <button type="submit" className="sdp-submit">
              <MdCheckCircle size={18} />
              Finish Setup
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}