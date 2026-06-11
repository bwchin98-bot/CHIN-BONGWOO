/**
 * CLI Command Handler
 * Manages all skill commands
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class CLIHandler {
  constructor() {
    this.commands = {
      generate: 'Generate AI daily report',
      setup: 'Run initial setup',
      test: 'Test mode (dry run)',
      status: 'Show current status',
      config: 'Show configuration',
      logs: 'Show recent logs',
      roadmap: 'Show development roadmap',
      issues: 'Show active issues',
      version: 'Show version information',
      language: 'Set report language (ko/en)',
      desktop: 'Toggle Desktop auto-save',
      help: 'Show help message',
    };
  }

  async execute(command, args) {
    if (!command || command === 'help' || command === '-h' || command === '--help') {
      this.showHelp();
      return;
    }

    if (!this.commands[command]) {
      console.error(`❌ Unknown command: ${command}\n`);
      this.showHelp();
      process.exit(1);
    }

    try {
      await this[command](args);
    } catch (error) {
      console.error(`❌ Command failed: ${error.message}`);
      process.exit(1);
    }
  }

  showHelp() {
    console.log('\n🤖 AI Daily Report Generator Skill\n');
    console.log('Commands:');
    Object.entries(this.commands).forEach(([cmd, desc]) => {
      console.log(`  ${cmd.padEnd(15)} - ${desc}`);
    });
    console.log('\nUsage:');
    console.log('  /ai-report <command> [options]\n');
  }

  async generate(args) {
    console.log('\n🚀 Generating AI Daily Report...\n');
    try {
      execSync('node generate_report.js', { stdio: 'inherit', cwd: this.getRootDir() });
      console.log('\n✅ Report generated successfully!\n');
    } catch (e) {
      throw new Error('Report generation failed');
    }
  }

  async setup(args) {
    console.log('\n🔧 Running setup...\n');
    try {
      const setupScript = path.join(__dirname, '..', 'scripts', 'setup.sh');
      execSync(`bash ${setupScript}`, { stdio: 'inherit' });
      console.log('\n✅ Setup complete!\n');
    } catch (e) {
      throw new Error('Setup failed');
    }
  }

  async test(args) {
    console.log('\n🧪 Running in test mode...\n');
    console.log('Environment Check:');
    console.log(`  Node.js: ${process.version}`);
    console.log(`  Platform: ${process.platform}`);
    console.log(`  CWD: ${process.cwd()}\n`);

    console.log('Required Files:');
    const files = ['generate_report.js', 'ai_report_template.html', 'package.json'];
    files.forEach(f => {
      const exists = fs.existsSync(path.join(this.getRootDir(), f));
      console.log(`  ${exists ? '✅' : '❌'} ${f}`);
    });

    console.log('\nEnvironment Variables:');
    const vars = ['GITHUB_USER', 'GITHUB_EMAIL', 'GITHUB_TOKEN', 'GITHUB_REPO'];
    vars.forEach(v => {
      const exists = !!process.env[v];
      console.log(`  ${exists ? '✅' : '❌'} ${v}`);
    });

    if (!process.env.GITHUB_TOKEN) {
      console.log('\n⚠️  GITHUB_TOKEN not set. Run: /ai-report setup\n');
    } else {
      console.log('\n✅ Environment ready for report generation\n');
    }
  }

  async status(args) {
    console.log('\n📊 Status Report\n');
    console.log('Configuration:');
    console.log(`  User: ${process.env.GITHUB_USER || '(not set)'}`);
    console.log(`  Email: ${process.env.GITHUB_EMAIL || '(not set)'}`);
    console.log(`  Token: ${process.env.GITHUB_TOKEN ? '✅ Set' : '❌ Not set'}`);
    console.log(`  Repo: ${process.env.GITHUB_REPO || '(not set)'}\n`);

    console.log('Generated Reports:');
    const reportsDir = path.join(this.getRootDir(), 'reports');
    if (fs.existsSync(reportsDir)) {
      const reports = fs.readdirSync(reportsDir)
        .filter(f => f.endsWith('.html'))
        .sort()
        .reverse()
        .slice(0, 5);

      if (reports.length === 0) {
        console.log('  (no reports yet)');
      } else {
        reports.forEach(r => console.log(`  📄 ${r}`));
      }
    } else {
      console.log('  (reports directory not found)');
    }
    console.log('');
  }

  async config(args) {
    console.log('\n⚙️  Configuration\n');
    console.log('Environment Variables:');
    const envVars = {
      GITHUB_USER: process.env.GITHUB_USER,
      GITHUB_EMAIL: process.env.GITHUB_EMAIL,
      GITHUB_TOKEN: process.env.GITHUB_TOKEN ? '***' : '(not set)',
      GITHUB_REPO: process.env.GITHUB_REPO,
    };

    Object.entries(envVars).forEach(([k, v]) => {
      console.log(`  ${k}: ${v || '(not set)'}`);
    });

    console.log('\nTo set variables:');
    console.log('  export GITHUB_USER=username');
    console.log('  export GITHUB_EMAIL=your@email.com');
    console.log('  export GITHUB_TOKEN=ghp_...');
    console.log('  export GITHUB_REPO=your-repo\n');
  }

  async logs(args) {
    console.log('\n📋 Recent Activity\n');
    const reportsDir = path.join(this.getRootDir(), 'reports');
    if (fs.existsSync(reportsDir)) {
      const files = fs.readdirSync(reportsDir)
        .filter(f => f.endsWith('.html'))
        .map(f => {
          const stat = fs.statSync(path.join(reportsDir, f));
          return { file: f, time: stat.mtime };
        })
        .sort((a, b) => b.time - a.time)
        .slice(0, 10);

      if (files.length === 0) {
        console.log('No reports generated yet.\n');
      } else {
        files.forEach(({ file, time }) => {
          console.log(`  📄 ${file}`);
          console.log(`     Created: ${time.toLocaleString()}\n`);
        });
      }
    } else {
      console.log('No reports directory found.\n');
    }
  }

  async roadmap(args) {
    console.log('\n🗺️  Development Roadmap\n');
    console.log('Phase 1: MVP ✅\n  [x] Breaking News\n  [x] Papers\n  [x] Repos\n');
    console.log('Phase 2: Core ✅\n  [x] Company News\n  [x] Funding\n  [x] Models\n  [x] Events\n');
    console.log('Phase 3: Advanced ✅\n  [x] Korean Localization\n  [x] Compact Format\n  [x] Desktop Save\n  [x] GitHub Actions v5\n');
    console.log('Phase 4: Expansion ⏳\n  [ ] Email Notifications\n  [ ] Slack Integration\n  [ ] Twitter Auto-Posting\n  [ ] Web Dashboard\n');
  }

  async issues(args) {
    console.log('\n🐛 Active Issues\n');
    console.log('Issue #6: Fix GitHub Actions to Node.js 24');
    console.log('  Status: CLOSED ✅\n');
  }

  async version(args) {
    console.log('\n📦 Version Information\n');
    console.log('  Skill: AI Daily Report Generator');
    console.log('  Version: 4.0.0');
    console.log('  Status: Production Ready - Final Release ✅\n');
    console.log('  Features:');
    console.log('    ✅ 7 Sections (News, Papers, Repos, Models, Company, Funding, Events)');
    console.log('    ✅ Korean Localization');
    console.log('    ✅ Desktop Auto-Save');
    console.log('    ✅ GitHub Actions Automation (v5, Node.js 24)');
    console.log('    ✅ Compact Summary Format (1-2 lines)\n');
    console.log('  Repository: https://github.com/bwchin98-bot/CHIN-BONGWOO');
    console.log('  Author: bwchin98-bot\n');
  }

  async language(args) {
    const lang = args[0] || 'ko';
    console.log('\n🌐 Report Language Setting\n');

    if (lang !== 'ko' && lang !== 'en') {
      console.log('❌ Invalid language. Use: ko (Korean) or en (English)');
      process.exit(1);
    }

    console.log(`✅ Language set to: ${lang === 'ko' ? '한글 🇰🇷' : 'English 🇺🇸'}`);
    console.log('\nTo apply, set environment variable:');
    console.log(`  export REPORT_LANGUAGE=${lang}\n`);
  }

  async desktop(args) {
    const enable = args[0] !== 'off';
    console.log('\n💾 Desktop Auto-Save Setting\n');

    if (enable) {
      console.log('✅ Desktop auto-save is now ENABLED');
      console.log('\nReports will be saved to:');
      console.log('  C:\\Users\\{username}\\Desktop\\AI-Daily-Reports\\');
      console.log('\nTo apply, set environment variable:');
      console.log('  export REPORT_DESKTOP_SAVE=true');
    } else {
      console.log('❌ Desktop auto-save is now DISABLED');
      console.log('\nTo apply, set environment variable:');
      console.log('  export REPORT_DESKTOP_SAVE=false');
    }
    console.log('');
  }

  getRootDir() {
    return path.resolve(__dirname, '..', '..', '..');
  }
}

module.exports = new CLIHandler();
