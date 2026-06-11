#!/bin/bash

# AI Daily Report Skill - Setup Script

set -e

echo "🤖 AI Daily Report Generator - Setup"
echo "===================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is required but not installed."
  echo "   Install from: https://nodejs.org/"
  exit 1
fi

echo "✅ Node.js $(node --version)"
echo ""

# Check git
if ! command -v git &> /dev/null; then
  echo "❌ Git is required but not installed."
  exit 1
fi

echo "✅ Git installed"
echo ""

# Create .claude directory if not exists
mkdir -p .claude/skills/ai-daily-report

echo "📁 Directory structure ready"
echo ""

# Check if files exist
if [ ! -f "generate_report.js" ]; then
  echo "⚠️  generate_report.js not found"
  echo "   Please copy the main script to repository root"
  exit 1
fi

if [ ! -f "ai_report_template.html" ]; then
  echo "⚠️  ai_report_template.html not found"
  echo "   Please copy the template to repository root"
  exit 1
fi

if [ ! -f "package.json" ]; then
  echo "⚠️  package.json not found"
  echo "   Please copy package.json to repository root"
  exit 1
fi

echo "✅ Required files found"
echo ""

# Install dependencies
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install axios cheerio dotenv
  echo "✅ Dependencies installed"
else
  echo "✅ Dependencies already installed"
fi

echo ""
echo "🔐 GitHub Configuration"
echo "======================================"
echo ""
echo "You need to set these environment variables:"
echo ""
echo "1. GITHUB_USER"
echo "   Your GitHub username (e.g., bwchin98-bot)"
echo ""
echo "2. GITHUB_EMAIL"
echo "   Your GitHub email (e.g., bwchin98@gmail.com)"
echo ""
echo "3. GITHUB_TOKEN"
echo "   Personal Access Token from https://github.com/settings/tokens"
echo "   Required scopes: repo, workflow"
echo ""
echo "4. GITHUB_REPO"
echo "   Repository name (e.g., CHIN-BONGWOO)"
echo ""

# Create .env.example if not exists
if [ ! -f ".env.example" ]; then
  cat > .env.example << 'EOF'
# GitHub Configuration
GITHUB_USER=your-username
GITHUB_EMAIL=your-email@example.com
GITHUB_TOKEN=ghp_your_token_here
GITHUB_REPO=your-repo-name

# Optional
SCHEDULE_TIME="0 9 * * *"
EOF
  echo "✅ Created .env.example"
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables (see above)"
echo "2. Run: node generate_report.js (to test)"
echo "3. Run: git push (to upload to GitHub)"
echo "4. Configure GitHub Actions Secrets (see README.md)"
echo ""
