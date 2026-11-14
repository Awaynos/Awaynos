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
  const json = await response.json();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
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
      totalCommitContributions
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

// One contributionsCollection covers at most a year, so the years are aliased
// into a single request and added up. This is the number GitHub prints next to
// "Commits" in the profile's contribution panel (private repos included).
async function allTimeCommits(contributionYears) {
  if (contributionYears.length === 0) {
    return 0;
  }
  const fields = contributionYears
    .map(
      (year, index) =>
        `y${index}: contributionsCollection(from: "${year}-01-01T00:00:00Z", ` +
        `to: "${year}-12-31T23:59:59Z") { totalCommitContributions }`,
    )
    .join("\n");
  const data = await gql(
    `query($login: String!) { user(login: $login) { ${fields} } }`,
    { login },
  );
  return Object.values(data.user).reduce(
    (sum, year) => sum + year.totalCommitContributions,
    0,
  );
}

// Top languages are counted by authored commits, not by file size: a single
// config repository with generated QML files (ii-config, ~31 MB) otherwise
// outweighs every source repository and reports QML as 86% of the profile.
//
// Each repository is attributed to its primary language, which is the same
// coarse split GitHub's own "most commit language" card uses. One aliased
// GraphQL request covers every repository.
async function languageCommits(user) {
  const repositories = user.repositories.nodes.filter(
    (repository) => repository.primaryLanguage,
  );
  if (repositories.length === 0) {
    return {};
  }

  const aliases = repositories
    .map((repository, index) => {
      const [owner, name] = repository.nameWithOwner.split("/");
      return (
        `r${index}: repository(owner: ${JSON.stringify(owner)}, ` +
        `name: ${JSON.stringify(name)}) { ` +
        `defaultBranchRef { target { ... on Commit { ` +
        `history(author: {id: $uid}) { totalCount } } } } }`
      );
    })
    .join("\n");

  const data = await gql(
    `query($uid: ID!) { ${aliases} }`,
    { uid: user.id },
  );

  const languages = {};
  repositories.forEach((repository, index) => {
    const { name, color } = repository.primaryLanguage;
    const total =
      data?.[`r${index}`]?.defaultBranchRef?.target?.history?.totalCount ?? 0;
    if (total === 0) {
      return;
    }
    languages[name] ??= { name, color, size: 0, count: 0 };
    languages[name].size += total;
    languages[name].count += 1;
  });
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
const commits = await allTimeCommits(
  user.contributionsCollection.contributionYears,
);
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
    theme: "bear",
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

const languagesCard = renderTopLanguages(await languageCommits(user), {
  theme: "bear",
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
