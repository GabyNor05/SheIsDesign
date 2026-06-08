import { useState, useEffect, useRef } from "react";
import { X, CloudArrowUp, Lightning, Tag, FileText, CheckCircle } from "@phosphor-icons/react";
import { cloudinaryService } from "../../services/CloudinaryService";
import { postService } from "../../services/postManagementService";

const CATEGORIES = [
  "Brand Identity",
  "Graphic Design",
  "UX Design",
  "Motion Design",
  "UI Design",
  "Print & Packaging",
];

export default function SubmitWorkModal({ onClose, onSuccess, studentId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [eventId, setEventId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetch("http://localhost:5160/api/Event").then((r) => r.json());
        setEvents(Array.isArray(data) ? data : []);
      } catch {
        setEvents([]);
      } finally {
        setEventsLoading(false);
      }
    }
    loadEvents();
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleFileSelect(file) {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPG, PNG, GIF, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10 MB.");
      return;
    }
    setError(null);
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  async function handleSubmit() {
    if (!title.trim())  { setError("Please add a title for your work."); return; }
    if (!category)      { setError("Please select a category."); return; }
    if (!imageFile)     { setError("Please upload an image of your work."); return; }

    setError(null);
    setSubmitting(true);

    try {
      // Step 1 — upload to Cloudinary
      setUploadProgress("Uploading image…");
      const imageUrl = await cloudinaryService.uploadImage(imageFile, "posts");

      if (!imageUrl) {
        throw new Error("Image upload failed. Please try again.");
      }

      // Step 2 — create post
      setUploadProgress("Saving your post…");
      const postData = {
        Title:         title.trim(),
        Description:   description.trim(),
        Category:      category,
        StudentId:     studentId,
        EventId:       eventId ? Number(eventId) : null,
        ImageFileLink: imageUrl,
        Status:        "Pending",
      };

      const newPost = await postService.createPost(postData);

      setSuccess(true);
      setTimeout(() => {
        onSuccess(newPost);
        onClose();
      }, 1800);

    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
      setUploadProgress("");
    }
  }

  return (
    <div className="submit-modal__backdrop" onClick={onClose}>
      <div
        className={`submit-modal ${success ? "submit-modal--success" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="submit-modal__header">
          <div className="submit-modal__header-left">
            <div className="submit-modal__header-eyebrow">
              <Lightning size={12} weight="fill" color="#FE4081" />
              <span>Share Your Work</span>
            </div>
            <h2 className="submit-modal__header-title">Post to Gallery</h2>
          </div>
          <button className="submit-modal__close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Success overlay */}
        {success && (
          <div className="submit-modal__success-overlay">
            <div className="submit-modal__success-icon">
              <CheckCircle size={52} weight="fill" color="#10e266" />
            </div>
            <p className="submit-modal__success-title">Work Posted!</p>
            <p className="submit-modal__success-sub">
              Your project is under review and will appear in the gallery once approved.
            </p>
          </div>
        )}

        {/* Body */}
        <div className="submit-modal__body">

          {/* Left: image upload */}
          <div className="submit-modal__left">
            <div
              className={`submit-modal__drop-zone
                ${dragOver     ? "submit-modal__drop-zone--active"    : ""}
                ${imagePreview ? "submit-modal__drop-zone--has-image" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="submit-modal__preview-img" />
                  <div className="submit-modal__preview-overlay">
                    <CloudArrowUp size={24} />
                    <span>Change image</span>
                  </div>
                </>
              ) : (
                <div className="submit-modal__drop-content">
                  <div className="submit-modal__drop-icon">
                    <CloudArrowUp size={32} color="#C41262" />
                  </div>
                  <p className="submit-modal__drop-title">Drop your image here</p>
                  <p className="submit-modal__drop-sub">
                    or click to browse — JPG, PNG, GIF, WEBP up to 10 MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
            </div>

            {imageFile && (
              <div className="submit-modal__file-info">
                <span className="submit-modal__file-name">{imageFile.name}</span>
                <button
                  className="submit-modal__file-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Right: form fields */}
          <div className="submit-modal__right">

            <div className="submit-modal__field">
              <label className="submit-modal__label">
                <FileText size={12} />
                Project Title <span className="submit-modal__required">*</span>
              </label>
              <input
                className="submit-modal__input"
                type="text"
                placeholder="e.g. Bloom — Wellness Brand Identity"
                value={title}
                maxLength={80}
                onChange={(e) => setTitle(e.target.value)}
              />
              <span className="submit-modal__char-count">{title.length}/80</span>
            </div>

            <div className="submit-modal__field">
              <label className="submit-modal__label">
                <Tag size={12} />
                Category <span className="submit-modal__required">*</span>
              </label>
              <div className="submit-modal__pills">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`submit-modal__pill ${category === cat ? "submit-modal__pill--active" : ""}`}
                    onClick={() => setCategory(cat)}
                    type="button"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="submit-modal__field">
              <label className="submit-modal__label">
                <Lightning size={12} />
                Event (optional)
              </label>
              {eventsLoading ? (
                <div className="submit-modal__events-loading">Loading events…</div>
              ) : events.length === 0 ? (
                <div className="submit-modal__events-loading">No events available</div>
              ) : (
                <select
                  className="submit-modal__select"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                >
                  <option value="">— Not linked to an event —</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name || ev.title || ev.eventName || `Event #${ev.id}`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="submit-modal__field">
              <label className="submit-modal__label">
                <FileText size={12} />
                Description
              </label>
              <textarea
                className="submit-modal__textarea"
                placeholder="Describe your project, process, or inspiration…"
                value={description}
                maxLength={600}
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
              />
              <span className="submit-modal__char-count">{description.length}/600</span>
            </div>

            {error && (
              <div className="submit-modal__error">{error}</div>
            )}

            <button
              className={`submit-modal__submit ${submitting ? "submit-modal__submit--loading" : ""}`}
              onClick={handleSubmit}
              disabled={submitting || success}
              type="button"
            >
              {submitting ? (
                <>
                  <span className="submit-modal__spinner" />
                  {uploadProgress || "Submitting…"}
                </>
              ) : (
                <>
                  <Lightning size={15} weight="fill" />
                  Post to Gallery
                </>
              )}
            </button>

            <p className="submit-modal__disclaimer">
              Posts are reviewed before appearing publicly in the gallery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}