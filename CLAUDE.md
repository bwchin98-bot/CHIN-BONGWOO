# CLAUDE.md - 에이전트 운영 가이드

**목적**: Claude Code 에이전트를 위한 프로젝트 운영·구조·설정 매뉴얼  
**로드**: Claude Code 세션마다 자동 로드 (SSOT)  
**대상**: AI 에이전트

---

## 🏗️ 파일 구조

```
CHIN-BONGWOO/
│
├── 📄 README.md                    (사용자 가이드 → 시작은 여기)
├── 📄 CLAUDE.md                    (이 파일 → 에이전트 운영)
├── 📄 SOUL.md                      (설계 철학 → 판단 기준)
│
├── 🔧 메인 코드
│   ├── generate_report.js          (보고서 생성 메인 로직)
│   ├── ai_report_template.html     (HTML 템플릿, 한글)
│   ├── package.json                (npm 의존성)
│   └── .github/workflows/generate_report.yml  (GitHub Actions)
│
├── 📁 reports/                     (생성된 보고서 저장)
│   └── report-YYYY-MM-DD.html
│
└── 📁 .claude/
    └── skills/ai-daily-report/     (Claude Code 스킬)
        ├── skill.yml               (스킬 정의 v4.0.0)
        ├── package.json
        ├── src/                    (스킬 소스)
        │   ├── index.js            (진입점)
        │   └── cli.js              (명령어 처리)
        ├── config/                 (설정)
        │   └── defaults.js         (상수)
        ├── docs/                   (스킬 문서)
        │   ├── DOCUMENTATION.md    (기술 상세)
        │   └── CHANGELOG.md        (버전 이력)
        └── scripts/                (설정 스크립트)
```

---

## ⚙️ 필수 설정

### 환경 변수 (필수 4개)
```bash
GITHUB_USER           # GitHub 사용자명
GITHUB_EMAIL          # GitHub 이메일
GITHUB_TOKEN          # Personal Access Token (repo 권한)
GITHUB_REPO           # 저장소명 (CHIN-BONGWOO)
```

### GitHub Secrets (Actions 실행 시)
```
REPORT_GITHUB_USER    → GITHUB_USER 값
REPORT_GITHUB_EMAIL   → GITHUB_EMAIL 값
REPORT_GITHUB_TOKEN   → GITHUB_TOKEN 값
```

### 선택 설정
```bash
REPORT_LANGUAGE=ko           # 한글(기본) 또는 en
REPORT_DESKTOP_SAVE=true     # Desktop 저장(기본: true)
```

---

## 📊 데이터 흐름

```
매일 9:00 UTC (한국 오후 6시)
    ↓
GitHub Actions 트리거 (.github/workflows/generate_report.yml)
    ↓
Node.js 실행: node generate_report.js
    ↓
5개 API 병렬 호출 (각 5-6개 항목)
    ├─ Hacker News: 뉴스, 기업, 펀딩
    ├─ arXiv: 논문
    ├─ GitHub: 저장소
    ├─ Hugging Face: 모델
    └─ Hardcoded: 행사
    ↓
처리 (generate_report.js 내부)
    ├─ 한글 번역
    ├─ 1-2줄 컴팩트 포맷
    ├─ 링크 추출
    └─ 메타데이터 정리
    ↓
렌더링 (ai_report_template.html)
    ├─ 반응형 HTML 생성
    ├─ CSS 스타일 적용
    └─ 링크 연결
    ↓
저장 2곳
    ├─ Desktop: C:\Users\{username}\Desktop\AI-Daily-Reports\
    └─ GitHub: reports/ 폴더 (자동 커밋 및 푸시)
```

---

## 🔧 일반적 작업

### 새 API 소스 추가
1. `generate_report.js`에 수집 함수 추가
2. `createCompact*Item()` 함수로 포맷 정의
3. `ai_report_template.html`에 섹션 추가
4. `config/defaults.js`에 설정 추가
5. 테스트: `/ai-report test` 후 `/ai-report generate`
6. GitHub Issue로 기록

### 번역 추가 (언어 추가)
1. `generate_report.js`의 `TRANSLATIONS` 객체 수정
2. `ai_report_template.html`의 문자열 번역
3. `config/defaults.js`의 `translations` 객체 수정
4. 환경 변수: `REPORT_LANGUAGE=언어코드`

### 섹션 커스터마이징
1. `ai_report_template.html`: 섹션 제목·구조 수정
2. `generate_report.js`: 해당 섹션의 파싱 로직 수정
3. CSS는 `<style>` 태그에서 조정

---

## 🐛 디버깅

### 환경 확인
```bash
/ai-report test
# 또는
node .claude/skills/ai-daily-report/src/index.js test
```

### 보고서 생성 로그
```bash
node generate_report.js 2>&1
# 에러 메시지 확인, 첫 50줄 보기
node generate_report.js 2>&1 | head -50
```

### GitHub 연결 확인
```bash
git config user.email        # 설정된 이메일
git config user.name         # 설정된 사용자명
git remote -v                # 원격 저장소 URL
```

### Token 확인
```bash
echo $GITHUB_TOKEN           # 토큰 출력 (***로 숨겨짐)
# 또는
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

---

## 📈 성능 지표

### 생성 시간
- Hacker News (5개): ~500ms
- arXiv (5개, XML 파싱): ~2000ms
- GitHub (5개): ~500ms
- Hugging Face (5개): ~1000ms
- 렌더링: ~200ms
- **총합**: ~4초

### 저장소 용량
- 보고서당: 25-30KB
- 월간: ~750KB
- 년간: ~9MB

### API 호출
- 총 ~20개 요청 (각 API당 1-2회)
- 레이트 제한 준수 중

---

## 🔄 GitHub Actions 상세

**파일**: `.github/workflows/generate_report.yml`

**구성**:
```yaml
- 스케줄: 매일 09:00 UTC
- 환경: Node.js v24
- Actions: checkout@v5, setup-node@v5
- 스크립트: node generate_report.js
- 커밋: git add + git commit + git push
```

**실패 시**:
- 에러 로그는 GitHub Actions 탭에서 확인
- Desktop 저장은 로컬 환경에서만 동작
- GitHub 푸시 실패는 토큰·권한 확인

---

## 💾 저장 경로

### Desktop (로컬)
```
Windows: C:\Users\{username}\Desktop\AI-Daily-Reports\
macOS:   /Users/{username}/Desktop/AI-Daily-Reports/
Linux:   /home/{username}/Desktop/AI-Daily-Reports/
```

### GitHub
```
저장소: https://github.com/bwchin98-bot/CHIN-BONGWOO
경로: reports/report-YYYY-MM-DD.html
자동: 매일 커밋 및 푸시
```

---

## 📋 체크리스트

### 새 세션 시작
- [ ] 이 파일(CLAUDE.md) 읽기
- [ ] 환경 변수 확인 (`echo $GITHUB_TOKEN`)
- [ ] `/ai-report test` 실행
- [ ] 최근 보고서 확인 (`/ai-report status`)

### 기능 추가
- [ ] GitHub Issue 생성
- [ ] 코드 수정
- [ ] 로컬 테스트 (`/ai-report generate`)
- [ ] CHANGELOG.md 기록
- [ ] GitHub에 푸시
- [ ] Issue 종료

### 배포
- [ ] 모든 테스트 통과
- [ ] 버전 업그레이드 (skill.yml, package.json)
- [ ] 문서 검증
- [ ] 최종 푸시

---

## 🔗 참고

- **사용자 가이드**: [README.md](README.md)
- **설계 철학**: [SOUL.md](SOUL.md)
- **스킬 상세**: [.claude/skills/ai-daily-report/README.md](.claude/skills/ai-daily-report/README.md)
- **기술 문서**: [.claude/skills/ai-daily-report/docs/DOCUMENTATION.md](.claude/skills/ai-daily-report/docs/DOCUMENTATION.md)
- **버전 이력**: [.claude/skills/ai-daily-report/docs/CHANGELOG.md](.claude/skills/ai-daily-report/docs/CHANGELOG.md)

---

**버전**: v4.0.0  
**상태**: Production Ready ✅  
**마지막 업데이트**: 2026-06-11
