# 🤖 AI Daily Report Generator v4.0.0

**Production Ready - Final Release** ✅  
*자동으로 AI 업계 동향을 수집하여 매일 HTML 보고서를 생성하고 GitHub에 올려주는 Claude Code 스킬*

---

## 📋 목차
1. [개요](#개요)
2. [주요 기능](#주요-기능)
3. [시스템 요구사항](#시스템-요구사항)
4. [설치 및 설정](#설치-및-설정)
5. [사용 방법](#사용-방법)
6. [기술 아키텍처](#기술-아키텍처)
7. [데이터 소스](#데이터-소스)
8. [GitHub Actions 자동화](#github-actions-자동화)
9. [문제 해결](#문제-해결)
10. [향후 계획](#향후-계획)

---

## 개요

### 🎯 목적
AI 산업의 최신 동향을 자동으로 수집하고, 전문적인 HTML 보고서로 생성하여 매일 GitHub 저장소에 자동 저장합니다.

### 📊 보고서 구성
- **7개 섹션**: 뉴스, 모델, 기업, 펀딩, 논문, 저장소, 행사
- **총 34개 항목**: 매일 자동 수집
- **반응형 디자인**: 모바일/태블릿/데스크톱 모두 지원
- **한글 지원**: 100% 한글로 번역

### 🌍 크로스플랫폼
- ✅ Windows
- ✅ macOS
- ✅ Linux

---

## 주요 기능

### Phase 1: MVP (완료) ✅
```
✅ Breaking News (Hacker News API)
✅ Research Papers (arXiv API)
✅ GitHub Trending Repositories
✅ HTML Report Generation
✅ GitHub Actions Integration
```

### Phase 2: Core Features (완료) ✅
```
✅ Company Updates (Anthropic, OpenAI, Google 등)
✅ Funding & Investments Information
✅ New Models & Technologies (Hugging Face)
✅ Upcoming Events (Major AI Conferences)
```

### Phase 3: Advanced Features (완료) ✅
```
✅ 100% Korean Localization
✅ Compact Summary Format (1-2 lines per item)
✅ Desktop Auto-Save (C:\Users\{username}\Desktop\AI-Daily-Reports\)
✅ GitHub Actions Automation (v5, Node.js 24)
✅ Professional HTML Report
✅ Archive Management
```

---

## 시스템 요구사항

### 필수 사항
- **Node.js**: v24 이상
- **npm**: 기본 포함
- **GitHub**: 저장소 및 Personal Access Token
- **Internet**: API 호출 필수

### 환경 변수 (필수)
```bash
GITHUB_USER       # GitHub 사용자명
GITHUB_EMAIL      # GitHub 이메일
GITHUB_TOKEN      # Personal Access Token (repo 권한)
GITHUB_REPO       # 저장소명 (예: CHIN-BONGWOO)
```

### 환경 변수 (선택)
```bash
REPORT_LANGUAGE           # ko 또는 en (기본값: ko)
REPORT_DESKTOP_SAVE       # true 또는 false (기본값: true)
SCHEDULE_TIME            # 스케줄 시간 (기본값: 09:00 UTC)
```

---

## 설치 및 설정

### 1단계: 저장소 클론
```bash
git clone https://github.com/bwchin98-bot/CHIN-BONGWOO.git
cd CHIN-BONGWOO
```

### 2단계: 스킬 설치
```bash
# Claude Code 스킬로 설치
/ai-report setup

# 또는 수동 설치
node .claude/skills/ai-daily-report/run.js setup
```

### 3단계: GitHub 인증 설정
```bash
# 환경 변수 설정
export GITHUB_USER="your-username"
export GITHUB_EMAIL="your@email.com"
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxx"
export GITHUB_REPO="your-repo-name"
```

### 4단계: 보고서 생성 테스트
```bash
/ai-report generate
# 또는
node .claude/skills/ai-daily-report/run.js generate
```

### 5단계: GitHub Actions 설정
```bash
# 저장소 Settings → Secrets and variables → Actions
# 다음 Secrets 추가:
REPORT_GITHUB_USER       # GitHub 사용자명
REPORT_GITHUB_EMAIL      # GitHub 이메일
REPORT_GITHUB_TOKEN      # Personal Access Token
```

---

## 사용 방법

### Claude Code 스킬 명령어

#### 보고서 생성
```bash
/ai-report generate
```
- 즉시 AI 동향 보고서 생성
- HTML 형식으로 저장
- Desktop 폴더에 자동 저장
- GitHub에 자동 푸시

#### 설정
```bash
/ai-report setup         # 초기 설정 실행
/ai-report config        # 현재 설정 확인
/ai-report test          # 환경 테스트
```

#### 정보 조회
```bash
/ai-report version       # v4.0.0 버전 정보
/ai-report status        # 생성된 보고서 목록
/ai-report logs          # 최근 활동 로그
/ai-report roadmap       # 개발 로드맵
/ai-report issues        # 활성 이슈
```

#### 언어 및 저장소 설정
```bash
/ai-report language ko   # 한글 설정
/ai-report language en   # 영어 설정
/ai-report desktop on    # Desktop 저장 활성화
/ai-report desktop off   # Desktop 저장 비활성화
```

### 수동 명령어
```bash
# 보고서 생성
node generate_report.js

# 스킬 명령어 실행
node .claude/skills/ai-daily-report/run.js [command]
```

---

## 기술 아키텍처

### 시스템 다이어그램
```
┌─────────────────────────────────────────────────────────┐
│                  GitHub Actions (Daily)                 │
│              (9:00 UTC / 한국 오후 6시)                  │
└───────────┬──────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│              Data Collection Layer                       │
├──────────┬──────────┬──────────┬──────────┬──────────────┤
│ Hacker   │ arXiv    │ GitHub   │ Hugging  │ Hardcoded    │
│ News API │ XML      │ Search   │ Face     │ Events       │
│ (5 items)│ (5 items)│ (5 items)│ (5 items)│ (5 items)    │
└──────────┴──────────┴──────────┴──────────┴──────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│              Processing Layer                           │
├─────────────────────────────────────────────────────────┤
│ • Compact Summary (1-2 lines)                           │
│ • Korean Translation (한글)                              │
│ • Data Normalization                                    │
│ • Link Extraction                                       │
└──────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│              Rendering Layer                            │
├──────────┬──────────────────────────────────────────────┤
│ Template │ ai_report_template.html                      │
│ Engine   │ • Responsive Design                          │
│          │ • Animation Effects                          │
│          │ • Hover Interactions                         │
└──────────┴──────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│              Output Layer                               │
├──────────┬──────────────────────────────────────────────┤
│ Desktop  │ GitHub Repository                            │
│ Folder   │ reports/ folder                              │
│ Save     │ Automatic Commit & Push                      │
└──────────┴──────────────────────────────────────────────┘
```

### 파일 구조
```
CHIN-BONGWOO/
├── generate_report.js              # 메인 스크립트
├── ai_report_template.html         # HTML 템플릿
├── package.json                    # 의존성
├── CHANGELOG.md                    # 변경 이력
├── DOCUMENTATION.md                # 이 파일
├── reports/                        # 생성된 보고서
│   ├── report-2026-06-11.html
│   ├── report-2026-06-10.html
│   └── ...
├── .github/
│   └── workflows/
│       └── generate_report.yml     # GitHub Actions 설정
└── .claude/
    └── skills/
        └── ai-daily-report/
            ├── skill.yml           # 스킬 메타데이터
            ├── README.md           # 스킬 문서
            ├── run.js              # 스킬 명령어 핸들러
            └── setup.sh            # 설정 스크립트
```

---

## 데이터 소스

### 1. Hacker News API
**용도**: 주요 뉴스, 기업 뉴스, 펀딩 정보  
**수집 항목**: 5개  
**업데이트**: 실시간  

```javascript
// 쿼리 예시
Hacker News "AI" top stories
필터링: Anthropic, OpenAI, Google, DeepSeek 등
```

### 2. arXiv API
**용도**: 최신 AI 논문  
**수집 항목**: 5개  
**업데이트**: 매일  

```xml
<!-- XML 파싱 -->
<entry>
  <title>논문 제목</title>
  <author name="저자명"/>
  <summary>초록</summary>
  <link href="http://arxiv.org/abs/..."/>
  <published>2026-06-10T...</published>
</entry>
```

### 3. GitHub Search API
**용도**: 트렌딩 AI 저장소  
**수집 항목**: 5개  
**정렬**: Stars (최신)  

```bash
# 검색 쿼리
language:python stars:>10000 created:>2026-01-01
sort by: stars descending
```

### 4. Hugging Face API
**용도**: 신규 AI 모델  
**수집 항목**: 5개  
**정렬**: Likes (인기도)  

```javascript
// API 엔드포인트
https://huggingface.co/api/models?sort=likes
```

### 5. Hardcoded Events
**용도**: 주요 AI 컨퍼런스 일정  
**수집 항목**: 5개  

```javascript
const EVENTS = [
  { name: "NeurIPS 2026", date: "2026-12-09", location: "Vancouver, Canada" },
  { name: "ICML 2026", date: "2026-07-23", location: "Vienna, Austria" },
  // ... 더 많은 이벤트
];
```

---

## GitHub Actions 자동화

### 워크플로우 설정
**파일**: `.github/workflows/generate_report.yml`

### 스케줄 설정
```yaml
schedule:
  - cron: '0 9 * * *'   # 매일 09:00 UTC (한국 오후 6시)
```

### 실행 트리거
- ✅ **일정 실행**: 매일 자동 실행
- ✅ **수동 실행**: workflow_dispatch로 언제든 실행
- ✅ **Push 트리거**: 저장소 변경 시 선택적 실행

### GitHub Actions 구성
```yaml
- actions/checkout@v5          # 저장소 체크아웃
- actions/setup-node@v5        # Node.js 24 설정
  with:
    node-version: '24'
- node generate_report.js       # 보고서 생성
- git commit & push            # 자동 커밋 및 푸시
```

### 주요 개선사항 (v4.0.0)
| 항목 | 이전 | 현재 | 효과 |
|------|------|------|------|
| Actions | v4 | v5 | 최신 표준 준수 |
| Node.js | 20 (deprecated) | 24 | 보안 및 성능 향상 |
| npm cache | 활성화 | 제거 | 의존성 에러 해결 |
| 환경변수 | FORCE_NODE24 | (불필요) | 간결화 |

---

## 문제 해결

### 문제 1: "Dependencies lock file is not found"
**원인**: npm cache 설정이 활성화되어 있지만 lock 파일 부재  
**해결**: 
```yaml
# setup-node v5에서 cache 옵션 제거
with:
  node-version: '24'
  # cache: false (v5에서 지원 안 함)
```

### 문제 2: "Node.js 20 is deprecated"
**원인**: GitHub Actions v4 사용  
**해결**: v5로 업그레이드
```yaml
- uses: actions/checkout@v5      # v4 → v5
- uses: actions/setup-node@v5    # v4 → v5
```

### 문제 3: Desktop 폴더에 보고서가 저장되지 않음
**원인**: 폴더 권한 문제 또는 경로 오류  
**해결**:
```javascript
// getDesktopPath() 함수 확인
const desktopPath = path.join(os.homedir(), 'Desktop');
fs.mkdirSync(reportDir, {recursive: true}); // 폴더 생성
```

### 문제 4: GitHub 푸시 실패
**원인**: Personal Access Token 부재 또는 권한 부족  
**해결**:
```bash
# GitHub Settings → Developer settings → Personal access tokens
# 필요 권한: repo, workflow
```

### 문제 5: API 레이트 제한
**원인**: API 호출 초과  
**해결**: 
```javascript
// 각 API마다 5개 항목만 수집 (레이트 제한 내)
// 캐싱 미구현 (시간 절약)
```

---

## 향후 계획

### Phase 4: 확장 기능 (Planned)
```
⏳ Email Notifications
   - 보고서 생성 시 이메일 자동 전송
   - 구독자 관리 시스템

⏳ Slack Integration
   - Slack 채널에 자동 포스팅
   - Interactive 버튼 (자세히 보기 등)

⏳ Twitter Auto-Posting
   - 주요 뉴스 자동 트윗
   - 해시태그 자동 생성

⏳ Web Dashboard
   - 웹 기반 보고서 뷰어
   - 필터링 및 검색 기능
   - 과거 보고서 아카이브
```

### 개선 예정 항목
- [ ] 데이터베이스 통합 (보고서 히스토리)
- [ ] 중복 뉴스 필터링
- [ ] 사용자 정의 필터링
- [ ] 성능 최적화
- [ ] API 모니터링 대시보드

---

## 기술 스택

| 계층 | 기술 |
|------|------|
| **Runtime** | Node.js v24 |
| **Script** | JavaScript (ES6+) |
| **HTTP** | Node.js built-in (http) |
| **Templating** | HTML Template Literal |
| **File System** | Node.js fs module |
| **Process** | Node.js child_process |
| **Scheduling** | GitHub Actions Cron |
| **VCS** | Git + GitHub |
| **Skill Framework** | Claude Code Skill |

---

## 버전 이력

### v4.0.0 (2026-06-11) - Final Release ✅
- GitHub Actions v5 완벽 호환
- Node.js 24 지원
- npm cache 에러 해결
- 모든 Phase 3 기능 완성
- Production Ready

### v3.2.0 (2026-06-11)
- GitHub Actions v5 업그레이드
- Node.js 24 지원 준비
- 스킬 업데이트

### v3.1.0 (2026-06-XX)
- 한글 완벽 번역
- 컴팩트 요약 형식
- Desktop 자동 저장

### v3.0.0 (2026-06-XX)
- 초기 완성 버전
- 7개 섹션 데이터 수집
- HTML 리포트 생성

---

## 라이선스 및 기여

**저장소**: https://github.com/bwchin98-bot/CHIN-BONGWOO  
**Author**: bwchin98-bot  
**Status**: Open Source (MIT License)

---

## 연락처 및 지원

### 문제 보고
GitHub Issues: https://github.com/bwchin98-bot/CHIN-BONGWOO/issues

### 커뮤니티
Pull Request 환영합니다! 🙌

---

**마지막 업데이트**: 2026-06-11  
**문서 버전**: v4.0.0  
**상태**: Production Ready ✅
