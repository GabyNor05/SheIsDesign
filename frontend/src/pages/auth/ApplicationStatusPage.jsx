
import "./AuthPage.css";
import { FiCheckCircle, FiClock, FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


function ApplicationStatusPage() {
  // TODO: Replace with real status from API
  const status = "pending"; // or "approved"
  const navigate = useNavigate();

  // Stepper logic (Figma: Application Submitted > Under Review > Approved)
  const steps = [
    { label: "Application Submitted", complete: true },
    { label: "Under Review", complete: status !== "pending" },
    { label: "Approved", complete: status === "approved" },
  ];

  // Status rows (Figma: 3 rows with icon and text)
  const statusRows = [
    {
      icon: <FiCheckCircle size={24} className="text-primary" />, text: "Application submitted successfully.", complete: true,
    },
    {
      icon: <FiClock size={24} className={status !== "pending" ? "text-primary" : "text-accent"} />, text: "Your university status is being verified.", complete: status !== "pending",
    },
    {
      icon: <FiCheckCircle size={24} className={status === "approved" ? "text-primary" : "text-white/30"} />, text: "Account approved.", complete: status === "approved",
    },
  ];

  return (
    <section className="hero-section min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div className="hero-glow-1" />
      <div className="hero-glow-2" />
      <div className="hero-glow-3" />
      <div className="form-card relative rounded-[32px] p-8 sm:p-12 w-full max-w-lg shadow-xl border border-white/10 bg-gradient-to-br from-[#201A1B] to-[#0D0608] z-10 flex flex-col items-center">
        <div className="form-card-glow-line" />
        {/* Top status icon in circle */}
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white/5 border-2 border-primary mb-6 mt-2">
          {status === "pending" ? (
            <FiClock size={48} className="text-accent" />
          ) : (
            <FiCheckCircle size={48} className="text-primary" />
          )}
        </div>
        {/* Stepper */}
        <div className="w-full flex flex-col items-center mb-8">
          <div className="flex items-center gap-0 w-full max-w-xs">
            {steps.map((step, idx) => (
              <div key={step.label} className="flex items-center w-full">
                <div className={`rounded-full border-2 ${step.complete ? "border-primary bg-primary" : "border-white/30 bg-white/10"} w-6 h-6 flex items-center justify-center text-xs font-bold text-white`}>
                  {step.complete ? <FiCheckCircle size={16} className="text-white" /> : idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-1 flex-1 ${steps[idx + 1].complete ? "bg-primary" : "bg-white/20"}`}></div>
                )}
              </div>
            ))}
          </div>
          {/* Stepper status text */}
          <div className="w-full flex justify-center mt-2">
            <span className="text-white/80 text-xs font-medium">
              {steps.findLast((s) => s.complete).label}
            </span>
          </div>
        </div>
        {/* Main heading and subtext */}
        <h2 className="hero-heading text-2xl md:text-3xl font-extrabold leading-tight text-white mb-2 text-center">
          {status === "pending" ? "Application Pending" : "Application Approved"}
        </h2>
        <p className="text-base text-white/70 text-center mb-4">
          {status === "pending"
            ? "Your university status is being verified. You will receive an email once your account is activated."
            : "Congratulations! Your account is now active."}
        </p>
        {/* Status rows */}
        <div className="w-full mt-2 mb-6">
          {statusRows.map((row, idx) => (
            <div key={idx} className="flex items-center gap-4 py-3 px-2 rounded-lg mb-2 bg-white/5">
              <span>{row.icon}</span>
              <span className={`text-base ${row.complete ? "text-white" : "text-white/40"}`}>{row.text}</span>
            </div>
          ))}
        </div>
        {/* Return button */}
        <button
          className="btn hero-btn-primary w-full max-w-xs flex items-center justify-center gap-2 px-8 py-4 text-base font-bold mt-2"
          onClick={() => navigate("/")}
        >
          <FiArrowLeftCircle size={24} />
          Return to Home
        </button>
      </div>
    </section>
  );
}

export default ApplicationStatusPage;
