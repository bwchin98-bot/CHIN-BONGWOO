#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const CONFIG = {
  github: {
    user: process.env.GITHUB_USER || 'bwchin98-bot',
    token: process.env.GITHUB_TOKEN,
    repo: process.env.GITHUB_REPO || 'CHIN-BONGWOO',
    email: process.env.GITHUB_EMAIL || 'bwchin98@gmail.com',
  },
  output: {
    dir: 'reports',
    filename: `report-${new Date().toISOString().split('T')[0]}.html`
  }
};

function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, { headers: { 'User-Agent': 'AI-Report-Bot/1.0', ...headers } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, headers).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function fetchJson(url, headers = {}) {
  const text = await fetchUrl(url, headers);
  return JSON.parse(text);
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

function createNewsItem(title, meta, url, source) {
  return `<div class="news-item">
    <h3><a href="${url}" target="_blank" style="color:#333;text-decoration:none;">${escapeHtml(title)}</a></h3>
    <p>${escapeHtml(meta)}</p>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
      <a href="${url}" target="_blank">자세히 보기 →</a>
      <div class="source">출처: ${source}</div>
    </div>
  </div>`;
}

function createPaperItem(title, authors, abstract, url, date) {
  return `<div class="paper-item">
    <h3>${escapeHtml(title)}</h3>
    <div class="authors">${escapeHtml(authors)}</div>
    <p>${escapeHtml(abstract.substring(0, 250))}...</p>
    <div class="tags">
      <span class="tag">${date}</span>
      <a href="${url}" target="_blank" style="color:#667eea;font-weight:600;">논문 보기 →</a>
    </div>
  </div>`;
}

function createRepoItem(name, url, description, stars, language) {
  return `<div class="repo-item">
    <h3><a href="${url}" target="_blank" style="color:#667eea;text-decoration:none;">${escapeHtml(name)}</a></h3>
    <p>${escapeHtml(description || '설명 없음')}</p>
    <div class="stats">
      <div class="stat">⭐ <strong>${Number(stars).toLocaleString()}</strong> stars</div>
      ${language ? `<div class="stat">📝 <strong>${escapeHtml(language)}</strong></div>` : ''}
    </div>
  </div>`;
}

// Hacker News에서 AI 관련 뉴스 수집
async function fetchHackerNewsAI() {
  try {
    console.log('📰 Hacker News 수집 중...');
    const topStories = await fetchJson('https://hacker-news.firebaseio.com/v0/topstories.json');
    console.log(`   [디버그] 총 ${topStories.length}개 상위 스토리 로드`);

    const AI_KEYWORDS = ['ai', 'machine learning', 'neural', 'gpt', 'llm', 'transformer',
      'deep learning', 'nlp', 'openai', 'anthropic', 'gemini', 'claude', 'mistral',
      'diffusion', 'reinforcement', 'chatgpt', 'language model', 'stable diffusion'];
    const stories = [];

    for (let i = 0; i < Math.min(50, topStories.length) && stories.length < 5; i++) {
      try {
        const story = await fetchJson(`https://hacker-news.firebaseio.com/v0/item/${topStories[i]}.json`);
        if (!story || !story.title) continue;
        const titleLow = story.title.toLowerCase();
        if (AI_KEYWORDS.some(k => titleLow.includes(k))) {
          console.log(`   ✓ AI 뉴스 발견: ${story.title.substring(0, 50)}`);
          stories.push({
            title: story.title,
            url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
            score: story.score || 0,
          });
        }
      } catch (e) { console.error(`   [에러] 스토리 ${topStories[i]} 로드 실패:`, e.message); }
    }
    console.log(`  → ${stories.length}개 수집 완료`);
    return stories;
  } catch (e) {
    console.error('❌ HN 오류:', e.message);
    console.error(e.stack);
    return [];
  }
}

// arXiv에서 최신 AI 논문 수집 (XML 파싱)
async function fetchArxivPapers() {
  try {
    console.log('📚 arXiv 논문 수집 중...');
    const url = 'https://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.LG+OR+cat:cs.CL&start=0&max_results=5&sortBy=submittedDate&sortOrder=descending';
    console.log(`   [디버그] URL: ${url}`);
    const xml = await fetchUrl(url);
    console.log(`   [디버그] XML 응답 길이: ${xml.length} bytes`);

    const papers = [];
    const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) || [];
    console.log(`   [디버그] 항목 수: ${entries.length}`);

    for (const entry of entries.slice(0, 5)) {
      const title = (entry.match(/<title>([\s\S]*?)<\/title>/) || [])[1]?.replace(/\s+/g, ' ').trim() || '';
      const abstract = (entry.match(/<summary>([\s\S]*?)<\/summary>/) || [])[1]?.replace(/\s+/g, ' ').trim() || '';
      const url = (entry.match(/<id>([\s\S]*?)<\/id>/) || [])[1]?.trim() || '';
      const published = (entry.match(/<published>([\s\S]*?)<\/published>/) || [])[1]?.substring(0, 10) || '';
      const authorMatches = entry.match(/<name>([\s\S]*?)<\/name>/g) || [];
      const authors = authorMatches.slice(0, 3).map(a => a.replace(/<\/?name>/g, '').trim()).join(', ');

      if (title) {
        console.log(`   ✓ 논문: ${title.substring(0, 50)}`);
        papers.push({ title, abstract, url, date: published, authors });
      }
    }
    console.log(`  → ${papers.length}개 수집 완료`);
    return papers;
  } catch (e) {
    console.error('❌ arXiv 오류:', e.message);
    console.error(e.stack);
    return [];
  }
}

// GitHub API로 AI 관련 인기 저장소 수집
async function fetchGithubTrending() {
  try {
    console.log('🔥 GitHub 트렌딩 수집 중...');
    const hasToken = !!CONFIG.github.token;
    console.log(`   [디버그] Token 있음: ${hasToken}`);
    const headers = hasToken
      ? { Authorization: `token ${CONFIG.github.token}` }
      : {};

    const url = 'https://api.github.com/search/repositories?q=topic:artificial-intelligence+topic:machine-learning&sort=stars&order=desc&per_page=5';
    console.log(`   [디버그] 요청 URL: ${url}`);
    const data = await fetchJson(url, headers);
    console.log(`   [디버그] 응답 항목 수: ${(data.items || []).length}`);

    const repos = (data.items || []).slice(0, 5).map(r => {
      console.log(`   ✓ 저장소: ${r.full_name} (⭐ ${r.stargazers_count})`);
      return {
        name: r.full_name,
        url: r.html_url,
        description: r.description,
        stars: r.stargazers_count,
        language: r.language,
      };
    });
    console.log(`  → ${repos.length}개 수집 완료`);
    return repos;
  } catch (e) {
    console.error('❌ GitHub 오류:', e.message);
    console.error(e.stack);
    return [];
  }
}

// 인덱스 페이지 생성
function generateIndexPage(reports) {
  const items = reports
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 30)
    .map(f => {
      const date = f.replace('report-', '').replace('.html', '');
      return `<li><a href="reports/${f}">📄 ${date} AI 업계 동향 보고서</a></li>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Daily Report Archive</title>
  <style>
    body { font-family: -apple-system, sans-serif; max-width: 800px; margin: 60px auto; padding: 20px; }
    h1 { color: #667eea; }
    ul { list-style: none; padding: 0; }
    li { padding: 12px; border-bottom: 1px solid #eee; }
    a { color: #667eea; text-decoration: none; font-size: 1.05em; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>🤖 AI Daily Report</h1>
  <p>매일 자동 수집되는 AI 업계 동향 보고서</p>
  <ul>${items}</ul>
</body>
</html>`;
}

async function generateReport() {
  console.log('\n🚀 AI 일일 보고서 생성 시작...\n');

  const [newsItems, papers, repos] = await Promise.all([
    fetchHackerNewsAI(),
    fetchArxivPapers(),
    fetchGithubTrending(),
  ]);

  const newsHtml = newsItems.length > 0
    ? newsItems.map(item => createNewsItem(item.title, `Hacker News · ${item.score} upvotes`, item.url, 'Hacker News')).join('')
    : '<div class="empty-state">오늘 AI 관련 뉴스가 없습니다.</div>';

  const papersHtml = papers.length > 0
    ? papers.map(p => createPaperItem(p.title, p.authors, p.abstract, p.url, p.date)).join('')
    : '<div class="empty-state">오늘 추가된 논문이 없습니다.</div>';

  const reposHtml = repos.length > 0
    ? repos.map(r => createRepoItem(r.name, r.url, r.description, r.stars, r.language)).join('')
    : '<div class="empty-state">트렌딩 저장소를 불러올 수 없습니다.</div>';

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = days[now.getDay()];
  const timeStr = now.toISOString().split('T')[1].split('.')[0];

  const totalItems = newsItems.length + papers.length + repos.length;
  const summary = `오늘은 ${newsItems.length}개의 AI 뉴스, ${papers.length}개의 최신 논문, ${repos.length}개의 트렌딩 저장소를 수집했습니다. 총 ${totalItems}개 항목을 확인하세요.`;

  const template = fs.readFileSync(path.join(__dirname, 'ai_report_template.html'), 'utf8');

  const variables = {
    DATE: dateStr,
    DAY_OF_WEEK: dayOfWeek,
    SUMMARY: summary,
    NEWS_ITEMS: newsHtml,
    MODELS_ITEMS: '<div class="empty-state">신규 모델 정보는 뉴스 섹션을 확인하세요.</div>',
    COMPANY_ITEMS: '<div class="empty-state">기업 뉴스는 뉴스 섹션을 확인하세요.</div>',
    FUNDING_ITEMS: '<div class="empty-state">펀딩 정보를 수집 중입니다.</div>',
    PAPERS_ITEMS: papersHtml,
    REPOS_ITEMS: reposHtml,
    EVENTS_ITEMS: '<div class="empty-state">예정된 이벤트가 없습니다.</div>',
    TIME: timeStr,
    LAST_UPDATE: now.toISOString(),
    GITHUB_REPO_URL: `https://github.com/${CONFIG.github.user}/${CONFIG.github.repo}`
  };

  let html = template;
  Object.entries(variables).forEach(([k, v]) => {
    html = html.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
  });

  const outputDir = CONFIG.output.dir;
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, CONFIG.output.filename);
  fs.writeFileSync(outputPath, html);
  console.log(`\n✅ 보고서 생성: ${outputPath}`);

  // 인덱스 페이지 갱신
  const reportFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.html'));
  fs.writeFileSync('index.html', generateIndexPage(reportFiles));
  console.log('✅ 인덱스 페이지 갱신');

  return outputPath;
}

async function pushToGithub(reportPath) {
  if (!CONFIG.github.token) {
    console.warn('\n⚠️  GITHUB_TOKEN 없음 — 로컬 저장만 완료');
    return;
  }
  console.log('\n📤 GitHub 푸시 중...');
  try {
    execSync(`git config user.email "${CONFIG.github.email}"`);
    execSync(`git config user.name "AI Report Bot"`);
    execSync(`git add reports/ index.html`);
    const date = new Date().toISOString().split('T')[0];
    execSync(`git commit -m "report: AI Daily Report ${date}"`);
    const remote = `https://${CONFIG.github.user}:${CONFIG.github.token}@github.com/${CONFIG.github.user}/${CONFIG.github.repo}.git`;
    execSync(`git push ${remote} main`);
    console.log('✅ GitHub 푸시 완료');
  } catch (e) {
    console.error('❌ 푸시 실패:', e.message);
  }
}

async function main() {
  console.log('[시작] GitHub 환경 변수 확인:');
  console.log(`  GITHUB_USER: ${process.env.GITHUB_USER || '(없음)'}`);
  console.log(`  GITHUB_EMAIL: ${process.env.GITHUB_EMAIL || '(없음)'}`);
  console.log(`  GITHUB_TOKEN: ${process.env.GITHUB_TOKEN ? '✓ 있음' : '✗ 없음'}`);
  console.log(`  GITHUB_REPO: ${process.env.GITHUB_REPO || '(없음)'}\n`);

  const reportPath = await generateReport();
  await pushToGithub(reportPath);
  console.log('\n✨ 완료!\n');
}

main().catch(e => {
  console.error('\n❌ 심각한 오류:');
  console.error(e);
  process.exit(1);
});
