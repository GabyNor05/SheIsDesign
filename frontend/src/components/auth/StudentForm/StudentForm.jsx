import { useState } from "react";
import SelectField from "../../ui/Fields/SelectField/SelectField";
import { Field } from '../../ui/Fields/Field/Field';

const UNIVERSITIES = [
  "University of Cape Town",
  "University of Johannesburg",
  "Stellenbosch University",
  "University of the Witwatersrand",
  "Rhodes University",
  "CPUT",
  "Tshwane University of Technology",
  "University of Pretoria",
  "Open Window",
  "Other",
];

const YEARS = [
  "1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate",
];

function StudentForm({ form, onChange, errors }) {
  const [wantsVolunteer, setWantsVolunteer] = useState(false);

  return (
    <div className="student-form">
      <Field
        label="Email Address"
        name="email"
        type="email"
        value={form.email}
        disabled
      />
      <SelectField
        label="University"
        name="university"
        value={form.university}
        onChange={onChange}
        options={UNIVERSITIES}
        placeholder="Select your university"
        error={errors.university}
      />
      <div className="student-form__row">
        <Field
          label="Student Number"
          name="studentNumber"
          placeholder="e.g. STU2024001"
          value={form.studentNumber}
          onChange={onChange}
          error={errors.studentNumber}
        />
        <SelectField
          label="Year of Study"
          name="yearOfStudy"
          value={form.yearOfStudy}
          onChange={onChange}
          options={YEARS}
          placeholder="Select year"
          error={errors.yearOfStudy}
        />
      </div>
      <Field
        label="Field of Study"
        name="fieldOfStudy"
        placeholder="e.g. Graphic Design, UX Design…"
        value={form.fieldOfStudy}
        onChange={onChange}
        error={errors.fieldOfStudy}
      />

      {/* Volunteer checkbox */}
      <label className="student-form__volunteer-label">
        <div className="student-form__checkbox-wrap">
          <input
            type="checkbox"
            checked={wantsVolunteer}
            onChange={e => setWantsVolunteer(e.target.checked)}
            className="student-form__checkbox-input"
          />
          <div className={`student-form__checkbox ${wantsVolunteer ? "student-form__checkbox--checked" : ""}`}>
            {wantsVolunteer && (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>
        <span className="student-form__volunteer-text">
          I'd like to volunteer for SheIsDesign events too
        </span>
      </label>

      {wantsVolunteer && (
        <div className="student-form__volunteer-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <p>Great! You'll be notified about volunteer opportunities after your account is verified.</p>
        </div>
      )}
    </div>
  );
}

export default StudentForm;