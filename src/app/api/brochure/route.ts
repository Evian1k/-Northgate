/**
 * GET /api/brochure
 * Generates a downloadable PDF prospectus using HTML print approach.
 * Returns HTML that auto-opens the browser's print dialog (user selects "Save as PDF").
 */
import { db, ensureSeeded } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeeded();
  const [settings, departments, programmes] = await Promise.all([
    db.siteSetting.findMany(),
    db.department.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: { sortOrder: "asc" },
      include: { programmes: { where: { deletedAt: null, status: "PUBLISHED" }, orderBy: { sortOrder: "asc" } } },
    }),
    db.programme.count({ where: { deletedAt: null, status: "PUBLISHED" } }),
  ]);

  const s: Record<string, string> = {};
  for (const setting of settings) s[setting.key] = setting.value;

  const siteName = s["site.name"] || "Northgate Institute of Technology";
  const tagline = s["site.tagline"] || "Building Tomorrow's Skilled Professionals";
  const phone = s["site.phone"] || "+254 700 000 000";
  const email = s["site.email"] || "admissions@northgate.ac.ke";
  const address = s["site.address"] || "Nairobi, Kenya";
  const intake = s["admissions.intake"] || "September 2026";
  const deadline = s["admissions.deadline"] || "15 August 2026";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${siteName} — 2026 Prospectus</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #0b1437; line-height: 1.55; font-size: 11pt; }
  .cover { background: linear-gradient(135deg, #0b1437 0%, #1e3a8a 100%); color: white; padding: 60px 40px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
  .cover h1 { font-size: 28pt; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.5px; }
  .cover .tag { font-size: 14pt; color: #e6c66e; font-weight: 600; margin-bottom: 24px; }
  .cover .meta { font-size: 10pt; color: rgba(255,255,255,0.7); }
  .cover .badge { display: inline-block; background: #c9a227; color: #0b1437; padding: 6px 16px; border-radius: 999px; font-size: 10pt; font-weight: 700; margin-top: 20px; }
  h2 { font-size: 16pt; font-weight: 700; color: #1e3a8a; margin: 24px 0 12px; padding-bottom: 6px; border-bottom: 2px solid #c9a227; }
  h3 { font-size: 12pt; font-weight: 700; margin: 14px 0 6px; }
  p { margin-bottom: 8px; }
  .stats { display: flex; gap: 12px; margin: 16px 0; }
  .stat { flex: 1; background: #f5f7fb; padding: 12px; border-radius: 8px; text-align: center; }
  .stat .num { font-size: 18pt; font-weight: 800; color: #1e3a8a; }
  .stat .lbl { font-size: 8.5pt; color: #4a5578; text-transform: uppercase; letter-spacing: 0.5px; }
  .dept { margin-bottom: 14px; padding: 12px; background: #f5f7fb; border-radius: 8px; border-left: 4px solid #1e3a8a; }
  .dept-name { font-weight: 700; color: #1e3a8a; font-size: 11.5pt; }
  .dept-tag { color: #4a5578; font-size: 9.5pt; font-style: italic; margin-bottom: 6px; }
  .prog-list { list-style: none; }
  .prog-list li { padding: 4px 0; font-size: 10pt; border-bottom: 1px dashed #e5e9f2; }
  .prog-list li:last-child { border: none; }
  .prog-code { font-family: monospace; color: #c9a227; font-weight: 700; margin-right: 8px; }
  .prog-fee { float: right; color: #4a5578; font-size: 9pt; }
  .contact { background: #0b1437; color: white; padding: 20px; border-radius: 8px; margin-top: 24px; }
  .contact h3 { color: #e6c66e; margin-top: 0; }
  .contact p { color: rgba(255,255,255,0.85); font-size: 10pt; margin-bottom: 4px; }
  .footer { text-align: center; font-size: 9pt; color: #4a5578; margin-top: 20px; padding-top: 12px; border-top: 1px solid #e5e9f2; }
  @media print { .no-print { display: none; } body { font-size: 10pt; } }
  .print-btn { position: fixed; top: 16px; right: 16px; background: #1e3a8a; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 11pt; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
  .print-btn:hover { background: #1e40af; }
</style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">Save as PDF</button>

  <div class="cover">
    <h1>${siteName}</h1>
    <div class="tag">${tagline}</div>
    <div class="meta">${address} · ${phone} · ${email}</div>
    <div class="badge">2026 PROSPECTUS · ${intake} INTAKE</div>
  </div>

  <div class="stats">
    <div class="stat"><div class="num">${s["stats.students"] || "9,000+"}</div><div class="lbl">Students</div></div>
    <div class="stat"><div class="num">${s["stats.programmes"] || "150+"}</div><div class="lbl">Programmes</div></div>
    <div class="stat"><div class="num">${s["stats.employability"] || "96"}%</div><div class="lbl">Employability</div></div>
    <div class="stat"><div class="num">${s["stats.years"] || "60+"}</div><div class="lbl">Years</div></div>
  </div>

  <h2>Welcome from the Principal</h2>
  <p>For over six decades, ${siteName} has stood at the forefront of technical and vocational education in East Africa. Our mission is simple: to build tomorrow's skilled professionals through world-class workshops, industry partnerships, and hands-on mastery.</p>
  <p>This prospectus details our ${programmes} accredited programmes across ${departments.length} departments — each combining rigorous theory with intensive practical immersion. Whether you are a recent school leaver, a career changer, or an industry professional seeking certification, you will find a path that fits your ambitions.</p>
  <p>We invite you to join a community of 9,000+ students and 18,500+ alumni who are shaping the future of East Africa's industries.</p>

  <h2>Admissions Information</h2>
  <p><strong>Intake:</strong> ${intake}</p>
  <p><strong>Application Deadline:</strong> ${deadline}</p>
  <p><strong>How to Apply:</strong> Visit our online portal at https://northgate.ac.ke/apply or submit a paper application at our admissions office.</p>
  <p><strong>Entry Requirements:</strong> KCSE Mean Grade C- (minus) or equivalent for diploma programmes; D (plain) for certificate programmes. Specific requirements vary by programme — see below.</p>

  <h2>Programmes by Department</h2>
  ${departments.map(d => `
    <div class="dept">
      <div class="dept-name">${d.name}</div>
      <div class="dept-tag">${d.tagline}</div>
      <ul class="prog-list">
        ${d.programmes.map(p => `
          <li>
            <span class="prog-code">${p.code}</span>
            ${p.title}
            <span class="prog-fee">${p.currency} ${p.fee.toLocaleString()}/yr · ${p.duration}</span>
          </li>
        `).join("")}
      </ul>
    </div>
  `).join("")}

  <div class="contact">
    <h3>Contact Admissions</h3>
    <p><strong>Address:</strong> ${address}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Office Hours:</strong> Monday–Friday, 8:00 AM – 5:00 PM EAT</p>
    <p><strong>Website:</strong> https://northgate.ac.ke</p>
  </div>

  <div class="footer">
    © ${new Date().getFullYear()} ${siteName}. All rights reserved.<br>
    This prospectus is for informational purposes. Programme details, fees, and requirements may change without notice.
  </div>

  <script>
    setTimeout(function() { window.print(); }, 800);
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
