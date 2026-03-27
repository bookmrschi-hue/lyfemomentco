# CLAUDE.md — Lyfe Moment Co.

## Project Overview

**Lyfe Moment Co.** is a custom graduation and event planning/decoration business based in Corona, CA. This repository is a **single-file static web application** — the entire frontend lives in `index.html` (HTML + CSS + JavaScript, ~1,266 lines, ~25MB due to embedded base64 images).

There is no build system, no package manager, no backend, and no framework. To run the app, open `index.html` directly in a browser.

---

## Repository Structure

```
lyfemomentco/
├── index.html   ← Entire application (HTML + CSS + JS + embedded images)
└── CLAUDE.md    ← This file
```

---

## Tech Stack

| Layer       | Technology                         |
|-------------|-----------------------------------|
| Markup      | HTML5                              |
| Styling     | Vanilla CSS (CSS variables, flex/grid, animations) |
| Scripting   | Vanilla ES6+ JavaScript (async/await, Fetch API, FileReader) |
| Images      | Base64-encoded data URIs in `IMGS` JS object |
| AI Feature  | Anthropic API (`claude-sonnet-4-20250514`) |
| No Framework | No React/Vue/Angular, no npm/webpack/vite |

---

## Application Architecture

### Page Sections (top → bottom)

| Section ID      | Purpose                                          |
|-----------------|--------------------------------------------------|
| *(nav)*         | Sticky navigation bar with cart icon             |
| *(ticker)*      | Scrolling announcement banner                    |
| *(hero)*        | Welcome/brand hero section                       |
| `#packages`     | 4 service tiers ($250 → $15K+)                  |
| `#how`          | 5-step "How It Works" process                    |
| `#events`       | Event showcase gallery + Star Package promo      |
| `#grades`       | Products organized by school grade (K, 6, 8, 12)|
| `#gallery`      | Editable 8-photo mosaic gallery                  |
| `#testimonials` | Customer quote section (currently empty)         |
| `#products`     | 12 product cards (prints, decor, yearbooks, etc.)|
| `#yearbook`     | Highlighted personal yearbook product            |
| `#process`      | 5-step order process + drag-drop file upload     |
| `#planner`      | AI-powered party planning form                   |
| `#order`        | Final checkout + payment method selection        |

### Core Data Structures

```javascript
const IMGS = { ... }         // All images as base64 data URIs
const events = [...]         // 8 event showcase objects { src, name, desc, price, tag }
const products = [...]       // 12 products { name, emoji, desc, price, img, badge }
const gradeProds = { ... }   // Products by grade: kinder, sixth, eighth, twelfth
const galleryData = [...]    // 8 gallery items { src, label, wide }
```

### JavaScript Functions (17 total)

| Function              | Purpose                                               |
|-----------------------|-------------------------------------------------------|
| `renderEvents()`      | Render events showcase grid                           |
| `renderGallery()`     | Render photo gallery mosaic                           |
| `getP(name)`          | Look up a product by name                             |
| `makeGradeCard(name)` | Build a product card for milestone/grade products     |
| `renderGrades()`      | Render all grade-based product grids                  |
| `renderProducts()`    | Render the main 12-product grid                       |
| `triggerImg(i)`       | Click hidden file input for product image upload      |
| `handleImg(e,i)`      | Read and preview uploaded product image               |
| `triggerGallery(i)`   | Click hidden file input for gallery image upload      |
| `handleGallery(e,i)`  | Read and preview uploaded gallery image               |
| `addToCart(name)`     | Add product to cart, increment counter, show toast    |
| `addPkg(name)`        | Add a package to cart, scroll to `#order`             |
| `showToast(msg)`      | Display a timed notification overlay                  |
| `selectPay(el,method)`| Toggle active payment method (Square/Zelle/Cash App) |
| `handleUpload(e)`     | Handle batch file upload with drag-drop preview       |
| `generatePlan()`      | Call Anthropic API and display AI party plan          |
| `renderPlan(plan,name)`| Render the returned AI party plan into the DOM      |

---

## CSS Conventions

### Color Variables (defined on `:root`)

```css
--tiffany: #7EC8D8   /* Primary brand color */
--yellow:  #F5D020
--cream:   #FFFEF5   /* Page background */
--navy:    (dark text/accents)
--black:   #111111
--white:   #FFFFFF
```

Always use CSS variables for brand colors. Do not hardcode hex values that correspond to a variable.

### Layout

- Page uses a **scroll-based single-page layout** — no routing.
- Sections are full-width with centered `max-width` containers.
- Grid and flexbox are used for all multi-column layouts.
- Responsive breakpoints exist via `@media` queries; mobile-first is not strictly enforced.

---

## Key Conventions & Rules

### 1. Single-File Architecture
All changes go into `index.html`. Do **not** create separate `.js`, `.css`, or template files unless the user explicitly asks to refactor to a multi-file structure.

### 2. No Build Step
There is no compilation or bundling. Changes to `index.html` take effect immediately on browser refresh. Do not introduce build tooling without explicit instruction.

### 3. Embedded Images
All images are stored as base64 data URIs in the `IMGS` constant near the top of the `<script>` block. New images should follow the same pattern. Avoid referencing external image URLs.

### 4. No Backend
This is a fully client-side application. There are no API routes, no server, and no database. All state is in-memory (resets on page reload). Do not assume any server-side persistence.

### 5. API Key Handling (Critical)
The `generatePlan()` function calls `https://api.anthropic.com/v1/messages`. The **API key is not currently present** in the fetch headers. When fixing or activating this feature, the key must be added to the `Authorization` header:

```javascript
headers: {
  "Content-Type": "application/json",
  "x-api-key": "<YOUR_API_KEY>",
  "anthropic-version": "2023-06-01"
}
```

**Never hardcode a real API key into the file.** Prompt the user to supply it or use a runtime input method.

### 6. Cart & Order State
Cart item count is tracked in `cartCount`. There is no cart item list, no order persistence, and no actual checkout submission logic implemented yet.

### 7. Payment Methods
Three payment options are shown in the UI: Square, Zelle, Cash App (`$LyfeMomentCo`). The selection UI is functional, but no payment processing logic exists.

---

## Business Domain Reference

| Category         | Details                                              |
|------------------|------------------------------------------------------|
| Business Name    | Lyfe Moment Co.                                      |
| Location         | Corona, CA (ships nationwide)                        |
| Services         | Custom print products, event planning/coordination   |
| Target Markets   | K-12 graduations, baby showers, galas, corporate     |
| Packages         | The Spark ($250), The Era ($500), Main Character ($2,500), The Vibe ($5K–$10K), Star Package ($15K+) |
| Products (12)    | Flyers, Posters, Foam Boards, Banners, Treat Bags, Invitations, Menus, Fans, Yard Signs, Stools, Welcome Sign, Personal Yearbook |
| Tax Rate         | 10.25% (CA sales tax, hardcoded)                    |
| Payment Methods  | Square, Zelle, Cash App                              |

---

## Development Workflow

### Running Locally
```bash
# No install or build needed — just open in browser
open index.html
# or serve with any static file server:
python3 -m http.server 8080
```

### Making Changes
1. Edit `index.html` directly.
2. Refresh the browser to see changes.
3. Validate that all 17 functions still exist and no section IDs were accidentally removed.

### Git Conventions
- Branch naming pattern: `claude/{feature-description}-{id}` (e.g., `claude/add-claude-documentation-fdg4m`)
- Default branch: `main`
- Remote: `origin`
- Commits use descriptive messages; prefer conventional commit style (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`)

### Pushing Changes
```bash
git add index.html CLAUDE.md
git commit -m "feat: description of change"
git push -u origin <branch-name>
```

---

## Known Issues / Missing Functionality

| Issue                             | Details                                                 |
|-----------------------------------|---------------------------------------------------------|
| AI planner non-functional         | Missing `x-api-key` header in `generatePlan()` fetch   |
| No order submission               | `handleOrder()` function not yet implemented            |
| No data persistence               | All cart/upload state lost on page reload               |
| No payment processing             | Payment method UI exists but no integration             |
| Testimonials section empty        | Section present in HTML but no testimonial content      |
| No input validation               | Order form fields lack client-side validation           |
| No error handling on AI fetch     | `generatePlan()` needs try/catch around the fetch call  |

---

## What to Avoid

- Do not add a build system, package.json, or npm dependencies unless explicitly asked.
- Do not split the single `index.html` into multiple files unless explicitly asked.
- Do not introduce a frontend framework (React, Vue, etc.) without explicit instruction.
- Do not hardcode real API keys, payment credentials, or sensitive values.
- Do not add a backend server unless explicitly asked.
- Do not alter the brand color variables without explicit instruction.
- Do not remove existing section IDs — they are used for smooth-scroll navigation.
