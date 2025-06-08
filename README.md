# 📚 BookVerse — Online Book Marketplace

A full-stack web application for listing, searching, and managing books.

---

## 🚀 Tech Stack

- ⚡ **Next.js 15 (App Router)**
- 🎨 **ShadCN UI** + Tailwind CSS
- 🍪 **JWT Authentication** (access token via HTTP-only cookie)

---

## 📁 Project Structure

bookverse-client/
├── app/ # App router pages
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Landing page
│ └── ... # Auth, profile, browse, etc.
├── components/ # Reusable UI components
├── hooks/ # Custom hooks (e.g. useAuth, useVerify)
├── lib/ # Utility functions (e.g. axios config)
├── middleware.ts # Route protection via cookies
├── public/ # Static assets
├── styles/ # Global styles
├── tailwind.config.ts # Tailwind CSS config
├── tsconfig.json # TypeScript config
└── ...

## ⚙️ Setup Instructions (Development)

### 1. Clone the repository

```bash
git clone https://github.com/egsir1/rgt-bookstore-client

npm install

NEXT_PUBLIC_API_URL=http://localhost:7000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
Adjust the URLs based on your backend port and domain.

4. Run the development server

npm run dev
Then open http://localhost:3000 in your browser.

🛠 Build & Run in Production
1. Build the project

npm run build

🔐 Auth Flow
Signup, Login, Logout using secure HTTP-only cookies

Middleware redirects unauthenticated users to /auth

Auto redirect back after login using next query param

```
