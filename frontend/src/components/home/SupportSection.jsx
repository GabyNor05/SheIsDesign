import { Link } from "react-router-dom";
import { MdHandshake, MdPeople, MdCampaign, MdSchool,
         MdEmojiEvents, MdCoPresent, MdGavel, MdDiversity3,
         MdVolunteerActivism, MdHowToReg } from "react-icons/md";
import { HiBriefcase, HiUserGroup } from "react-icons/hi2";

// ============================================================
// STATIC CONTENT 
// These are fixed marketing copy lists describing what sponsors
// and volunteers get out of participating.
//
// The only DB connection in this section is the CTA buttons:
//   - "Sponsor an Event" → links to DonatePage → creates Donation record
//     ERD Table: Donation
//     Fields: donor_name, amount, date, notes, eventID (optional)
//
//   - "Apply as Volunteer" → links to VolunteerPage → creates Volunteer record
//     ERD Table: Volunteer
//     Fields: volenterrID, userID, eventCount
//     NOTE: Volunteer table currently only has volenterrID, userID, eventCount
//     I Suggest adding: name, expertise, motivation fields for the signup form
// ============================================================

const sponsorBenefits = [
  { icon: <MdCampaign size={14} />, text: "Brand visibility at events" },
  { icon: <MdSchool size={14} />, text: "Access to top-performing students" },
  { icon: <MdEmojiEvents size={14} />, text: "Industry recognition" },
];

const volunteerBenefits = [
  { icon: <MdCoPresent size={14} />, text: "Host a workshop" },
  { icon: <MdGavel size={14} />, text: "Judge competitions" },
  { icon: <MdDiversity3 size={14} />, text: "Mentor students" },
];
// ============================================================

function ImagePlaceholder({ icon }) {
  return (
    <div style={{
      width: "100%", height: "148px", borderRadius: "16px",
      background: "rgba(196,18,98,0.06)",
      border: "1px solid rgba(196,18,98,0.12)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "8px",
      flexShrink: 0, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(196,18,98,0.3), transparent)",
      }} />
      <div style={{
        width: "40px", height: "40px", borderRadius: "12px",
        background: "rgba(196,18,98,0.12)",
        border: "1px solid rgba(196,18,98,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#C41262",
      }}>
        {icon}
      </div>
      <span style={{
        fontFamily: "'Poppins', sans-serif",
        fontSize: "11px", color: "rgba(248,235,237,0.2)",
      }}>
        Image placeholder
      </span>
    </div>
  );
}

function BulletItem({ icon, text }) {
  return (
    <li style={{
      display: "flex", alignItems: "center", gap: "12px",
      listStyle: "none",
    }}>
      <div style={{
        width: "28px", height: "28px", borderRadius: "8px",
        background: "rgba(196,18,98,0.12)",
        border: "1px solid rgba(196,18,98,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, color: "#C41262",
      }}>
        {icon}
      </div>
      <span style={{
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 400, fontSize: "14px",
        color: "rgba(248,235,237,0.6)", lineHeight: "1.5",
      }}>
        {text}
      </span>
    </li>
  );
}

function SupportCard({
  headerIcon,
  imagePlaceholderIcon,
  title,
  description,
  benefits,
  buttonLabel,
  buttonIcon,
  buttonTo,
}) {
  return (
    <div style={{
      flex: 1,
      background: "linear-gradient(145deg, rgba(196,18,98,0.07) 0%, rgba(13,6,8,0.95) 100%)",
      border: "1px solid rgba(196,18,98,0.15)",
      borderRadius: "24px",
      padding: "40px",
      display: "flex", flexDirection: "column", gap: "32px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Top glow line — decorative */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(196,18,98,0.4), transparent)",
      }} />

      {/* Image placeholder — replace with real image */}
      <ImagePlaceholder icon={imagePlaceholderIcon} />

      {/* Icon + Title + Description */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "14px",
          background: "rgba(196,18,98,0.12)",
          border: "1px solid rgba(196,18,98,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#C41262",
        }}>
          {headerIcon}
        </div>

        {/* Static title*/}
        <h3 style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 800, fontSize: "26px",
          color: "#F8EBED", letterSpacing: "-0.5px",
          lineHeight: "1.2", margin: 0,
        }}>
          {title}
        </h3>

        {/* Static description*/}
        <p style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 400, fontSize: "14px",
          color: "rgba(248,235,237,0.5)", lineHeight: "1.75", margin: 0,
        }}>
          {description}
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(248,235,237,0.06)" }} />

      {/* Benefits list */}
      <ul style={{ display: "flex", flexDirection: "column", gap: "16px", padding: 0, margin: 0 }}>
        {benefits.map((b) => (
          <BulletItem key={b.text} icon={b.icon} text={b.text} />
        ))}
      </ul>

      {/* 
        CTA Button
        Sponsor card  → links to /donate
          ERD: creates Donation record
          Fields: Donation.donor_name, Donation.amount, Donation.date,
                  Donation.notes, Donation.eventID (optional)

        Volunteer card → links to /volunteer
          ERD: creates Volunteer record
          Fields: Volunteer.volenterrID, Volunteer.userID, Volunteer.eventCount
          NOTE: I suggest adding name, expertise, bio fields to Volunteer table
                for a proper signup form
      */}
      <div style={{ marginTop: "auto", paddingTop: "8px" }}>
        <Link
          to={buttonTo}
          style={{
            width: "100%",
            display: "inline-flex", alignItems: "center",
            justifyContent: "center", gap: "10px",
            padding: "16px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #C41262, #FE4081)",
            color: "white", textDecoration: "none",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700, fontSize: "14px",
          }}
        >
          {buttonIcon}
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
}

function SupportSection() {
  return (
    <section
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#0D0608",
        borderTop: "1px solid rgba(248,235,237,0.06)",
        position: "relative",
        overflow: "hidden",
      }}
      className="w-full px-8 md:px-16 py-28"
    >
      {/* Background glows*/}
      <div style={{
        position: "absolute", top: "-100px", left: "-100px",
        width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(196,18,98,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-100px", right: "-100px",
        width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(254,64,129,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div
        className="max-w-[1440px] mx-auto flex flex-col"
        style={{ gap: "64px", position: "relative", zIndex: 1 }}
      >

        {/* Section Header  */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "20px", textAlign: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "20px", height: "1.5px", background: "rgba(254,127,171,0.4)" }} />
            <span style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500, fontSize: "11px",
              color: "#FE7FAB", letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}>
              Get Involved
            </span>
            <div style={{ width: "20px", height: "1.5px", background: "rgba(254,127,171,0.4)" }} />
          </div>

          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(36px, 4vw, 52px)",
            color: "#F8EBED",
            letterSpacing: "-1px", lineHeight: "1.1",
            margin: 0,
          }}>
            Support the Mission
          </h2>

          <p style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400, fontSize: "16px",
            color: "rgba(248,235,237,0.5)", lineHeight: "1.75",
            maxWidth: "540px", margin: 0,
          }}>
            Individuals and industry professionals can contribute through
            sponsorship or by volunteering their time and expertise.
          </p>
        </div>

        {/* Two Support Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}
          className="grid-cols-1 md:grid-cols-2">

          {/* 
            Sponsor Card
            CTA links to /donate
            ERD: Donation table
            Fields: donor_name, amount, date, notes, eventID
          */}
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

          {/* 
            Volunteer Card
            CTA links to /volunteer
            ERD: Volunteer table
            Fields: volenterrID, userID, eventCount
            NOTE: suggest adding name, expertise, bio to Volunteer table
          */}
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