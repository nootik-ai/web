const API_URL = "https://nootik-api.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const betaForm = document.getElementById("beta-form");
  const extraForm = document.getElementById("extra-form");
  const thankYou = document.getElementById("thank-you");
  let userEmail = ""; // guardar email globalmente

  if (!betaForm) return;

  // Paso 1: Guardar email
  betaForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = betaForm.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      // 👇 usamos tu ruta original que funcionaba
      const res = await fetch(`${API_URL}/api/lead/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to save lead");

      userEmail = email; // guardar email para el paso 2

      // Mostrar segundo paso
      betaForm.classList.add("hidden");
      extraForm.classList.remove("hidden");
      setTimeout(() => extraForm.classList.add("opacity-100"), 50);

    } catch (err) {
      console.error("Error saving lead:", err);
      alert("Something went wrong. Please try again later.");
    }
  });

  // Paso 2: Guardar más información opcional
  const feedbackBtn = extraForm?.querySelector("button");
  if (feedbackBtn) {
    feedbackBtn.addEventListener("click", async () => {
      const inputs = extraForm.querySelectorAll("input, select, textarea");
      const data = {};

      inputs.forEach((input) => {
        const key =
          input.placeholder?.toLowerCase().replace(/\s+/g, "_") ||
          input.name ||
          "field";
        if (input.value) data[key] = input.value;
      });

      try {
        // 👇 tu backend usa PUT con parámetro en URL
        const res = await fetch(`${API_URL}/api/lead/${encodeURIComponent(userEmail)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Failed to update lead");

        // Step 3 — mostrar agradecimiento
        extraForm.classList.add("hidden");
        thankYou.classList.remove("hidden");
        setTimeout(() => thankYou.classList.add("opacity-100"), 50);
      } catch (err) {
        console.error("Error sending feedback:", err);
        alert("Could not send feedback, please try again later.");
      }
    });
  }
});
