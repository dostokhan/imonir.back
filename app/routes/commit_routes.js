const db = require('sqlite');
const repo = require('app/libs/repo');
const logger = require('app/libs/logger');
// const queue = require('app/libs/queue');

const lookupCommit = async (req, res, next) => {
  // fetch 10 latest commits from db
  // if result is empty and no task running
  // schedule a task in 5 minutes
  const sql = 'SELECT * FROM work ORDER BY datetime(date) DESC LIMIT 10';

  try {
    const commits = await db.all(sql);

    // check if fetch needed ?
    let d;
    if (commits.length === 0) {
      logger.info('No Commit found');
      // console.log('first fetch');
      d = new Date('January 1 2017');
      repo.fetchIfNeeded(d);
    } else {
      // console.log('updated fetch');
      d = new Date(commits[0].datetime);
      const current = new Date();
      current.setDate(d.getDate() - 1);

      if (d < current) {
        repo.fetchIfNeeded(d);
      }
    }

    res.status(200).send(JSON.stringify({ commits }));
  } catch (err) {
    res.status(500).send({ detail: 'could not fetch' });
  }
};

module.exports = (server) => {
  // fetch note
  server.get('/commit/', lookupCommit);
};

// const fetchNeeded = (fetchFrom) => {
//   // repo.fetchCommits(fetchFrom);

//   // queue.create('justchill', {
//   //     title: 'Welcome to the site',
//   //     to: 'user@example.com',
//   //     template: 'welcome-email'
//   // }).priority('high').attempts(5).save();

//   // check if fetching commit is necessary ?
//   // 24 hours after last fetch &&
//   // currently no running/scheduled task
// };

