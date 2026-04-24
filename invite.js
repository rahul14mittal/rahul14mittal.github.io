document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("inviteCard");
  const fadeElements = document.querySelectorAll(".fade-in");

  // Initial load animation
  setTimeout(() => {
    card.classList.add("loaded");
  }, 100);

  setTimeout(() => {
    fadeElements.forEach(el => el.classList.add("visible"));
  }, 600);

  // Micro-animation: 3D tilt effect on card hover
  card.addEventListener("mousemove", (e) => {
    // Only apply hover tilt on non-touch devices
    if(window.matchMedia("(pointer: coarse)").matches) return;
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -3; // Subtle tilt
    const rotateY = ((x - centerX) / centerX) * 3;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(0)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
  });
});

const translations = {
  en: {
    eyebrow: "Together with their families",
    groom: "Rahul",
    bride: "Shinjini",
    subtitle: "Invite you to celebrate their wedding",
    date: "December 11-12",
    location: "Kolkata, West Bengal",
    button: "View the Itinerary"
  },
  hi: {
    eyebrow: "अपने परिवारों के साथ",
    groom: "राहुल",
    bride: "शिंजिनी",
    subtitle: "आपको अपनी शादी के जश्न में आमंत्रित करते हैं",
    date: "11-12 दिसंबर",
    location: "कोलकाता, पश्चिम बंगाल",
    button: "कार्यक्रम देखें"
  },
  bn: {
    eyebrow: "তাদের পরিবারের সাথে",
    groom: "রাহুল",
    bride: "শিঞ্জিনী",
    subtitle: "আপনাকে তাদের বিবাহের উদযাপনে আমন্ত্রণ জানাচ্ছে",
    date: "১১-১২ ডিসেম্বর",
    location: "কলকাতা, পশ্চিমবঙ্গ",
    button: "অনুষ্ঠানসূচি দেখুন"
  }
};

document.getElementById('languageToggle').addEventListener('change', (e) => {
  const lang = e.target.value;
  const t = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(t[key]) {
      el.style.transition = "opacity 0.3s ease";
      el.style.opacity = 0;
      setTimeout(() => {
        el.textContent = t[key];
        el.style.opacity = 1;
      }, 300);
    }
  });
});
