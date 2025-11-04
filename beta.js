// beta.js
const API_URL = "https://nootik-api.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const betaForm = document.getElementById("beta-form");
  const extraForm = document.getElementById("extra-form");

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
      const res = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to save lead");

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
      const email = document.querySelector("#beta-form input[type='email']").value;
      const data = { email };

      inputs.forEach((input) => {
        const key =
          input.placeholder?.toLowerCase().replace(/\s+/g, "_") ||
          input.name ||
          "field";
        if (input.value) data[key] = input.value;
      });

      try {
        const res = await fetch(`${API_URL}/leads/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Failed to update lead");

        extraForm.innerHTML = `
          <p class="text-[#00C2B7] font-medium text-center mt-4">
            ✅ Thanks! Your feedback helps shape Nootik.
          </p>
        `;
      } catch (err) {
        console.error("Error sending feedback:", err);
        alert("Could not send feedback, please try again later.");
      }
    });
  }
});
