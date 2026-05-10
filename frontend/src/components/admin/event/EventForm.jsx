import { useState} from "react"
import { T} from "../theme";

const CATEGORIES = ["Branding", "Motion", "UI/UX", "Typography", "Illustration", "Packaging", "Photography", "Web Design", "Other"];
const STATUSES   = ["OPEN", "DRAFT", "CLOSED", "UPCOMING"];



const EMPTY_FORM = {
  title: "", start_date: "", end_date: "", description: "",
  max_entries: "", category: "Branding", points_reward: "",
  status: "DRAFT", image_link: "", entry_count: 0, submissions: 0,
};



function Field({ label, required, children, hint }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: T.textSec, letterSpacing: "0.07em", textTransform: "uppercase" }}>
        {label}{required && <span style={{ color: T.pink }}> *</span>}
      </label>
      {children}
      {hint && <span style={{ fontSize: 11, color: T.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{hint}</span>}
    </div>
  );
}

const inputStyle = {
  background: T.surfaceHi, border: `1px solid ${T.border}`, borderRadius: 8,
  padding: "10px 14px", color: T.text,
  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
  outline: "none", width: "100%", boxSizing: "border-box",
  transition: "border-color 0.15s",
};

function EventForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial ? { ...initial } : { ...EMPTY_FORM });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = "Title is required";
    if (!form.start_date)         e.start_date  = "Start date is required";
    if (!form.end_date)           e.end_date    = "Deadline is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.max_entries || isNaN(form.max_entries) || +form.max_entries < 1) e.max_entries = "Enter a valid number";
    if (!form.points_reward || isNaN(form.points_reward) || +form.points_reward < 0) e.points_reward = "Enter a valid number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      ...form,
      max_entries: +form.max_entries,
      points_reward: +form.points_reward,
      entry_count: form.entry_count || 0,
      submissions: form.submissions || 0,
    });
  };

  const inp = (k, extra = {}) => ({
    ...inputStyle, ...extra,
    value: form[k] || "",
    onChange: e => set(k, e.target.value),
    onFocus: e => { e.target.style.borderColor = T.pink; },
    onBlur:  e => { e.target.style.borderColor = errors[k] ? T.red : T.border; },
    style: { ...inputStyle, ...extra, borderColor: errors[k] ? T.red : T.border },
  });

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <div style={{ gridColumn: "1/-1" }}>
          <Field label="Event Title" required>
            <input type="text" placeholder="e.g. Brand Identity Challenge" {...inp("title")} />
            {errors.title && <span style={{ fontSize: 11, color: T.red }}>{errors.title}</span>}
          </Field>
        </div>

        <Field label="Start Date" required>
          <input type="date" {...inp("start_date")} />
          {errors.start_date && <span style={{ fontSize: 11, color: T.red }}>{errors.start_date}</span>}
        </Field>

        <Field label="Submission Deadline" required>
          <input type="date" {...inp("end_date")} />
          {errors.end_date && <span style={{ fontSize: 11, color: T.red }}>{errors.end_date}</span>}
        </Field>

        <Field label="Category" required>
          <select {...inp("category")} style={{ ...inputStyle, borderColor: T.border, appearance: "none" }}>
            {CATEGORIES.map(c => <option key={c} value={c} style={{ background: T.surfaceHi }}>{c}</option>)}
          </select>
        </Field>

        <Field label="Status" required>
          <select {...inp("status")} style={{ ...inputStyle, borderColor: T.border, appearance: "none" }}>
            {STATUSES.map(s => <option key={s} value={s} style={{ background: T.surfaceHi }}>{s}</option>)}
          </select>
        </Field>

        <Field label="Max Entries" required>
          <input type="number" min="1" placeholder="e.g. 100" {...inp("max_entries")} />
          {errors.max_entries && <span style={{ fontSize: 11, color: T.red }}>{errors.max_entries}</span>}
        </Field>

        <Field label="Points Reward" required>
          <input type="number" min="0" placeholder="e.g. 500" {...inp("points_reward")} />
          {errors.points_reward && <span style={{ fontSize: 11, color: T.red }}>{errors.points_reward}</span>}
        </Field>

        <div style={{ gridColumn: "1/-1" }}>
          <Field label="Description" required>
            <textarea
              rows={4}
              placeholder="Describe the event, rules, deliverables..."
              {...inp("description")}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
            />
            {errors.description && <span style={{ fontSize: 11, color: T.red }}>{errors.description}</span>}
          </Field>
        </div>

        <div style={{ gridColumn: "1/-1" }}>
          <Field label="Image / Banner URL" hint="Optional — paste a URL to a cover image">
            <input type="url" placeholder="https://..." {...inp("image_link")} />
          </Field>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
        <button onClick={onClose} style={{
          background: "none", border: `1px solid ${T.border}`, borderRadius: 8,
          padding: "10px 20px", color: T.textSec, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.color = T.text; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = T.border;   e.currentTarget.style.color = T.textSec; }}
        >
          Cancel
        </button>
        <button onClick={handleSubmit} style={{
          background: T.pink, border: "none", borderRadius: 8,
          padding: "10px 24px", color: "#fff", cursor: "pointer",
          fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700,
          transition: "opacity 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          {initial ? "Save Changes" : "Create Event"}
        </button>
      </div>
    </div>
  );
}

export default EventForm;