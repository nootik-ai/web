const API_URL = "https://nootik-api.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const betaForm  = document.getElementById("beta-form");
  const extraForm = document.getElementById("extra-form");
  const thankYou  = document.getElementById("thank-you");
  let userEmail   = "";

  // Paso 1: guardar email y mostrar el paso 2
  betaForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = betaForm.querySelector('input[type="email"]');
    userEmail = emailInput.value.trim().toLowerCase();
    if (!userEmail) {
      alert("Please enter your email.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      if (!res.ok) throw new Error("Failed to save lead");

      betaForm.classList.add("hidden");
      extraForm.classList.remove("hidden");
      setTimeout(() => extraForm.classList.add("opacity-100"), 50);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again later.");
    }
  });

  // Paso 2: guardar datos extras y mostrar paso 3
  extraForm.querySelector("button").addEventListener("click", async () => {
    if (!userEmail) {
      alert("Something went wrong. Please start again.");
      return;
    }
    const inputs = extraForm.querySelectorAll("input, select, textarea");
    const updateData = { email: userEmail };
    inputs.forEach((input) => {
      const key = (input.placeholder || input.name || "").toLowerCase().replace(/\s+/g, "_");
      if (input.value.trim()) updateData[key] = input.value.trim();
    });

    try {
      const res = await fetch(`${API_URL}/api/lead/${encodeURIComponent(userEmail)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) throw new Error("Failed to update lead");

      extraForm.classList.add("hidden");
      thankYou.classList.remove("hidden");
      setTimeout(() => thankYou.classList.add("opacity-100"), 50);
    } catch (err) {
      console.error(err);
      alert("Could not send feedback, please try again later.");
    }
  });
});
