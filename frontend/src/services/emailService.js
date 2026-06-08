import emailjs from "@emailjs/browser";

const EXPIRY_MINUTES = 15;

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function getExpiryTimestamp() {
  return Date.now() + EXPIRY_MINUTES * 60 * 1000;
}

function formatExpiryTime(expiryMs) {
  return new Date(expiryMs).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export async function sendVerificationEmail(toEmail, toName, otpCode, expiryMs) {
  return emailjs.send(
    process.env.REACT_APP_EMAILJS_SERVICE_ID,
    process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
    {
      to_email:   toEmail,
      to_name:    toName,
      otp_code:   otpCode,
      expires_at: formatExpiryTime(expiryMs),
    },
    process.env.REACT_APP_EMAILJS_PUBLIC_KEY
  );
}
