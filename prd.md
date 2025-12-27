# PRD: Reno Local Dollars Kept Calculator (MVP)

## 1) Summary
A lightweight Reno-specific web app that lets anyone enter a purchase amount by category (coffee, burrito, etc.) and instantly see an **estimated range of how much stayed in the Reno economy**, plus a **shareable link** to send to friends/family. No database required.

## 2) Goals
- Make “spend local” feel concrete with a simple estimate: **$ kept in Reno (low / likely / high)**
- Keep it fast, understandable, and shareable
- Avoid overclaiming: show ranges + assumptions clearly

## 3) Non-goals (for MVP)
- No business-level accuracy (no “this coffee shop” scoring)
- No automated competitor matching (Starbucks/Chipotle) yet
- No user accounts, no leaderboards, no place directory
- No paid APIs required

## 4) Target users
- Reno locals who want a quick gut-check on local impact
- People sharing with family/friends (holiday convos, community posts)
- Local organizers and small business supporters

## 5) Key concepts
- **Direct local retention**: estimated portion of spend that stays in Reno via local wages, rent, local suppliers, local ownership profit.
- **Range-based estimate**: show **low / likely / high** retention % per category.
- Optional later: ripple/rounds multiplier (but **exclude from MVP** to keep honest + simple).

## 6) User stories
1. As a user, I can pick a category and enter an amount to see how much likely stayed in Reno.
2. As a user, I can toggle frequency (one-time / weekly / monthly) to see monthly and yearly impact.
3. As a user, I can share a link that recreates the exact same result page.
4. As a user, I can read “how we estimate this” in plain language.

## 7) Core UX flow

### Screen A: Calculator
**Inputs**
- Category (dropdown or cards)
- Amount (number input)
- Frequency (optional): `one-time | weekly | monthly` (default: one-time)

**Outputs (live update)**
- “Estimated kept in Reno (likely): $X”
- Range: “$low – $high”
- If weekly/monthly: show “per month” + “per year”

**CTA**
- “Share result” (copies link)
- “Reset”

### Screen B: Result (same page, sharable)
When loaded via share URL:
- Pre-populate category/amount/frequency from URL
- Show same outputs
- “Edit” button returns to calculator mode

## 8) Calculation model (MVP)

### Data structure
Each category has:
- `retention_low` (0–1)
- `retention_likely` (0–1)
- `retention_high` (0–1)
- `description` (plain-language rationale)

### Computations
Let:
- `A` = amount
- `R_low/likely/high` = retention rates for category

Then:
- `kept_low = A * R_low`
- `kept_likely = A * R_likely`
- `kept_high = A * R_high`

**Frequency conversions**
- `one-time`: as-is
- `weekly` → monthly: `* 4.33`, yearly: `* 52`
- `monthly` → yearly: `* 12`

**Rounding**
- Display to 2 decimals
- Use consistent formatting (e.g., `$3.27`)

### Copy requirement
Always label:
- “Estimated (range)”
- “Based on category assumptions (not any specific business)”

## 9) Categories (starter set)
Include 6–8, Reno-oriented.

Recommended initial set (editable):
- Coffee / Café
- Quick Meal (Burrito / Sandwich)
- Restaurant Dinner
- Bar / Brewery
- Local Retail / Thrift
- Personal Services (Hair / Nails / Tattoo)
- Local Groceries / Market
- Events (Show / Market / Ticket)

For MVP, you can start with 6 categories if you want to keep UI tight.

## 10) Shareable link spec

### Route
`/r`

### Query parameters
- `c` = category key (string)
- `a` = amount (number, max 2 decimals)
- `f` = frequency key (`once|weekly|monthly`)

Example:
- `/r?c=coffee&a=6&f=weekly`

### Behavior
- If params missing/invalid, show calculator defaults.
- If category unknown, fallback to first category.
- If amount invalid/negative, clamp to `0`.

### Share action
- Generate URL from current state
- Copy to clipboard + show toast “Link copied”

## 11) Content: “How this works” (modal/drawer)
Short explainer:
- What “kept in Reno” means: local wages, local rent, local suppliers, local owner profit
- Why it’s a range (different businesses differ)
- This is not a statement about any specific business

Suggested sections:
- “What does ‘kept in Reno’ mean?”
- “Why is it a range?”
- “How can this be improved later?” (optional)

## 12) Tech requirements (MVP)
- Static-first Next.js route (or any SPA)
- No database
- State stored in URL (and optionally localStorage for convenience)
- Accessible UI (keyboard navigation, readable contrast)
- Mobile-first

## 13) Analytics (optional, free)
- If any analytics are used, they must be privacy-respecting (or none for MVP).
- MVP should work fully without analytics.

## 14) Acceptance criteria
- User can pick a category, enter amount, and see kept-low/likely/high immediately.
- User can switch frequency and see monthly/yearly values update correctly.
- “Share” creates a URL that reproduces the exact same state on reload.
- App clearly labels results as estimates based on category assumptions.
- Works on mobile and desktop.

## 15) Future enhancements (post-MVP)
- Add “local vs national competitor” comparison mode
- Add place-level search + evidence + confidence grading
- Add community-submitted category tuning for Reno
- Add shareable image card generation
- Add “rounds/ripple (beta)” toggle with clear labeling