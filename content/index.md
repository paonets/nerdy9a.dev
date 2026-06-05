---
title: nerdy9a garden 🌳
layout: custom
created: 2026-05-31 19:51
updated: 2026-06-03 21:47
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
var recentNotesData = [];

function getRelativeTime(dateStr, lang) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  const isEn = lang === 'en';

  if (diffSec < 60) {
    return isEn ? 'just now' : 'เมื่อสักครู่';
  } else if (diffMin < 60) {
    return isEn ? `${diffMin}m ago` : `${diffMin} นาทีที่แล้ว`;
  } else if (diffHrs < 24) {
    return isEn ? `${diffHrs}h ago` : `${diffHrs} ชั่วโมงที่แล้ว`;
  } else if (diffDays === 1) {
    return isEn ? 'yesterday' : 'เมื่อวานนี้';
  } else if (diffDays < 7) {
    return isEn ? `${diffDays}d ago` : `${diffDays} วันที่แล้ว`;
  } else if (diffWeeks < 4) {
    return isEn 
      ? `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago` 
      : `${diffWeeks} สัปดาห์ที่แล้ว`;
  } else if (diffMonths < 12) {
    return isEn 
      ? `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago` 
      : `${diffMonths} เดือนที่แล้ว`;
  } else {
    return isEn 
      ? `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago` 
      : `${diffYears} ปีที่แล้ว`;
  }
}

function renderRecentNotes(lang) {
  const container = document.getElementById('recently-updated-list');
  if (!container) return;

  if (recentNotesData.length === 0) {
    container.innerHTML = `<div class="empty-placeholder">${lang === 'en' ? 'No recent updates found.' : 'ไม่พบข้อมูลการอัปเดตล่าสุด'}</div>`;
    return;
  }

  const listHtml = recentNotesData.map(function(note) {
    const relativeTime = getRelativeTime(note.date, lang);
    const tagsHtml = (note.tags || [])
      .map(function(tag) {
        return `<a class="internal tag-link" href="tags/${tag}">${tag}</a>`;
      })
      .join(' ');

    return `
      <div class="update-row" onclick="if(!event.target.closest('.tag-link')) this.querySelector('.update-title').click()">
        <span class="update-date">${relativeTime}</span>
        <div class="update-content">
          <a class="update-title" href="./${note.slug}">${note.title}</a>
          ${tagsHtml ? `<div class="update-tags-container">${tagsHtml}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = listHtml;
}

function initRecentNotes() {
  if (typeof fetchData !== 'undefined') {
    fetchData.then(function(data) {
      processIndexData(data);
    }).catch(function(err) {
      console.error('Failed to load content index:', err);
      const container = document.getElementById('recently-updated-list');
      if (container) {
        container.innerHTML = `<div class="error-placeholder">Failed to load updates.</div>`;
      }
    });
  } else {
    // Fallback if fetchData is not defined
    fetch('static/contentIndex.json')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        processIndexData(data);
      })
      .catch(function(err) {
        console.error('Failed to fetch content index:', err);
      });
  }
}

function processIndexData(data) {
  const items = [];
  for (const slug in data) {
    if (Object.prototype.hasOwnProperty.call(data, slug)) {
      const item = data[slug];
      
      // Exclude logic
      if (slug === 'index') continue;
      if (item.isVirtual) continue;
      if (slug.startsWith('tags/')) continue;
      if (slug.startsWith('categories/')) continue;
      if (slug.startsWith('travel-journal/places/')) continue;
      if (slug.startsWith('Travel-Journal/Places/')) continue;
      if (!item.date) continue; // Must have date to sort

      items.push({
        slug: slug,
        title: item.title,
        date: item.date,
        tags: item.tags
      });
    }
  }

  // Sort by date descending
  items.sort(function(a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Take top 3
  recentNotesData = items.slice(0, 3);

  // Render using current language selection
  const currentLang = document.querySelector('.lang-tab.active')?.id === 'tab-th' ? 'th' : 'en';
  renderRecentNotes(currentLang);
}

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
  
  // Re-render recent notes in the active language
  renderRecentNotes(lang);
}

(function() {
  var lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  var isThai = lang.startsWith('th');
  switchLang(isThai ? 'th' : 'en');
  initRecentNotes();
})();
</script>

<div class="content-grid">
  <div class="content-card">
    <h3><a href="./categories/tech" data-no-popover="true">🛠️ Engineering & Startup</a></h3>
    <p>Software engineering, distributed systems, AWS, AI tools, and lessons from building Hato Hub.</p>
    <a class="card-link" href="./categories/tech" data-no-popover="true">Explore Tech & Startup →</a>
  </div>
  
  <div class="content-card">
    <h3><a href="./categories/self-improvement" data-no-popover="true">📈 Self-Improvement & PKM</a></h3>
    <p>Personal knowledge management, productivity workflows, book summaries, and Toastmasters guides.</p>
    <a class="card-link" href="./categories/self-improvement" data-no-popover="true">Explore Self-Improvement →</a>
  </div>

  <div class="content-card">
    <h3><a href="./categories/health" data-no-popover="true">🧘‍♂️ Health & Mindfulness</a></h3>
    <p>Notes and logs on physical health, wellness, and mindfulness.</p>
    <a class="card-link" href="./categories/health" data-no-popover="true">Explore Wellness →</a>
  </div>

  <div class="content-card">
    <h3><a href="./categories/travel" data-no-popover="true">✈️ Travel & Japan</a></h3>
    <p>Trip planning, preferences, and itineraries, with a special focus on traveling in Japan.</p>
    <a class="card-link" href="./categories/travel" data-no-popover="true">Explore Travel →</a>
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

## 🔄 Recently Updated

<div class="recently-updated-section">
  <div id="recently-updated-list" class="recently-updated-list">
    <div class="loading-placeholder">Loading recent updates...</div>
  </div>
</div>

---

### What is a [[Digital Garden]]? 🌳

Instead of structured, polished blog posts, a **[[Digital Garden|digital garden]]** is an environment for cultivating ideas. Notes here are interconnected, evolving, and grow over time from raw seedlings 🌱 to evergreen concepts 🌳.

---

> [!NOTE]
> **AI-Assisted Curation:** This garden is mostly written by AI agents or co-written/polished by AI based on my notes, learnings, and experiences.
