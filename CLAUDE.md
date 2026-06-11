# CLAUDE.md - AI Daily Report Generator v4.0.0

**목적**: Claude Code 에이전트 진입점 | 운영·구조·SSOT (WHAT·HOW)  
**로드**: 세션마다 자동 로드 | Claude Code 학습 자료  
**대상**: Claude 에이전트 (AI)

---

## 📋 이 프로젝트는 무엇인가? (WHAT)

AI 산업의 최신 동향을 자동으로 수집하고 전문적인 HTML 보고서로 생성하여 매일 GitHub에 저장하는 **완벽 자동화 시스템**입니다.

- **형태**: Claude Code Skill (v4.0.0)
- **트리거**: GitHub Actions (매일 9:00 UTC)
- **입력**: 5개 API (Hacker News, arXiv, GitHub, Hugging Face, 하드코딩 데이터)
- **출력**: HTML 보고서 (한글, 컴팩트, 반응형)
- **저장소**: GitHub 자동 푸시 + Desktop 자동 저장

---

## 🏗️ 어떻게 작동하나? (HOW)

### 데이터 흐름
```
매일 9:00 UTC
    ↓
GitHub Actions 트리거
    ↓
generate_report.js 실행
    ↓
5개 API에서 데이터 수집 (각 5개 항목)
    ↓
한글 번역 + 컴팩트 포맷 변환
    ↓
ai_report_template.html 렌더링
    ↓
Desktop + GitHub 자동 저장
```

### 주요 파일

| 파일 | 역할 |
|------|------|
| `generate_report.js` | 메인 로직 (API 수집 → 처리 → 렌더링) |
| `ai_report_template.html` | HTML 템플릿 (반응형, 한글) |
| `.github/workflows/generate_report.yml` | GitHub Actions (일정 + 환경) |
| `.claude/skills/ai-daily-report/` | Claude Code 스킬 패키징 |

### 스킬 구조
```
.claude/skills/ai-daily-report/
├── src/
│   ├── index.js      → 진입점
│   └── cli.js        → 명령어 처리
├── config/
│   └── defaults.js   → 상수 & 설정
├── docs/
│   ├── DOCUMENTATION.md  → 기술 문서
│   └── CHANGELOG.md      → 변경 이력
├── skill.yml         → 스킬 정의
└── package.json      → npm 설정
```

---

## ⚙️ 필수 설정

### 환경 변수 (필수)
```bash
GITHUB_USER       # GitHub 사용자명
GITHUB_EMAIL      # GitHub 이메일
GITHUB_TOKEN      # Personal Access Token (repo 권한)
GITHUB_REPO       # 저장소명 (CHIN-BONGWOO)
```

### GitHub Secrets (Actions용)
```
REPORT_GITHUB_USER      → GITHUB_USER
REPORT_GITHUB_EMAIL     → GITHUB_EMAIL
REPORT_GITHUB_TOKEN     → GITHUB_TOKEN
```

### 선택 설정
```bash
REPORT_LANGUAGE=ko           # 언어 (ko/en)
REPORT_DESKTOP_SAVE=true     # Desktop 저장
SCHEDULE_TIME=09:00 UTC      # 실행 시간
```

---

## 🚀 Claude Code에서 사용

### 스킬 명령어
```bash
/ai-report setup       # 초기 설정
/ai-report generate    # 보고서 생성
/ai-report version     # v4.0.0 확인
/ai-report status      # 보고서 목록
/ai-report test        # 환경 테스트
/ai-report help        # 도움말
```

### 직접 실행
```bash
node generate_report.js          # 메인 스크립트
node src/index.js generate       # 스킬 CLI
npm run generate                 # npm 스크립트
```

---

## 📊 데이터 소스 & API

### 1. Hacker News API
- **용도**: 뉴스, 기업, 펀딩
- **수집**: 각 섹션 5개 항목
- **필터**: AI 관련 키워드

### 2. arXiv API
- **용도**: 최신 논문
- **포맷**: XML (파싱)
- **선택**: cs.AI 카테고리

### 3. GitHub Search API
- **용도**: 트렌딩 저장소
- **정렬**: Stars (최신)
- **필터**: Python, JavaScript

### 4. Hugging Face API
- **용도**: 신규 AI 모델
- **정렬**: Likes (인기도)
- **타입**: Models

### 5. Hardcoded Events
- **용도**: 주요 AI 컨퍼런스
- **관리**: config/defaults.js
- **수정**: 수동 업데이트

---

## 🔄 GitHub Actions 워크플로우

### 파일: `.github/workflows/generate_report.yml`

**스케줄**:
```yaml
cron: '0 9 * * *'  # 매일 09:00 UTC (한국 오후 6시)
```

**환경**:
```yaml
- Node.js v24
- actions/checkout@v5
- actions/setup-node@v5
```

**프로세스**:
1. 저장소 체크아웃
2. Node.js 24 설정
3. `node generate_report.js` 실행
4. 변경사항 git add
5. 자동 커밋 & 푸시

---

## 📁 저장 위치

### 로컬
```
C:\Users\{username}\Desktop\AI-Daily-Reports\
├── report-2026-06-11.html
├── report-2026-06-10.html
└── ...
```

### GitHub
```
https://github.com/bwchin98-bot/CHIN-BONGWOO/
├── reports/
│   ├── report-2026-06-11.html
│   └── ...
└── .claude/skills/ai-daily-report/
```

---

## 🔧 일반적인 작업

### 새로운 데이터 소스 추가
1. `generate_report.js`에 수집 함수 추가
2. `ai_report_template.html`에 섹션 추가
3. `config/defaults.js`에 설정 추가
4. `CHANGELOG.md`에 기록
5. GitHub Issue 생성 후 버전 업그레이드

### API 응답 포맷 변경
1. 해당 섹션의 parsing 로직 수정
2. `createCompact*Item()` 함수 업데이트
3. HTML 템플릿 CSS 확인
4. 로컬 테스트 실행

### 번역 추가
1. `generate_report.js`의 TRANSLATIONS 객체 수정
2. HTML 템플릿의 섹션 제목 번역
3. `config/defaults.js`의 translations 추가

---

## 🐛 디버깅

### 보고서 생성 실패
```bash
/ai-report test        # 환경 확인
echo $GITHUB_TOKEN     # 토큰 확인
node generate_report.js 2>&1 | head -50  # 에러 로그
```

### GitHub 푸시 실패
```bash
git config user.email     # 이메일 확인
git status                # 변경사항 확인
cat .git/config          # 원격 설정 확인
```

### Desktop 저장 실패
```javascript
// generate_report.js에서
console.log(desktopPath);  // 경로 확인
fs.accessSync(reportDir);  // 권한 확인
```

---

## 📈 성능 & 최적화

### API 호출 시간
- Hacker News: ~500ms (5 요청)
- arXiv: ~2000ms (XML 파싱)
- GitHub Search: ~500ms (1 요청)
- Hugging Face: ~1000ms (1 요청)
- **총합**: ~4초

### 최적화 포인트
- 병렬 API 호출 (현재 순차)
- 응답 캐싱 (24시간)
- 이미지 최적화 (CDN)

### 용량
- 평균 보고서: 25-30 KB
- 월간 저장소: ~750 KB
- 년간 저장소: ~9 MB

---

## 🔐 보안

### 토큰 관리
- ✅ 환경 변수로 관리 (하드코딩 금지)
- ✅ GitHub Secrets 사용
- ✅ `.env` 파일 .gitignore에 포함

### API 보안
- ✅ 공개 API만 사용
- ✅ 인증 필요 없음 (Public)
- ✅ 레이트 제한 준수

---

## 📚 관련 문서

- **[SOUL.md](SOUL.md)** - 사명·원칙·가치 (WHO·WHY)
- **[README.md](README.md)** - 사용자 가이드 (외부 온보딩)
- **[DOCUMENTATION.md](.claude/skills/ai-daily-report/docs/DOCUMENTATION.md)** - 기술 상세
- **[CHANGELOG.md](.claude/skills/ai-daily-report/docs/CHANGELOG.md)** - 변경 이력

---

## ✅ 체크리스트

### 새 세션 시작 시
- [ ] CLAUDE.md 읽기 (이 파일)
- [ ] 환경 변수 확인
- [ ] `/ai-report test` 실행
- [ ] 최근 보고서 확인

### 기능 추가 시
- [ ] GitHub Issue 생성
- [ ] CLAUDE.md 업데이트
- [ ] CHANGELOG.md 기록
- [ ] 로컬 테스트
- [ ] GitHub에 푸시
- [ ] Issue 종료

### 배포 시
- [ ] 모든 테스트 통과
- [ ] 버전 업그레이드 (skill.yml, package.json)
- [ ] CHANGELOG.md 완성
- [ ] GitHub Release 생성
- [ ] 문서 검증

---

**마지막 업데이트**: 2026-06-11  
**버전**: v4.0.0  
**상태**: Production Ready ✅
