const github = require('octonode');

// Then we instantiate a client with or without a token (as show in a later section)

// const ghme           = client.me();
// const ghuser         = client.user('pksunkara');
// const ghrepo         = client.repo('pksunkara/hub');
// const ghorg          = client.org('flatiron');
// const ghissue        = client.issue('pksunkara/hub', 37);
// const ghmilestone    = client.milestone('pksunkara/hub', 37);
// const ghlabel        = client.label('pksunkara/hub', 'todo');
// const ghpr           = client.pr('pksunkara/hub', 37);
// const ghrelease      = client.release('pksunkara/hub', 37);
// const ghgist         = client.gist();
// const ghteam         = client.team(37);
// const ghproject      = client.project('pksunkara/hub', 37);
// const ghnotification = client.notification(37);

const repo = {
  fetchCommits: () => {
    const client = github.client(process.env.GITHUB_ACCESS_TOKEN);


    // get repos
    const ghuser = client.user('dostokhan');

    ghuser.repos(null, (err, repos) => {
      if (err) {
        console.log(err);

        return;
      }

      console.log(`total repo: ${repos.length}`);
      repos.forEach((repo) => {
        console.log(`repo: ${repo.full_name} updated_at: ${repo.updated_at}`);
        console.log(`archived: ${repo.archived} forked: ${repo.fork}`);


        // need to fetch commits of repos for which
        // is not forked and is not archived
        // updated_at greater than last_fetch_time or 1jan, 2017
        //
      })
      // console.log(repos);
    });

    // get commits
    // const d = new Date();
    // const until = d.toISOString();
    // d.setDate(d.getDate() - 90);
    // const since = d.toISOString();
    // const params = {
    //   since,
    //   until,
    // };
    // const ghrepo = client.repo('dostokhan/utils');
    // ghrepo.commits(params, (err, commits) => {
    //   if (err) {
    //     console.log('error');
    //     console.log(err);

    //     return;
    //   }

    //   console.log(`total commits: ${commits.length}`);
    //   commits.forEach((commit) => {
    //     console.log(`commit: ${commit.message}`);
    //   })
    // });
  },
};


module.exports = repo;
