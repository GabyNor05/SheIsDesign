import "./StepIndicator.css";

const STEPS = [
  { key: "account", label: "Account" },
  { key: "about",   label: "About you" },
];

function StepIndicator({ active }) {
  const activeIdx = STEPS.findIndex(s => s.key === active);

  return (
    <div className="step-indicator">
      {STEPS.map((step, i) => {
        const isDone   = i < activeIdx;
        const isActive = step.key === active;

        return (
          <div key={step.key} className="step-indicator__item">
            {i > 0 && (
              <div className={`step-indicator__connector ${isDone ? "step-indicator__connector--done" : ""}`} />
            )}
            <div className="step-indicator__step">
              <div className={[
                "step-indicator__dot",
                isActive ? "step-indicator__dot--active" : "",
                isDone   ? "step-indicator__dot--done"   : "",
              ].join(" ").trim()}>
                {isDone ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="step-indicator__number">{i + 1}</span>
                )}
              </div>
              <span className={[
                "step-indicator__label",
                isActive ? "step-indicator__label--active" : "",
                isDone   ? "step-indicator__label--done"   : "",
              ].join(" ").trim()}>
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StepIndicator;