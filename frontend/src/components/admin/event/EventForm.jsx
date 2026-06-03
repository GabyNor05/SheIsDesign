import { useState } from "react";
import { T } from "../theme";
import FormField from "./FormField";
import { eventService } from "../../../services/eventService";
import { cloudinaryService } from "../../../services/CloudinaryService.js";

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

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (validate()) {
      let uploadedImageUrl = null;

      try {
        if (form.image_link && form.image_link instanceof File) {
          console.log("Uploading image to Cloudinary...");
          
          uploadedImageUrl = await cloudinaryService.uploadImage(form.image_link, 'event_banners');
          
          if (!uploadedImageUrl) {
            throw new Error("Failed to upload event image to Cloudinary.");
          }
        } else if (typeof form.image_link === 'string') {
          uploadedImageUrl = form.image_link;
        }

        const utcStartDate = form.start_date ? new Date(form.start_date).toISOString() : null;
        const utcEndDate = form.end_date ? new Date(form.end_date).toISOString() : null;

        const eventDTO = {
          title: form.title,
          start_date: utcStartDate,
          end_date: utcEndDate, 
          description: form.description,
          max_entry: Number(form.max_entries), 
          category: form.category,
          points_reward: Number(form.points_reward), 
          status: form.status || "draft", 
          image_link: uploadedImageUrl 
        };

        console.log("Submitting Event DTO:", eventDTO);

        onSave(form);

        const response = await eventService.createEvent(eventDTO);
        console.log("Event created successfully:", response);

      } catch (error) {
        console.error("Form submission failed:", error);
        alert(error.message || "An error occurred while creating the event.");
      } 
    }
  };

  const bindInput = (key, type = "text", placeholder = "") => {
    const inputProps = {
      type,
      placeholder,
      onChange: e => {
        if (type === "file") {
          set(key, e.target.files[0]); 
        } else {
          set(key, e.target.value);
        }
      },
      style: { ...inputStyle, borderColor: errors[key] ? T.closedRed : T.border },
      onFocus: e => { e.target.style.borderColor = T.pink; },
      onBlur: e => { e.target.style.borderColor = errors[key] ? T.closedRed : T.border; },
    };

    if (type !== "file") {
      inputProps.value = form[key] || "";
    }

    return inputProps;
  };

  return (
    <div className="p-8">
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
          <input {...bindInput("start_date", "datetime-local")} />
        </FormField>
        <FormField label="End Date" required error={errors.end_date}>
          <input {...bindInput("end_date", "datetime-local")} />
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
        <FormField label="Upload Image">
          <input {...bindInput("image_link", "file")} accept="image/*" />
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