// Generates the two profile cards (stats + top languages) in the old
// github-readme-stats look, but with our own data and our own token.
//
// Why this exists: the public github-readme-stats instances are rate-limited
// (they returned 503 / empty cards), and their "Total Commits" is a one-year
// number while "Contributed to" counts only the last year and skips your own
// repositories. Here every total is all-time, from the same GraphQL data the
// GitHub profile shows, and the SVGs are committed to this repository.
//
// The card layout itself comes from the (now frozen) github-readme-stats
// renderer, pinned in package.json, so the result keeps the old look.
//
// Usage: GITHUB_TOKEN=... PROFILE_USER=Awaynos node scripts/cards.mjs

import fs from "node:fs";
import path from "node:path";

import { calculateRank } from "github-readme-stats/src/calculateRank.js";
import { renderStatsCard } from "github-readme-stats/src/cards/stats.js";
import { renderTopLanguages } from "github-readme-stats/src/cards/top-languages.js";

const login = process.env.PROFILE_USER || "Awaynos";
const token = process.env.GITHUB_TOKEN || process.env.PAT_1;
const outDir = path.resolve("profile-cards");

if (!token) {
  throw new Error("GITHUB_TOKEN (or PAT_1) is required");
}

async function gql(query, variables) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "Awaynos-profile-cards",
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.errors || !json.data) {
    const detail = json.errors
      ? JSON.stringify(json.errors)
      : json.message || `HTTP ${response.status}`;
    throw new Error(`GitHub API: ${detail}`);
  }
  return json.data;
}

const PROFILE_QUERY = `
query($login: String!) {
  user(login: $login) {
    id
    login
    followers { totalCount }
    issues(first: 1) { totalCount }
    pullRequests(first: 1) { totalCount }
    repositoriesContributedTo(first: 1, includeUserRepositories: true,
      contributionTypes: [COMMIT, PULL_REQUEST, ISSUE, REPOSITORY]) {
      totalCount
    }
    contributionsCollection {
      contributionYears
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
      totalCount
      nodes {
        name
        nameWithOwner
        stargazerCount
        primaryLanguage { name color }
      }
    }
  }
}`;

// GitHub's own commit attribution, summed over every contribution year. This
// is the number GitHub prints next to "Commits" in the profile's contribution
// panel. Counting history(author: {id}) per repository undercounts commits
// made with an email that is linked to the profile but not matched by that
// filter (eft-map-overlay and QTranslate-R-old were 31 commits short), and
// totalCommitContributions alone can hide private commits when the profile's
// private-contribution setting is off.
async function contributionCommits(user) {
  const years = user.contributionsCollection.contributionYears;
  if (years.length === 0) {
    return { repoCommits: [], days: [] };
  }

  const aliases = years
    .map(
      (year, index) =>
        `y${index}: contributionsCollection(from: "${year}-01-01T00:00:00Z", ` +
        `to: "${year}-12-31T23:59:59Z") { ` +
        `commitContributionsByRepository(maxRepositories: 100) { ` +
        `repository { nameWithOwner primaryLanguage { name color } } ` +
        `contributions { totalCount } } ` +
        `contributionCalendar { weeks { contributionDays { date contributionCount } } } }`,
    )
    .join("\n");

  const data = await gql(
    `query($login: String!) { user(login: $login) { ${aliases} } }`,
    { login },
  );

  const repositories = new Map();
  const days = new Map();
  for (const year of Object.values(data.user)) {
    for (const entry of year.commitContributionsByRepository) {
      if (!entry.repository) {
        continue;
      }
      const key = entry.repository.nameWithOwner;
      const current = repositories.get(key) ?? {
        nameWithOwner: key,
        commits: 0,
        language: entry.repository.primaryLanguage,
      };
      current.commits += entry.contributions.totalCount;
      current.language ??= entry.repository.primaryLanguage;
      repositories.set(key, current);
    }
    for (const week of year.contributionCalendar.weeks) {
      for (const day of week.contributionDays) {
        days.set(day.date, day.contributionCount);
      }
    }
  }
  return {
    repoCommits: [...repositories.values()],
    days: [...days]
      .map(([date, contributionCount]) => ({ date, contributionCount }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}

// Top languages are counted by authored commits, not by file size: a single
// config repository with generated QML files (ii-config, ~31 MB) otherwise
// outweighs every source repository and reports QML as 86% of the profile.
//
// Each repository is attributed to its primary language, which is the same
// coarse split GitHub's own "most commit language" card uses.
function languageCommits(repoCommits) {
  const languages = {};
  for (const { language, commits } of repoCommits) {
    if (!language || commits === 0) {
      continue;
    }
    const { name, color } = language;
    languages[name] ??= { name, color, size: 0, count: 0 };
    languages[name].size += commits;
    languages[name].count += 1;
  }
  return languages;
}

// The streak card that used to come from streak-stats.demolab.com. Same
// three-column layout and catppuccin-mocha accents, but rendered here from
// the contribution calendars so no external service can blank it out.
function dayNumber(date) {
  return Math.floor(Date.parse(`${date}T00:00:00Z`) / 86400000);
}

function streakStats(days) {
  const active = [
    ...new Set(
      days
        .filter((day) => day.contributionCount > 0)
        .map((day) => dayNumber(day.date)),
    ),
  ].sort((a, b) => a - b);
  const today = Math.floor(Date.now() / 86400000);
  const past = active.filter((number) => number <= today);

  let longest = 0;
  let run = 0;
  let longestStart = 0;
  let longestEnd = 0;
  for (let index = 0; index < past.length; index += 1) {
    run = index > 0 && past[index] === past[index - 1] + 1 ? run + 1 : 1;
    if (run > longest) {
      longest = run;
      longestStart = past[index] - run + 1;
      longestEnd = past[index];
    }
  }

  let current = 0;
  let currentStart = 0;
  let currentEnd = 0;
  const last = past[past.length - 1];
  if (last !== undefined && last >= today - 1) {
    current = 1;
    currentStart = last;
    currentEnd = last;
    for (
      let index = past.length - 2;
      index >= 0 && past[index] === past[index + 1] - 1;
      index -= 1
    ) {
      current += 1;
      currentStart = past[index];
    }
  }

  return {
    total: days.reduce((sum, day) => sum + day.contributionCount, 0),
    first: active[0],
    current,
    currentStart,
    currentEnd,
    longest,
    longestStart,
    longestEnd,
  };
}

const ruDate = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const ruShortDate = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

function formatDay(number, withYear = false) {
  const date = new Date(number * 86400000);
  return (withYear ? ruDate : ruShortDate).format(date);
}

function formatRange(start, end) {
  if (!start) {
    return "—";
  }
  const sameYear =
    new Date(start * 86400000).getUTCFullYear() ===
    new Date(end * 86400000).getUTCFullYear();
  return `${formatDay(start, !sameYear)} - ${formatDay(end, !sameYear)}`;
}

function renderStreakCard(days) {
  const streak = streakStats(days);
  const totalRange =
    streak.first === undefined
      ? "—"
      : `${formatDay(streak.first, true)} - Сейчас`;
  const currentRange =
    streak.current > 0 ? formatRange(streak.currentStart, streak.currentEnd) : "—";
  const longestRange =
    streak.longest > 0 ? formatRange(streak.longestStart, streak.longestEnd) : "—";
  const column = (x, value, label, dates, color) => `
  <text x="${x}" y="80" text-anchor="middle" class="num" fill="${color}">${value}</text>
  <text x="${x}" y="116" text-anchor="middle" class="label" fill="${color}">${label}</text>
  <text x="${x}" y="146" text-anchor="middle" class="dates" fill="#bac2de">${dates}</text>`;

  return `<svg width="600" height="195" viewBox="0 0 600 195" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Серия коммитов">
  <title>Серия коммитов</title>
  <style>
    .num { font: 700 28px 'Segoe UI', Ubuntu, sans-serif; }
    .label { font: 400 14px 'Segoe UI', Ubuntu, sans-serif; }
    .dates { font: 400 12px 'Segoe UI', Ubuntu, sans-serif; }
  </style>
  <rect x="0.5" y="0.5" width="599" height="194" rx="6" fill="#1e1e2e"/>
  <line x1="200" y1="28" x2="200" y2="170" stroke="#313244" stroke-width="1"/>
  <line x1="400" y1="28" x2="400" y2="170" stroke="#313244" stroke-width="1"/>
  <g transform="translate(288, 16) scale(1.5)" fill="#94e2d5">
    <path d="M7.998 14.5c2.832 0 5-1.98 5-4.5 0-1.463-.68-2.19-1.879-3.383l-.036-.037c-1.013-1.008-2.3-2.29-2.834-4.434-.322.256-.63.579-.864.953-.432.696-.621 1.58-.046 2.73.473.943.114 1.5-.455 1.5-.638 0-1.18-.504-1.48-1.089a3.645 3.645 0 0 1-.346-1.323 3.9 3.9 0 0 0-.6.961c-.563.767-.895 1.636-.895 2.622 0 2.52 2.168 4.5 5 4.5z"/>
  </g>${column(100, streak.total, "Общий вклад", totalRange, "#cba6f7")}${column(300, streak.current, "Текущая серия", currentRange, "#94e2d5")}${column(500, streak.longest, "Самая длинная серия", longestRange, "#cba6f7")}
</svg>`;
}

// The stock card is laid out for short English labels. The Russian ones run
// into the right-aligned numbers ("Всего запросов изменений:" is wider than the
// whole value column), so shorten them before rendering.
const SHORT_LABELS = [
  ["Всего звёзд:", "Звёзды:"],
  ["Всего коммитов:", "Коммиты:"],
  ["Всего запросов изменений:", "PR:"],
  ["Всего вопросов:", "Issues:"],
  ["Внесено вклада (за прошлый год):", "Вклад в проекты:"],
];

const user = (await gql(PROFILE_QUERY, { login })).user;
const repositories = user.repositories.nodes;
const stars = repositories.reduce((sum, repo) => sum + repo.stargazerCount, 0);
const { repoCommits: repoCommitData, days: contributionDays } =
  await contributionCommits(user);
const commits = repoCommitData.reduce((sum, item) => sum + item.commits, 0);
const prs = user.pullRequests.totalCount;
const issues = user.issues.totalCount;
const contributedTo = user.repositoriesContributedTo.totalCount;

const rank = calculateRank({
  all_commits: true,
  commits,
  prs,
  issues,
  reviews: 0,
  repos: user.repositories.totalCount,
  stars,
  followers: user.followers.totalCount,
});

let statsCard = renderStatsCard(
  {
    name: user.login,
    totalStars: stars,
    totalCommits: commits,
    totalPRs: prs,
    totalIssues: issues,
    contributedTo,
    rank,
  },
  {
    // Catppuccin (Mocha) palette. The card keeps the old layout, only the
    // colours change.
    title_color: "cba6f7",
    icon_color: "f5c2e7",
    text_color: "cdd6f4",
    bg_color: "1e1e2e",
    ring_color: "cba6f7",
    show_icons: true,
    hide_border: true,
    include_all_commits: true,
    locale: "ru",
    custom_title: "Статистика GitHub",
    card_width: 467,
  },
);

for (const [label, short] of SHORT_LABELS) {
  statsCard = statsCard.replaceAll(label, short);
}

const languagesCard = renderTopLanguages(languageCommits(repoCommitData), {
  title_color: "cba6f7",
  text_color: "cdd6f4",
  bg_color: "1e1e2e",
  hide_border: true,
  locale: "ru",
  custom_title: "Языки по коммитам",
  layout: "compact",
  langs_count: 6,
  card_width: 300,
});

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "stats.svg"), statsCard);
fs.writeFileSync(path.join(outDir, "top-languages.svg"), languagesCard);
fs.writeFileSync(
  path.join(outDir, "streak.svg"),
  renderStreakCard(contributionDays),
);

console.log(
  `stats: ${stars} stars, ${commits} commits, ${prs} PRs, ${issues} issues, ` +
    `${contributedTo} contributed to, rank ${rank.level}`,
);
