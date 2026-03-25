const esc = s => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const PAGE_CSS = `
  @page { size: A4; margin: 10mm 14mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
`;

function expBlocks(experience) {
  return (experience || []).map(exp => `
    <div class="exp-item">
      <div class="exp-row">
        <span class="exp-pos">${esc(exp.position)}</span>
        <span class="exp-date">${esc(exp.startDate)} – ${esc(exp.endDate)}</span>
      </div>
      <div class="exp-co">${esc(exp.company)}</div>
      <ul class="bullets">${(exp.bullets || []).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
    </div>`).join('');
}

// ─── Harvard ────────────────────────────────────────────────────────────────
function harvardHTML(d) {
  const { personalInfo: p, summary, experience, education, skills, languages, certifications } = d;
  const contact = [p?.email, p?.phone, p?.location, p?.linkedin].filter(Boolean).join('  ·  ');

  const section = (title, body) => `
    <div class="section">
      <div class="sec-title">${title}</div>
      <hr class="sec-hr"/>
      ${body}
    </div>`;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <style>
    ${PAGE_CSS}
    body { font-family: 'Times New Roman', Georgia, serif; font-size: 9.5pt; color: #1a1a1a; background: #fff; }
    .header { text-align: center; padding: 12px 28px 10px; border-bottom: 2px solid #1a1a1a; margin-bottom: 10px; }
    .name { font-size: 17pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .job-title { font-size: 9pt; color: #555; margin-top: 3px; }
    .contact { font-size: 7.5pt; color: #555; margin-top: 5px; }
    .body { padding: 0 28px 12px; }
    .section { margin-bottom: 8px; }
    .sec-title { font-size: 7.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; }
    .sec-hr { border: none; border-top: 1px solid #bbb; margin: 3px 0 6px; }
    p, .para { font-size: 9pt; line-height: 1.4; color: #333; }
    .exp-item { margin-bottom: 7px; }
    .exp-row { display: flex; justify-content: space-between; align-items: baseline; }
    .exp-pos { font-weight: 700; font-size: 9.5pt; }
    .exp-date { font-size: 7.5pt; color: #555; }
    .exp-co { font-size: 8.5pt; color: #555; font-style: italic; margin: 1px 0 3px; }
    .bullets { padding-left: 14px; margin-top: 2px; }
    .bullets li { font-size: 8.5pt; color: #333; line-height: 1.35; margin-bottom: 1px; }
  </style></head><body>
  <div class="header">
    <div class="name">${esc(p?.name)}</div>
    ${p?.title ? `<div class="job-title">${esc(p.title)}</div>` : ''}
    <div class="contact">${esc(contact)}</div>
  </div>
  <div class="body">
    ${summary ? section('Professional Summary', `<p class="para">${esc(summary)}</p>`) : ''}
    ${(experience?.length) ? section('Experience', expBlocks(experience)) : ''}
    ${(education?.length) ? section('Education', (education||[]).map(e=>`
      <div class="exp-item">
        <div class="exp-row"><span class="exp-pos">${esc(e.school)}</span><span class="exp-date">${esc(e.year)}</span></div>
        <div class="exp-co">${esc(e.degree)}${e.field?`, ${esc(e.field)}`:''}</div>
      </div>`).join('')) : ''}
    ${skills?.length ? section('Skills', `<p class="para">${skills.map(esc).join('  ·  ')}</p>`) : ''}
    ${languages?.length ? section('Languages', `<p class="para">${(languages||[]).map(l=>`${esc(l.language)}${l.level?` (${esc(l.level)})`:''}`).join('  ·  ')}</p>`) : ''}
    ${certifications?.length ? section('Certifications', `<ul class="bullets">${(certifications||[]).map(c=>`<li>${esc(c)}</li>`).join('')}</ul>`) : ''}
  </div>
  </body></html>`;
}

// ─── Modern Pro ──────────────────────────────────────────────────────────────
function modernProHTML(d) {
  const { personalInfo: p, summary, experience, education, skills, languages, certifications } = d;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <style>
    ${PAGE_CSS}
    body { font-family: Arial, Helvetica, sans-serif; font-size: 9.5pt; color: #374151; background: #fff; }
    .header { background: #0F2D52; color: #fff; padding: 14px 24px; border-left: 5px solid #1A56A0; }
    .name { font-size: 17pt; font-weight: 800; }
    .title { font-size: 8.5pt; color: #93C5FD; margin-top: 3px; }
    .contact { font-size: 7.5pt; color: #CBD5E1; margin-top: 5px; }
    .body { padding: 10px 24px; }
    .section { margin-bottom: 9px; }
    .sec-head { margin-bottom: 5px; }
    .sec-title { font-size: 7.5pt; font-weight: 800; color: #0F2D52; text-transform: uppercase; letter-spacing: 1.2px; }
    .sec-bar { height: 2px; width: 28px; background: #1A56A0; margin-top: 2px; }
    p { font-size: 9pt; line-height: 1.4; color: #374151; }
    .exp-item { margin-bottom: 8px; padding-left: 12px; border-left: 2px solid #EBF2FB; }
    .exp-row { display: flex; justify-content: space-between; align-items: baseline; }
    .exp-pos { font-weight: 700; font-size: 9.5pt; color: #111827; }
    .exp-date { font-size: 7.5pt; color: #6B7280; }
    .exp-co { font-size: 8.5pt; color: #1A56A0; font-weight: 600; margin: 1px 0 3px; }
    .bullets { padding-left: 10px; }
    .bullets li { font-size: 8.5pt; color: #374151; line-height: 1.35; list-style: "› "; margin-bottom: 1px; }
    .skills-wrap { display: flex; flex-wrap: wrap; gap: 4px; }
    .skill { background: #EBF2FB; border-left: 2px solid #1A56A0; padding: 2px 8px; font-size: 8pt; color: #0F2D52; font-weight: 600; }
    .inline-list { font-size: 8.5pt; color: #374151; line-height: 1.4; }
  </style></head><body>
  <div class="header">
    <div class="name">${esc(p?.name)}</div>
    ${p?.title ? `<div class="title">${esc(p.title)}</div>` : ''}
    <div class="contact">${[p?.email,p?.phone,p?.location,p?.linkedin].filter(Boolean).map(esc).join('  |  ')}</div>
  </div>
  <div class="body">
    ${summary ? `<div class="section"><div class="sec-head"><div class="sec-title">Profile</div><div class="sec-bar"></div></div><p>${esc(summary)}</p></div>` : ''}
    ${experience?.length ? `<div class="section"><div class="sec-head"><div class="sec-title">Professional Experience</div><div class="sec-bar"></div></div>${expBlocks(experience)}</div>` : ''}
    ${education?.length ? `<div class="section"><div class="sec-head"><div class="sec-title">Education</div><div class="sec-bar"></div></div>${(education||[]).map(e=>`<div class="exp-item"><div class="exp-row"><span class="exp-pos">${esc(e.school)}</span><span class="exp-date">${esc(e.year)}</span></div><div class="exp-co">${esc(e.degree)}${e.field?` · ${esc(e.field)}`:''}</div></div>`).join('')}</div>` : ''}
    ${skills?.length ? `<div class="section"><div class="sec-head"><div class="sec-title">Core Skills</div><div class="sec-bar"></div></div><div class="skills-wrap">${skills.map(s=>`<span class="skill">${esc(s)}</span>`).join('')}</div></div>` : ''}
    ${(languages?.length||certifications?.length) ? `<div class="section"><div class="sec-head"><div class="sec-title">${languages?.length&&certifications?.length?'Languages & Certifications':languages?.length?'Languages':'Certifications'}</div><div class="sec-bar"></div></div><p class="inline-list">${[...(languages||[]).map(l=>`${esc(l.language)}${l.level?` (${esc(l.level)})`:''}`), ...(certifications||[]).map(esc)].join('  ·  ')}</p></div>` : ''}
  </div>
  </body></html>`;
}

// ─── Executive ───────────────────────────────────────────────────────────────
function executiveHTML(d) {
  const { personalInfo: p, summary, experience, education, skills, languages, certifications } = d;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <style>
    ${PAGE_CSS}
    body { font-family: Arial, sans-serif; font-size: 9.5pt; color: #4A4A4A; background: #fff; }
    .header { background: #1C1C1E; color: #fff; padding: 14px 24px; }
    .name { font-size: 17pt; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; }
    .gold-rule { width: 40px; height: 2px; background: #B8973A; margin: 7px 0; }
    .title { font-size: 8.5pt; color: #D1C4A0; letter-spacing: 1px; margin-bottom: 8px; }
    .contacts { display: flex; gap: 16px; flex-wrap: wrap; }
    .contact-label { font-size: 6.5pt; color: #888; text-transform: uppercase; letter-spacing: 1px; }
    .contact-val { font-size: 8.5pt; color: #D4D4D4; }
    .body { padding: 12px 24px; }
    .section { margin-bottom: 9px; }
    .sec-title { font-size: 7.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #1C1C1E; }
    .gold-line { height: 1.5px; background: #B8973A; margin: 3px 0 7px; }
    p { font-size: 9pt; color: #4A4A4A; line-height: 1.4; }
    .exp-item { display: flex; margin-bottom: 8px; }
    .exp-left { width: 48px; text-align: center; padding-right: 10px; flex-shrink: 0; }
    .exp-date { font-size: 7pt; color: #B8973A; font-weight: 700; }
    .exp-sep { height: 14px; width: 1px; background: #ddd; margin: 3px auto; }
    .exp-right { flex: 1; }
    .exp-pos { font-size: 9.5pt; font-weight: 700; color: #1C1C1E; }
    .exp-co { font-size: 8.5pt; color: #B8973A; font-weight: 600; margin: 1px 0 3px; }
    .bullets { padding-left: 10px; }
    .bullets li { font-size: 8.5pt; color: #4A4A4A; line-height: 1.35; list-style: "▪ "; margin-bottom: 1px; }
    .two-col { display: flex; gap: 14px; background: #F5F4F0; padding: 10px 12px; border-radius: 5px; margin-top: 2px; }
    .col { flex: 1; }
    .col-title { font-size: 7.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #1C1C1E; margin-bottom: 3px; }
    .gold-line2 { height: 1px; background: #B8973A; margin-bottom: 5px; }
    .comp { font-size: 8.5pt; color: #4A4A4A; margin: 2px 0; }
  </style></head><body>
  <div class="header">
    <div class="name">${esc(p?.name)}</div>
    <div class="gold-rule"></div>
    ${p?.title ? `<div class="title">${esc(p.title)}</div>` : ''}
    <div class="contacts">
      ${[p?.email&&`<div class="contact-item"><div class="contact-label">Email</div><div class="contact-val">${esc(p.email)}</div></div>`,p?.phone&&`<div class="contact-item"><div class="contact-label">Phone</div><div class="contact-val">${esc(p.phone)}</div></div>`,p?.location&&`<div class="contact-item"><div class="contact-label">Location</div><div class="contact-val">${esc(p.location)}</div></div>`,p?.linkedin&&`<div class="contact-item"><div class="contact-label">LinkedIn</div><div class="contact-val">${esc(p.linkedin)}</div></div>`].filter(Boolean).join('')}
    </div>
  </div>
  <div class="body">
    ${summary ? `<div class="section"><div class="sec-title">Executive Summary</div><div class="gold-line"></div><p>${esc(summary)}</p></div>` : ''}
    ${experience?.length ? `<div class="section"><div class="sec-title">Career History</div><div class="gold-line"></div>${(experience||[]).map(e=>`<div class="exp-item"><div class="exp-left"><div class="exp-date">${esc(e.startDate)}</div><div class="exp-sep"></div><div class="exp-date">${esc(e.endDate)}</div></div><div class="exp-right"><div class="exp-pos">${esc(e.position)}</div><div class="exp-co">${esc(e.company)}</div><ul class="bullets">${(e.bullets||[]).map(b=>`<li>${esc(b)}</li>`).join('')}</ul></div></div>`).join('')}</div>` : ''}
    ${education?.length ? `<div class="section"><div class="sec-title">Education</div><div class="gold-line"></div>${(education||[]).map(e=>`<div class="exp-item"><div class="exp-left"><div class="exp-date">${esc(e.year)}</div></div><div class="exp-right"><div class="exp-pos">${esc(e.degree)}${e.field?` in ${esc(e.field)}`:''}</div><div class="exp-co">${esc(e.school)}</div></div></div>`).join('')}</div>` : ''}
    <div class="two-col">
      ${skills?.length ? `<div class="col"><div class="col-title">Core Competencies</div><div class="gold-line2"></div>${skills.map(s=>`<div class="comp">▪ ${esc(s)}</div>`).join('')}</div>` : ''}
      ${(languages?.length||certifications?.length) ? `<div class="col">${languages?.length?`<div class="col-title">Languages</div><div class="gold-line2"></div>${(languages||[]).map(l=>`<div class="comp">▪ ${esc(l.language)}${l.level?` · ${esc(l.level)}`:''}</div>`).join('')}`:''}${certifications?.length?`<div class="col-title" style="margin-top:8px">Certifications</div><div class="gold-line2"></div>${(certifications||[]).map(c=>`<div class="comp">▪ ${esc(c)}</div>`).join('')}`:''}</div>` : ''}
    </div>
  </div>
  </body></html>`;
}

// ─── Clean ATS ───────────────────────────────────────────────────────────────
function cleanATSHTML(d) {
  const { personalInfo: p, summary, experience, education, skills, languages, certifications } = d;
  const contact = [p?.email,p?.phone,p?.location,p?.linkedin].filter(Boolean).map(esc).join(' | ');

  const section = (title, body) => `
    <div class="section">
      <div class="sec-title">${title}</div>
      <hr class="hr"/>
      ${body}
    </div>`;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <style>
    ${PAGE_CSS}
    body { font-family: Arial, sans-serif; font-size: 9.5pt; color: #222; background: #fff; padding: 14px 24px; }
    .name { font-size: 16pt; font-weight: 700; }
    .title { font-size: 9pt; color: #333; margin-top: 2px; }
    .contact { font-size: 7.5pt; color: #444; margin-top: 4px; }
    .top-hr { border: none; border-top: 1.5px solid #000; margin: 8px 0 10px; }
    .section { margin-bottom: 8px; }
    .sec-title { font-size: 7.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; }
    .hr { border: none; border-top: 1px solid #bbb; margin: 3px 0 6px; }
    p { font-size: 9pt; line-height: 1.4; color: #222; }
    .exp-item { margin-bottom: 7px; }
    .exp-row { display: flex; justify-content: space-between; align-items: baseline; }
    .exp-pos { font-weight: 700; font-size: 9.5pt; }
    .exp-date { font-size: 7.5pt; color: #444; }
    .exp-co { font-size: 8.5pt; color: #444; margin: 1px 0 3px; }
    .bullets { padding-left: 14px; }
    .bullets li { font-size: 8.5pt; line-height: 1.35; color: #222; margin-bottom: 1px; }
  </style></head><body>
  <div class="name">${esc(p?.name)}</div>
  ${p?.title ? `<div class="title">${esc(p.title)}</div>` : ''}
  <div class="contact">${contact}</div>
  <hr class="top-hr"/>
  ${summary ? section('Summary', `<p>${esc(summary)}</p>`) : ''}
  ${experience?.length ? section('Work Experience', expBlocks(experience)) : ''}
  ${education?.length ? section('Education', (education||[]).map(e=>`<div class="exp-item"><div class="exp-row"><span class="exp-pos">${esc(e.school)}</span><span class="exp-date">${esc(e.year)}</span></div><div class="exp-co">${esc(e.degree)}${e.field?`, ${esc(e.field)}`:''}</div></div>`).join('')) : ''}
  ${skills?.length ? section('Technical Skills', `<p>${skills.map(esc).join(' • ')}</p>`) : ''}
  ${languages?.length ? section('Languages', `<p>${(languages||[]).map(l=>`${esc(l.language)}${l.level?` (${esc(l.level)})`:''}`).join(' • ')}</p>`) : ''}
  ${certifications?.length ? section('Certifications', `<ul class="bullets">${(certifications||[]).map(c=>`<li>${esc(c)}</li>`).join('')}</ul>`) : ''}
  </body></html>`;
}

// ─── Export ───────────────────────────────────────────────────────────────────
export function buildHTML(templateId, data) {
  switch (templateId) {
    case 'harvard':   return harvardHTML(data);
    case 'modernpro': return modernProHTML(data);
    case 'executive': return executiveHTML(data);
    case 'cleanats':  return cleanATSHTML(data);
    default:          return harvardHTML(data);
  }
}
