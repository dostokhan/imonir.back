const db = require('sqlite');
const repo = require('../libs/repo');


const fetchNeeded = (fetchFrom) => {
  console.log(`fetchFrom: ${fetchFrom}`);

  // check if fetching commit is necessary ?
  // 24 hours after last fetch &&
  // currently no running/scheduled task


  //
  // var job = queue.create('test', {
  //   title: 'job ran at ' + Date.now()
  // }).save( function(err){
  //   if( !err ) console.log( job.id );
  // });

  // repo.fetchCommits();
};

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
      // console.log('first fetch');
      d = new Date('January 1 2017');
      fetchNeeded(d.toISOString());
    } else {
      // console.log('updated fetch');
      d = new Date(commits[0].datetime);
      const current = new Date();
      current.setDate(d.getDate() - 1);

      if (d < current) {
        fetchNeeded(d.toISOString());
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
