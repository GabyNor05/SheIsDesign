const API_BASE = "http://localhost:5160/api";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function mapDonation(item) {
  const donorName =
    item.donor_name ?? item.Donor_name ?? item.name ?? item.Name ?? "Anonymous";

  const isAnonymous =
    donorName === "Anonymous" ||
    donorName.toString().toLowerCase().includes("anonymous") ||
    item.type === "anonymous";

  return {
    id: item.id ?? item.Id,
    name: donorName,
    email: item.email ?? item.Email ?? null,
    amount: Number(item.amount ?? item.Amount ?? 0),
    fund: item.fund ?? item.Fund ?? "General Fund",
    type: isAnonymous ? "anonymous" : "member",
    date: formatDate(item.date ?? item.Date),
    notes: item.notes ?? item.Notes ?? "",
    color: isAnonymous
      ? null
      : ["#C41262", "#60A5FA", "#22C55E", "#a78bfa"][(item.id ?? 0) % 4],
    raw: item,
  };
}

export async function fetchDonations() {
  const response = await fetch(`${API_BASE}/Donation`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to fetch donations");
  }

  const data = await response.json();
  return (Array.isArray(data) ? data : []).map(mapDonation);
}
