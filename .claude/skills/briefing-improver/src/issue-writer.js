/**
 * Stage ⓐ: Issue Writer
 * Detects weaknesses → Creates GitHub Issues
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class IssueWriter {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    this.repo = process.env.GITHUB_REPO;
    this.user = process.env.GITHUB_USER;
    this.apiBase = 'api.github.com';
  }

  async detectWeaknesses() {
    console.log('Analyzing project structure...\n');

    const weaknesses = [];
    const rootDir = process.cwd();

    // Check 1: Code quality issues
    const codeIssues = await this.checkCodeQuality(rootDir);
    weaknesses.push(...codeIssues);

    // Check 2: Documentation gaps
    const docIssues = await this.checkDocumentation(rootDir);
    weaknesses.push(...docIssues);

    // Check 3: Test coverage
    const testIssues = await this.checkTesting(rootDir);
    weaknesses.push(...testIssues);

    // Check 4: Performance
    const perfIssues = await this.checkPerformance(rootDir);
    weaknesses.push(...perfIssues);

    console.log(`Found ${weaknesses.length} potential improvements:\n`);
    weaknesses.forEach((w, i) => {
      console.log(`  ${i + 1}. [${w.priority}] ${w.title}`);
    });
    console.log('');

    return weaknesses;
  }

  checkCodeQuality(dir) {
    const issues = [];

    // Check for console.log statements
    const files = this.findFiles(dir, '*.js');
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('console.log')) {
        issues.push({
          title: `Remove debug console.log in ${path.basename(file)}`,
          body: `File: ${file}\n\nConsole.log statements should be replaced with proper logging.`,
          priority: 'low',
          type: 'code-quality'
        });
      }
    });

    return issues;
  }

  checkDocumentation(dir) {
    const issues = [];
    const requiredDocs = ['README.md', 'CLAUDE.md', 'SOUL.md'];

    requiredDocs.forEach(doc => {
      if (!fs.existsSync(path.join(dir, doc))) {
        issues.push({
          title: `Missing documentation: ${doc}`,
          body: `Required documentation file is missing: ${doc}`,
          priority: 'high',
          type: 'documentation'
        });
      } else {
        // Check if doc is outdated
        const stat = fs.statSync(path.join(dir, doc));
        const daysOld = (Date.now() - stat.mtime) / (1000 * 60 * 60 * 24);
        if (daysOld > 30) {
          issues.push({
            title: `Update outdated documentation: ${doc}`,
            body: `${doc} hasn't been updated in ${Math.round(daysOld)} days`,
            priority: 'medium',
            type: 'documentation'
          });
        }
      }
    });

    return issues;
  }

  checkTesting(dir) {
    const issues = [];

    // Check for test files
    const testFiles = this.findFiles(dir, '*.test.js');
    if (testFiles.length === 0) {
      issues.push({
        title: 'Add unit tests for core modules',
        body: 'No test files found. Add tests for:\n- generate_report.js\n- API integrations\n- HTML template rendering',
        priority: 'medium',
        type: 'testing'
      });
    }

    return issues;
  }

  checkPerformance(dir) {
    const issues = [];

    // Check report generation size
    const reportsDir = path.join(dir, 'reports');
    if (fs.existsSync(reportsDir)) {
      const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.html'));
      if (files.length > 0) {
        const lastReport = path.join(reportsDir, files[files.length - 1]);
        const stat = fs.statSync(lastReport);
        const sizeKB = stat.size / 1024;

        if (sizeKB > 50) {
          issues.push({
            title: 'Optimize report generation performance',
            body: `Report size is ${sizeKB.toFixed(1)}KB. Consider:\n- Lazy loading images\n- CSS minification\n- HTML compression`,
            priority: 'low',
            type: 'performance'
          });
        }
      }
    }

    return issues;
  }

  async createIssues(weaknesses) {
    const created = [];

    for (const weakness of weaknesses) {
      try {
        const issue = await this.createGitHubIssue({
          title: weakness.title,
          body: weakness.body,
          labels: [weakness.type, weakness.priority]
        });

        console.log(`  ✅ Created: #${issue.number} - ${weakness.title}`);
        created.push(issue);
      } catch (error) {
        console.log(`  ❌ Failed: ${weakness.title} - ${error.message}`);
      }
    }

    return created;
  }

  createGitHubIssue(issueData) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.apiBase,
        path: `/repos/${this.user}/${this.repo}/issues`,
        method: 'POST',
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`API error: ${res.statusCode}`));
          }
        });
      });

      req.on('error', reject);
      req.write(JSON.stringify(issueData));
      req.end();
    });
  }

  findFiles(dir, pattern) {
    const files = [];
    const walkDir = (currentPath) => {
      try {
        fs.readdirSync(currentPath).forEach(file => {
          const fullPath = path.join(currentPath, file);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            // Skip hidden and node_modules
            if (!file.startsWith('.') && file !== 'node_modules') {
              walkDir(fullPath);
            }
          } else if (this.matchPattern(file, pattern)) {
            files.push(fullPath);
          }
        });
      } catch (err) {
        // Ignore permission errors
      }
    };

    walkDir(dir);
    return files;
  }

  matchPattern(filename, pattern) {
    const glob = pattern.replace('*', '.*');
    const regex = new RegExp(`^${glob}$`);
    return regex.test(filename);
  }
}

module.exports = IssueWriter;
