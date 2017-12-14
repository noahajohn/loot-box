const CronJob = require('cron').CronJob;
const {User} = require('./schema');

const job = new CronJob('1 * * * * *', async () => {
  /*
   * Runs every minute.
   */
   console.log('starting cron');
   await User.generateMana();
   console.log('done cron');
  },
  null,
  false, /* Start the job right now */
  'America/New_York' /* Time zone of this job. */
);

exports.regenManaCron = job;