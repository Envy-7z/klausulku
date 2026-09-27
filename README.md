# KlausulKu 🛡️

> **AI-Powered Legal Document Advisor for Indonesian MSMEs (UMKM)**  
> Upload contract PDFs/scans, get instant clause-by-clause risk analysis, actionable fairness scores, and export ready-to-send negotiation drafts.

Built for **[#JuaraVibeCoding](https://gdg.community.dev)** — Google for Developers Study Jam Indonesia.

---

## 🎯 The Problem

Contracts in Indonesia are easy to sign, but hard to truly understand.

Most small business owners (warung, rental shops, small franchises) sign lease agreements and vendor MOUs without fully grasping the legal jargon. Not out of carelessness, but because the language was never written for them. Hidden liabilities, one-sided termination penalties, and ambiguous indemnity traps often show up months later when disputes arise.

**KlausulKu** bridges this gap by transforming complex legal contracts into clear, plain-language insights in under 3 seconds.

---

## ✨ Features

- **⚡ Sub-3-Second AI Contract Analysis**: Drag & drop PDF or image contracts for instant parsing powered by Gemini 2.5 Flash.
- **🚦 Clear AI Verdicts**: Immediate categorization — *Safe to Sign*, *Negotiate First*, or *Walk Away*.
- **📊 UMKM-Friendliness Index (0–100)**: Quantitative fairness score benchmarking the agreement against typical Indonesian commercial market standards.
- **🔍 Clause-by-Clause Risk Heatmap**: Highlights the top fine-print traps with specific paragraph-level warnings.
- **💬 Ready-to-Send Negotiation Drafts**: 1-click generator for professional WhatsApp, Email, or Addendum responses to counter-propose fairer terms.
- **📋 Prioritized Action Plan**: Concrete next steps categorized into Urgent, Important, and Optional actions.
- **🛡️ Guided AI Advisory Chat**: Contextual Q&A allowing owners to ask specific questions like *"Can they terminate my lease early without compensation?"*.
- **📄 Complete Report Export**: Export formatted PDF health audit summaries and sync critical dates to `.ics` calendar files.
- **🌓 Dual Mode & Auth**: Responsive light and dark modes with Google Sign-In and cloud persistence via Firebase Firestore.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS v4, shadcn-inspired accessible primitives |
| **AI Engine** | Google Gemini 2.5 Flash (`@google/genai`) |
| **Auth & Database** | Firebase Authentication (Google SSO) & Cloud Firestore |
| **Icons & Fonts** | Lucide React, Plus Jakarta Sans |
| **Export Engines** | `html2pdf.js`, iCalendar `.ics` utilities |
| **Container & Cloud** | Docker, Nginx, Google Cloud Run |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Google Gemini API Key from [Google AI Studio](https://aistudio.google.com)
- Firebase Project with Google Auth & Firestore enabled

### Local Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Envy-7z/klausulku.git
   cd klausulku
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_GCP_PROJECT_ID=your_gcp_project_id
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 📦 Scripts

```bash
npm run dev        # Launch Vite development server
npm run build      # Build optimized production bundle
npm run preview    # Preview production build locally
npm run lint       # Run ESLint validation
```

---

## 🚢 Cloud Run Deployment

KlausulKu is containerized via multi-stage Docker builds and served through Nginx on Google Cloud Run:

```bash
# Build and tag image
docker build \
  --build-arg VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY \
  --build-arg VITE_GCP_PROJECT_ID=$VITE_GCP_PROJECT_ID \
  -t gcr.io/klausulku/klausulku .

# Deploy to Cloud Run
gcloud run deploy klausulku \
  --image gcr.io/klausulku/klausulku \
  --platform managed \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --port 8080
```

---

## ⚖️ Disclaimer

*KlausulKu provides automated document analysis and risk assessment powered by artificial intelligence. It does not constitute formal legal advice. Users are encouraged to consult certified legal counsel for high-liability commercial disputes.*

---

## 📄 License

MIT © [Wisnu Andrian](https://github.com/Envy-7z)
