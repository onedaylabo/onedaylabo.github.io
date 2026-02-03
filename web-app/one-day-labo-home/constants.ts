
import { Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Neon Streamer',
    description: 'ソーシャルメディアのトレンドをリアルタイムで可視化するツール。',
    longDescription: 'Neon Streamerは、ライブデータをキャプチャし、Three.jsを使用して没入感のある3Dビジュアライゼーションに変換します。マーケターがトレンドの予兆をいち早く察知するのを支援します。',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
    techStack: ['React', 'Three.js', 'WebSockets', 'Tailwind'],
    url: '#',
    category: 'Web App',
    date: '2024.03'
  },
  {
    id: '2',
    title: 'MindCanvas',
    description: 'AIを活用した、アイデア発想とマインドマッピングのアシスタント。',
    longDescription: 'MindCanvasは高度なLLMを統合し、複雑な思考をマッピングするのを助けます。関連概念の提案、ノードの自動カテゴリ化、セッションの要約生成など、創造性を最大化します。',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
    techStack: ['Next.js', 'Gemini API', 'Framer Motion'],
    url: '#',
    category: 'Experiment',
    date: '2024.01'
  },
  {
    id: '3',
    title: 'TaskFlow Pro',
    description: 'クリエイティブチームのための、ミニマルなタスク管理ツール。',
    longDescription: '認知負荷の軽減に特化したTaskFlow Proは、独自の空間的UIを採用。集中が必要な時間帯に通知を制限する機能により、ディープワーク（深い集中）を促進します。',
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800',
    techStack: ['TypeScript', 'React Query', 'PostgreSQL'],
    url: '#',
    category: 'Web App',
    date: '2023.11'
  },
  {
    id: '4',
    title: 'Chronos Lens',
    description: '数十年間にわたる歴史的な気象データの可視化プラットフォーム。',
    longDescription: 'インタラクティブなマップを通じて、過去50年間の気候変動が地域にどのような影響を与えたかを詳細なチャートと衛星写真の比較で確認できる教育ツールです。',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    techStack: ['D3.js', 'Mapbox', 'Python API'],
    url: '#',
    category: 'Utility',
    date: '2023.09'
  },
  {
    id: '5',
    title: 'Echo Harmony',
    description: '環境音を解析して生成される、プロセッサ・ミュージック・ジェネレーター。',
    longDescription: 'マイクで周囲の音を拾い、その響きをリアルタイムで穏やかなアンビエントミュージックに変換します。集中力の向上やリラクゼーションに最適です。',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800',
    techStack: ['Web Audio API', 'React', 'GLSL'],
    url: '#',
    category: 'Experiment',
    date: '2023.07'
  },
  {
    id: '6',
    title: 'Verba Labs',
    description: 'リアルタイムでの多言語書き起こしおよび翻訳システム。',
    longDescription: '国際的な研究者やビジネス向けに構築されたツールです。15以上の言語を同時に、高い精度で書き起こし、翻訳し、グローバルな対話をスムーズにします。',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
    techStack: ['Gemini API', 'React Native', 'AWS'],
    url: '#',
    category: 'Web App',
    date: '2023.05'
  }
];
