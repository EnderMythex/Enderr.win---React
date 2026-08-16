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
      stats: 'stats',
      email: 'email',
    },
    projects: {
      hint: 'click anywhere to go back',
      less: 'less',
      more: 'more',
    },
    stats: {
      replies: 'replies',
      likes: 'likes',
      claims: 'claims',
      flames: 'flames',
      hint: 'click anywhere to go back',
      lastAction: 'last action: {action} • {time}',
      never: 'never',
      offline: 'stats offline',
      loading: '…',
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
      stats: '統計',
      email: 'メール',
    },
    projects: {
      hint: 'クリックで戻る',
      less: '少ない',
      more: '多い',
    },
    stats: {
      replies: 'リプライ',
      likes: 'いいね',
      claims: 'クレーム',
      flames: 'フレーム',
      hint: 'クリックで戻る',
      lastAction: '最終アクション: {action} • {time}',
      never: 'なし',
      offline: '統計オフライン',
      loading: '…',
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
      stats: 'статистика',
      email: 'почта',
    },
    projects: {
      hint: 'нажмите для возврата',
      less: 'меньше',
      more: 'больше',
    },
    stats: {
      replies: 'ответы',
      likes: 'лайки',
      claims: 'клеймы',
      flames: 'огни',
      hint: 'нажмите для возврата',
      lastAction: 'последнее действие: {action} • {time}',
      never: 'никогда',
      offline: 'статистика недоступна',
      loading: '…',
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
