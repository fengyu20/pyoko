(() => {
  'use strict';

  const SUPPORTED_LANGUAGES = ['ja', 'en', 'zh'];
  const LANGUAGE_STORAGE_KEY = 'grutto-pass-lang';
  const LANGUAGE_QUERY_KEY = 'lang';
  const METADATA = {
    '/about/': {
      ja: {
        title: 'PYOKOについて｜ぐるっとパス非公式ガイド',
        description: '「今日、このあとどこへ行ける？」から始まったPYOKO。ぐるっとパスで次の一館を決めやすくするために、なぜ作ったのか、できること、個人で運営する非公式ガイドとしての考え方を紹介します。'
      },
      en: {
        title: 'About PYOKO | Unofficial Grutto Pass Guide',
        description: 'PYOKO began with one question: “Where can I go next today?” Learn why I built this independent Grutto Pass guide and how it helps with the small decisions between one stop and the next.'
      },
      zh: {
        title: '关于 PYOKO｜ぐるっとパス非官方个人指南',
        description: 'PYOKO 从“今天接下来还能去哪？”这个问题开始。这里介绍我为什么做这个非官方个人指南，以及它怎样帮助使用 ぐるっとパス 的人更轻松地决定下一站。'
      }
    },
    '/about/data/': {
      ja: {
        title: '情報・出典と判断について｜PYOKO',
        description: 'PYOKOがぐるっとパスや施設の公式情報をどう確認し、開館状況や展覧会、Pass条件をどう扱うか。出典、不確実な情報、最終入館、多言語情報について説明します。'
      },
      en: {
        title: 'Information, Sources and How PYOKO Decides | PYOKO',
        description: 'How PYOKO uses official Grutto Pass and venue information, handles opening rules and uncertainty, and keeps important information traceable to its source.'
      },
      zh: {
        title: '信息、来源与判断｜PYOKO',
        description: 'PYOKO 如何参考 ぐるっとパス 和各设施的官方信息，处理开馆规则、不确定状态、最晚入馆、展览与多语言信息，以及为什么重要信息应该可以追溯到原始来源。'
      }
    },
    '/about/pass-tracker/': {
      ja: {
        title: 'Pass Trackerと参考価値について｜PYOKO',
        description: 'PYOKOのPass Trackerで表示する「参考価値」の意味と考え方。実際の節約額との違い、未確認や概算をどう扱うかを説明します。'
      },
      en: {
        title: 'Pass Tracker and Reference Value | PYOKO',
        description: 'What “reference value” means in PYOKO Pass Tracker, how it differs from actual money saved, and why estimates and unverified values are kept distinct.'
      },
      zh: {
        title: 'Pass Tracker 和参考价值｜PYOKO',
        description: '解释 PYOKO Pass Tracker 中“参考价值”的含义，它为什么不等于实际省下的钱，以及未确认和概算为什么不会被当作确定数字。'
      }
    }
  };

  function normalizeLanguage(value) {
    const normalized = String(value || '').toLowerCase();
    if (normalized.startsWith('zh')) return 'zh';
    if (normalized.startsWith('en')) return 'en';
    return 'ja';
  }

  function readStoredLanguage() {
    try { return window.localStorage?.getItem(LANGUAGE_STORAGE_KEY) || ''; } catch { return ''; }
  }

  function initialLanguage() {
    let queryLanguage = '';
    try { queryLanguage = new URL(window.location.href).searchParams.get(LANGUAGE_QUERY_KEY) || ''; } catch {}
    if (queryLanguage) return normalizeLanguage(queryLanguage);
    const stored = readStoredLanguage();
    if (stored) return normalizeLanguage(stored);
    return normalizeLanguage(window.navigator?.language || 'ja');
  }

  function currentPagePath() {
    const pathname = window.location.pathname || '/about/';
    return pathname.endsWith('/') ? pathname : `${pathname}/`;
  }

  function pageMetadata(language) {
    const metadata = METADATA[currentPagePath()] || METADATA['/about/'];
    return metadata[language] || metadata.ja;
  }

  function setMetaContent(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.setAttribute('content', value);
  }

  let currentLanguage = initialLanguage();

  function applyMetadata() {
    const metadata = pageMetadata(currentLanguage);
    document.title = metadata.title;
    setMetaContent('meta[name="description"]', metadata.description);
    setMetaContent('meta[property="og:title"]', metadata.title);
    setMetaContent('meta[property="og:description"]', metadata.description);
    setMetaContent('meta[name="twitter:title"]', metadata.title);
    setMetaContent('meta[name="twitter:description"]', metadata.description);
  }

  function preserveLanguageOnLinks() {
    document.querySelectorAll('[data-about-language-link]').forEach(link => {
      const rawHref = link.getAttribute('href');
      if (!rawHref) return;
      try {
        const url = new URL(rawHref, window.location.href);
        url.searchParams.set(LANGUAGE_QUERY_KEY, currentLanguage);
        link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
      } catch {}
    });
  }

  function applyLanguage() {
    document.documentElement.lang = currentLanguage;
    document.querySelectorAll('[data-about-language]').forEach(section => {
      const active = section.dataset.aboutLanguage === currentLanguage;
      section.hidden = !active;
      section.setAttribute('aria-hidden', String(!active));
    });
    document.querySelectorAll('[data-about-lang]').forEach(button => {
      const active = button.dataset.aboutLang === currentLanguage;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-about-copy]').forEach(element => {
      element.textContent = element.dataset[currentLanguage] || element.dataset.ja || '';
    });
    document.querySelectorAll('[data-about-aria]').forEach(element => {
      const value = element.dataset[`${currentLanguage}Aria`] || element.dataset.jaAria || '';
      if (value) element.setAttribute('aria-label', value);
    });
    applyMetadata();
    preserveLanguageOnLinks();
  }

  function setLanguage(language) {
    const next = normalizeLanguage(language);
    if (!SUPPORTED_LANGUAGES.includes(next)) return;
    currentLanguage = next;
    try { window.localStorage?.setItem(LANGUAGE_STORAGE_KEY, next); } catch {}
    try {
      const url = new URL(window.location.href);
      url.searchParams.set(LANGUAGE_QUERY_KEY, next);
      window.history?.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    } catch {}
    applyLanguage();
  }

  document.querySelectorAll('[data-about-lang]').forEach(button => {
    button.addEventListener('click', () => setLanguage(button.dataset.aboutLang));
  });

  applyLanguage();
  window.getAboutLanguage = () => currentLanguage;
  window.setAboutLanguage = setLanguage;
})();
