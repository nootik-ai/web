const API_URL = "https://nootik-api.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const betaForm = document.getElementById("beta-form");
  const extraForm = document.getElementById("extra-form");
  const thankYou = document.getElementById("thank-you");

  let userEmail = ""; // Guardamos el email globalmente

  if (!betaForm) return;

  // ✅ Paso 1: Guardar email en DB
  betaForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = betaForm.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/lead/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        console.error("POST error:", await res.text());
        throw new Error("Failed to save lead");
      }

      console.log("✅ Lead saved successfully");
      userEmail = email; // Guardamos el email globalmente

      // Mostrar paso 2
      betaForm.classList.add("hidden");
      extraForm.classList.remove("hidden");
      setTimeout(() => extraForm.classList.add("opacity-100"), 50);
    } catch (err) {
      console.error("Error saving lead:", err);
      alert("Something went wrong. Please try again later.");
    }
  });

  // ✅ Paso 2: Guardar información adicional (PUT)
  const feedbackBtn = extraForm?.querySelector("button");
  if (feedbackBtn) {
    feedbackBtn.addEventListener("click", async () => {
      if (!userEmail) {
        alert("Something went wrong. Please start again.");
        return;
      }

      const inputs = extraForm.querySelectorAll("input, select, textarea");
      const updateData = {};

      inputs.forEach((input) => {
        const key =
          input.placeholder?.toLowerCase().replace(/\s+/g, "_") ||
          input.name ||
          "field";
        if (input.value) updateData[key] = input.value;
      });

      try {
        const res = await fetch(`${API_URL}/api/lead/${encodeURIComponent(userEmail)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });

        if (!res.ok) {
          console.error("PUT error:", await res.text());
          throw new Error("Failed to update lead");
        }

        console.log("✅ Lead updated successfully");

        // Mostrar paso 3
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
