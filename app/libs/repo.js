const github = require('octonode');
const db = require('sqlite');
// const logger = require('app/libs/logger');

const processCommits = (client, repos, since) => {
  const params = {
    since: since.toISOString(),
  };
  repos.forEach((repo) => {
    const ghrepo = client.repo(repo);

    ghrepo.commits(params, (err, commits) => {
      if (err) {
        console.log('error');
        console.log(err);

        return;
      }

      console.log(`total commits: ${commits.length}`);
      commits.forEach((commitObj) => {
        // console.log(`message: ${commitObj.commit.message}`);
        // console.log(`repo: ${repo}`);
        // console.log(`date: ${commitObj.commit.committer.date}`);
        // console.log(commitObj.commit);
        // console.log('-------------------------------');
      });

    });
  });
};

const repomaster = {
  fetchCommits: (since) => {
    const client = github.client(process.env.GITHUB_ACCESS_TOKEN);
    // get repos
    const ghuser = client.user('dostokhan');

    ghuser.repos(null, (err, repos) => {
      if (err) {
        console.log(err);

        return;
      }

      console.log(`total repo: ${repos.length}`);
      const reposToFetch = [];
      let repoUpdatedAt;
      repos.forEach((repo) => {
        repoUpdatedAt = new Date(repo.updated_at);
        // need to fetch commits of repos for which
        // is not forked and is not archived
        // updated_at greater than last_fetch_time or 1jan, 2017
        //
        if (!repo.archived && !repo.forked && repoUpdatedAt > since) {
          reposToFetch.push(repo.full_name);
        }
        // console.log(`repo: ${repo.full_name} updated_at: ${repo.updated_at}`);
        // console.log(`archived: ${repo.archived} forked: ${repo.fork}`);
      });

      console.log('fetch these repo');
      console.log(reposToFetch);

      if (reposToFetch.length > 0) {
        processCommits(client, reposToFetch, since);
      }
    });
  },
};


module.exports = repomaster;
