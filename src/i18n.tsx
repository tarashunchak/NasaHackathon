import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "uk" | "en";

const messages = {
  en: {
    appTitle: "Lunar site check",
    appSubtitle: "Sun and Earth at a landing site. Two scenarios, one timeline. UTC.",
    language: "Language",
    directions: "Compass directions",
    theme: "Theme",
    lightTheme: "Light",
    darkTheme: "Dark",
    howItWorks: "How it works",
    hide: "Hide",
    loadingSites: "Loading site data…",
    loadSitesError: "Could not load site data: ",
    play: "Play",
    pause: "Pause",
    timeRange: "Time from start of period",
    playbackSpeed: "Playback speed",
    site: "Site",
    customCoordinates: "Custom coordinates",
    latitude: "Latitude (°)",
    longitude: "Longitude (°E)",
    startDate: "Start date (UTC)",
    flatHorizon: "Flat horizon (°)",
    scenarioA: "Scenario A",
    scenarioB: "Scenario B",
    sky2d: "2D Sky",
    moon3d: "3D Moon",
    invalidDate: "Pick a valid date.",
    now: "Now",
    coordinateSource: "Coordinates:",
    manualCoordinates: "Coordinates entered by hand.",
    terrain: "Terrain:",
    terrainMask: "LOLA-derived mask, {count} azimuths.",
    terrainUploaded: "user-provided horizon profile, {count} azimuths.",
    terrainMissing: "no mask for this site; flat horizon used, so terrain shadows are not modelled.",
    explainPolesTitle: "Why the poles are hard",
    explainPolesBody: "The Moon's axis is tilted only about 1.5°, so near the south pole the Sun circles the horizon and never climbs more than a few degrees. Hills and crater rims decide who gets light, so a few kilometers or a few days can flip a site from lit to dark.",
    explainPowerTitle: "Power",
    explainPowerBody: "Panels need the Sun above the local horizon. A low Sun gives weak power and long shadows. There is no atmosphere, so no twilight: sunset is abrupt.",
    explainCommsTitle: "Communication",
    explainCommsBody: "A direct link needs Earth above the horizon. From the pole, Earth hugs the horizon and swings with libration, so it comes and goes over the month.",
    explainReadingTitle: "Reading the tool",
    explainReadingBody: "When a terrain profile is available, the curve marks the local horizon. Without one, the model assumes a flat 0° horizon. The Sun or Earth is visible above the local horizon.",
    sun: "Sun",
    earth: "Earth",
    chartCaption: "Elevation over 30 days. Click to jump.",
    dashedZero: "dashed = 0°",
    rotateHint: "Drag to rotate, scroll to zoom. Red dot: site. Ring: local horizon. Sun and Earth not to scale.",
    comparisonTitle: "A vs B, 30-day window",
    metric: "Metric",
    sunUp: "Sun up",
    earthUp: "Earth up",
    bothUp: "Sun and Earth together",
    longestSunGap: "Longest Sun gap",
    longestEarthGap: "Longest Earth gap",
    peakSunElevation: "Peak Sun elevation",
    betterNote: "Green: B is better for power or comms. Red: worse.",
    elevation: "Elevation",
    azimuth: "Azimuth",
    status: "Status",
    next30Days: "Up, next 30 d",
    longestGap: "Longest gap",
    aboveHorizon: "above horizon",
    belowHorizon: "below horizon",
    sets: "sets",
    rises: "rises",
    in: "in",
    moreThan: "more than",
    missionProfileTitle: "Mission constraints",
    missionProfileNote: "Screening thresholds only; this is not a spacecraft power-system model.",
    minSunElevation: "Minimum Sun elevation (°)",
    minPoweredHours: "Minimum usable sunlight (hours / 30 d)",
    maxEarthGap: "Maximum Earth outage (hours)",
    missionPass: "Within mission limits",
    missionReview: "Review mission limits",
    poweredHours: "Usable sunlight above threshold",
    earthOutage: "Longest Earth outage",
    meets: "Meets",
    misses: "Below target",
    operationalWindows: "Operational windows",
    solarWindows: "Usable sunlight",
    contactWindows: "Earth contact",
    jointWindows: "Sun + Earth",
    noWindows: "No upcoming windows in this period.",
    activeNow: "Now",
    periodContinues: "Beyond period",
    hourUnit: "h",
    resolutionNote: "Window boundaries are estimated from hourly samples (up to 1 h resolution).",
    shareExport: "Share and export",
    copyShareLink: "Copy scenario link",
    exportCsv: "Export CSV",
    shareLinkCopied: "Link copied. It includes both scenarios and mission limits.",
    shareLinkReady: "Copy the link below to share both scenarios and mission limits.",
    shareLinkLabel: "Shareable scenario link",
    csvScenario: "Scenario",
    csvSite: "Site",
    csvTime: "Time (UTC)",
    csvSunElevation: "Sun elevation (deg)",
    csvSunAzimuth: "Sun azimuth (deg)",
    csvSunVisible: "Sun visible",
    csvEarthElevation: "Earth elevation (deg)",
    csvEarthAzimuth: "Earth azimuth (deg)",
    csvEarthVisible: "Earth visible",
    csvPowerWindow: "Usable sunlight",
    csvNoSite: "Custom coordinates",
    horizonUpload: "Horizon profile (JSON)",
    horizonFormat: "Use an array of elevation angles or an object with a values array (degrees, evenly spaced around 360°).",
    horizonLoaded: "{count} horizon samples loaded",
    clearHorizon: "Remove horizon profile",
    horizonInvalid: "Invalid profile. Provide 12–4096 finite angles between −90° and 90°.",
    horizonTooLarge: "The profile file must be smaller than 2 MB.",
    webglUnavailable: "3D view is unavailable in this browser environment. The 2D horizon view is still available above.",
    calculating: "Updating calculations…",
  },
  uk: {
    appTitle: "Перевірка місячної ділянки",
    appSubtitle: "Сонце й Земля над місцем посадки. Два сценарії, спільна шкала часу. UTC.",
    language: "Мова",
    directions: "Сторони світу",
    theme: "Тема",
    lightTheme: "Світла",
    darkTheme: "Темна",
    howItWorks: "Як це працює",
    hide: "Сховати",
    loadingSites: "Завантаження даних ділянок…",
    loadSitesError: "Не вдалося завантажити дані ділянок: ",
    play: "Пуск",
    pause: "Пауза",
    timeRange: "Час від початку періоду",
    playbackSpeed: "Швидкість відтворення",
    site: "Ділянка",
    customCoordinates: "Власні координати",
    latitude: "Широта (°)",
    longitude: "Довгота (° сх. д.)",
    startDate: "Початок (UTC)",
    flatHorizon: "Рівний горизонт (°)",
    scenarioA: "Сценарій A",
    scenarioB: "Сценарій B",
    sky2d: "2D Небо",
    moon3d: "3D Місяць",
    invalidDate: "Оберіть коректну дату.",
    now: "Зараз",
    coordinateSource: "Джерело координат:",
    manualCoordinates: "Координати введено вручну.",
    terrain: "Рельєф:",
    terrainMask: "маска за даними LOLA, {count} напрямків азимута.",
    terrainUploaded: "власний профіль горизонту, {count} напрямків азимута.",
    terrainMissing: "для цієї ділянки маски немає; використовується рівний горизонт, тіні рельєфу не враховано.",
    explainPolesTitle: "Чому полюси складні",
    explainPolesBody: "Вісь Місяця нахилена лише приблизно на 1,5°, тому біля південного полюса Сонце рухається майже вздовж горизонту й піднімається лише на кілька градусів. Освітлення визначають пагорби та краї кратерів, тож зміщення на кілька кілометрів або днів може змінити освітлену ділянку на темну.",
    explainPowerTitle: "Енергозабезпечення",
    explainPowerBody: "Сонячним панелям потрібне Сонце над місцевим горизонтом. Низьке Сонце дає мало енергії та створює довгі тіні. Атмосфери немає, тож і сутінків теж: захід відбувається різко.",
    explainCommsTitle: "Зв’язок",
    explainCommsBody: "Для прямого зв’язку Земля має бути над горизонтом. Біля полюса вона майже торкається горизонту й коливається через лібрацію Місяця, тому протягом місяця з’являється та зникає.",
    explainReadingTitle: "Як читати схему",
    explainReadingBody: "За наявності профілю рельєфу крива показує місцевий обрій. Без нього модель припускає рівний горизонт 0°. Сонце або Земля видимі, коли вони вище місцевого обрію.",
    sun: "Сонце",
    earth: "Земля",
    chartCaption: "Висота над горизонтом за 30 діб. Натисніть на графік, щоб перейти до часу.",
    dashedZero: "пунктир — 0°",
    rotateHint: "Перетягуйте, щоб обертати; прокручуйте, щоб наблизити. Червона точка — ділянка, кільце — місцевий горизонт. Сонце й Земля не в масштабі.",
    comparisonTitle: "Порівняння за 30 діб",
    metric: "Показник",
    sunUp: "Сонце над горизонтом",
    earthUp: "Земля над горизонтом",
    bothUp: "Сонце й Земля одночасно",
    longestSunGap: "Найдовше без Сонця",
    longestEarthGap: "Найдовше без Землі",
    peakSunElevation: "Максимальна висота Сонця",
    betterNote: "Зелений: сценарій B кращий для енергозабезпечення чи зв’язку. Червоний: гірший.",
    elevation: "Висота",
    azimuth: "Азимут",
    status: "Стан",
    next30Days: "Над горизонтом, 30 діб",
    longestGap: "Найдовша перерва",
    aboveHorizon: "над горизонтом",
    belowHorizon: "під горизонтом",
    sets: "захід",
    rises: "схід",
    in: "за",
    moreThan: "понад",
    missionProfileTitle: "Обмеження місії",
    missionProfileNote: "Це пороги для попереднього відбору, а не модель енергосистеми апарата.",
    minSunElevation: "Мінімальна висота Сонця (°)",
    minPoweredHours: "Мінімум придатного сонячного часу (год / 30 діб)",
    maxEarthGap: "Максимальна перерва зв’язку із Землею (год)",
    missionPass: "Вимоги місії виконано",
    missionReview: "Перевірте обмеження місії",
    poweredHours: "Придатне сонячне освітлення вище порога",
    earthOutage: "Найдовша перерва зв’язку із Землею",
    meets: "Виконано",
    misses: "Не виконано",
    operationalWindows: "Операційні вікна",
    solarWindows: "Придатне сонячне освітлення",
    contactWindows: "Зв’язок із Землею",
    jointWindows: "Сонце й Земля одночасно",
    noWindows: "У цьому періоді більше немає вікон.",
    activeNow: "Зараз",
    periodContinues: "Поза періодом",
    hourUnit: "год",
    resolutionNote: "Межі вікон оцінено за погодинними даними (точність до 1 год).",
    shareExport: "Поширення й експорт",
    copyShareLink: "Копіювати посилання на сценарії",
    exportCsv: "Експортувати CSV",
    shareLinkCopied: "Посилання скопійовано. Воно містить обидва сценарії та обмеження місії.",
    shareLinkReady: "Скопіюйте посилання нижче, щоб поділитися сценаріями й обмеженнями місії.",
    shareLinkLabel: "Посилання для поширення сценаріїв",
    csvScenario: "Сценарій",
    csvSite: "Ділянка",
    csvTime: "Час (UTC)",
    csvSunElevation: "Висота Сонця (град.)",
    csvSunAzimuth: "Азимут Сонця (град.)",
    csvSunVisible: "Сонце видиме",
    csvEarthElevation: "Висота Землі (град.)",
    csvEarthAzimuth: "Азимут Землі (град.)",
    csvEarthVisible: "Земля видима",
    csvPowerWindow: "Придатне сонячне освітлення",
    csvNoSite: "Власні координати",
    horizonUpload: "Профіль горизонту (JSON)",
    horizonFormat: "Масив кутів висоти або об’єкт із масивом values (градуси, рівномірно для 360°).",
    horizonLoaded: "Завантажено значень горизонту: {count}",
    clearHorizon: "Видалити профіль горизонту",
    horizonInvalid: "Некоректний профіль. Потрібно 12–4096 скінченних кутів від −90° до 90°.",
    horizonTooLarge: "Розмір файлу профілю має бути меншим за 2 МБ.",
    webglUnavailable: "3D-вигляд недоступний у цьому середовищі браузера. 2D-схема горизонту доступна вище.",
    calculating: "Оновлення розрахунків…",
  },
} as const;

export type TranslationKey = keyof typeof messages.en;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "uk",
  setLocale: () => undefined,
  t: (key) => messages.uk[key],
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const urlLocale = new URLSearchParams(window.location.search).get("lang");
      if (urlLocale === "en" || urlLocale === "uk") return urlLocale;
      return localStorage.getItem("lunar-planner-locale") === "en" ? "en" : "uk";
    } catch {
      return "uk";
    }
  });
  const setLocale = useCallback((nextLocale: Locale) => {
    if (nextLocale === locale) return;
    document.documentElement.classList.add("locale-changing");
    setLocaleState(nextLocale);
    window.setTimeout(() => document.documentElement.classList.remove("locale-changing"), 180);
  }, [locale]);
  const t = useCallback((key: TranslationKey) => messages[locale][key], [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = messages[locale].appTitle;
    const url = new URL(window.location.href);
    if (url.searchParams.has("lang") && url.searchParams.get("lang") !== locale) {
      url.searchParams.set("lang", locale);
      window.history.replaceState(null, "", url);
    }
    try {
      localStorage.setItem("lunar-planner-locale", locale);
    } catch {
      // Storage may be unavailable in private browsing contexts.
    }
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}