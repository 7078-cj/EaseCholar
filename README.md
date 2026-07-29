# EaseKolar

EaseKolar is a scholarship discovery platform built for Filipino students (undergraduate and Master's applicants). Students fill out a short profile, optionally upload supporting documents, and get matched against a database of government (CHED, DOST) and university scholarships — each shown with a clear, honest eligibility status instead of a vague "maybe."

EaseKolar never processes applications itself. Every scholarship redirects to its own official page or university portal — the platform's job is only to tell you, quickly and specifically, where you already stand.

## Project Overview

**Problem:** Filipino students looking for scholarships have to search dozens of government and university websites individually, with no way to quickly tell which ones they actually qualify for.

**Solution:** EaseKolar collects a student's profile once (region, GPA, income bracket, year level, course, etc.), optionally verifies it against uploaded documents via OCR + LLM extraction, and matches it against every scholarship in the database — showing per-scholarship eligibility instead of one global yes/no.

**What EaseKolar is not:** an application portal. There is no submission step on the platform — "Visit Official Website" always redirects externally.

## Core Concepts

**Three-state eligibility per scholarship** (never a single global status):

| Status | Meaning |
|---|---|
| **Eligible** | Every requirement is met by the data/documents already submitted |
| **Missing Requirements** | Nothing disqualifies the student, but a required document hasn't been uploaded to confirm a criterion |
| **Not Eligible** | A submitted value fails a hard cutoff (e.g. GPA below the required minimum) — shown plainly, never softened |

**Documents are a match-accuracy lever, not a gate.** Nothing on EaseKolar is ever blocked by missing documents — uploading more just moves scholarships from "Missing Requirements" toward "Eligible."

**Scholarship data is scraped**, not manually entered — sourced from CHED/DOST/university listings via a background scraping pipeline.

## Tech Stack

### Frontend
- **React** (Vite)
- **Zustand** — state management (`useProfileStore`, `useDocumentsStore`, `useMatchStore`)
- **Tailwind CSS** — styling
- **Axios** — API client
- **Lucide React** — icons
- Deployed on **Vercel**

### Backend
- **Django** + **Django REST Framework**
- **EasyOCR** — OCR extraction from uploaded report cards / documents
- **Google Gemini API** (`google-genai`) — structured data extraction (GWA, income, etc.) and friendly tip rephrasing
- **Playwright** — scholarship web scraping pipeline
- Runs via **Docker** (Debian-based Python image — Alpine is not supported due to Playwright/OpenCV requirements)

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.12
- **Docker** (recommended for backend, especially for EasyOCR + Playwright)
- A **Google Gemini API key**

## Backend Setup

### Option A — Local (without Docker)

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

pip install -r requirements.txt

# Create .env in backend/ (see Environment Variables section below)

python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

> **Note:** `runserver` is fine for local development only. See [Deployment](#deployment) for production notes.


The backend starts at `http://127.0.0.1:8000`.

## Frontend Setup

```bash
cd frontend
npm install

# Create .env in frontend/ (see Environment Variables section below)

npm run dev
```

The frontend starts at `http://localhost:5173` by default.

**Build for production:**

```bash
npm run build   # outputs to dist/
```

