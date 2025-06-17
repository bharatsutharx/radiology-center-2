"use client"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export class AIService {
  private static readonly API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY
  private static readonly API_URL = "https://api.groq.com/openai/v1/chat/completions"
  private static lastRequestTime = 0
  private static readonly RATE_LIMIT_MS = 2000 // 2 seconds between requests

  static async getChatResponse(userMessage: string, chatHistory: Message[]): Promise<string> {
    // Rate limiting
    const now = Date.now()
    if (now - this.lastRequestTime < this.RATE_LIMIT_MS) {
      await new Promise((resolve) => setTimeout(resolve, this.RATE_LIMIT_MS - (now - this.lastRequestTime)))
    }
    this.lastRequestTime = Date.now()

    if (!this.API_KEY) {
      return this.getFallbackResponse(userMessage)
    }

    try {
      const systemPrompt = this.getSystemPrompt()
      const messages = [
        { role: "system", content: systemPrompt },
        ...chatHistory.slice(-6).map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.content,
        })),
        { role: "user", content: userMessage },
      ]

      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || this.getFallbackResponse(userMessage)
    } catch (error) {
      console.error("AI Service Error:", error)
      return this.getFallbackResponse(userMessage)
    }
  }

  private static getSystemPrompt(): string {
    return `You are an AI assistant for Dr. Bhajan Sonography & Imaging Center. You help patients and visitors with information about medical imaging services.

IMPORTANT: Always include this disclaimer at the end of medical advice: "Please consult with Dr. Bhajan Lal or our medical staff for personalized medical advice."

CENTER INFORMATION:
- Name: Dr. Bhajan Sonography & Imaging Center
- Expert Radiologist: Dr. Bhajan Lal (MBBS, MD Radiodiagnosis)
- Location: N.H. 68, Opp. B.Lal & Citilite Hospital, Kamalpura, Sanchor
- Phone: +91 94609 91212
- Email: drbhajansonography@gmail.com
- Hours: Mon-Sat: 8AM-8PM, Sun: 9AM-5PM

SERVICES AVAILABLE:

1. 1.5T MRI SCAN:
- Brain & Brain Angiography, Brain Venography & Spectroscopy
- Neck & PNS, Neck Angiography
- Cervical, Dorsal & Lumbosacral Spine, Whole Spine Screening
- Shoulder, Elbow & Wrist
- Duration: 30-60 minutes
- Preparation: Remove all metal objects, inform about implants

2. 96 SLICE CT SCAN (MDCT):
- CT Brain, Neck, Chest, Abdomen Pelvis, I.V.P
- HRCT Temporal Bone & Chest
- 3D Bone Reconstruction, CT Angiography
- Brain & Neck Angiography, Pulmonary, Renal, Abdominal Angiography
- CT Cisternography, Myelography, PNS, Orbit
- Duration: 10-30 minutes
- Preparation: Fasting may be required for contrast studies

3. SONOGRAPHY:
- Abdomen & Pelvis, Obs & Gynec
- Transvaginal, Thyroid, Neck, Scrotal, Breast Sonography
- Musculoskeletal Sonography
- USG Guided Procedures, FNAC & Biopsy
- Duration: 20-45 minutes
- Preparation: Full bladder for pelvic scans

4. DIGITAL X-RAY:
- All Routine X-Rays, Barium Studies
- IVT/MCU/RGU, HSG
- Duration: 5-15 minutes
- Low radiation, immediate results

5. COLOUR DOPPLER:
- Peripheral Arterial & Venous, Foetal Doppler
- Renal, Carotid, Scrotal, Small Part Doppler
- Duration: 30-45 minutes

6. SPECIAL PROCEDURES:
- USG Guided Procedures
- Liver Abscess Aspiration
- Pleural/Ascitic Tapping
- F.N.A.C. & Biopsy

Be helpful, professional, and informative. Answer questions about services, preparation, scheduling, and general medical imaging information. Always encourage patients to contact the center directly for appointments and specific medical advice.`
  }

  static getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("mri")) {
      return "We offer 1.5T MRI scans including brain, spine, and joint imaging. MRI uses magnetic fields and is safe with no radiation. Please remove all metal objects before the scan. For appointments, call +91 94609 91212. Please consult with Dr. Bhajan Lal or our medical staff for personalized medical advice."
    }

    if (lowerMessage.includes("ct") || lowerMessage.includes("scan")) {
      return "Our 96 Slice CT scanner provides rapid, detailed imaging for brain, chest, abdomen, and specialized studies like angiography. Some scans may require contrast and fasting. Contact us at +91 94609 91212 for scheduling. Please consult with Dr. Bhajan Lal or our medical staff for personalized medical advice."
    }

    if (lowerMessage.includes("ultrasound") || lowerMessage.includes("sonography")) {
      return "We provide comprehensive sonography services including abdominal, pelvic, obstetric, and specialized ultrasounds. It's safe, painless, and uses no radiation. Some scans require a full bladder. Call +91 94609 91212 for appointments. Please consult with Dr. Bhajan Lal or our medical staff for personalized medical advice."
    }

    if (lowerMessage.includes("appointment") || lowerMessage.includes("book")) {
      return "To schedule an appointment, please call us at +91 94609 91212 or email drbhajansonography@gmail.com. We're open Mon-Sat: 8AM-8PM, Sun: 9AM-5PM. Our expert radiologist Dr. Bhajan Lal will ensure you receive the best care."
    }

    if (lowerMessage.includes("location") || lowerMessage.includes("address")) {
      return "We're located at N.H. 68, Opposite B.Lal & Citilite Hospital, Kamalpura, Sanchor. You can easily find us on the main highway. For directions, call +91 94609 91212."
    }

    if (lowerMessage.includes("doctor") || lowerMessage.includes("radiologist")) {
      return "Our expert radiologist is Dr. Bhajan Lal (MBBS, MD Radiodiagnosis), a highly qualified specialist in medical imaging. He ensures accurate diagnosis and quality care for all patients."
    }

    if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
      return "For information about pricing and packages, please contact us directly at +91 94609 91212 or email drbhajansonography@gmail.com. We offer competitive rates for all our imaging services."
    }

    return "I'm here to help with information about our medical imaging services including MRI, CT scans, sonography, X-rays, and Colour Doppler. For specific questions or appointments, please call +91 94609 91212 or email drbhajansonography@gmail.com. Our expert radiologist Dr. Bhajan Lal is here to provide the best care. Please consult with Dr. Bhajan Lal or our medical staff for personalized medical advice."
  }
}

export async function generateMedicalResponse(userMessage: string): Promise<string> {
  try {
    // Rate limiting check
    const now = Date.now()
    const lastRequest = localStorage.getItem("last-chat-request")

    if (lastRequest && now - Number.parseInt(lastRequest) < 2000) {
      // 2 second cooldown
      await new Promise((resolve) => setTimeout(resolve, 2000 - (now - Number.parseInt(lastRequest))))
    }

    localStorage.setItem("last-chat-request", now.toString())

    // If no API key, return fallback response
    if (!AIService.API_KEY) {
      return AIService.getFallbackResponse(userMessage)
    }

    const systemPrompt = `You are an AI assistant for Dr. Bhajan Sonography & CT, MRI Centre. You help patients with medical imaging information.

IMPORTANT: Always include this disclaimer: "Please consult with Dr. Bhajan Lal or our medical staff for personalized medical advice."

CENTER INFORMATION:
- Name: Dr. Bhajan Sonography & CT, MRI Centre
- Expert Radiologist: Dr. Bhajan Lal (MBBS, MD Radiodiagnosis)
- Location: N.H. 68, Opp. B.Lal & Citilite Hospital, Kamalpura, Sanchor
- Phone: +91 94609 91212
- Email: drbhajansonography@gmail.com

SERVICES:
1. 1.5T MRI: Brain, Spine, Joints (30-60 min)
2. 96 Slice CT: All body parts, Angiography (10-30 min)
3. Sonography: Abdomen, Pelvis, Pregnancy (20-45 min)
4. Digital X-Ray: All routine X-rays (5-15 min)
5. Colour Doppler: Vascular studies (30-45 min)

Be helpful and professional. Encourage contacting the center for appointments.`

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIService.API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || AIService.getFallbackResponse(userMessage)
  } catch (error) {
    console.error("AI Service Error:", error)
    return AIService.getFallbackResponse(userMessage)
  }
}
