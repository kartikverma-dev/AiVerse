# 🌌 AiVerse

> **Don't chase headlines. Track the evolution of ideas.**

**AiVerse** is a living knowledge graph and intelligence platform for the AI ecosystem. Instead of reading hype-filled headlines, AiVerse allows developers, researchers, and students to track how machine learning concepts are born, how they evolve over time, and whether they are worth your attention today using evidence-based metrics.

---

## 🚀 Key Features

*   **📚 Concept Library:** A curated glossary of AI and Machine Learning terminology with direct TL;DRs, deep technical definitions, simplified beginner explanations, citations, and adoption status.
*   **🔗 Evolution Timeline:** A lineage mapping tool showing how modern AI concepts descend from foundational ideas (e.g., *Prompt Engineering* → *Chain-of-Thought (CoT)* → *Context Engineering* → *Loop Engineering*).
*   **🕸️ Interactive Relationship Graph:** A dynamic, interactive force-directed graph (powered by D3.js) connecting related concepts. Filter by category, difficulty, or development status.
*   **📡 Relevance Tracker:** An automated, evidence-based status pipeline tracking GitHub activity, academic paper mentions, and community volume to categorize concepts (e.g., 🌱 *Emerging*, 📈 *Growing*, ✅ *Stable*).
*   **🏆 Source Hierarchy:** Cited claims and definitions ranked by authority from official lab papers down to community discussions.
*   **📬 Weekly Digest:** Automatically generated digests summarizing weekly conceptual shifts, status changes, and notable publications.

---

## 🛠️ Technology Stack

*   **Framework:** [Next.js](https://nextjs.org/) (v16 App Router + Turbopack)
*   **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + Realtime)
*   **AI Inference:** [NVIDIA NIM API](https://build.nvidia.com/) (Meta Llama 3.3 70B Instruct for concept drafting and status evaluation)
*   **Data Visualization:** [D3.js](https://d3js.org/) (Force-directed graphs)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Styling:** Custom CSS Custom Properties (for cohesive dark-mode design system)

---

## 📦 Getting Started

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm/pnpm/yarn installed.

### 2. Installation
Clone the repository and install the dependencies:

```bash
git clone https://github.com/kartikverma-dev/AiVerse.git
cd AiVerse
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and configure the following keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bhdlvxycieaycbplkmpp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_PxasSUjf25hg8xDbCo7Acw_sRGeNq21
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NVIDIA_NIM_API_KEY=your_nvidia_nim_api_key
ADMIN_SECRET=your_admin_panel_password
```

### 4. Database Setup
The database schema is located at `supabase/schema.sql`. You can initialize or update your Supabase database instance by running these SQL commands in the Supabase SQL Editor.

### 5. Running the Application
To run the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

---

## 📂 Project Structure

```text
├── app/                  # Next.js App Router (pages and layouts)
│   ├── admin/            # Curators & Admin Dashboard
│   ├── api/              # API Route Handlers (NVIDIA NIM pipeline & db synchronization)
│   ├── concepts/         # Concept library views
│   ├── digest/           # Weekly digest generator view
│   ├── graph/            # D3 interactive knowledge graph
│   └── timeline/         # Chronological lineage views
├── components/           # Reusable React components
│   ├── admin/            # Admin UI elements (Sidebar, forms)
│   ├── public/           # Public UI cards and nodes
│   └── ui/               # Global components (Navbar, search, layouts)
├── lib/                  # Utilities, Supabase Clients & NVIDIA NIM integration
├── public/               # Static assets
├── scripts/              # Pipelines and automated sync scripts
├── supabase/             # Database initialization schemas (schema.sql)
└── types/                # TypeScript shared typings
```

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
