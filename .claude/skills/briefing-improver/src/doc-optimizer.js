/**
 * Stage ⓒ: Doc Optimizer
 * Analyzes documentation → Suggests improvements
 */

const fs = require('fs');
const path = require('path');

class DocOptimizer {
  constructor() {
    this.docsToCheck = ['README.md', 'CLAUDE.md', 'SOUL.md'];
  }

  async analyzeDocs() {
    console.log('Analyzing documentation quality...\n');

    const suggestions = [];

    for (const doc of this.docsToCheck) {
      if (!fs.existsSync(doc)) {
        console.log(`⏭️  ${doc} not found, skipping\n`);
        continue;
      }

      console.log(`📄 Analyzing ${doc}...`);
      const content = fs.readFileSync(doc, 'utf8');
      const docSuggestions = await this.checkDoc(doc, content);

      docSuggestions.forEach(s => {
        console.log(`   ${s.icon} ${s.issue}`);
        suggestions.push(s);
      });
      console.log('');
    }

    return suggestions;
  }

  async checkDoc(filename, content) {
    const suggestions = [];

    // Check 1: Outdated links
    const deadLinks = this.checkLinks(content);
    deadLinks.forEach(link => {
      suggestions.push({
        doc: filename,
        icon: '🔗',
        issue: `Fix dead link: ${link}`,
        type: 'link'
      });
    });

    // Check 2: Missing sections
    const missingSections = this.checkSections(filename, content);
    missingSections.forEach(section => {
      suggestions.push({
        doc: filename,
        icon: '📝',
        issue: `Add missing section: ${section}`,
        type: 'structure'
      });
    });

    // Check 3: Readability issues
    const readabilityIssues = this.checkReadability(content);
    readabilityIssues.forEach(issue => {
      suggestions.push({
        doc: filename,
        icon: '👁️',
        issue: `Improve readability: ${issue}`,
        type: 'readability'
      });
    });

    // Check 4: Consistency
    const consistencyIssues = this.checkConsistency(filename, content);
    consistencyIssues.forEach(issue => {
      suggestions.push({
        doc: filename,
        icon: '🔄',
        issue: `Inconsistent: ${issue}`,
        type: 'consistency'
      });
    });

    return suggestions;
  }

  checkLinks(content) {
    const links = [];
    const urlRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = urlRegex.exec(content)) !== null) {
      const url = match[2];
      // Check if file exists for local links
      if (url.startsWith('.') || url.startsWith('#')) {
        if (url.startsWith('.') && !url.includes('http')) {
          const filePath = path.resolve(url);
          if (!fs.existsSync(filePath)) {
            links.push(url);
          }
        }
      }
    }

    return links;
  }

  checkSections(filename, content) {
    const sections = [];

    if (filename === 'README.md') {
      if (!content.includes('## ')) sections.push('Main sections');
      if (!content.includes('Quick Start') && !content.includes('시작')) {
        sections.push('Quick Start Guide');
      }
    }

    if (filename === 'CLAUDE.md') {
      if (!content.includes('파일 구조') && !content.includes('File Structure')) {
        sections.push('File Structure');
      }
      if (!content.includes('설정') && !content.includes('Configuration')) {
        sections.push('Configuration');
      }
    }

    return sections;
  }

  checkReadability(content) {
    const issues = [];

    // Check for very long paragraphs
    const paragraphs = content.split('\n\n');
    paragraphs.forEach((para, i) => {
      const lines = para.split('\n').length;
      if (lines > 10 && !para.startsWith('```')) {
        issues.push('Paragraph too long (simplify or break up)');
      }
    });

    // Check for code examples
    if (!content.includes('```')) {
      if (content.includes('command') || content.includes('function')) {
        issues.push('Add code examples');
      }
    }

    return [...new Set(issues)]; // Remove duplicates
  }

  checkConsistency(filename, content) {
    const issues = [];

    // Check heading consistency
    if (filename === 'README.md') {
      if (content.includes('## ') && content.includes('###')) {
        const h2Count = (content.match(/^## /gm) || []).length;
        const h3Count = (content.match(/^### /gm) || []).length;
        if (h2Count === 0) {
          issues.push('No level-2 headings found');
        }
      }
    }

    // Check formatting consistency
    if (content.includes('✅') && content.includes('✓')) {
      issues.push('Mixed checkmark styles (use ✅ consistently)');
    }

    // Check link style
    const externalLinks = content.match(/https?:\/\/[^\s)]+/g) || [];
    const markdownLinks = content.match(/\[[^\]]+\]\(https?:\/\/[^)]+\)/g) || [];

    if (externalLinks.length > 0 && markdownLinks.length > 0) {
      issues.push('Mixed link styles (use markdown links consistently)');
    }

    return issues;
  }

  async applyImprovements(suggestions) {
    console.log('Applying improvements...\n');

    const applied = [];

    // Group by document
    const byDoc = {};
    suggestions.forEach(s => {
      if (!byDoc[s.doc]) byDoc[s.doc] = [];
      byDoc[s.doc].push(s);
    });

    // Apply fixes
    for (const [doc, docSuggestions] of Object.entries(byDoc)) {
      try {
        let content = fs.readFileSync(doc, 'utf8');
        let modified = false;

        docSuggestions.forEach(suggestion => {
          // Auto-fix simple issues
          if (suggestion.type === 'consistency') {
            if (suggestion.issue.includes('checkmark')) {
              content = content.replace(/✓/g, '✅');
              modified = true;
              console.log(`  ✅ Fixed: ${suggestion.issue}`);
            }
          }

          if (suggestion.type === 'readability') {
            // This requires Claude's judgment, log as suggestion
            console.log(`  💡 Suggestion: ${suggestion.issue}`);
          }

          applied.push(suggestion);
        });

        if (modified) {
          fs.writeFileSync(doc, content, 'utf8');
        }
      } catch (error) {
        console.log(`  ❌ Error processing ${doc}: ${error.message}`);
      }
    }

    console.log('');
    return applied;
  }
}

module.exports = DocOptimizer;
