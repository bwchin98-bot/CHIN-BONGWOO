/**
 * Default Configuration
 * Skill default settings and constants
 */

module.exports = {
  // Skill Info
  skill: {
    name: 'AI Daily Report Generator',
    version: '4.0.0',
    status: 'Production Ready - Final Release ✅',
    author: 'bwchin98-bot',
    repository: 'https://github.com/bwchin98-bot/CHIN-BONGWOO',
  },

  // Required Environment Variables
  required_env: {
    GITHUB_USER: 'GitHub username',
    GITHUB_EMAIL: 'GitHub email address',
    GITHUB_TOKEN: 'Personal Access Token (repo scope)',
    GITHUB_REPO: 'Repository name',
  },

  // Optional Environment Variables
  optional_env: {
    REPORT_LANGUAGE: {
      default: 'ko',
      description: 'Report language (ko, en)',
      values: ['ko', 'en'],
    },
    REPORT_DESKTOP_SAVE: {
      default: true,
      description: 'Save reports to Desktop folder',
      values: [true, false],
    },
    SCHEDULE_TIME: {
      default: '09:00 UTC',
      description: 'Cron schedule time',
    },
  },

  // Report Configuration
  report: {
    title: '🤖 AI 업계 일일 동향 보고서',
    sections: [
      { id: 'news', title: '🔥 주요 뉴스', items: 5 },
      { id: 'models', title: '🤖 신규 모델 & 기술', items: 5 },
      { id: 'companies', title: '💼 기업 뉴스', items: 5 },
      { id: 'funding', title: '💰 펀딩 & 투자', items: 4 },
      { id: 'papers', title: '📄 주목할 논문', items: 5 },
      { id: 'repos', title: '🔥 트렌딩 저장소', items: 5 },
      { id: 'events', title: '📅 예정된 행사', items: 5 },
    ],
    totalItems: 34,
    template: 'ai_report_template.html',
  },

  // API Configuration
  apis: {
    hackernews: {
      name: 'Hacker News',
      url: 'https://hacker-news.firebaseio.com/v0',
      rateLimit: {
        requests: 30,
        period: 60000, // 1 minute
      },
    },
    arxiv: {
      name: 'arXiv',
      url: 'http://export.arxiv.org/api/query',
      rateLimit: {
        requests: 3,
        period: 1000, // 1 second
      },
    },
    github: {
      name: 'GitHub Search',
      url: 'https://api.github.com/search',
      rateLimit: {
        requests: 10,
        period: 60000, // 1 minute
      },
    },
    huggingface: {
      name: 'Hugging Face',
      url: 'https://huggingface.co/api',
      rateLimit: {
        requests: 100,
        period: 60000, // 1 minute
      },
    },
  },

  // Company Keywords for Filtering
  companies: [
    'Anthropic',
    'OpenAI',
    'Google',
    'Meta',
    'Microsoft',
    'DeepSeek',
    'xAI',
    'Claude',
  ],

  // File Paths
  paths: {
    root: process.cwd(),
    reports: './reports',
    template: './ai_report_template.html',
    desktop: {
      windows: 'Desktop/AI-Daily-Reports',
      unix: 'Desktop/AI-Daily-Reports',
    },
  },

  // Translations
  translations: {
    ko: {
      title: '🤖 AI 업계 일일 동향 보고서',
      summary: '📊 오늘의 요약',
      news: '🔥 주요 뉴스',
      models: '🤖 신규 모델 & 기술',
      companies: '💼 기업 뉴스',
      funding: '💰 펀딩 & 투자',
      papers: '📄 주목할 논문',
      repos: '🔥 트렌딩 저장소',
      events: '📅 예정된 행사',
      footer: '생성일',
      lastUpdate: '최종 업데이트',
      viewOnGithub: 'GitHub에서 보기',
    },
    en: {
      title: '🤖 AI Industry Daily Report',
      summary: '📊 Today\'s Summary',
      news: '🔥 Breaking News',
      models: '🤖 New Models & Technologies',
      companies: '💼 Company Updates',
      funding: '💰 Funding & Investments',
      papers: '📄 Notable Research Papers',
      repos: '🔥 Trending Repositories',
      events: '📅 Upcoming Events',
      footer: 'Generated on',
      lastUpdate: 'Last Updated',
      viewOnGithub: 'View on GitHub',
    },
  },

  // Events (Hardcoded)
  events: [
    { name: 'NeurIPS 2026', date: '2026-12-09', location: 'Vancouver, Canada' },
    { name: 'ICML 2026', date: '2026-07-23', location: 'Vienna, Austria' },
    { name: 'CVPR 2026', date: '2026-06-18', location: 'New York, USA' },
    { name: 'ACL 2026', date: '2026-08-09', location: 'Mexico City, Mexico' },
    { name: 'ICCV 2026', date: '2026-10-11', location: 'Paris, France' },
  ],

  // Logging
  logging: {
    level: 'info', // debug, info, warn, error
    timestamps: true,
    colors: true,
  },

  // GitHub Actions
  github_actions: {
    checkout_version: 'v5',
    node_version: '24',
    schedule: '0 9 * * *', // Daily at 09:00 UTC
  },
};
