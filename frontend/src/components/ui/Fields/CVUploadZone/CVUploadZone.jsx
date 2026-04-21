import { useState, useRef } from "react";
import "./CVUploadZone.css";

function CVUploadZone({ label = "CV / Career Summary", fileName, onChange }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onChange(file.name);
  }

  return (
    <div className="cv-upload">
      {label && <label className="cv-upload__label">{label}</label>}
      <div
        className={[
          "cv-upload__zone",
          dragging  ? "cv-upload__zone--drag"   : "",
          fileName  ? "cv-upload__zone--filled"  : "",
        ].join(" ").trim()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && inputRef.current?.click()}
      >
        <span className="cv-upload__icon" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </span>
        {fileName ? (
          <span className="cv-upload__filename">{fileName}</span>
        ) : (
          <>
            <span className="cv-upload__title">Upload your CV or career summary</span>
            <span className="cv-upload__hint">PDF or Word, max 5MB — drag &amp; drop or click</span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="cv-upload__input"
          onChange={e => { const f = e.target.files?.[0]; if (f) onChange(f.name); }}
        />
      </div>
    </div>
  );
}

export default CVUploadZone;