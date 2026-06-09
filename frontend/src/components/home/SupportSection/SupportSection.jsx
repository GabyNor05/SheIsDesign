import { Link } from "react-router-dom";
import { MdHandshake, MdPeople, MdCampaign, MdSchool,
         MdEmojiEvents, MdCoPresent, MdGavel, MdDiversity3,
         MdVolunteerActivism, MdHowToReg } from "react-icons/md";
import "./SupportSection.css";

const sponsorBenefits = [
  { icon: <MdCampaign size={15} />, text: "Brand visibility at events" },
  { icon: <MdSchool size={15} />,   text: "Access to top-performing students" },
  { icon: <MdEmojiEvents size={15} />, text: "Industry recognition" },
];

const volunteerBenefits = [
  { icon: <MdCoPresent size={15} />, text: "Host a workshop" },
  { icon: <MdGavel size={15} />,     text: "Judge competitions" },
  { icon: <MdDiversity3 size={15} />, text: "Mentor students" },
];


/* =============================================
   Volunteer visual
   ============================================= */
function VolunteerVisual() {
  return (
    <div className="support-visual">
      <div className="sv-orb sv-orb--4" />
      <div className="sv-orb sv-orb--5" />
      <div className="sv-orb sv-orb--6" />
      <div className="sv-circle sv-circle--1" />
      <div className="sv-circle sv-circle--2" />
      <div className="sv-circle sv-circle--3" />
      <div className="sv-orbit sv-orbit--1" />
      <div className="sv-orbit sv-orbit--2" />
      <div className="sv-orbit sv-orbit--3" />
      <div className="sv-orbit sv-orbit--4" />
      <div className="sv-dot sv-dot--5" />
      <div className="sv-dot sv-dot--6" />
      <div className="sv-dot sv-dot--7" />
      <div className="sv-dot sv-dot--8" />
      {/* Centre icon */}
      <div className="sv-center-icon">
        <MdPeople size={28} color="#C41262" />
      </div>
    </div>
  );
}

/* =============================================
   BulletItem
   ============================================= */
function BulletItem({ icon, text }) {
  return (
    <li className="support-bullet">
      <div className="support-bullet-icon">{icon}</div>
      <span className="support-bullet-text">{text}</span>
    </li>
  );
}

/* =============================================
   SupportCard
   ============================================= */
function SupportCard({
  visual, title, description, benefits,
  buttonLabel, buttonIcon, buttonTo,
}) {
  return (
    <div className="support-card">
      <div className="support-card-glow-line" />

      {/* Visual strip */}
      {visual}

      {/* Body */}
      <div className="support-card-body">
        <h3 className="support-card-title">{title}</h3>
        <p className="support-card-description">{description}</p>
      </div>

      <div className="support-card-divider" />

      <ul className="support-benefits-list">
        {benefits.map((b) => (
          <BulletItem key={b.text} icon={b.icon} text={b.text} />
        ))}
      </ul>

      <div className="support-card-cta">
        <Link to={buttonTo} className="support-card-btn">
          {buttonIcon}
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
}

/* =============================================
   SupportSection
   ============================================= */
function SupportSection() {
  return (
    <section className="support-section">

      <div className="support-glow-1" />
      <div className="support-glow-2" />

      <div className="support-inner">

        {/* Header */}
        <div className="support-header">
          <div className="support-header-rule">
            <div className="support-header-line" />
            <span className="support-eyebrow">Get Involved</span>
            <div className="support-header-line" />
          </div>
          <h2 className="support-heading">Support the Mission</h2>
          <p className="support-subtext">
            Individuals and industry professionals can contribute through
            sponsorship or by volunteering their time and expertise.
          </p>
        </div>

        {/* Cards */}
        <div className="support-cards-grid">
          <SupportCard
            visual={<VolunteerVisual />}
            title="Become a Sponsor"
            description="Partner with SheisDesign to support the next generation of women in design. Your sponsorship directly funds events, prizes, and development opportunities."
            benefits={sponsorBenefits}
            buttonLabel="Sponsor an Event"
            buttonIcon={<MdVolunteerActivism size={18} />}
            buttonTo="/donate"
          />
          <SupportCard
            visual={<VolunteerVisual />}
            title="Volunteer Your Expertise"
            description="Industry professionals are welcome to share their knowledge by hosting workshops, sitting on judging panels, or mentoring students through real design challenges."
            benefits={volunteerBenefits}
            buttonLabel="Apply as Volunteer"
            buttonIcon={<MdHowToReg size={18} />}
            buttonTo="/signup"
          />
        </div>
      </div>
    </section>
  );
}

export default SupportSection;