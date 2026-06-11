#!/usr/bin/env node

/**
 * AI Daily Report Generator Skill
 * Main Entry Point
 *
 * Usage:
 *   node index.js <command> [options]
 *   /ai-report <command> [options]
 */

const path = require('path');
const { execSync } = require('child_process');

const VERSION = '4.0.0';
const SKILL_NAME = 'AI Daily Report Generator';
const REPO = 'https://github.com/bwchin98-bot/CHIN-BONGWOO';

class AIReportSkill {
  constructor() {
    this.version = VERSION;
    this.name = SKILL_NAME;
    this.rootDir = path.resolve(__dirname, '..', '..', '..');
  }

  async run(command, args = []) {
    try {
      // CLI 핸들러로 위임
      const cliHandler = require('./cli');
      await cliHandler.execute(command, args);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  }

  getVersion() {
    return {
      skill: this.name,
      version: this.version,
      status: 'Production Ready - Final Release ✅',
      repository: REPO,
    };
  }

  getConfig() {
    return {
      required: ['GITHUB_USER', 'GITHUB_EMAIL', 'GITHUB_TOKEN', 'GITHUB_REPO'],
      optional: ['REPORT_LANGUAGE', 'REPORT_DESKTOP_SAVE', 'SCHEDULE_TIME'],
    };
  }
}

// CLI 실행
if (require.main === module) {
  const skill = new AIReportSkill();
  const command = process.argv[2] || 'help';
  const args = process.argv.slice(3);

  skill.run(command, args).catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = AIReportSkill;
