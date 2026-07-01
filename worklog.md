# Northgate Institute of Technology — Demo Accounts & One-Click Login

---
Task ID: demo-accounts
Agent: main
Task: Make all demo accounts fully functional with one-click login buttons, add more demo student accounts with different scenarios

Work Log:
- Verified all 5 existing demo accounts are ACTIVE and have complete data:
  • admin@northgate.ac.ke (ADMIN) — full CMS access
  • editor@northgate.ac.ke (EDITOR) — content management
  • student@northgate.ac.ke (Alex Mwangi, Engineering, GPA 3.65, 5 units, 3 fees, 5 results, 92 attendance records, 10 notifications)
  • mary.student@northgate.ac.ke (Mary Wanjiru, ICT, GPA 3.85, 5 units, 3 fees, 5 results, 46 attendance, 10 notifications)
  • brian.student@northgate.ac.ke (Brian Otieno, Business, GPA 3.20, 4 units, 3 fees, 5 results, 46 attendance, 10 notifications)

- Added 3 new demo students with distinct scenarios (prisma/seed-students2.ts):
  • grace.student@northgate.ac.ke (Grace Achieng, Nursing, GPA 3.95, 98% attendance, fully paid fees, issued exam card, scholarship notification) — TOP PERFORMER scenario
  • david.student@northgate.ac.ke (David Kiprop, Agribusiness, GPA 2.10, 68% attendance, OVERDUE fees, PENDING exam card, warning notifications, no hostel) — STRUGGLING scenario
  • faith.student@northgate.ac.ke (Faith Njoroge, Culinary Arts, GPA 3.45, 91% attendance, partial fees, graduating, final year) — GRADUATING scenario
  • Each new student has: 4 enrolled units, 2 assessments per unit, POE requests, 30 days attendance, fees (scenario-appropriate), past + current results, exam card (scenario-appropriate), 5 notifications, hostel allocation (except David)

- Created 9 additional units for Nursing, Agriculture, and Hospitality departments

- Built /api/auth/demo-login API route:
  • Accepts { account: "admin" | "editor" | "student1" | ... | "student6" }
  • Maps to demo email, looks up user, sets session cookies, returns redirect URL
  • Logs DEMO_LOGIN audit event
  • Disabled in production unless ENABLE_DEMO_LOGIN=true

- Built reusable DemoLoginButtons component:
  • Takes array of { account, label, email, role, description, color }
  • One-click login with loading spinner per button
  • Error handling with toast
  • Redirects to appropriate dashboard (/admin or /student/dashboard)
  • Shows "All demo passwords" hint at bottom

- Added DemoLoginButtons to /admin/login:
  • Administrator (gradient-royal) — Full access
  • Content Editor (emerald) — Content only

- Added DemoLoginButtons to /student/login:
  • Alex Mwangi (royal) — Engineering · GPA 3.65
  • Mary Wanjiru (emerald) — ICT · GPA 3.85
  • Brian Otieno (blue) — Business · GPA 3.20
  • Grace Achieng (gold) — Nursing · GPA 3.95 ★
  • David Kiprop (red) — Agribusiness · GPA 2.10 ⚠
  • Faith Njoroge (purple) — Culinary · Graduating

- Added DemoLoginButtons to /portal (public student portal page):
  • 4 quick accounts: Alex (Engineering), Grace (Top performer), David (Struggling), Admin (Staff)

Stage Summary:
- Lint: clean
- Agent Browser verified end-to-end:
  • /student/login shows 6 one-click demo buttons with emails + descriptions
  • Click "Grace Achieng" → redirects to /student/dashboard → shows "Welcome back, Grace!" with GPA 3.95
  • /admin/login shows 2 one-click demo buttons
  • Click "Administrator" → redirects to /admin → dashboard loads
  • Click "David Kiprop" → dashboard shows struggling scenario (low GPA, overdue fees)
  • Click "Faith Njoroge" → dashboard shows graduating scenario
- All 8 demo accounts (2 staff + 6 students) are fully functional with one-click access
- Each student has a unique scenario that showcases different dashboard states
