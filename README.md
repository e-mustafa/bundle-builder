# 🛡️ Interactive Bundle Builder - E-Commerce Security System Configurator

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://wyze-bundle-builder-chi.vercel.app/)

> 🚀 **Live Demo:** [https://wyze-bundle-builder-chi.vercel.app/](https://wyze-bundle-builder-chi.vercel.app/)

A high-performance, fully responsive multi-step bundle builder built with **React 19**, **TypeScript**, **Zustand**, and **Tailwind CSS v4**.

This application enables shoppers to dynamically assemble a custom security system through an interactive 4-step accordion process while maintaining real-time synchronization with a sticky order review panel.

---

## 🌟 Key Features

- **Multi-step Accordion Flow:** Step-by-step assembly process featuring contextual headers, "N selected" product counters, and seamless smooth step navigation.
- **Independent Variant Tracking:** Complex state logic where variants (e.g., product color chips) maintain isolated quantities. Switching variants updates the active stepper without overwriting other variant selections.
- **Real-time Live Review Panel:** Instant itemized price calculations, category groupings (Cameras, Sensors, Accessories, Plans), shipping calculation, savings breakdown, and checkout summary.
- **Bidirectional Quantity Syncing:** Quantity changes in either the product card or the review panel remain 100% synchronized in real time.
- **Client-Side Persistence:** "Save my system for later" functionality persists the user's exact configuration (selections, quantities, active variants) in `localStorage` and hydrates seamlessly on return visits.
- **Data-Driven Architecture:** Entire UI, steps, products, variants, and pricing structures are rendered dynamically from a JSON schema.
- **Fully Responsive & Accessible:** Desktop matches Figma specs pixel-for-pixel, with mobile-first layouts and proper ARIA accordion accessibility attributes.

---

## 🛠️ Tech Stack & Tools

- **Core:** React 19, TypeScript, Vite
- **State Management:** Zustand v5 (for global quantity tracking, active steps, and localStorage persistence)
- **Styling:** Tailwind CSS v4, `clsx`, `tailwind-merge`
- **Icons:** Lucide React
- **Feedback Notifications:** `react-hot-toast`

---

## 🏗️ Architectural Decisions & Tradeoffs

### 1. State Management Strategy (Zustand over Context)

We chose **Zustand** instead of React Context to avoid unnecessary re-renders across steps and cards during high-frequency quantity adjustments. Zustand selectors ensure that only components bound to specific product key changes undergo re-renders.

### 2. Composite Key Schema for Variants (`productId` + `variantId`)

To handle variant isolation correctly:

- Products without variants are keyed by `productId` (e.g., `"wyze-duo-cam-doorbell"`).
- Products with variants use a composite key format: `${productId}:${variantId}` (e.g., `"wyze-cam-v4:black"`).
  This guarantees that selecting 2 White cameras and switching to Black resets the UI stepper to 0 without clearing the 2 White cameras from the Zustand store or the Review Panel.

### 3. Array Index Navigation vs `stepNumber`

Accordion navigation relies directly on the array index (`index + 1`) rather than hardcoded step IDs or numbers. This guarantees that filtering or modifying steps dynamically in the backend JSON won't break the step navigation flow or trigger out-of-bounds array errors.


### 4. Typography & Font Normalization

To ensure optimal web performance and cross-device rendering, **Inter** was chosen as the primary typeface to replace the design's custom `Gilroy` font. Additionally, Figma listed a static `font-weight: 400` for all text because the actual weights were embedded in the font names (`Gilroy-Regular`, `-Medium`, `-SemiBold`). We corrected this by mapping each element to its proper semantic weight (`400`, `500`, and `600`).

---

## 🚀 Getting Started

### Prerequisites

Make sure you have **Node.js** (v18.x or higher) and **npm** installed on your machine.

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/e-mustafa/bundle-builder.git](https://github.com/e-mustafa/bundle-builder.git)
   cd bundle-builder
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   ```
3. **Start the development server:**
   ```bash
   pnpm run dev
   ```
4. **Open your browser and navigate to:**
   ```
   http://localhost:5173
   ```

---

## 📜 Available Scripts

- `pnpm run dev` - Starts the Vite local development server with HMR.

- `pnpm run build` - Runs TypeScript type checking (tsc --noEmit) followed by the Vite production build.

- `pnpm run type-check` - Validates TypeScript types across the codebase without emitting output.

- `pnpm run lint` - Runs ESLint to check for code quality and formatting issues.

- `pnpm run preview` - Previews the production build locally.

---

## 📂 Directory Structure

```text
├── public/
│   ├── data/                  # Mock JSON configuration dataset
│   └── assets/                # Static assets (images, icons, etc.)
├── src/
│   ├── features/
│   │   └── bundle-builder/
│   │       ├── components/    # ProductCard, ReviewPanel, StepIcon, etc.
│   │       ├── stores/        # Zustand bundle state & persistence logic
│   │       ├── types/         # Strictly-typed TypeScript interfaces
│   │       └── utils/         # Helper utilities & price aggregators
│   ├── shared/                # Utility classes & tailwind merge helpers
│   └── App.tsx                # Root application component
├── pnpm-lock.yaml             # Lockfile for consistent pnpm installations
└── package.json               # Project manifest and dependencies
```

---
