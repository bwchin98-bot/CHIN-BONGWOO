#!/usr/bin/env node

/**
 * AI Daily Report Skill - Command Runner
 *
 * Usage:
 *   node run.js generate      - Generate report
 *   node run.js setup         - Run setup
 *   node run.js test          - Test mode
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COMMANDS = {
  generate: 'Generate AI daily report',
  setup: 'Run initial setup',
  test: 'Test mode (dry run)',
  status: 'Show current status',
  config: 'Show configuration',
  logs: 'Show recent logs'
};

function printHelp() {
  console.log('\n🤖 AI Daily Report Skill\n');
  console.log('Commands:');
  Object.entries(COMMANDS).forEach(([cmd, desc]) => {
    console.log(`  ${cmd.padEnd(15)} - ${desc}`);
  });
  console.log('\nUsage:');
  console.log('  node run.js <command>\n');
}

function runSetup() {
  console.log('\n🔧 Running setup...\n');

  try {
    if (process.platform === 'win32') {
      execSync('bash .claude/skills/ai-daily-report/setup.sh', { stdio: 'inherit' });
    } else {
      execSync('bash .claude/skills/ai-daily-report/setup.sh', { stdio: 'inherit' });
    }
    console.log('\n✅ Setup complete!\n');
  } catch (e) {
    console.error('\n❌ Setup failed:\n', e.message);
    process.exit(1);
  }
}

function runGenerate() {
  console.log('\n🚀 Generating AI Daily Report...\n');

  try {
    // Check if generate_report.js exists
    if (!fs.existsSync('generate_report.js')) {
      console.error('❌ generate_report.js not found in root directory');
      process.exit(1);
    }

    // Run the main script
    execSync('node generate_report.js', { stdio: 'inherit' });
    console.log('\n✅ Report generated successfully!\n');
  } catch (e) {
    console.error('\n❌ Generation failed:\n', e.message);
    process.exit(1);
  }
}

function runTest() {
  console.log('\n🧪 Running in test mode...\n');

  console.log('Checking environment:');
  console.log('  Node.js:', process.version);
  console.log('  Platform:', process.platform);
  console.log('  CWD:', process.cwd());
  console.log('');

  console.log('Checking required files:');
  const requiredFiles = [
    'generate_report.js',
    'ai_report_template.html',
    'package.json'
  ];

  requiredFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  });

  console.log('');
  console.log('Checking environment variables:');
  const envVars = ['GITHUB_USER', 'GITHUB_EMAIL', 'GITHUB_TOKEN', 'GITHUB_REPO'];
  envVars.forEach(v => {
    const exists = !!process.env[v];
    const value = exists ? '***' : '(not set)';
    console.log(`  ${exists ? '✅' : '❌'} ${v}: ${value}`);
  });

  console.log('');
  if (!process.env.GITHUB_TOKEN) {
    console.log('⚠️  GITHUB_TOKEN not set. Configuration required.');
    console.log('   Run: node run.js setup\n');
  } else {
    console.log('✅ Environment ready for report generation\n');
  }
}

function showStatus() {
  console.log('\n📊 Status Report\n');

  console.log('Configuration:');
  console.log(`  User: ${process.env.GITHUB_USER || '(not set)'}`);
  console.log(`  Email: ${process.env.GITHUB_EMAIL || '(not set)'}`);
  console.log(`  Token: ${process.env.GITHUB_TOKEN ? '✅ Set' : '❌ Not set'}`);
  console.log(`  Repo: ${process.env.GITHUB_REPO || '(not set)'}`);
  console.log('');

  console.log('Generated Reports:');
  const reportsDir = 'reports';
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

function showConfig() {
  console.log('\n⚙️  Configuration\n');

  console.log('Environment Variables:');
  const config = {
    GITHUB_USER: process.env.GITHUB_USER,
    GITHUB_EMAIL: process.env.GITHUB_EMAIL,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN ? '***' : '(not set)',
    GITHUB_REPO: process.env.GITHUB_REPO,
  };

  Object.entries(config).forEach(([k, v]) => {
    console.log(`  ${k}: ${v || '(not set)'}`);
  });

  console.log('\nTo set variables:');
  console.log('  export GITHUB_USER=bwchin98-bot');
  console.log('  export GITHUB_EMAIL=your@email.com');
  console.log('  export GITHUB_TOKEN=ghp_...');
  console.log('  export GITHUB_REPO=your-repo');
  console.log('');
}

function showLogs() {
  console.log('\n📋 Recent Activity\n');

  if (fs.existsSync('reports')) {
    const files = fs.readdirSync('reports')
      .filter(f => f.endsWith('.html'))
      .map(f => {
        const stat = fs.statSync(path.join('reports', f));
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

// Main
const command = process.argv[2];

if (!command || command === '--help' || command === '-h') {
  printHelp();
  process.exit(0);
}

switch (command) {
  case 'setup':
    runSetup();
    break;
  case 'generate':
    runGenerate();
    break;
  case 'test':
    runTest();
    break;
  case 'status':
    showStatus();
    break;
  case 'config':
    showConfig();
    break;
  case 'logs':
    showLogs();
    break;
  default:
    console.error(`❌ Unknown command: ${command}\n`);
    printHelp();
    process.exit(1);
}
