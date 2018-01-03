const kue = require('kue');
const logger = require('app/libs/logger');

const queue = kue.createQueue();


queue.process('justchill', (job, done) => {
  logger.info(job.data);
});


module.exports = queue;
