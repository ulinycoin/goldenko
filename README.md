# Goldenko Landing Page

B2B landing page for Goldenko (Elevator Renovation & Maintenance in Latvia).

## Tech Stack
- **Framework**: Vite (Vanilla JS)
- **Styling**: Tailwind CSS v3
- **Animations**: GSAP

## Setup & Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```

## Deployment Instruction
To deploy this project to production (Vercel, Netlify, etc.):

1. **Build the project**:
   ```bash
   npm run build
   ```
   This will create a `dist` folder with optimized HTML, CSS, and JS.

2. **Deploy to Vercel**:
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel` in the root directory.
   - Choose default settings (Vite is detected automatically).

3. **Deploy to Netlify**:
   - Drag and drop the `dist` folder to Netlify Drop.
   - Or connect GitHub repo and set Build Command: `npm run build`, Publish Directory: `dist`.

## Project Structure
- `index.html`: Main structure (B2B content).
- `src/main.js`: Animation logic (GSAP) and interactivity.
- `src/style.css`: Tailwind directives.
