---
title: nerdy9a garden 🌳
layout: custom
created: 2026-05-31 19:51
updated: 2026-06-02 00:00
---

<div class="homepage-logo-container">
  <img src="static/garden_logo.png" alt="nerdy9a logo" class="homepage-logo" />
  <h1 class="homepage-title">nerdy9a <span class="accent">garden</span></h1>
</div>

<h2 class="page-subtitle"><span>Thinking in systems</span><span>Living with intention</span><span>Exploring the world</span></h2>

<div class="welcome-message">
  <div class="lang-tabs" id="lang-tabs">
    <button class="lang-tab active" id="tab-en" onclick="switchLang('en')" aria-label="English">🇬🇧 EN</button>
    <button class="lang-tab" id="tab-th" onclick="switchLang('th')" aria-label="ภาษาไทย">🇹🇭 TH</button>
  </div>

  <div class="lang-panel" id="panel-en">
    <p>Hi, I'm <strong>Pongsakorn Teeraparpwong (A)</strong>. I'm a software engineer and entrepreneur, currently co-founding
      <span class="highlight-link"><a href="https://www.hatohub.com" target="_blank" rel="noopener">Hato Hub</a></span>.
      Previously, I designed distributed systems as a Senior SDE at Amazon in Seattle and earned my MS in Computer Science at UCSD.</p>
    <p>This digital garden is a window to my personal <span class="highlight-link"><strong>Second Brain</strong></span>—an evolving space where I cultivate raw ideas into evergreen knowledge. Inside, you'll find technical insights, startup frameworks, and reflections on intentional living. I hope something here inspires your own journey.</p>
  </div>

  <div class="lang-panel" id="panel-th" style="display:none;">
    <p>สวัสดีครับ ยินดีต้อนรับสู่ nerdy9a garden 🌳 เว็บนี้เป็นพื้นที่แชร์ knowledge base ที่ผมสะสมไว้ใน Obsidian ให้ทุกคนครับ โดยใช้คอนเซปต์ของ Digital Garden — คือเป็นพื้นที่บ่มเพาะไอเดียและโน้ตต่างๆ ที่อาจจะยังแค่เริ่มต้น ให้เติบโตขึ้นเรื่อยๆ ครับ ในนี้จะมีเรื่องเกี่ยวกับ Engineering, Dev, Startup, สุขภาพกายและใจ รวมถึงเรื่องท่องเที่ยว โดยเฉพาะญี่ปุ่น หวังว่าเว็บนี้จะให้ประโยชน์หรือเป็นแรงบันดาลใจให้ทุกคนไม่มากก็น้อยนะครับ</p>
    <p>คอนเทนต์ส่วนใหญ่จะเป็นภาษาอังกฤษ แต่มีบางหน้าที่มีภาษาไทยด้วยครับ 😊</p>
  </div>

  <div class="welcome-connect">
    <span>🔗 Connect:</span>
    <a href="https://www.linkedin.com/in/pongsakorn-teeraparpwong/" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="flex-shrink:0"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> LinkedIn</a>
    <a href="https://www.youtube.com/@nerdy9a" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="flex-shrink:0"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> YouTube</a>
  </div>
</div>

<script>
function switchLang(lang) {
  var panels = document.querySelectorAll('.lang-panel');
  var tabs = document.querySelectorAll('.lang-tab');
  panels.forEach(function(p) {
    if (p.id === 'panel-' + lang) {
      p.style.display = '';
      p.classList.add('lang-fade-in');
    } else {
      p.style.display = 'none';
      p.classList.remove('lang-fade-in');
    }
  });
  tabs.forEach(function(t) {
    t.classList.toggle('active', t.id === 'tab-' + lang);
  });
}
(function() {
  var lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  var isThai = lang.startsWith('th');
  switchLang(isThai ? 'th' : 'en');
})();
</script>

<div class="content-grid">
  <div class="content-card">
    <h3><a href="./categories/tech">🛠️ Engineering & Startup</a></h3>
    <p>Software engineering, distributed systems, AWS, AI tools, and lessons from building Hato Hub.</p>
    <a class="card-link" href="./categories/tech">Explore Tech & Startup →</a>
  </div>
  
  <div class="content-card">
    <h3><a href="./categories/self-improvement">📈 Self-Improvement & PKM</a></h3>
    <p>Personal knowledge management, productivity workflows, book summaries, and Toastmasters guides.</p>
    <a class="card-link" href="./categories/self-improvement">Explore Self-Improvement →</a>
  </div>

  <div class="content-card">
    <h3><a href="./categories/health">🧘‍♂️ Health & Mindfulness</a></h3>
    <p>Notes and logs on physical health, wellness, and mindfulness.</p>
    <a class="card-link" href="./categories/health">Explore Wellness →</a>
  </div>

  <div class="content-card">
    <h3><a href="./categories/travel">✈️ Travel & Japan</a></h3>
    <p>Trip planning, preferences, and itineraries, with a special focus on traveling in Japan.</p>
    <a class="card-link" href="./categories/travel">Explore Travel →</a>
  </div>
</div>

---

## ⭐️ Featured Notes

Below are some of my favorite evergreen 🌳 concepts and workflows:

- [[How this Digital Garden is Built|🛠️ Technical Setup & Pipeline]] – How this garden is built using Obsidian, Quartz 5, and Python.
- [[The Future of Software Engineering in the AI Era|🤖 Software Engineering in the AI Era]] – How AI is shifting development from writing syntax to designing systems.
- [[Personal Knowledge Management Frameworks|🗂️ PKM Frameworks]] – Structured notes on Zettelkasten, PARA, and GTD.
- [[Techniques for Better Sleep|🛌 Techniques for Better Sleep]] – Actionable methods for sleep hygiene, screen limits, and vagus nerve breathing.

---

### What is a [[Digital Garden]]? 🌳

Instead of structured, polished blog posts, a **[[Digital Garden|digital garden]]** is an environment for cultivating ideas. Notes here are interconnected, evolving, and grow over time from raw seedlings 🌱 to evergreen concepts 🌳.

---

> [!NOTE]
> **AI-Assisted Curation:** This garden is mostly written by AI agents or co-written/polished by AI based on my notes, learnings, and experiences.
