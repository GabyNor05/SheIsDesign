import { useState, useEffect } from "react";
import { X, Image, Star, Clock, CheckCircle, UploadSimple } from "@phosphor-icons/react";
import { postService } from "../../services/postManagementService";
import { judgeMarkSchemeService } from "../../services/judgeMarkService";
import "./MySubmissionsModal.css";

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function StatusPill({ status }) {
  const s = status?.toLowerCase();
  if (s === "approved") return (
    <span className="msm__pill msm__pill--approved">
      <CheckCircle size={11} weight="fill" /> Approved
    </span>
  );
  return (
    <span className="msm__pill msm__pill--pending">
      <Clock size={11} weight="fill" /> Pending review
    </span>
  );
}

export default function MySubmissionsModal({ event, studentId, onClose, onResubmit }) {
  const [posts,   setPosts]   = useState([]);
  const [scores,  setScores]  = useState({});
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!event?.id || !studentId) return;

    Promise.all([
      postService.getPostsByStudentAndEvent(studentId, event.id),
      judgeMarkSchemeService.getMarkSchemesByEvent(event.id),
    ])
      .then(([myPosts, markSchemes]) => {
        setPosts(myPosts);
        const scoreMap = {};
        markSchemes.forEach(m => { scoreMap[m.postId] = m; });
        setScores(scoreMap);
      })
      .catch(() => setError("Could not load your submissions."))
      .finally(() => setLoading(false));
  }, [event?.id, studentId]);

  if (!event) return null;

  return (
    <div className="msm__overlay" onClick={onClose}>
      <div className="msm__box" onClick={e => e.stopPropagation()}>

        <button className="msm__close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>

        <div className="msm__header">
          <span className="msm__category">{event.category}</span>
          <h2 className="msm__title">My Submissions</h2>
          <p className="msm__sub">for <strong>{event.title}</strong></p>
        </div>

        <div className="msm__body">
          {loading && (
            <div className="msm__empty">
              <div className="msm__spinner" />
              <span>Loading…</span>
            </div>
          )}

          {!loading && error && (
            <div className="msm__empty">
              <p className="msm__error">{error}</p>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="msm__empty">
              <Image size={40} color="rgba(255,255,255,0.15)" />
              <p className="msm__empty-text">You haven&apos;t submitted any work yet.</p>
              <button className="msm__upload-btn" onClick={() => { onClose(); onResubmit?.(event, null); }}>
                <UploadSimple size={14} /> Submit Your Work
              </button>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <ul className="msm__list">
              {posts.map(post => {
                const mark = scores[post.id];
                return (
                  <li key={post.id} className="msm__card">
                    <div className="msm__card-img-wrap">
                      {post.imageFileLink ? (
                        <img src={post.imageFileLink} alt={post.title} className="msm__card-img" />
                      ) : (
                        <div className="msm__card-img-placeholder">
                          <Image size={22} color="rgba(255,255,255,0.2)" />
                        </div>
                      )}
                    </div>

                    <div className="msm__card-info">
                      <div className="msm__card-title">{post.title}</div>
                      <div className="msm__card-meta">
                        <StatusPill status={post.status} />
                        {post.postDate && (
                          <span className="msm__card-date">Submitted {fmtDate(post.postDate)}</span>
                        )}
                      </div>

                      {mark ? (
                        <div className="msm__score-row">
                          <Star size={13} color="#FBBF24" weight="fill" />
                          <span className="msm__score-val">{mark.score}<span className="msm__score-denom">/100</span></span>
                          {mark.comment && (
                            <span className="msm__score-comment">&ldquo;{mark.comment}&rdquo;</span>
                          )}
                        </div>
                      ) : (
                        <div className="msm__awaiting">Awaiting judge score</div>
                      )}

                      <button
                        className="msm__add-btn"
                        onClick={() => { onClose(); onResubmit?.(event, post); }}
                      >
                        <UploadSimple size={13} /> Resubmit
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
