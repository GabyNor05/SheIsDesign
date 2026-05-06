import { useState } from "react";
import "./TagInput.css";

function TagInput({ label = "Skills & Specialities", tags, onChange }) {
  const [input, setInput] = useState("");

  function addTag(val) {
    const trimmed = val.trim();
    if (trimmed && !tags.includes(trimmed)) onChange([...tags, trimmed]);
    setInput("");
  }

  function removeTag(tag) {
    onChange(tags.filter(t => t !== tag));
  }

  return (
    <div className="tag-input">
      {label && <label className="tag-input__label">{label}</label>}
      <div className="tag-input__field">
        {tags.map(tag => (
          <span key={tag} className="tag-input__tag">
            {tag}
            <button
              type="button"
              className="tag-input__remove"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(input); }
            if (e.key === "Backspace" && !input && tags.length) onChange(tags.slice(0, -1));
          }}
          placeholder={tags.length === 0 ? "e.g. UX Design, JavaScript… press Enter" : "Add a skill…"}
          className="tag-input__text"
        />
      </div>
    </div>
  );
}

export default TagInput;