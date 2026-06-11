#!/usr/bin/env node

/**
 * Briefing Improver - Meta-Skill
 * Improves AI Daily Report via 3-stage pipeline
 *
 * ⓐ issue-writer: Detect weaknesses → Create Issues
 * ⓑ issue-runner: Fix issues → Close
 * ⓒ doc-optimizer: Optimize documentation
 */

const IssueWriter = require('./issue-writer');
const IssueRunner = require('./issue-runner');
const DocOptimizer = require('./doc-optimizer');

const VERSION = '1.0.0';

class BriefingImprover {
  constructor() {
    this.version = VERSION;
    this.issueWriter = new IssueWriter();
    this.issueRunner = new IssueRunner();
    this.docOptimizer = new DocOptimizer();
  }

  showHelp() {
    console.log('\n🚀 Briefing Improver v' + VERSION + '\n');
    console.log('Commands:');
    console.log('  scan       - ⓐ Scan project weaknesses → Create GitHub Issues');
    console.log('  fix        - ⓑ Fix identified issues → Close GitHub Issues');
    console.log('  optimize   - ⓒ Optimize documentation');
    console.log('  run        - Run all three in sequence (full pipeline)\n');
  }

  async scan() {
    console.log('\n🔍 Stage ⓐ: Issue Writer');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    try {
      const issues = await this.issueWriter.detectWeaknesses();
      const created = await this.issueWriter.createIssues(issues);

      console.log(`\n✅ Created ${created.length} GitHub Issues\n`);
      return created;
    } catch (error) {
      console.error(`❌ Scan failed: ${error.message}\n`);
      throw error;
    }
  }

  async fix() {
    console.log('\n🔨 Stage ⓑ: Issue Runner');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    try {
      const issues = await this.issueRunner.getOpenIssues();
      const fixed = await this.issueRunner.fixIssues(issues);
      const closed = await this.issueRunner.closeIssues(fixed);

      console.log(`\n✅ Fixed and closed ${closed.length} issues\n`);
      return closed;
    } catch (error) {
      console.error(`❌ Fix failed: ${error.message}\n`);
      throw error;
    }
  }

  async optimize() {
    console.log('\n📚 Stage ⓒ: Doc Optimizer');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    try {
      const suggestions = await this.docOptimizer.analyzeDocs();
      const improved = await this.docOptimizer.applyImprovements(suggestions);

      console.log(`\n✅ Applied ${improved.length} documentation improvements\n`);
      return improved;
    } catch (error) {
      console.error(`❌ Optimize failed: ${error.message}\n`);
      throw error;
    }
  }

  async run() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║         🚀 Briefing Improver Full Pipeline v' + VERSION + '          ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    const results = {};

    try {
      // Stage A
      console.log('📍 Stage ⓐ: Scanning weaknesses...');
      results.scan = await this.scan();

      // Stage B
      console.log('📍 Stage ⓑ: Fixing issues...');
      results.fix = await this.fix();

      // Stage C
      console.log('📍 Stage ⓒ: Optimizing docs...');
      results.optimize = await this.optimize();

      // Summary
      console.log('\n');
      console.log('╔════════════════════════════════════════════════════════╗');
      console.log('║                    ✅ PIPELINE COMPLETE                ║');
      console.log('╚════════════════════════════════════════════════════════╝\n');
      console.log(`Created Issues: ${results.scan.length}`);
      console.log(`Fixed Issues: ${results.fix.length}`);
      console.log(`Doc Improvements: ${results.optimize.length}\n`);

      return results;
    } catch (error) {
      console.error('\n❌ Pipeline failed:\n', error.message);
      process.exit(1);
    }
  }
}

// CLI
if (require.main === module) {
  const improver = new BriefingImprover();
  const command = process.argv[2];

  if (!command || command === 'help' || command === '-h' || command === '--help') {
    improver.showHelp();
  } else if (command === 'scan') {
    improver.scan().catch(() => process.exit(1));
  } else if (command === 'fix') {
    improver.fix().catch(() => process.exit(1));
  } else if (command === 'optimize') {
    improver.optimize().catch(() => process.exit(1));
  } else if (command === 'run') {
    improver.run().catch(() => process.exit(1));
  } else {
    console.error(`\n❌ Unknown command: ${command}\n`);
    improver.showHelp();
    process.exit(1);
  }
}

module.exports = BriefingImprover;
