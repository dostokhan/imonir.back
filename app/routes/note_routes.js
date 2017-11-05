const noteReader = require('../libs/noteReader.js');

const renderErr = (res, err) => {
  console.log(err);
  res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Internal error.');
};

const renderNote = (req, res, content, contentJson = false) => {
  console.log(content);
  // var htmlContent = this.message.marked(this.rawContent);
  // var responseContent = this.message.mustacheTemplate(html, { postContent: htmlContent });

      // res.setHeader('Content-Type', 'application/json');
  if (contentJson) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(content);
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ key: req.params.notename, content }));
  }
};

module.exports = (server) => {
  // fetch note
  server.get('/note/:notename', (req, res) => {
    // const url = this.req.url;
    // const index = url.indexOf('/note/') + 1;
    const path = `${req.params.notename}.md`; // `${url.slice(index)}.md`;

    console.log(`read: ${path}`);
    noteReader(path)
      .then((content) => {
        renderNote(req, res, content);
      }, (err) => {
        renderErr(res, err);
      });
  });

  // list of notes, latest 10
  server.get('/note', (req, res) => {
    const path = 'list.json';
    noteReader(path)
      .then((content) => {
        renderNote(req, res, content, true);
      }, (err) => {
        renderErr(res, err);
      });
  });
};
