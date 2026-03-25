import { Link } from "react-router-dom";
import { MdHandshake, MdPeople, MdCampaign, MdSchool,
         MdEmojiEvents, MdCoPresent, MdGavel, MdDiversity3,
         MdVolunteerActivism, MdHowToReg } from "react-icons/md";
import { HiBriefcase, HiUserGroup } from "react-icons/hi2";
import "./SupportSection.css";

// ============================================================
// STATIC CONTENT
// CTA buttons:
//   "Sponsor an Event"  → /donate  → creates Donation record
//     ERD: Donation (donor_name, amount, date, notes, eventID)
//   "Apply as Volunteer" → /volunteer → creates Volunteer record
//     ERD: Volunteer (volenterrID, userID, eventCount)
//     NOTE: suggest adding name, expertise, motivation fields
// ============================================================

const sponsorBenefits = [
  { icon: <MdCampaign size={14} />, text: "Brand visibility at events" },
  { icon: <MdSchool size={14} />,   text: "Access to top-performing students" },
  { icon: <MdEmojiEvents size={14} />, text: "Industry recognition" },
];

const volunteerBenefits = [
  { icon: <MdCoPresent size={14} />, text: "Host a workshop" },
  { icon: <MdGavel size={14} />,     text: "Judge competitions" },
  { icon: <MdDiversity3 size={14} />, text: "Mentor students" },
];

/* =============================================
   ImagePlaceholder sub-component
   ============================================= */
function ImagePlaceholder({ icon }) {
  return (
    <div className="support-img-placeholder">
      <div className="support-img-glow-line" />
      <div className="support-img-icon">{icon}</div>
      <span className="support-img-label">Image placeholder</span>
    </div>
  );
}

/* =============================================
   BulletItem sub-component
   ============================================= */
function BulletItem({ icon, text }) {
  return (
    // DaisyUI: list-item inside list-none ul
    <li className="support-bullet">
      <div className="support-bullet-icon">{icon}</div>
      <span className="support-bullet-text">{text}</span>
    </li>
  );
}

/* =============================================
   SupportCard sub-component
   ============================================= */
function SupportCard({
  headerIcon, imagePlaceholderIcon,
  title, description, benefits,
  buttonLabel, buttonIcon, buttonTo,
}) {
  return (
    // DaisyUI: card as structural base
    <div className="support-card card">
      <div className="support-card-glow-line" />

      {/* Image placeholder — replace with real image */}
      <ImagePlaceholder icon={imagePlaceholderIcon} />

      {/* Icon + title + description */}
      <div className="support-card-body">
        <div className="support-card-icon">{headerIcon}</div>
        <h3 className="support-card-title">{title}</h3>
        <p className="support-card-description">{description}</p>
      </div>

      {/* Divider */}
      <div className="support-card-divider" />

      {/* DaisyUI: menu/list used as unordered list base */}
      <ul className="support-benefits-list">
        {benefits.map((b) => (
          <BulletItem key={b.text} icon={b.icon} text={b.text} />
        ))}
      </ul>

      {/*
        CTA Button
        Sponsor  → /donate   → ERD: Donation record
        Volunteer → /volunteer → ERD: Volunteer record
      */}
      <div className="support-card-cta">
        {/* DaisyUI: btn base, gradient via CSS */}
        <Link to={buttonTo} className="btn support-card-btn">
          {buttonIcon}
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
}

/* =============================================
   SupportSection main component
   ============================================= */
function SupportSection() {
  return (
    <section className="support-section w-full px-8 md:px-16 py-28">

      {/* Background glows */}
      <div className="support-glow-1" />
      <div className="support-glow-2" />

      <div className="support-inner max-w-[1440px] mx-auto flex flex-col gap-16">

        {/* Section header */}
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

        {/* Two Support Cards */}
        <div className="support-cards-grid">

          {/* Sponsor Card → /donate */}
          <SupportCard
            headerIcon={<MdHandshake size={22} />}
            imagePlaceholderIcon={<HiBriefcase size={20} />}
            title="Become a Sponsor"
            description="Partner with SheisDesign to support the next generation of women in design. Your sponsorship directly funds events, prizes, and development opportunities."
            benefits={sponsorBenefits}
            buttonLabel="Sponsor an Event"
            buttonIcon={<MdVolunteerActivism size={18} />}
            buttonTo="/donate"
          />

          {/* Volunteer Card → /volunteer */}
          <SupportCard
            headerIcon={<MdPeople size={22} />}
            imagePlaceholderIcon={<HiUserGroup size={20} />}
            title="Volunteer Your Expertise"
            description="Industry professionals are welcome to share their knowledge by hosting workshops, sitting on judging panels, or mentoring students through real design challenges."
            benefits={volunteerBenefits}
            buttonLabel="Apply as Volunteer"
            buttonIcon={<MdHowToReg size={18} />}
            buttonTo="/volunteer"
          />
        </div>
      </div>
    </section>
  );
}

export default SupportSection;