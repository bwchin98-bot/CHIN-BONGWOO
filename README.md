# 🤖 AI Industry Daily Report

AI 업계의 최신 뉴스, 연구, 기술을 매일 자동으로 수집하여 HTML 보고서로 생성하고 GitHub에 업로드하는 자동화 시스템입니다.

## 📋 기능

- **매일 자동 생성**: GitHub Actions를 통해 매일 정해진 시간에 자동 실행
- **다양한 출처**: Hacker News, arXiv, GitHub Trending, NewsAPI 등에서 정보 수집
- **예쁜 HTML**: 반응형 디자인의 전문적인 보고서
- **GitHub 통합**: 자동으로 커밋 및 푸시
- **커스터마이징**: 쉬운 템플릿 수정으로 섹션 추가/제거 가능

## 🚀 빠른 시작

### 1️⃣ 저장소 생성

```bash
# GitHub에서 새 저장소 생성
# 이름: ai-daily-report
# Public 또는 Private (선택)

git clone https://github.com/YOUR_USERNAME/ai-daily-report.git
cd ai-daily-report
```

### 2️⃣ 파일 설정

필요한 파일들을 저장소에 추가하세요:

```
ai-daily-report/
├── .github/
│   └── workflows/
│       └── generate_report.yml      # GitHub Actions 설정
├── generate_report.js                # 메인 스크립트
├── ai_report_template.html           # HTML 템플릿
├── package.json                      # Node.js 의존성
├── .env.example                      # 환경변수 예시
└── README.md                         # 이 파일
```

### 3️⃣ 환경 변수 설정

GitHub Secrets에 다음을 추가하세요:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret 이름 | 설명 | 예시 |
|------------|------|------|
| `GITHUB_USER` | GitHub 사용자명 | `john-doe` |
| `GITHUB_TOKEN` | Personal Access Token | `ghp_xxxx...` |
| `GITHUB_EMAIL` | GitHub 이메일 | `john@example.com` |

**GitHub Token 발급 방법:**
1. https://github.com/settings/tokens 접속
2. "Generate new token" → "Generate new token (classic)" 클릭
3. 다음 권한 선택:
   - ✅ `repo` (전체)
   - ✅ `workflow`
   - ✅ `gist`

### 4️⃣ 로컬에서 테스트

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일 수정하기

# 보고서 생성 테스트
npm start

# 생성된 파일 확인
ls reports/
```

### 5️⃣ GitHub에 푸시

```bash
git add .
git commit -m "chore: Initialize AI daily report automation"
git push origin main
```

## ⏰ 자동 실행 스케줄

기본적으로 **매일 09:00 UTC** (한국 시간 오후 6시)에 자동 실행됩니다.

시간 변경하려면 `.github/workflows/generate_report.yml`에서:

```yaml
schedule:
  - cron: '0 9 * * *'  # 이 부분 수정
```

Cron 문법:
- `0 9 * * *` = 매일 09:00
- `0 0 * * *` = 매일 00:00
- `0 0 * * 1` = 매주 월요일 00:00
- `*/6 * * * *` = 6시간마다

[Crontab Guru](https://crontab.guru)에서 시간 계산

## 📊 보고서 구조

생성되는 보고서에 포함되는 섹션:

1. **Executive Summary** - 오늘의 한줄 요약
2. **Breaking News** - 주요 뉴스 (Hacker News, NewsAPI)
3. **New Models & Technologies** - 최신 모델/기술
4. **Company Updates** - 주요 기업 뉴스
5. **Funding & Investments** - 펀딩 소식
6. **Research Papers** - 주목할 논문 (arXiv)
7. **Trending Repositories** - GitHub 트렌딩 (AI 관련)
8. **Upcoming Events** - 예정된 이벤트/컨퍼런스

## 🔧 커스터마이징

### 섹션 추가/제거

`ai_report_template.html`에서 필요한 섹션을 추가/제거하세요:

```html
<!-- 새 섹션 추가 예 -->
<div class="section">
  <h2>🎯 새로운 섹션</h2>
  <div id="new-section">
    {{NEW_SECTION_ITEMS}}
  </div>
</div>
```

그 다음 `generate_report.js`에서 대응하는 데이터 수집 함수를 추가:

```javascript
async function fetchNewSection() {
  // API 또는 웹 스크래핑으로 데이터 수집
  return items;
}
```

### 색상 변경

`ai_report_template.html`의 CSS를 수정하세요:

```css
:root 변수 추가 (또는 직접 변경)
--primary-color: #667eea;    /* 주 색상 */
--secondary-color: #764ba2;  /* 보조 색상 */
```

### 데이터 출처 추가

`generate_report.js`에 새 fetch 함수 추가:

```javascript
async function fetchCustomSource() {
  try {
    const data = await fetchJson('API_URL');
    return data.map(item => ({
      title: item.title,
      url: item.url,
      // ... 필요한 필드
    }));
  } catch (e) {
    console.error('Error:', e);
    return [];
  }
}
```

## 📡 API 출처 및 제한

| 출처 | 제한 | 인증 |
|------|------|------|
| Hacker News | 무제한 | 필요 없음 |
| arXiv | 초당 3요청 | 필요 없음 |
| GitHub API | 시간당 60회 | 토큰 권장 |
| NewsAPI | 하루 500회 | API Key 필요 |
| Product Hunt | - | 필요 없음 |

### NewsAPI 연동 (선택사항)

1. https://newsapi.org에서 무료 API Key 발급
2. `.env`에 추가:
   ```
   NEWS_API_KEY=your_api_key
   ```
3. `generate_report.js`에서 활용

## 🐛 문제 해결

### GitHub Actions 실패

**Logs 확인:**
1. GitHub 저장소 → Actions 탭
2. 실패한 워크플로우 클릭
3. 상세 로그 확인

**일반적인 오류:**

```
❌ Error: fatal: not a git repository
→ 해결: git clone으로 저장소를 제대로 초기화했는지 확인

❌ fatal: could not read Username
→ 해결: GITHUB_TOKEN이 정확하고 권한이 충분한지 확인

❌ fatal: origin does not appear to be a 'git' repository
→ 해결: .git 폴더가 존재하는지, 리모트가 제대로 설정되었는지 확인
```

### 로컬에서 테스트

```bash
# npm 의존성 설치
npm install

# 스크립트 직접 실행
node generate_report.js

# 결과 확인
cat reports/report-YYYY-MM-DD.html
```

## 📈 결과 활용

### GitHub Pages로 공개

`gh-pages` 브랜치를 활용하여 웹사이트로 공개:

```bash
# 저장소 설정에서 Pages 활성화
# Source: gh-pages 브랜치 선택

# 또는 workflows에 추가
```

### Slack/Email 알림

GitHub Actions에 다음 추가:

```yaml
- name: Send Slack notification
  if: success()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

## 📝 라이선스

MIT

## 🤝 기여

개선 아이디어나 버그 리포트는 이슈로 제출해주세요!

## 📞 지원

문제가 있으신가요?
- 📖 [GitHub Discussions](https://github.com)에서 질문하기
- 🐛 [Issues](https://github.com)에서 버그 보고하기

---

**마지막 업데이트**: 2024년 1월

Made with ❤️ for the AI community
