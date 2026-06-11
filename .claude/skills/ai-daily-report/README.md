# 🤖 AI Daily Report Generator Skill

자동으로 AI 업계 동향을 수집하여 매일 HTML 보고서를 생성하고 GitHub에 올려주는 Claude Code 스킬입니다.

## ✨ 기능

### ✅ 현재 작동 중
- **📰 Breaking News**: Hacker News에서 AI 관련 뉴스 5개 자동 수집
- **📚 Research Papers**: arXiv에서 최신 AI 논문 5개 자동 수집
- **🔥 Trending Repos**: GitHub에서 트렌딩 AI 저장소 5개 자동 수집
- **💼 Company Updates**: 기업 뉴스 자동 필터링 (OpenAI, Anthropic 등)
- **💰 Funding & Investments**: AI 펀딩 정보 자동 수집
- **🤖 New Models & Technologies**: Hugging Face에서 최신 모델 수집
- **📅 Upcoming Events**: 주요 AI 컨퍼런스 일정 자동 추가
- **📊 HTML Report**: 반응형 HTML 형식의 전문적인 보고서 생성
- **🌐 한글 지원**: 100% 한글로 번역된 보고서 생성
- **💾 Desktop 자동 저장**: `Desktop/AI-Daily-Reports/` 폴더에 자동 저장
- **🔄 자동 푸시**: GitHub에 자동으로 커밋 및 푸시
- **📑 아카이브**: 과거 보고서 목록 자동 생성
- **⏰ 자동화**: GitHub Actions로 매일 자동 실행

## 🚀 빠른 시작

### 1단계: 스킬 설치
```bash
/ai-report setup
```

### 2단계: GitHub 설정
```bash
설정되는 항목:
- GITHUB_USER: 사용자명
- GITHUB_EMAIL: 이메일
- GITHUB_TOKEN: Personal Access Token
- GITHUB_REPO: 저장소명
```

### 3단계: 보고서 생성
```bash
/ai-report generate
```

## 📋 사용 명령어

### 설정
```bash
/ai-report setup              # 초기 설정
/ai-report config             # 설정 변경
/ai-report secrets            # GitHub Secrets 관리
```

### 실행
```bash
/ai-report generate           # 보고서 생성 및 푸시
/ai-report test              # 테스트 실행
/ai-report schedule          # 자동화 스케줄 설정
```

### 관리
```bash
/ai-report status            # 상태 확인
/ai-report logs              # 최근 로그 보기
/ai-report list              # 생성된 보고서 목록
```

## 🔧 설정 요구사항

### 필수
- **GitHub 계정**: 저장소에 쓰기 권한
- **Personal Access Token**: `repo`, `workflow` 권한
- **Node.js 24+**: GitHub Actions 환경에서 자동 설치

### 선택 (환경변수)
```bash
# 언어 설정 (한글/영문)
REPORT_LANGUAGE=ko    # 'ko' (한글) 또는 'en' (영문)

# Desktop 저장
REPORT_DESKTOP_SAVE=true   # Desktop에 자동 저장 여부

# 저장 위치 커스터마이징
REPORT_SAVE_LOCATION=/custom/path
```

### Desktop 저장 위치
```
Windows: C:\Users\{username}\Desktop\AI-Daily-Reports\
macOS: /Users/{username}/Desktop/AI-Daily-Reports/
Linux: ~/Desktop/AI-Daily-Reports/
```

## 📊 보고서 구조

```
AI Industry Daily Report
├─ 📊 Executive Summary (하루 요약)
├─ 🔥 Breaking News (5개)
├─ 📚 Research Papers (5개)
├─ 🔥 GitHub Trending (5개)
├─ 🤖 New Models & Technologies
├─ 💼 Company Updates
├─ 💰 Funding & Investments
└─ 📅 Upcoming Events
```

## 🔄 GitHub Actions 자동화

기본값: **매일 오후 6시 (UTC 9시)**

변경 방법:
```bash
/ai-report schedule --time "0 18 * * *"  # 18:00 UTC
/ai-report schedule --time "0 0 * * *"   # 00:00 UTC
```

## 📁 파일 구조

```
your-repo/
├── .claude/
│   └── skills/
│       └── ai-daily-report/
│           ├── skill.yml          # 스킬 정의
│           ├── README.md          # 이 파일
│           ├── setup.sh           # 설정 스크립트
│           └── run.js             # 실행 스크립트
├── .github/
│   └── workflows/
│       └── generate_report.yml    # GitHub Actions
├── reports/                       # 생성된 보고서
│   └── report-YYYY-MM-DD.html
├── index.html                     # 아카이브 목록
├── generate_report.js             # 메인 스크립트
├── ai_report_template.html        # HTML 템플릿
└── package.json
```

## 🐛 문제 해결

### "GITHUB_TOKEN not found"
```bash
/ai-report setup
# 또는
/ai-report secrets --set GITHUB_TOKEN ghp_xxx...
```

### "Permission denied"
- Token의 `repo`, `workflow` 권한 확인
- https://github.com/settings/tokens 에서 권한 검사

### "No reports generated"
- GitHub Actions 로그 확인: Actions 탭 → 최근 실행 → 로그
- 데이터 수집 API 상태 확인 (Hacker News, arXiv 등)

## 🗺️ 로드맵

### Phase 1: MVP ✅ (완료)
- [x] Breaking News (Hacker News)
- [x] Research Papers (arXiv)
- [x] GitHub Trending Repositories
- [x] HTML Report Generation
- [x] GitHub Actions Integration
- [x] Archive Management

### Phase 2: 핵심 기능 (진행 중) - Issue #2
- [ ] Company Updates (Hacker News 필터링)
- [ ] Funding & Investments (Product Hunt API)
- [ ] New Models & Technologies (Hugging Face API)
- [ ] Upcoming Events (Calendar integration)

### Phase 3: 고급 기능
- [ ] Email 알림
- [ ] Slack 연동
- [ ] Twitter 자동 포스팅
- [ ] Discord 웹훅

### Phase 4: 확장
- [ ] 여러 언어 지원
- [ ] 커스텀 필터링
- [ ] 사용자 정의 섹션
- [ ] 대시보드 웹사이트

## 📋 활성 이슈

### Issue #2: 보고서 일부 섹션에 데이터 없음
**상태**: In Progress  
**우선순위**: High  
**영향**: 4개 섹션 (Company Updates, Funding, New Models, Events)

**계획된 해결책**:
1. **Company Updates**: Hacker News에서 "OpenAI", "Google", "Anthropic" 등 필터링
2. **Funding & Investments**: Product Hunt API로 AI 펀딩 정보 수집
3. **New Models & Technologies**: Hugging Face Models API 통합
4. **Upcoming Events**: 주요 AI 컨퍼런스 수동 또는 Calendar API

자세한 내용: [GitHub Issue #2](https://github.com/bwchin98-bot/CHIN-BONGWOO/issues/2)

## 📞 지원

- 🐛 **버그 리포트**: GitHub Issues
- 💡 **기능 제안**: GitHub Discussions
- 📚 **문서**: 이 README 참조

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 🙏 기여

Pull Request 환영합니다!

```bash
1. Fork the repository
2. Create feature branch: git checkout -b feature/amazing-feature
3. Commit changes: git commit -m 'Add amazing feature'
4. Push to branch: git push origin feature/amazing-feature
5. Open Pull Request
```

---

**만든이**: bwchin98-bot  
**생성일**: 2026-06-11  
**최종 업데이트**: 2026-06-11
