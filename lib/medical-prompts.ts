export const MEDICAL_PROMPTS = {
  // Quick response templates
  SERVICES: {
    xray: "Our digital X-ray services include chest imaging, bone fracture detection, and dental X-rays. Quick 5-15 minute procedures with minimal radiation exposure.",
    mri: "MRI scans provide detailed soft tissue imaging without radiation. We offer brain, spine, joint, and cardiac MRI with 30-60 minute scan times.",
    ct: "CT scans offer rapid cross-sectional imaging, perfect for emergency diagnostics and detailed organ examination. Scan time: 10-30 minutes.",
    ultrasound:
      "Safe ultrasound imaging for pregnancy monitoring, abdominal scans, cardiac echo, and thyroid examination. No radiation, real-time imaging.",
  },

  PREPARATION: {
    xray: "X-Ray preparation: Remove all jewelry and metal objects. Wear comfortable clothing. No special preparation needed.",
    mri: "MRI preparation: Remove all metal objects including jewelry, watches, and clothing with metal. Inform us of any implants or pacemakers.",
    ct: "CT preparation: May require fasting 4-6 hours before scan. Remove metal objects. Contrast material may be used.",
    ultrasound:
      "Ultrasound preparation: May require full bladder for pelvic scans. Fasting may be needed for abdominal scans.",
  },

  COMMON_QUESTIONS: {
    safety:
      "All our imaging procedures are safe when performed by qualified technologists. We follow strict safety protocols and use the latest equipment.",
    results:
      "Results are typically available within 24-48 hours. Urgent cases are prioritized. Reports are reviewed by board-certified radiologists.",
    insurance:
      "We work with most insurance providers. Please bring your insurance card and any required referrals to your appointment.",
  },
}

export const EMERGENCY_RESPONSES = {
  chest_pain:
    "For chest pain or breathing difficulties, please seek immediate emergency medical attention. Call emergency services or visit the nearest emergency room.",
  severe_injury:
    "For severe injuries or trauma, please call emergency services immediately. Our emergency imaging services are available 24/7 to support emergency care.",
  pregnancy_emergency:
    "For pregnancy-related emergencies, please contact your obstetrician immediately or visit the emergency room. Emergency ultrasound services are available.",
}
