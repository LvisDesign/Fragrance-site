# THE PERFUME SLUT | Luxury Fragrances & Bespoke Olfactive Art

A luxury e-commerce platform and administrative inventory management suite for The Perfume Slut fragrances, bespoke roll-on oils, and car scents.

---

## 🏛️ Repository Architecture

This repository is organized as a clean monorepo with isolated frontend and backend services:

```text
/ (Project Root)
├── .gitignore                         # Master root gitignore
├── README.md                          # Repository documentation
├── backend/                           # Standalone Express + Prisma API Service
│   ├── prisma/
│   │   └── schema.prisma              # PostgreSQL Database Models & Enums
│   ├── src/                           # Express Controllers, Routes, Services
│   ├── .env.example                   # Environment configuration template
│   └── package.json                   # Backend dependencies & scripts
└── frontend/                          # Next.js 14+ App Router Storefront & Admin UI
    ├── public/                        # Static brand assets & logos
    │   ├── theperfumeslut-logo.png
    │   ├── theperfumeslut-logo-transparent.png
    │   └── theperfumeslut-logo.svg
    ├── src/                           # Next.js pages, components, & Zustand stores
    ├── .env.example                   # Frontend environment configuration
    ├── AGENTS.md                      # AI Assistant Customization Guidelines
    ├── CLAUDE.md                      # Engineering Guidelines
    └── package.json                   # Frontend dependencies & scripts
```

---

## 🚀 Quick Start Instructions

### 1. Frontend Setup (Next.js Storefront & Admin UI)
```bash
cd frontend
npm install
npm run dev
```
Storefront opens at: `http://localhost:3000`  
Admin Auth Portal opens at: `http://localhost:3000/admin/login`

### 2. Standalone Backend Setup (Express + Prisma API)
```bash
cd backend
npm install
npm run dev
```
Backend API listener activates at: `http://localhost:5000`

---

## 🔑 Default Admin Credentials
- **Admin Email**: `theperfumeslut@gmail.com`
- **Default Password**: `0000`
- **Role**: `ADMIN`
