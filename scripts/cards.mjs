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
    return [];
  }

  const aliases = years
    .map(
      (year, index) =>
        `y${index}: contributionsCollection(from: "${year}-01-01T00:00:00Z", ` +
        `to: "${year}-12-31T23:59:59Z") { ` +
        `commitContributionsByRepository(maxRepositories: 100) { ` +
        `repository { nameWithOwner primaryLanguage { name color } } ` +
        `contributions { totalCount } } }`,
    )
    .join("\n");

  const data = await gql(
    `query($login: String!) { user(login: $login) { ${aliases} } }`,
    { login },
  );

  const repositories = new Map();
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
  }
  return [...repositories.values()];
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
const repoCommitData = await contributionCommits(user);
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

console.log(
  `stats: ${stars} stars, ${commits} commits, ${prs} PRs, ${issues} issues, ` +
    `${contributedTo} contributed to, rank ${rank.level}`,
);
