# 🤖 AI Daily Report Generator v4.0.0

**AI 산업의 최신 동향을 매일 자동으로 수집하고 한글 보고서로 생성하는 완벽 자동화 시스템**

![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/version-4.0.0-blue)
![Node.js](https://img.shields.io/badge/node.js-v24-green)
![Language](https://img.shields.io/badge/language-Korean-orange)

---

## ⚡ 5초 요약

```bash
/ai-report generate
```

매일 오후 6시, AI 뉴스·논문·모델·기업·펀딩·저장소·행사를 한 파일(HTML)로 정리해서 저장합니다.

---

## 📊 이것이 하는 일

| 항목 | 설명 |
|------|------|
| **수집** | Hacker News, arXiv, GitHub, Hugging Face에서 각 5개 항목 |
| **처리** | 한글 번역 + 1-2줄로 요약 |
| **저장** | Desktop + GitHub 자동 저장 |
| **반복** | 매일 오후 6시 자동 실행 |

**결과**: 깔끔한 HTML 보고서 (보통 25-30KB)

---

## 🚀 5분 시작 가이드

### 1단계: 환경 변수 설정
```bash
export GITHUB_USER="your-username"
export GITHUB_EMAIL="your@email.com"
export GITHUB_TOKEN="ghp_xxxxx"        # Personal Access Token (repo 권한)
export GITHUB_REPO="your-repo-name"
```

### 2단계: 스킬 설치
```bash
/ai-report setup
```

### 3단계: 보고서 생성
```bash
/ai-report generate
```

생성된 보고서:
- 📂 Desktop: `AI-Daily-Reports/report-YYYY-MM-DD.html`
- 📂 GitHub: `reports/report-YYYY-MM-DD.html`

---

## 🎮 사용 가능한 명령어

```bash
/ai-report generate      # 지금 바로 보고서 생성
/ai-report setup         # 초기 설정
/ai-report status        # 생성된 보고서 확인
/ai-report test          # 환경 설정 확인
/ai-report version       # v4.0.0 정보
/ai-report help          # 도움말
```

---

## 📦 필요한 것

- **Node.js**: v24 이상
- **Git**: 저장소 관리용
- **GitHub**: Personal Access Token (repo 권한)
- **Internet**: API 호출용

---

## 📁 폴더 구조

```
.
├── README.md                          ← 이 파일 (사용자 가이드)
├── CLAUDE.md                          ← 에이전트 운영 가이드
├── SOUL.md                            ← 설계 철학
├── generate_report.js                 ← 메인 스크립트
├── ai_report_template.html            ← HTML 템플릿
├── package.json
├── reports/                           ← 생성된 보고서
│   ├── report-2026-06-11.html
│   └── ...
├── .github/workflows/generate_report.yml  ← GitHub Actions
└── .claude/skills/ai-daily-report/    ← Claude Code 스킬
```

더 자세한 구조는 [CLAUDE.md](CLAUDE.md#-파일-구조)에서 확인하세요.

---

## 🔧 설정 상세

### 필수 환경 변수 (3개 구성 요소)

**Local/Manual 실행**:
```bash
GITHUB_USER       # GitHub 사용자명
GITHUB_EMAIL      # GitHub 이메일
GITHUB_TOKEN      # Personal Access Token
GITHUB_REPO       # 저장소명
```

**GitHub Actions 실행**:
Settings → Secrets and variables → Actions에서 설정:
```
REPORT_GITHUB_USER
REPORT_GITHUB_EMAIL
REPORT_GITHUB_TOKEN
```

### 선택 설정

```bash
REPORT_LANGUAGE=ko       # 한글 (기본값) 또는 en (영어)
REPORT_DESKTOP_SAVE=true # Desktop 저장 (기본값: true)
```

---

## 📚 더 알아보기

| 문서 | 대상 | 알아야 할 것 |
|------|------|------------|
| **[CLAUDE.md](CLAUDE.md)** | 🤖 개발자/에이전트 | 구조, 설정, 운영 방법 |
| **[SOUL.md](SOUL.md)** | 🎯 기여자 | 왜 이렇게 설계했나 |
| **[.claude/skills/ai-daily-report/README.md](.claude/skills/ai-daily-report/README.md)** | 📚 스킬 상세 | 스킬 자세한 설명 |

---

## ❓ 자주 묻는 질문

**Q: 보고서가 저장되는 곳은?**  
A: Desktop의 `AI-Daily-Reports/` 폴더 + GitHub의 `reports/` 폴더

**Q: 매일 자동으로 실행되나?**  
A: 네, GitHub Actions로 매일 오후 6시(UTC 9:00) 실행됩니다.

**Q: Personal Access Token은 어떻게 만드나?**  
A: GitHub → Settings → Developer settings → Personal access tokens → repo 권한 선택

**Q: 한국어 대신 영어로 받을 수 있나?**  
A: `export REPORT_LANGUAGE=en` 설정 후 `/ai-report generate`

**Q: 데이터 소스는 뭔가?**  
A: [CLAUDE.md의 데이터 소스 섹션](CLAUDE.md#데이터-소스--api)을 보세요.

---

## 🐛 문제 해결

보고서 생성 실패:
```bash
/ai-report test      # 환경 확인
echo $GITHUB_TOKEN   # 토큰 확인
```

GitHub 푸시 실패:
```bash
git config user.email  # 이메일 확인
```

더 자세한 디버깅은 [CLAUDE.md의 디버깅 섹션](CLAUDE.md#-디버깅)을 보세요.

---

## 🌟 주요 기능

✅ **자동화**: 매일 오후 6시 자동 실행  
✅ **한글**: 100% 한글로 번역  
✅ **컴팩트**: 각 항목 1-2줄 (빠른 읽기)  
✅ **반응형**: 모바일·태블릿·데스크톱 모두 지원  
✅ **정확**: 공식 API 사용 (신뢰성 높음)  
✅ **무료**: 오픈소스, 비용 없음  

---

## 📈 기술 스택

- **Runtime**: Node.js v24
- **언어**: JavaScript (ES6+)
- **저장**: Git + GitHub
- **자동화**: GitHub Actions
- **배포**: Claude Code Skill

---

## 🤝 기여하기

개선 아이디어가 있나요? GitHub Issues로 제안해주세요.

기여 방식:
1. Issue 생성 (무엇을 개선할지)
2. Fork 후 수정
3. Pull Request 제출

더 자세한 내용은 [SOUL.md의 기여 섹션](SOUL.md#-우리와-함께하는-방법)을 보세요.

---

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

---

## 🔗 링크

- **저장소**: https://github.com/bwchin98-bot/CHIN-BONGWOO
- **스킬**: `.claude/skills/ai-daily-report/`
- **보고서**: `/reports/` 폴더

---

**마지막 업데이트**: 2026-06-11  
**버전**: v4.0.0 Production Ready ✅
