---
title: nerdy9a garden 🌳
layout: custom
created: 2026-05-31 19:51
updated: 2026-06-01 19:44
---

<div class="homepage-logo-container">
  <img src="static/garden_logo.png" alt="nerdy9a logo" class="homepage-logo" />
  <h1 class="homepage-title">nerdy9a <span class="accent">garden</span></h1>
</div>

<h2 class="page-subtitle">Thinking in systems. Building startups. Living with intention. Exploring the world.</h2>

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
    <a href="https://github.com/paonets" target="_blank" rel="noopener">🐱 GitHub</a>
    <a href="https://www.linkedin.com/in/pongsakorn-teeraparpwong/" target="_blank" rel="noopener">💼 LinkedIn</a>
    <a href="https://www.youtube.com/@nerdy9a" target="_blank" rel="noopener">▶️ YouTube</a>
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
    <h3><a href="./categories/tech">🛠️ Engineering, Dev & Startup</a></h3>
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
