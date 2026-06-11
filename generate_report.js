#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// ======================== 설정 ========================
const CONFIG = {
  github: {
    user: process.env.GITHUB_USER || 'your-username',
    token: process.env.GITHUB_TOKEN, // GitHub Personal Access Token
    repo: process.env.GITHUB_REPO || 'ai-daily-report',
    email: process.env.GITHUB_EMAIL || 'your-email@example.com',
  },
  output: {
    dir: 'reports',
    filename: `report-${new Date().toISOString().split('T')[0]}.html`
  }
};

// ======================== 유틸리티 함수 ========================

// HTTPS 요청 함수
function fetchJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// 템플릿 렌더링
function renderTemplate(template, variables) {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return result;
}

// HTML 아이템 생성
function createNewsItem(title, description, url, source) {
  return `
    <div class="news-item">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description || 'No description available')}</p>
      <a href="${url}" target="_blank">Read More →</a>
      <div class="source">Source: ${source}</div>
    </div>
  `;
}

function createPaperItem(title, authors, abstract, url, date) {
  return `
    <div class="paper-item">
      <h3>${escapeHtml(title)}</h3>
      <div class="authors">${authors.join(', ')}</div>
      <p>${escapeHtml(abstract.substring(0, 200))}...</p>
      <div class="tags">
        <span class="tag">${date}</span>
        <a href="${url}" target="_blank" style="color: #667eea; font-weight: 600;">View Paper →</a>
      </div>
    </div>
  `;
}

function createRepoItem(name, url, description, stars, language) {
  return `
    <div class="repo-item">
      <h3><a href="${url}" target="_blank" style="color: #667eea; text-decoration: none;">${name}</a></h3>
      <p>${escapeHtml(description || 'No description')}</p>
      <div class="stats">
        <div class="stat">⭐ <strong>${stars}</strong> stars</div>
        ${language ? `<div class="stat">📝 <strong>${language}</strong></div>` : ''}
      </div>
    </div>
  `;
}

function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ======================== 데이터 수집 ========================

async function fetchHackerNewsAI() {
  try {
    console.log('📰 Fetching Hacker News...');
    const topStories = await fetchJson('https://hacker-news.firebaseio.com/v0/topstories.json');
    const stories = [];
    
    for (let i = 0; i < Math.min(30, topStories.length); i++) {
      const story = await fetchJson(`https://hacker-news.firebaseio.com/v0/item/${topStories[i]}.json`);
      const title = (story.title || '').toLowerCase();
      
      // AI 관련 키워드 필터링
      if (['ai', 'machine learning', 'neural', 'gpt', 'llm', 'transformer', 'model', 'algorithm', 'deep learning', 'nlp'].some(k => title.includes(k))) {
        stories.push({
          title: story.title,
          url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
          score: story.score,
          points: story.score
        });
        if (stories.length >= 5) break;
      }
    }
    
    return stories;
  } catch (e) {
    console.error('❌ HN 오류:', e.message);
    return [];
  }
}

async function fetchArxivPapers() {
  try {
    console.log('📚 Fetching arXiv papers...');
    const response = await fetchJson(
      'https://export.arxiv.org/api/query?search_query=cat:cs.AI+AND+submittedDate:[202401010000+TO+202412312359]&start=0&max_results=10&sortBy=submittedDate&sortOrder=descending'
    );
    
    // XML 응답이므로 JSON 변환 필요
    const papers = [];
    // 실제 구현시 xml2json 라이브러리 사용
    return papers;
  } catch (e) {
    console.error('❌ arXiv 오류:', e.message);
    return [];
  }
}

async function fetchGithubTrending() {
  try {
    console.log('🔥 Fetching GitHub trending...');
    // GitHub API를 직접 사용하려면 리포 필요
    // 여기서는 샘플 데이터 반환
    const repos = [
      {
        name: 'ollama/ollama',
        url: 'https://github.com/ollama/ollama',
        description: 'Get up and running with large language models',
        stars: '45000',
        language: 'Go'
      }
    ];
    return repos;
  } catch (e) {
    console.error('❌ GitHub 오류:', e.message);
    return [];
  }
}

async function generateSummary(newsItems) {
  // AI 기반 요약 (또는 간단한 템플릿)
  const summaries = [
    `오늘은 ${newsItems.length}개의 주요 AI 업계 뉴스가 있습니다. 최신 모델과 연구 동향을 확인하세요.`,
    `AI 분야의 빠른 변화가 계속되고 있습니다. ${newsItems.length}개의 주목할 뉴스를 정리했습니다.`,
    `오늘의 AI 업계 동향: ${newsItems.length}건의 주요 소식을 모아봤습니다.`
  ];
  return summaries[Math.floor(Math.random() * summaries.length)];
}

// ======================== 보고서 생성 ========================

async function generateReport() {
  console.log('\n🚀 AI Industry Daily Report 생성 시작...\n');
  
  // 데이터 수집
  const newsItems = await fetchHackerNewsAI();
  const papers = await fetchArxivPapers();
  const repos = await fetchGithubTrending();
  
  // HTML 생성
  const newsHtml = newsItems.map((item, i) => 
    createNewsItem(item.title, `${item.score} upvotes`, item.url, 'Hacker News')
  ).join('');
  
  const papersHtml = papers.length > 0 
    ? papers.map(p => createPaperItem(p.title, p.authors, p.abstract, p.url, p.date)).join('')
    : '<div class="empty-state">오늘 추가된 논문이 없습니다.</div>';
  
  const reposHtml = repos.map(r => 
    createRepoItem(r.name, r.url, r.description, r.stars, r.language)
  ).join('');
  
  // 요약 생성
  const summary = await generateSummary(newsItems);
  
  // 날짜 정보
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toISOString().split('T')[1].split('.')[0];
  const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
  
  // 템플릿 로드 및 렌더링
  const template = fs.readFileSync(path.join(__dirname, 'ai_report_template.html'), 'utf8');
  
  const variables = {
    DATE: dateStr,
    DAY_OF_WEEK: dayOfWeek,
    SUMMARY: summary,
    NEWS_ITEMS: newsHtml || '<div class="empty-state">뉴스를 불러올 수 없습니다.</div>',
    MODELS_ITEMS: '<div class="empty-state">오늘 업로드된 새로운 모델이 없습니다.</div>',
    COMPANY_ITEMS: '<div class="empty-state">기업 뉴스를 업로드 중입니다.</div>',
    FUNDING_ITEMS: '<div class="empty-state">펀딩 정보를 업로드 중입니다.</div>',
    PAPERS_ITEMS: papersHtml,
    REPOS_ITEMS: reposHtml,
    EVENTS_ITEMS: '<div class="empty-state">예정된 이벤트가 없습니다.</div>',
    TIME: timeStr,
    LAST_UPDATE: now.toISOString(),
    GITHUB_REPO_URL: `https://github.com/${CONFIG.github.user}/${CONFIG.github.repo}`
  };
  
  const html = renderTemplate(template, variables);
  
  // 파일 저장
  const outputDir = CONFIG.output.dir;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, CONFIG.output.filename);
  fs.writeFileSync(outputPath, html);
  
  console.log(`✅ 보고서 생성 완료: ${outputPath}`);
  
  return outputPath;
}

// ======================== GitHub 자동화 ========================

async function pushToGithub(reportPath) {
  if (!CONFIG.github.token) {
    console.warn('⚠️  GITHUB_TOKEN 환경변수가 설정되지 않았습니다.');
    return;
  }
  
  console.log('\n📤 GitHub에 푸시 중...\n');
  
  try {
    // Git 설정
    execSync(`git config user.email "${CONFIG.github.email}"`, { cwd: process.cwd() });
    execSync(`git config user.name "AI Report Bot"`, { cwd: process.cwd() });
    
    // 파일 추가
    execSync(`git add ${reportPath}`, { cwd: process.cwd() });
    execSync(`git add reports/`, { cwd: process.cwd() });
    
    // 커밋
    const date = new Date().toISOString().split('T')[0];
    execSync(`git commit -m "chore: AI Daily Report for ${date}"`, { cwd: process.cwd() });
    
    // 푸시
    const remoteUrl = `https://${CONFIG.github.user}:${CONFIG.github.token}@github.com/${CONFIG.github.user}/${CONFIG.github.repo}.git`;
    execSync(`git push ${remoteUrl} main`, { cwd: process.cwd() });
    
    console.log('✅ GitHub 푸시 완료!');
  } catch (error) {
    console.error('❌ GitHub 푸시 실패:', error.message);
  }
}

// ======================== 메인 실행 ========================

async function main() {
  try {
    const reportPath = await generateReport();
    await pushToGithub(reportPath);
    console.log('\n✨ 완료!\n');
  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

main();
