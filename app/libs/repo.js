const github = require('octonode');
const db = require('sqlite');
const logger = require('app/libs/logger');
const path = require('path');
const fs = require('fs');
// const logger = require('app/libs/logger');

const processCommits = (client, repos, since) => {
  const params = {
    since: since.toISOString(),
  };

  logger.info(params.since);
  let dataRows = [];
  repos.splice(0, 1);

  const handleCommits = (repo, commits) => {
    commits.forEach((commitObj) => {
      dataRows.push({
        message: commitObj.commit.message, repo,
        date: commitObj.commit.committer.date,
      });
    });
  };

  const putCommitsToDb = () => {
    logger.info(`total commits: ${dataRows.length}`);
    let queryResult;
    // logger.info(`repo: ${dataRows[0].repo}, date: ${dataRows[0].date}, message: ${dataRows[0].message}`);
    dataRows.forEach( async (row) => {
      try {
        await db.run('INSERT INTO Work (message, repo, date) VALUES (?, ?, ?)',
          row.message, row.repo, row.date);
      } catch (err) {
        logger.warn(`commit insert query failed : ${row.message}`);
        logger.error(err);
      }
    });

    logger.info('quefile deleted');
    fs.unlinkSync(repomaster.queueFile);
  }

  let processRepoCount = 0;
  repos.forEach((repo) => {
    const ghrepo = client.repo(repo);
    ghrepo.commits(params, (err, commits) => {
      processRepoCount++;
      if (err) {
        logger.error(err);
      } else {
        handleCommits(repo, commits);
      }

      if (repos.length === processRepoCount) {
        logger.info('got all repo commits');
        putCommitsToDb();
      }
    });

    // const coms = await ghrepo.commits(params, (err, commits) => {
    //   if (err) {
    //     logger.error(err);

    //     return;
    //   }
    //   logger.info(`repo: ${repo} commits: ${commits.length}`);

    //   let dataRows = [];
    //   commits.forEach((commitObj) => {
    //     dataRows.push({
    //       message: commitObj.commit.message,
    //       repo,
    //       date: commitObj.commit.committer.date,
    //     });
    //   });

    //   return dataRows;
    // });

    // console.log(coms);
  });

};



const repomaster = {
  queueFile: `${path.join(__dirname, '../tmp/queue.running')}`,
  fetchIfNeeded:(since) => {
    // check if already running
    logger.info('queueFile :' + repomaster.queueFile);

    if (fs.existsSync(repomaster.queueFile)) {
      logger.info('Can not fetch commits. running');
    } else {
      logger.info('Can fetch commits. not running');
      // job not running start job
      fs.writeFile(repomaster.queueFile, 'howdy', (err) => {
        if (err) {
          logger.error('can not write queuefile');
        }

        logger.info('fetch commits');
        repomaster.fetchCommits(since);
      });
    }
  },
  fetchCommits: (since) => {
    const client = github.client(process.env.GITHUB_ACCESS_TOKEN);
    // get repos
    const ghuser = client.user('dostokhan');

    ghuser.repos(null, (err, repos) => {
      if (err) {
        logger.error(err);

        return;
      }

      logger.info(`total repo: ${repos.length}`);
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

      logger.info(`fetch these repo: ${reposToFetch.join(', ')}`);

      if (reposToFetch.length > 0) {
        processCommits(client, reposToFetch, since);
      }
    });
  },
};

module.exports = repomaster;
