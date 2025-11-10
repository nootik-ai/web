// 🌍 Detectar ubicación real del visitante (client-side)
async function getClientGeo() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error("Failed to fetch IP info");
    const geo = await res.json();
    return {
      ip: geo.ip || null,
      country: geo.country_name || "Unknown",
      city: geo.city || "Unknown",
      region: geo.region || "Unknown",
      timezone: geo.timezone || "Unknown",
      latitude: geo.latitude || null,
      longitude: geo.longitude || null,
    };
  } catch (err) {
    console.warn("🌐 Could not get client geo:", err.message);
    return {};
  }
}
