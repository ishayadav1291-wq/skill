# SkillSetu (कौशलसेतू)

> **AI Career Guidance & Skill-Gap Platform for Vocational & Polytechnic Students in India**

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-19%20Passed-2E8B57.svg)](./src/tests/runAllTests.ts)
[![NSQF](https://img.shields.io/badge/NSQF-Levels%203--8-F28C28.svg)](https://www.msde.gov.in/)
[![Theme](https://img.shields.io/badge/Theme-Two%20Mode%20(Light%2FDark)-8A2BE2.svg)](#)

---

## 🎯 What is SkillSetu?

**SkillSetu** is an AI-powered career pathing and diagnostic platform engineered specifically for **ITI, Polytechnic, and Diploma students** across India. 

Rather than relying on ungrounded chatbot advice, SkillSetu evaluates real **NSQF-aligned job competency requirements**, calculates deterministic gap matrices, and charts personalized 8-week learning pathways to high-growth industrial and tech roles.

---

## 🌟 Key Highlights

- **Career Ladder Progression**: 4 clean vocational rungs from **Starter** (Level 4, ₹15k–₹20k/mo) to **Specialist** (Level 7, ₹45k–₹70k/mo) with gamified **Level Up ⚡** micro-advancement.
- **Explain-and-Challenge Scoring**: Transparent mathematical fit formula combining **Skill Readiness (60%)**, **Interest Alignment (25%)**, and **Industry Demand (15%)**.
- **Interactive "What-If" Simulator**: Real-time slider simulator allowing students to test how upgrading specific competencies impacts their readiness before enrolling in courses.
- **Stepping-Stone Intelligence**: Automatic intermediate role recommendations for learners starting under 50% target readiness.
- **Multi-Modal Skill Calibration**:
  - **Diagnostic Quizzes**: 5-question verified skill checkpoints.
  - **Resume & Project Text Parser**: Upload `.pdf`, `.docx`, `.txt` or drag & drop to auto-extract trade competencies.
  - **DigiLocker & Skill India Gateway**: One-click verification for NCVT Trade Certificates and marksheets.
- **Dual-Theme High-Contrast UI**: Handcrafted Light and Dark modes (`☼ / ☾`) with accessible WCAG AA contrast.
- **Trilingual Accessibility**: Full platform localization in **English**, **हिन्दी (Hindi)**, and **मराठी (Marathi)**.
- **100% User Data Isolation**: Zero pre-filled demo data leaks for real student accounts, with instant persistent browser sync.

---

## 🏛️ System Architecture

```text
+---------------------------------------------------------------------------------+
|                                1. USER INTERFACE                                |
|   * Student Dashboard & Ladder            * Interactive What-If Simulator       |
|   * Resume & Document Ingestion           * College TPO Cohort Analytics        |
|   * 8-Week Modular Pathway Engine         * Recruiter & Mentor Endorsements     |
+---------------------------------------+-----------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
|                             2. STATE & PERSISTENCE                              |
|   * AppContext: Multi-role authentication & isolated profile vectors            |
|   * StorageService: Local storage sync (isolated per user, zero demo leaks)    |
+---------------------------------------+-----------------------------------------+
                                        |
                   +--------------------+--------------------+
                   |                                         |
                   v                                         v
+--------------------------------------+  +---------------------------------------+
|       3. CORE ALGORITHM ENGINE       |  |      4. GOVERNMENT & DATA APIS        |
|  * Weighted Skill Gap Formula        |  |  * DigiLocker: NCVT Trade Certs       |
|  * Semantic Interest Matching        |  |  * Skill India Digital (SID): PMKVY   |
|  * Stepping-Stone Role Finder        |  |  * NAPS: Apprenticeships & Jobs       |
|  * 8-Week Pathway Generator          |  |  * SWAYAM / NPTEL: Free Course Maps   |
+--------------------------------------+  +---------------------------------------+
```

---

## 🧮 How Scores Are Calculated

$$\text{Fit Score} = (0.60 \times \text{Skills}) + (0.25 \times \text{Interests}) + (0.15 \times \text{Market Demand})$$

1. **60% Measured Skills**: Evaluated against the role's required skill thresholds (Level 0–5).
2. **25% Interest Fit**: Normalized cosine overlap between student interests and domain requirements.
3. **15% Market Demand**: Real-time hiring score calibrated to Indian industry trends.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) |
| **Bundler & Tooling** | [Vite 8](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (`@import "tailwindcss"`) |
| **Icons & Effects** | [Lucide React](https://lucide.dev/) + [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **AI Integration** | [@google/genai SDK](https://www.npmjs.com/package/@google/genai) |
| **Testing Engine** | Node.js Test Suite (`tsx`) |

---

## 🧪 Automated Test Suite (19 / 19 Passed)

Run the end-to-end automated validation suite:

```bash
npm test
```

### Test Coverage Breakdown:
- **Suite 1 (Taxonomy & NSQF Alignment)**: Validates career roles, level boundaries (Levels 3–8), demand indices, and skill references.
- **Suite 2 (Deterministic Recommendation Engine)**: Tests mathematical gap calculations, normalized interest fit, penalty skill detection, What-If simulation deltas, and stepping-stone triggers.
- **Suite 3 (Learning Pathway Builder)**: Verifies weekly hour budgets, prerequisite unlocks, and structured 8-week curriculum generation.
- **Suite 4 (Storage Service & Persistence)**: Ensures full state persistence for profiles, quizzes, certificates, and institutional batches.
- **Suite 5 (DigiLocker Verification)**: Tests cryptographic document injection and skill elevation to verified status.
- **Suite 6 (User Isolation & Fresh Accounts)**: Verifies zero demo data leakage for newly registered accounts.

---

## ⚡ Quick Start

### Prerequisites
- Node.js 20+ installed
- npm or pnpm

### Installation

```bash
# 1. Clone repository
git clone https://github.com/ishayadav1291-wq/SkillSetu-AI.git
cd SkillSetu-AI

# 2. Install dependencies
npm install

# 3. Run automated tests
npm test

# 4. Start development server
npm run dev
```

Visit `http://localhost:3000` to interact with the application.

---

## 👥 Multi-Role Support

- **Student Portal**: Skill diagnostics, Career Ladder, What-If simulator, and curated learning roadmaps.
- **Institution (TPO / Principal) Portal**: Cohort readiness metrics, batch deficit heatmaps, and placement tracking.
- **Industry Mentor / Recruiter Portal**: Verified student profiles, candidate endorsements, and NAPS apprenticeship matching.
- **System Admin**: Scoring formula calibration weights ($w_{\text{skill}}$, $w_{\text{interest}}$, $w_{\text{demand}}$).

---

## 📄 License & Standards Alignment

- **National Skills Qualification Framework (NSQF)**: Aligned with MSDE vocational levels 3 through 8.
- **National Classification of Occupations (NCO)**: Aligned with standard 4-digit occupational codes.
- **Data Privacy**: Client-side storage and verification workflows compliant with Indian **DPDP Act 2023** principles.
