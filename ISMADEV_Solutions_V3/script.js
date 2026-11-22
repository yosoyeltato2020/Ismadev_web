// ISMADEV — interactividad y animaciones
document.addEventListener("DOMContentLoaded", () => {
  const whatsappNumber = "34638315035"; // España (+34) y número de contacto, sin espacios.
  const tabs = document.querySelectorAll(".tab");
  const price = document.querySelector("#plan-price");
  const period = document.querySelector("#plan-period");
  const note = document.querySelector("#plan-note");
  const whatsappLinks = [document.querySelector("#invoice-whatsapp"), document.querySelector("#floating-whatsapp")];

  function updateWhatsapp(plan) {
    const message = plan === "monthly"
      ? "Hola, me interesa la página web de ISMADEV por 45 €/mes + IVA. ¿Podéis informarme?"
      : "Hola, me interesa una página web de ISMADEV desde 650 € + IVA. ¿Podéis informarme?";
    whatsappLinks.forEach((link) => {
      if (!whatsappNumber) {
        link.href = "#contacto";
        link.removeAttribute("target");
        link.title = "Pendiente de configurar el número de WhatsApp";
      } else {
        link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        link.target = "_blank";
      }
    });
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => {
    const monthly = tab.dataset.plan === "monthly";
    tabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    price.textContent = monthly ? "45 €" : "650 €";
    period.textContent = monthly ? "/mes" : "";
    note.textContent = monthly
      ? "Permanencia mínima de 12 meses (540 € + IVA). Incluye dominio, alojamiento, correo y mantenimiento según contrato."
      : "Dominio, alojamiento y correo previstos para el primer año, sujetos a presupuesto. Mantenimiento opcional.";
    updateWhatsapp(monthly ? "monthly" : "single");
  }));
  updateWhatsapp("single");
  if (!whatsappNumber) document.querySelector("#floating-whatsapp").hidden = true;
  document.querySelector("#year").textContent = new Date().getFullYear();

  // Navegación accesible en pantallas pequeñas.
  const menuButton = document.querySelector("#menu-toggle");
  const navigation = document.querySelector("#primary-nav");
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });

  // Envío real al backend opcional. Si no está activo, se ofrece mailto.
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.classList.remove("error");
    status.textContent = "Enviando consulta…";
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(10000)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se ha podido enviar.");
      status.textContent = "Consulta enviada correctamente. Gracias por contactar.";
      form.reset();
    } catch (error) {
      const subject = encodeURIComponent(`Consulta ISMADEV: ${data.service}`);
      const body = encodeURIComponent(`Nombre: ${data.name}\nEmail: ${data.email}\nServicio: ${data.service}\n\n${data.message}`);
      const link = document.createElement("a");
      link.href = `mailto:ilopez.infor@hotmail.com?subject=${subject}&body=${body}`;
      link.textContent = "Abrir mi correo para enviar la consulta";
      status.classList.add("error");
      status.replaceChildren("El envío automático no está disponible. ", link);
    } finally {
      button.disabled = false;
    }
  });

  // Animaciones progresivas; la web sigue funcionando sin GSAP.
  if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.from(".hero-inner > *", {opacity:0, y:25, duration:.8, stagger:.12, ease:"power2.out"});
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray(".card").forEach((card) => {
        gsap.from(card, {scrollTrigger:{trigger:card,start:"top 90%",once:true},opacity:0,y:35,duration:.65});
      });
      gsap.from(".invoice", {scrollTrigger:{trigger:".invoice",start:"top 85%",once:true},opacity:0,y:55,duration:.9});
    }
  }
});
