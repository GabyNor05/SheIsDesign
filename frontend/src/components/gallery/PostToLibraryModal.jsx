// This modal is what pops up when users want to add a post to the library page 
// by clicking the plus button on the bottom right of the screen

import { useState, useEffect, useRef } from "react";
import { X, CloudArrowUp, Lightning, Tag, FileText, CheckCircle } from "@phosphor-icons/react";
import { cloudinaryService } from "../../services/CloudinaryService";
import { postService } from "../../services/postManagementService";
import "./PostToLibraryModal.css";

const CATEGORIES = [
  "Brand Identity",
  "Graphic Design",
  "UX Design",
  "Motion Design",
  "UI Design",
  "Print & Packaging",
];

// Suggested tags students can pick from — they can also type their own
const SUGGESTED_TAGS = [
  "Minimalist", "Bold", "Typography", "Illustration", "Logo",
  "Color Theory", "Layout", "Digital", "Print", "Branding",
  "Editorial", "Poster", "Packaging", "Web", "Mobile",
  "3D", "Animation", "Photography", "Collage", "Abstract",
];

export default function PostToLibraryModal({ onClose, onSuccess, studentId }) {
  const [title, setTitle]               = useState("");
  const [description, setDescription]   = useState("");
  const [category, setCategory]         = useState("");
  const [tags, setTags]                 = useState([]);
  const [tagInput, setTagInput]         = useState("");
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [submitting, setSubmitting]         = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [error, setError]                   = useState(null);
  const [success, setSuccess]               = useState(false);
  const [dragOver, setDragOver]             = useState(false);

  const fileInputRef = useRef(null);
  const tagInputRef  = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // ── Tag helpers ──────────────────────────────────────────────────────────────
  function addTag(tag) {
    const cleaned = tag.trim().replace(/,/g, "");
    if (!cleaned || tags.includes(cleaned) || tags.length >= 8) return;
    setTags((prev) => [...prev, cleaned]);
  }

  function removeTag(tag) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
      setTagInput("");
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  }

  // ── File handling ─────────────────────────────────────────────────────────────
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

  // ── Submit ────────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!title.trim()) { setError("Please add a title for your work."); return; }
    if (!category)     { setError("Please select a category."); return; }
    if (!imageFile)    { setError("Please upload an image of your work."); return; }

    setError(null);
    setSubmitting(true);

    try {
      setUploadProgress("Uploading image…");
      const imageUrl = await cloudinaryService.uploadImage(imageFile, "posts");
      if (!imageUrl) throw new Error("Image upload failed. Please try again.");

      // Tags stored as comma-separated prefix in description: "[tag1,tag2] description"
      const tagsPrefix      = tags.length > 0 ? `[${tags.join(",")}] ` : "";
      const fullDescription = tagsPrefix + description.trim();

      setUploadProgress("Saving your post…");
      const postData = {
        Title:         title.trim(),
        Description:   fullDescription,
        Category:      category,
        StudentId:     studentId,
        EventId:       0,
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

  const availableSuggestions = SUGGESTED_TAGS.filter((t) => !tags.includes(t));

  return (
    <div className="ptl-modal__backdrop" onClick={onClose}>
      <div
        className={`ptl-modal ${success ? "ptl-modal--success" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="ptl-modal__header">
          <div className="ptl-modal__header-left">
            <div className="ptl-modal__header-eyebrow">
              <Lightning size={12} weight="fill" color="#FE4081" />
              <span>Share Your Work</span>
            </div>
            <h2 className="ptl-modal__header-title">Post to Library</h2>
          </div>
          <button className="ptl-modal__close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* ── Success overlay ── */}
        {success && (
          <div className="ptl-modal__success-overlay">
            <div className="ptl-modal__success-icon">
              <CheckCircle size={52} weight="fill" color="#10e266" />
            </div>
            <p className="ptl-modal__success-title">Work Posted!</p>
            <p className="ptl-modal__success-sub">
              Your project is under review and will appear in the library once approved.
            </p>
          </div>
        )}

        {/* ── Body ── */}
        <div className="ptl-modal__body">

          {/* Left: image upload */}
          <div className="ptl-modal__left">
            <div
              className={`ptl-modal__drop-zone
                ${dragOver     ? "ptl-modal__drop-zone--active"    : ""}
                ${imagePreview ? "ptl-modal__drop-zone--has-image" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="ptl-modal__preview-img" />
                  <div className="ptl-modal__preview-overlay">
                    <CloudArrowUp size={24} />
                    <span>Change image</span>
                  </div>
                </>
              ) : (
                <div className="ptl-modal__drop-content">
                  <div className="ptl-modal__drop-icon">
                    <CloudArrowUp size={32} color="#C41262" />
                  </div>
                  <p className="ptl-modal__drop-title">Drop your image here</p>
                  <p className="ptl-modal__drop-sub">
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
              <div className="ptl-modal__file-info">
                <span className="ptl-modal__file-name">{imageFile.name}</span>
                <button
                  className="ptl-modal__file-remove"
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
          <div className="ptl-modal__right">

            {/* Title */}
            <div className="ptl-modal__field">
              <label className="ptl-modal__label">
                <FileText size={12} />
                Project Title <span className="ptl-modal__required">*</span>
              </label>
              <input
                className="ptl-modal__input"
                type="text"
                placeholder="e.g. Bloom — Wellness Brand Identity"
                value={title}
                maxLength={80}
                onChange={(e) => setTitle(e.target.value)}
              />
              <span className="ptl-modal__char-count">{title.length}/80</span>
            </div>

            {/* Category */}
            <div className="ptl-modal__field">
              <label className="ptl-modal__label">
                <Tag size={12} />
                Category <span className="ptl-modal__required">*</span>
              </label>
              <div className="ptl-modal__pills">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`ptl-modal__pill ${category === cat ? "ptl-modal__pill--active" : ""}`}
                    onClick={() => setCategory(cat)}
                    type="button"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="ptl-modal__field">
              <label className="ptl-modal__label">
                <Tag size={12} />
                Tags
                <span className="ptl-modal__label-hint">up to 8</span>
              </label>

              <div
                className="ptl-modal__tag-input-wrap"
                onClick={() => tagInputRef.current?.focus()}
              >
                {tags.map((tag) => (
                  <span key={tag} className="ptl-modal__tag-chip">
                    {tag}
                    <button
                      className="ptl-modal__tag-chip-remove"
                      onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                      type="button"
                    >
                      <X size={9} />
                    </button>
                  </span>
                ))}
                {tags.length < 8 && (
                  <input
                    ref={tagInputRef}
                    className="ptl-modal__tag-inline-input"
                    placeholder={tags.length === 0 ? "Type a tag, press Enter…" : ""}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                  />
                )}
              </div>

              {availableSuggestions.length > 0 && tags.length < 8 && (
                <div className="ptl-modal__tag-suggestions">
                  {availableSuggestions.slice(0, 10).map((tag) => (
                    <button
                      key={tag}
                      className="ptl-modal__tag-suggestion"
                      onClick={() => addTag(tag)}
                      type="button"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="ptl-modal__field">
              <label className="ptl-modal__label">
                <FileText size={12} />
                Description
              </label>
              <textarea
                className="ptl-modal__textarea"
                placeholder="Describe your project, process, or inspiration…"
                value={description}
                maxLength={600}
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
              />
              <span className="ptl-modal__char-count">{description.length}/600</span>
            </div>

            {error && <div className="ptl-modal__error">{error}</div>}

            <button
              className={`ptl-modal__submit ${submitting ? "ptl-modal__submit--loading" : ""}`}
              onClick={handleSubmit}
              disabled={submitting || success}
              type="button"
            >
              {submitting ? (
                <>
                  <span className="ptl-modal__spinner" />
                  {uploadProgress || "Submitting…"}
                </>
              ) : (
                <>
                  <Lightning size={15} weight="fill" />
                  Post to Library
                </>
              )}
            </button>

            <p className="ptl-modal__disclaimer">
              Posts are reviewed before appearing publicly in the library.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}