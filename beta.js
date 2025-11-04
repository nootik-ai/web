// beta.js
const API_URL = "https://nootik-api.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const betaForm = document.getElementById("beta-form");
  const extraForm = document.getElementById("extra-form");
  const thankYou  = document.getElementById("thank-you");

  // variable para recordar el email entre pasos
  let userEmail = "";

  if (!betaForm) return;

  // Paso 1: guardar el email
  betaForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = betaForm.querySelector('input[type="email"]');
    const email = emailInput.value.trim().toLowerCase(); // normalizar
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

      userEmail = email;

      // mostrar el paso 2
      betaForm.classList.add("hidden");
      extraForm.classList.remove("hidden");
      setTimeout(() => extraForm.classList.add("opacity-100"), 50);
    } catch (err) {
      console.error("Error saving lead:", err);
      alert("Something went wrong. Please try again later.");
    }
  });

  // Paso 2: guardar la información adicional y pasar al agradecimiento
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
        const res = await fetch(
          `${API_URL}/api/lead/${encodeURIComponent(userEmail)}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
          }
        );

        if (!res.ok) {
          console.error("PUT error:", await res.text());
          throw new Error("Failed to update lead");
        }

        // mostrar paso 3 de agradecimiento
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
