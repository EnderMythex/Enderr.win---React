export const translations = {
  en: {
    description: 'developer • trader<br>building stuff on the internet.',
    links: {
      twitter: 'twitter',
      discord: 'discord',
      axiom: 'axiom',
      invo: 'invo',
      status: 'status',
      projects: 'projects',
      trading: 'trading',
      email: 'email',
    },
    projects: {
      hint: 'click anywhere to go back',
      less: 'less',
      more: 'more',
      kinds: { repo: 'repository', website: 'website', extension: 'chrome extension' },
    },
    trading: {
      copy: 'copy',
      copied: 'copied!',
      cards: 'pnl cards',
      hint: 'click anywhere to go back',
    },
    copy: '© {year} - All rights reserved',
  },
  ja: {
    description: 'デベロッパー • トレーダー<br>インターネットで何かを作っています。',
    links: {
      twitter: 'twitter',
      discord: 'discord',
      axiom: 'axiom',
      invo: 'invo',
      status: 'ステータス',
      projects: 'プロジェクト',
      trading: 'トレード',
      email: 'メール',
    },
    projects: {
      hint: 'クリックで戻る',
      less: '少ない',
      more: '多い',
      kinds: { repo: 'リポジトリ', website: 'ウェブサイト', extension: 'chrome拡張' },
    },
    trading: {
      copy: 'コピー',
      copied: 'コピーしました',
      cards: 'pnlカード',
      hint: 'クリックで戻る',
    },
    copy: '© {year} - 無断転載禁止',
  },
  ru: {
    description: 'разработчик • трейдер<br>создаю вещи в интернете.',
    links: {
      twitter: 'twitter',
      discord: 'discord',
      axiom: 'axiom',
      invo: 'invo',
      status: 'статус',
      projects: 'проекты',
      trading: 'трейдинг',
      email: 'почта',
    },
    projects: {
      hint: 'нажмите для возврата',
      less: 'меньше',
      more: 'больше',
      kinds: { repo: 'репозиторий', website: 'сайт', extension: 'расширение chrome' },
    },
    trading: {
      copy: 'копировать',
      copied: 'скопировано!',
      cards: 'pnl карточки',
      hint: 'нажмите для возврата',
    },
    copy: '© {year} - Все права защищены',
  },
} as const;

export type Lang = keyof typeof translations;
export type Translation = (typeof translations)[Lang];

export const LANGS: Lang[] = ['en', 'ja', 'ru'];
export const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  ja: '日本語',
  ru: 'Русский',
};

export function getBrowserLang(): Lang {
  const lang = navigator.language.substring(0, 2);
  return (lang in translations ? lang : 'en') as Lang;
}

export function getInitialLang(): Lang {
  const saved = localStorage.getItem('lang');
  if (saved && saved in translations) return saved as Lang;
  return getBrowserLang();
}
