
import { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { FiUsers, FiCalendar, FiAward } from "react-icons/fi";
import { MdLock, MdSchool, MdPersonAdd } from "react-icons/md";
import "./AuthPage.css";

const universityOptions = [
    "Select your university",
    "University of Cape Town",
    "Rhodes University",
    "Stellenbosch University",
    "University of the Witwatersrand",
];

const yearOptions = [
    "Year of study",
    "1st year",
    "2nd year",
    "3rd year",
    "4th year+",
];


function AuthPage() {
    const location = useLocation();
    const isRegisterPage = location.pathname.includes("register");
    const role = location.pathname.includes("admin") ? "admin" : "user";
    const [isRegister, setIsRegister] = useState(isRegisterPage);
    const [formValues, setFormValues] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        university: universityOptions[0],
        studentNumber: "",
        yearOfStudy: yearOptions[0],
        fieldOfStudy: "",
    });

    const handleInput = (event) => {
        const { name, value } = event.target;
        setFormValues((current) => ({ ...current, [name]: value }));
    };

    /* Token Modal Logic - when an admin logs in open the modal */
    const [showTokenModal, setShowTokenModal] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isRegister) {
            if (!formValues.fullName || !formValues.email || !formValues.password || !formValues.confirmPassword || formValues.university === universityOptions[0] || !formValues.studentNumber || formValues.yearOfStudy === yearOptions[0] || !formValues.fieldOfStudy) {
                alert("Please fill in all fields.");
                return;
            }else {
                localStorage.setItem("isRegistered", "true");
                console.log("Register submit", formValues);
                <Navigate to="/otp" state={{ isRegister: true }} />
            }
        } else {
            if (role === "admin") {
                // Handle admin login
                <Navigate to="/admin/dashboard" />
            }else {
                localStorage.setItem("isLoggedIn", "true");
                console.log("Login submit", formValues);
                <Navigate to="/otp" state={{ isRegister: false }} />
            }

        }
  
    };

    return (
        <section className="hero-section min-h-screen w-full px-0 md:px-0 pt-0 pb-0 flex items-center justify-center relative">
            {/* Mesh glows */}
            <div className="hero-glow-1" />
            <div className="hero-glow-2" />
            <div className="hero-glow-3" />

            <div className="max-w-[1440px] w-full flex flex-col md:flex-row items-center justify-center gap-2 py-24">
                {/* Form Card Section */}
                <div className="w-1/2 flex flex-col items-center">
                    {/* Toggle pill */}
                    <div className="mb-8 flex items-center gap-2 h-10 bg-white/10 rounded-full p-1">
                        <button
                            type="button"
                            onClick={() => setIsRegister(false)}
                            className={`hero-eyebrow transition-all px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-full border ${!isRegister ? "bg-primary text-white border-primary" : "bg-transparent text-white border-white/20 hover:text-accent"}`}
                        >
                            Log In
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsRegister(true)}
                            className={`hero-eyebrow transition-all px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-full border ${isRegister ? "bg-primary text-white border-primary" : "bg-transparent text-white border-white/20 hover:text-accent"}`}
                        >
                            Create Account
                        </button>
                    </div>

                    {/* Card */}
                    <div className="form-card relative rounded-[32px] p-8 sm:p-12 w-full max-w-xl shadow-xl border border-white/10 bg-gradient-to-br from-[#201A1B] to-[#0D0608]">
                        <div className="form-card-glow-line" />
                        <div className="space-y-3 mb-8">
                            <h1 className="hero-heading text-4xl md:text-5xl font-extrabold leading-tight">
                                {isRegister ? (
                                    <>
                                        <span className="text-white">Create your</span><br />
                                        <span className="hero-heading-gradient">account</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-white">Welcome</span><br />
                                        <span className="hero-heading-gradient">back</span>
                                    </>
                                )}
                            </h1>
                            <p className="text-base md:text-lg text-white/70">
                                {isRegister
                                    ? "Join SheisDesign as a verified design student."
                                    : "Access your profile, submissions, and leaderboard ranking."}
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {isRegister ? (
                                <>
                                    <div className="space-y-4">
                                        <div className="form-control w-full">
                                            <label className="label">
                                                <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                                                    Full Name
                                                </span>
                                            </label>
                                            <input
                                                name="fullName"
                                                value={formValues.fullName}
                                                onChange={handleInput}
                                                type="text"
                                                placeholder="Your full name"
                                                className="input input-bordered w-full bg-white/5 border-white/10 text-white placeholder-white/40"
                                            />
                                        </div>
                                        <div className="form-control w-full">
                                            <label className="label">
                                                <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                                                    Email address
                                                </span>
                                            </label>
                                            <input
                                                name="email"
                                                value={formValues.email}
                                                onChange={handleInput}
                                                type="email"
                                                placeholder="you@university.co.za"
                                                className="input input-bordered w-full bg-white/5 border-white/10 text-white placeholder-white/40"
                                            />
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="form-control w-full">
                                                <label className="label">
                                                    <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                                                        Password
                                                    </span>
                                                </label>
                                                <input
                                                    name="password"
                                                    value={formValues.password}
                                                    onChange={handleInput}
                                                    type="password"
                                                    placeholder="Create a password"
                                                    className="input input-bordered w-full bg-white/5 border-white/10 text-white placeholder-white/40"
                                                />
                                            </div>
                                            <div className="form-control w-full">
                                                <label className="label">
                                                    <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                                                        Confirm Password
                                                    </span>
                                                </label>
                                                <input
                                                    name="confirmPassword"
                                                    value={formValues.confirmPassword}
                                                    onChange={handleInput}
                                                    type="password"
                                                    placeholder="Repeat password"
                                                    className="input input-bordered w-full bg-white/5 border-white/10 text-white placeholder-white/40"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-control w-full">
                                            <label className="label">
                                                <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                                                    University
                                                </span>
                                            </label>
                                            <select
                                                name="university"
                                                value={formValues.university}
                                                onChange={handleInput}
                                                className="select select-bordered w-full bg-white/5 border-white/10 text-white"
                                            >
                                                {universityOptions.map((option) => (
                                                    <option key={option} value={option} disabled={option === universityOptions[0]}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="form-control w-full">
                                                <label className="label">
                                                    <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                                                        Student Number
                                                    </span>
                                                </label>
                                                <input
                                                    name="studentNumber"
                                                    value={formValues.studentNumber}
                                                    onChange={handleInput}
                                                    type="text"
                                                    placeholder="e.g. STU202400"
                                                    className="input input-bordered w-full bg-white/5 border-white/10 text-white placeholder-white/40"
                                                />
                                            </div>
                                            <div className="form-control w-full">
                                                <label className="label">
                                                    <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                                                        Year of Study
                                                    </span>
                                                </label>
                                                <select
                                                    name="yearOfStudy"
                                                    value={formValues.yearOfStudy}
                                                    onChange={handleInput}
                                                    className="select select-bordered w-full bg-white/5 border-white/10 text-white"
                                                >
                                                    {yearOptions.map((option) => (
                                                        <option key={option} value={option} disabled={option === yearOptions[0]}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-control w-full">
                                            <label className="label">
                                                <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                                                    Field of Study
                                                </span>
                                            </label>
                                            <input
                                                name="fieldOfStudy"
                                                value={formValues.fieldOfStudy}
                                                onChange={handleInput}
                                                type="text"
                                                placeholder="e.g. Graphic Design, UX Design..."
                                                className="input input-bordered w-full bg-white/5 border-white/10 text-white placeholder-white/40"
                                            />
                                        </div>
                                    </div>
                                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/80">
                                        <div className="mb-2 flex items-center gap-2 text-white/60">
                                            <MdSchool size={18} />
                                            <span className="font-semibold">University verification</span>
                                        </div>
                                        <p>
                                            Your university registration will be reviewed before your account is activated. This usually takes 1–2 business days.
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-6">
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                                                Email address
                                            </span>
                                        </label>
                                        <input
                                            name="email"
                                            value={formValues.email}
                                            onChange={handleInput}
                                            type="email"
                                            placeholder="you@university.co.za"
                                            className="input input-bordered w-full bg-white/5 border-white/10 text-white placeholder-white/40"
                                        />
                                    </div>
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                                                Password
                                            </span>
                                        </label>
                                        <input
                                            name="password"
                                            value={formValues.password}
                                            onChange={handleInput}
                                            type="password"
                                            placeholder="Enter your password"
                                            className="input input-bordered w-full bg-white/5 border-white/10 text-white placeholder-white/40"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-8">
                                <button type="submit" className="btn hero-btn-primary w-full sm:w-auto px-8 py-4 text-base font-bold">
                                    {isRegister ? (
                                        <>
                                            <MdPersonAdd size={18} className="mr-2" />
                                            Create Account
                                        </>
                                    ) : (
                                        <>
                                            <MdLock size={18} className="mr-2" />
                                            Sign In
                                        </>
                                    )}
                                    
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsRegister((current) => !current)}
                                    className="text-sm font-semibold text-white/60 underline-offset-4 hover:text-accent"
                                >
                                    {isRegister ? "Already have an account? Log in" : "Create a new account"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                {/* Stats Panel Section */}
                <aside className="w-1/2 flex-1 rounded-[32px] bg-white/5 border border-white/10 p-8 sm:p-12 shadow-xl">
                    <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent text-white shadow-lg">
                        <FiUsers size={32} />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-white">Join the community.</h2>
                        <p className="text-base text-white/70">
                            Compete, create, and be recognised among the best women designers in the industry.
                        </p>
                    </div>
                    <div className="mt-8 space-y-4">
                        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
                                    <FiUsers size={18} />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-white">1,200+</p>
                                    <p className="text-sm text-white/60">Design Students</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
                                    <FiCalendar size={18} />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-white">48</p>
                                    <p className="text-sm text-white/60">Events Hosted</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
                                    <FiAward size={18} />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-white">320+</p>
                                    <p className="text-sm text-white/60">Awards Given</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

                {/* Token Modal */}
                {showTokenModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="bg-white rounded-lg p-8 w-full max-w-md text-center">
                            <h2 className="text-2xl font-bold mb-4">Admin Access Token</h2>
                            <h3 className="text-lg mb-2">Use this token for API authentication:</h3>
                            <label className="block text-sm font-medium text-gray-700 mb-1">TOKEN:</label>
                            <input
                                type="text"
                                value="abc123def456"
                                readOnly
                                className="bg-gray-100 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={() => setShowTokenModal(false)}
                                className="btn hero-btn-primary px-6 py-3"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
        </section>
    );
}

export default AuthPage;
