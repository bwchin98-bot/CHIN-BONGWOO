# 🚀 Briefing Improver v1.0.0

**Meta-skill that improves AI Daily Report through automated issue detection, fixing, and documentation optimization**

---

## 📋 What It Does

Briefing Improver runs a **3-stage pipeline** to continuously improve your project:

### Stage ⓐ: Issue Writer
```
Scan project → Detect weaknesses → Create GitHub Issues
```
- Checks code quality (console.log, unused variables)
- Checks documentation (missing docs, outdated content)
- Checks testing coverage
- Checks performance metrics

### Stage ⓑ: Issue Runner
```
Get open issues → Fix automatically → Close issues
```
- Fetches all open GitHub issues
- Applies automatic fixes where possible
- Closes resolved issues
- Logs manual review needed

### Stage ⓒ: Doc Optimizer
```
Analyze docs → Find improvement opportunities → Apply fixes
```
- Checks for dead links
- Validates document structure
- Improves readability
- Ensures consistency

---

## 🎮 Commands

```bash
/briefing-improver scan      # Stage ⓐ only
/briefing-improver fix       # Stage ⓑ only
/briefing-improver optimize  # Stage ⓒ only
/briefing-improver run       # All three stages (full pipeline)
```

---

## 🔄 Full Pipeline Example

```bash
/briefing-improver run

╔════════════════════════════════════════════════════════╗
║      🚀 Briefing Improver Full Pipeline v1.0.0         ║
╚════════════════════════════════════════════════════════╝

📍 Stage ⓐ: Scanning weaknesses...
  ✅ Created: #15 - Remove debug console.log
  ✅ Created: #16 - Add unit tests
  ✅ Created 2 GitHub Issues

📍 Stage ⓑ: Fixing issues...
  ✅ Fixed: #15 - Remove debug console.log
  ✅ Closed: #15
  ✅ Fixed and closed 1 issues

📍 Stage ⓒ: Optimizing docs...
  ✅ Fixed: Mixed checkmark styles
  💡 Suggestion: Add code examples
  ✅ Applied 1 documentation improvements

╔════════════════════════════════════════════════════════╗
║                 ✅ PIPELINE COMPLETE                  ║
╚════════════════════════════════════════════════════════╝

Created Issues: 2
Fixed Issues: 1
Doc Improvements: 1
```

---

## ⚙️ Configuration

### Required Environment Variables
```bash
GITHUB_USER      # GitHub username
GITHUB_TOKEN     # Personal Access Token (repo scope)
GITHUB_REPO      # Repository name
```

### Optional
```bash
SCAN_DEPTH=2     # How deeply to scan (1-5, default 2)
AUTO_FIX=true    # Enable auto-fix mode (default true)
```

---

## 📊 What Gets Scanned

### Code Quality
- ❌ console.log statements (debug code)
- ❌ Unused variables
- ❌ Missing error handling

### Documentation
- ✅ Required docs exist (README.md, CLAUDE.md, SOUL.md)
- ✅ Docs are up-to-date (< 30 days old)
- ✅ Sections are complete
- ✅ Links are valid

### Testing
- ✅ Test files exist
- ✅ Coverage > 80%

### Performance
- ✅ Report size < 50KB
- ✅ Generation time < 10 seconds

---

## 🔗 Related Documents

- **Project**: [README.md](../../README.md)
- **Agent Guide**: [CLAUDE.md](../../CLAUDE.md)
- **Philosophy**: [SOUL.md](../../SOUL.md)
- **AI Daily Report**: [.claude/skills/ai-daily-report/](../ai-daily-report/)

---

## 🚀 Use Cases

### Continuous Improvement
Run daily to automatically detect and fix issues:
```bash
# In cron job or GitHub Actions
/briefing-improver run
```

### Code Review Preparation
Before PR review:
```bash
/briefing-improver scan    # See what issues exist
/briefing-improver optimize # Clean up docs
```

### Project Health Check
Periodically audit your project:
```bash
/briefing-improver scan    # Weaknesses
/briefing-improver optimize # Doc quality
```

---

## 📈 Integration with CI/CD

Add to `.github/workflows/improve.yml`:

```yaml
name: Briefing Improver
on:
  schedule:
    - cron: '0 8 * * 1'  # Weekly Monday 8 AM UTC
  workflow_dispatch:

jobs:
  improve:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: '24'
      - run: |
          export GITHUB_TOKEN=${{ secrets.GITHUB_TOKEN }}
          export GITHUB_USER=${{ github.actor }}
          export GITHUB_REPO=${{ github.event.repository.name }}
          node .claude/skills/briefing-improver/src/index.js run
```

---

## 🎯 Future Enhancements

- [ ] Security scanning (dependencies, secrets)
- [ ] Performance profiling
- [ ] API rate limit analysis
- [ ] Cost optimization suggestions
- [ ] Accessibility checks
- [ ] SEO optimization (if web-facing)

---

**Version**: 1.0.0  
**Status**: Active  
**Last Updated**: 2026-06-11
