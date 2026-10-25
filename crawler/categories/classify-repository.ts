import { Repository, CategorySummary } from '../../types/repository';

export interface CategoryRule {
  id: string;
  name: string;
  description: string;
  iconName: string;
  topicKeywords: string[];
  textKeywords: string[];
  languages?: string[];
}

export const CATEGORY_DEFINITIONS: CategoryRule[] = [
  {
    id: 'ai',
    name: 'AI',
    description: 'Artificial intelligence, LLMs, neural networks, and generative models',
    iconName: 'Sparkles',
    topicKeywords: ['ai', 'artificial-intelligence', 'llm', 'gpt', 'transformers', 'deep-learning', 'neural-network', 'openai', 'ollama', 'stable-diffusion', 'rag', 'agent', 'claude', 'gemini', 'lora'],
    textKeywords: ['artificial intelligence', 'large language model', 'neural network', 'llm', 'gpt', 'deep learning', 'embeddings', 'transformer', 'agentic', 'langchain'],
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    description: 'Statistical learning, data science, training pipelines, and inference engines',
    iconName: 'Cpu',
    topicKeywords: ['machine-learning', 'data-science', 'pytorch', 'tensorflow', 'scikit-learn', 'keras', 'onnx', 'cuda', 'training', 'inference'],
    textKeywords: ['machine learning', 'data science', 'pytorch', 'tensorflow', 'model inference', 'dataset training', 'scikit'],
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    description: 'Security testing, exploit tools, cryptography, threat analysis, and pentesting',
    iconName: 'Shield',
    topicKeywords: ['security', 'cybersecurity', 'cyber', 'burp', 'burpsuite', 'burp-suite', 'cve', 'exploit', 'pentest', 'pentesting', 'vulnerability', 'infosec', 'hacker', 'ctf', 'cryptography', 'auth', 'firewall', 'malware', 'vpn-security', 'redteam', 'blueteam', 'osint', 'payload', 'scanner', 'fuzzing', 'reversing', 'reverse-engineering'],
    textKeywords: ['vulnerability', 'pentesting', 'exploit', 'cybersecurity', 'cyber security', 'cyber', 'burp suite', 'burpsuite', 'burp extension', 'cryptography', 'infosec', 'firewall', 'burp', 'osint', 'malware analysis', 'reverse engineering', 'packet inspection', 'penetration testing', 'payload'],
  },
  {
    id: 'developer-tools',
    name: 'Developer Tools',
    description: 'Compilers, linters, debuggers, SDKs, formatters, and IDE utilities',
    iconName: 'Wrench',
    topicKeywords: ['developer-tools', 'devtools', 'sdk', 'linter', 'compiler', 'debugger', 'formatter', 'bundler', 'parser', 'editor', 'vim', 'neovim', 'lsp'],
    textKeywords: ['developer tools', 'devtools', 'compiler', 'linter', 'language server', 'code editor', 'sdk client', 'parser'],
  },
  {
    id: 'cli',
    name: 'CLI',
    description: 'Command-line tools, terminal utilities, shell scripts, and TUI apps',
    iconName: 'Terminal',
    topicKeywords: ['cli', 'command-line', 'terminal', 'tui', 'shell', 'bash', 'zsh', 'console', 'cli-tool'],
    textKeywords: ['command line', 'command-line', 'terminal interface', 'terminal app', 'cli tool', 'interactive tui', 'shell utility'],
  },
  {
    id: 'devops',
    name: 'DevOps',
    description: 'Continuous integration, delivery pipelines, monitoring, and container tooling',
    iconName: 'Workflow',
    topicKeywords: ['devops', 'ci-cd', 'docker', 'actions', 'github-actions', 'gitea-actions', 'runner', 'pipeline', 'helm', 'ansible', 'terraform', 'jenkins'],
    textKeywords: ['continuous integration', 'ci/cd', 'docker container', 'gitea runner', 'pipeline automation', 'ansible playbook', 'terraform module'],
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    description: 'Cloud systems, orchestration, distributed systems, servers, and clustering',
    iconName: 'Server',
    topicKeywords: ['infrastructure', 'kubernetes', 'k8s', 'server', 'cluster', 'cloud', 'distributed-systems', 'storage', 's3', 'load-balancer', 'dns'],
    textKeywords: ['infrastructure', 'kubernetes cluster', 'cloud native', 'distributed storage', 'server architecture', 'bare metal'],
  },
  {
    id: 'databases',
    name: 'Databases',
    description: 'Relational databases, NoSQL, ORM, key-value stores, and caching layers',
    iconName: 'Database',
    topicKeywords: ['database', 'databases', 'sql', 'nosql', 'postgres', 'postgresql', 'mysql', 'sqlite', 'redis', 'orm', 'migration', 'mongodb', 'tidb', 'kv-store'],
    textKeywords: ['database engine', 'orm library', 'object relational', 'sql query', 'postgres client', 'sqlite database', 'redis cache'],
  },
  {
    id: 'web',
    name: 'Web',
    description: 'Frontend frameworks, fullstack web apps, web components, and WASM',
    iconName: 'Globe',
    topicKeywords: ['web', 'frontend', 'backend', 'react', 'vue', 'nextjs', 'svelte', 'html', 'css', 'javascript', 'typescript', 'wasm', 'webassembly', 'tailwind'],
    textKeywords: ['web application', 'frontend framework', 'fullstack web', 'react component', 'web service', 'rest api server'],
  },
  {
    id: 'mobile',
    name: 'Mobile',
    description: 'iOS, Android, React Native, Flutter, and cross-platform mobile apps',
    iconName: 'Smartphone',
    topicKeywords: ['mobile', 'android', 'ios', 'flutter', 'react-native', 'swift', 'kotlin', 'apk', 'mobile-app'],
    textKeywords: ['mobile application', 'android app', 'ios app', 'flutter app', 'react native'],
  },
  {
    id: 'self-hosted',
    name: 'Self-hosted',
    description: 'Homelab software, private cloud, home servers, and personal productivity services',
    iconName: 'Home',
    topicKeywords: ['self-hosted', 'homelab', 'homeserver', 'nas', 'private-cloud', 'owncloud', 'nextcloud', 'selfhosted'],
    textKeywords: ['self-hosted', 'self hosted', 'homelab', 'private cloud server', 'home assistant', 'media server'],
  },
  {
    id: 'automation',
    name: 'Automation',
    description: 'Bots, task runners, workflow engines, scrapers, and event handlers',
    iconName: 'Bot',
    topicKeywords: ['automation', 'bot', 'crawler', 'scraper', 'workflow', 'telegram-bot', 'discord-bot', 'scheduler'],
    textKeywords: ['automation bot', 'automated workflow', 'web crawler', 'web scraper', 'discord bot', 'cron scheduler'],
  },
  {
    id: 'networking',
    name: 'Networking',
    description: 'Proxies, VPN, WireGuard, P2P protocols, HTTP proxies, and socket servers',
    iconName: 'Network',
    topicKeywords: ['networking', 'network', 'vpn', 'wireguard', 'proxy', 'socks5', 'tcp', 'udp', 'p2p', 'torrent', 'websocket', 'router', 'traffic'],
    textKeywords: ['networking protocol', 'vpn client', 'proxy server', 'wireguard config', 'peer-to-peer', 'traffic forwarder'],
  },
  {
    id: 'games',
    name: 'Games',
    description: 'Game development, game engines, graphics, shaders, and interactive entertainment',
    iconName: 'Gamepad2',
    topicKeywords: ['game', 'games', 'gamedev', 'engine', 'godot', 'unity', 'opengl', 'webgl', 'vulkan', 'sdl', '2d-game', '3d-game'],
    textKeywords: ['game development', 'game engine', 'pixel art game', 'opengl renderer', 'interactive game'],
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Learning materials, cheat sheets, tutorials, book examples, and roadmaps',
    iconName: 'GraduationCap',
    topicKeywords: ['education', 'tutorial', 'learn', 'awesome-list', 'roadmap', 'course', 'cheatsheet', 'algorithms', 'study'],
    textKeywords: ['learning guide', 'curated list', 'awesome list', 'tutorial series', 'study guide', 'educational course'],
  },
];

/**
 * Deterministically classifies a repository into one or more categories.
 */
export function classifyRepository(repo: Partial<Repository>): string[] {
  const matches = new Set<string>();
  const topics = (repo.topics || []).map(t => t.toLowerCase());
  const textCorpus = `${repo.name || ''} ${repo.fullName || ''} ${repo.description || ''}`.toLowerCase();

  for (const cat of CATEGORY_DEFINITIONS) {
    // Check topics
    const hasMatchingTopic = cat.topicKeywords.some(keyword =>
      topics.some(t => t === keyword || t.includes(keyword))
    );

    if (hasMatchingTopic) {
      matches.add(cat.id);
      continue;
    }

    // Check text keywords in name or description
    const hasMatchingText = cat.textKeywords.some(keyword =>
      textCorpus.includes(keyword)
    );

    if (hasMatchingText) {
      matches.add(cat.id);
    }
  }

  // If no specific category matched, classify as 'other'
  if (matches.size === 0) {
    matches.add('other');
  }

  return Array.from(matches);
}

/**
 * Builds CategorySummary entities across the repository collection.
 */
export function buildCategorySummaries(repos: Repository[]): CategorySummary[] {
  const summaries: Record<string, CategorySummary> = {};

  for (const cat of CATEGORY_DEFINITIONS) {
    summaries[cat.id] = {
      id: cat.id,
      name: cat.name,
      description: cat.description,
      count: 0,
      totalStars: 0,
      iconName: cat.iconName,
      topRepositories: [],
    };
  }

  // Add 'other'
  summaries['other'] = {
    id: 'other',
    name: 'Other',
    description: 'Uncategorized and emerging open-source software',
    count: 0,
    totalStars: 0,
    iconName: 'Folder',
    topRepositories: [],
  };

  for (const repo of repos) {
    const cats = repo.categories && repo.categories.length > 0 ? repo.categories : ['other'];
    for (const catId of cats) {
      if (!summaries[catId]) {
        summaries[catId] = {
          id: catId,
          name: catId,
          description: '',
          count: 0,
          totalStars: 0,
          iconName: 'Folder',
          topRepositories: [],
        };
      }
      summaries[catId].count++;
      summaries[catId].totalStars += repo.stars;
      if (summaries[catId].topRepositories.length < 5) {
        summaries[catId].topRepositories.push(repo.fullName);
      }
    }
  }

  return Object.values(summaries).sort((a, b) => b.count - a.count);
}
