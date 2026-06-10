import { useState, useRef } from "react";
import { X, UploadSimple, Image, CheckCircle } from "@phosphor-icons/react";
import { postService } from "../../services/postManagementService";
import { cloudinaryService } from "../../services/CloudinaryService";
import "./SubmitWorkModal.css";

export default function SubmitWorkModal({ event, studentId, existingPost, onClose, onSuccess }) {
  const isResubmit = !!existingPost;
  const [title,       setTitle]       = useState(existingPost?.title ?? "");
  const [description, setDescription] = useState(existingPost?.description ?? "");
  const [imageFile,   setImageFile]   = useState(null);
  const [preview,     setPreview]     = useState(existingPost?.imageFileLink ?? null);
  const [uploading,   setUploading]   = useState(false);
  const [error,       setError]       = useState(null);
  const [done,        setDone]        = useState(false);
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { setError("Please add a title."); return; }
    if (!existingPost && !imageFile) { setError("Please upload an image of your work."); return; }

    setError(null);
    setUploading(true);

    try {
      let imageUrl = existingPost?.imageFileLink ?? "";
      if (imageFile) {
        imageUrl = await cloudinaryService.uploadImage(imageFile, "event-submissions");
        if (!imageUrl) throw new Error("Image upload failed. Please try again.");
      }

      const payload = {
        title:         title.trim(),
        studentId:     studentId,
        imageFileLink: imageUrl,
        category:      event.category,
        eventId:       event.id,
        description:   description.trim(),
        status:        "Pending",
      };

      if (existingPost) {
        await postService.updatePost(existingPost.id, payload);
      } else {
        await postService.createPost(payload);
      }

      setDone(true);
      setTimeout(() => { onSuccess?.(); onClose(); }, 1800);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  if (!event) return null;

  return (
    <div className="swm__overlay" onClick={onClose}>
      <div className="swm__box" onClick={e => e.stopPropagation()}>

        <button className="swm__close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>

        {done ? (
          <div className="swm__done">
            <CheckCircle size={52} color="#22C55E" weight="fill" />
            <h3 className="swm__done-title">{existingPost ? "Resubmission saved!" : "Submission received!"}</h3>
            <p className="swm__done-sub">Your work has been {existingPost ? "updated" : "submitted"} for <strong>{event.title}</strong>. A judge will review it soon.</p>
          </div>
        ) : (
          <>
            <div className="swm__header">
              <span className="swm__category">{event.category}</span>
              <h2 className="swm__title">{existingPost ? "Resubmit Your Work" : "Submit Your Work"}</h2>
              <p className="swm__sub">for <strong>{event.title}</strong></p>
            </div>

            <form className="swm__form" onSubmit={handleSubmit} noValidate>
              {/* Image drop zone */}
              <div
                className={`swm__dropzone${preview ? " swm__dropzone--has-image" : ""}`}
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="swm__preview" />
                ) : (
                  <div className="swm__drop-hint">
                    <Image size={32} color="rgba(255,255,255,0.25)" />
                    <span className="swm__drop-label">Drop your image here or <u>browse</u></span>
                    <span className="swm__drop-sub">PNG, JPG, WEBP · max 10 MB</span>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFile}
                />
              </div>

              {preview && (
                <button
                  type="button"
                  className="swm__change-img"
                  onClick={() => fileRef.current?.click()}
                >
                  <UploadSimple size={13} /> Change image
                </button>
              )}

              <label className="swm__label">
                Title <span className="swm__req">*</span>
                <input
                  type="text"
                  className="swm__input"
                  placeholder="e.g. Verde — Sustainable Fashion Identity"
                  value={title}
                  maxLength={100}
                  onChange={e => setTitle(e.target.value)}
                />
              </label>

              <label className="swm__label">
                Description <span className="swm__opt">(optional)</span>
                <textarea
                  className="swm__textarea"
                  placeholder="Describe your work, process, or inspiration..."
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </label>

              {error && <p className="swm__error">{error}</p>}

              <div className="swm__actions">
                <button type="button" className="swm__cancel" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="swm__submit" disabled={uploading}>
                  {uploading ? "Uploading…" : <><UploadSimple size={15} /> {existingPost ? "Resubmit Work" : "Submit Work"}</>}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
