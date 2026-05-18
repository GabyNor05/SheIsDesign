import { useState } from "react";
import { T } from "../theme";
import FormField from "./FormField";

const inputStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13,
  padding: "10px 12px",
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  color: T.textPrimary,
  width: "100%",
  boxSizing: "border-box",
};

export default function EventForm({ initial = null, onSave, onClose }) {
  const [form, setForm] = useState(initial || {});
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const newErrors = {};
    if (!form.title?.trim()) newErrors.title = "Title is required";
    if (!form.category?.trim()) newErrors.category = "Category is required";
    if (!form.start_date) newErrors.start_date = "Start date is required";
    if (!form.end_date) newErrors.end_date = "End date is required";
    if (!form.max_entries || form.max_entries <= 0) newErrors.max_entries = "Max entries must be > 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(form);
    }
  };

  const bindInput = (key, type = "text", placeholder = "") => ({
    type,
    placeholder,
    value: form[key] || "",
    onChange: e => set(key, e.target.value),
    style: { ...inputStyle, borderColor: errors[key] ? T.closedRed : T.border },
    onFocus: e => { e.target.style.borderColor = T.pink; },
    onBlur: e => { e.target.style.borderColor = errors[key] ? T.closedRed : T.border; },
  });

  return (
    <div>
      <FormField label="Event Title" required error={errors.title}>
        <input {...bindInput("title", "text", "E.g. Brand Identity Challenge")} />
      </FormField>

      <FormField label="Category" required error={errors.category}>
        <select
          value={form.category || ""}
          onChange={e => set("category", e.target.value)}
          style={{
            ...inputStyle,
            borderColor: errors.category ? T.closedRed : T.border,
            cursor: "pointer",
          }}
        >
          <option value="">Select category</option>
          <option value="Brand Identity">Brand Identity</option>
          <option value="Motion Design">Motion Design</option>
          <option value="UX Design">UX Design</option>
          <option value="Graphic Design">Graphic Design</option>
          <option value="Illustration">Illustration</option>
        </select>
      </FormField>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormField label="Start Date" required error={errors.start_date}>
          <input {...bindInput("start_date", "date")} />
        </FormField>
        <FormField label="End Date" required error={errors.end_date}>
          <input {...bindInput("end_date", "date")} />
        </FormField>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormField label="Max Entries" required error={errors.max_entries}>
          <input {...bindInput("max_entries", "number", "100")} />
        </FormField>
        <FormField label="Points Reward">
          <input {...bindInput("points_reward", "number", "500")} />
        </FormField>
      </div>

      <FormField label="Description">
        <textarea
          value={form.description || ""}
          onChange={e => set("description", e.target.value)}
          style={{
            ...inputStyle,
            minHeight: 100,
            fontFamily: "'DM Sans', sans-serif",
            resize: "vertical",
          }}
          placeholder="Event description..."
        />
      </FormField>

      <div>
        <FormField label="Image URL">
          <input {...bindInput("image_link", "text", "https://example.com/image.jpg")} />
        </FormField>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
        <button
          onClick={onClose}
          style={{
            padding: "10px 20px",
            background: T.surfaceBord,
            border: "none",
            borderRadius: 8,
            color: T.textSecond,
            cursor: "pointer",
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            background: T.pink,
            border: "none",
            borderRadius: 8,
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {initial ? "Update" : "Create"} Event
        </button>
      </div>
    </div>
  );
}
