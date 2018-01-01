const helper = {
  titleToSlug: title => title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-'),
};

module.exports = helper;
