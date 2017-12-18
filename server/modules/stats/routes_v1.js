const {User} = require('../user/schema');
const validator = require('validator');
const HttpError = require('standard-http-error');

function parsePaginationParams(req) {
  let page = req.query.page || '1';
  if (!validator.isInt(page, {min: 1})) {
    throw new HttpError(400, 'page value, "'+page+'", is not an integer greater than 1');
  }
  page = parseInt(page);

  let limit = req.query.limit || '10';
  if (!validator.isInt(limit, {min: 1, max: 50})) {
    throw new HttpError(400, 'limit value, \''+limit+'\', is not an integer between 1 and 50 inclusive');
  }
  limit = parseInt(limit);

  return {
    page: page,
    limit: limit
  };
}

function getTopUserScores(skip, limit) {
  const fields = {
    _id: 0,
    user_name: 1,
    'stats.collection_score': 1
  };

  const topUsersPromise = User.find({}, fields)
                            .sort({'stats.collection_score': -1})
                            .skip(skip)
                            .limit(limit)
                            .exec();
  return topUsersPromise;
}

function computeSkip(page, limit) {
  return (page-1)*limit;
}

function getNextUrl(fullUrl, curPage, limit, totalDocs) {
  let nextUrl = false;
  const skip = computeSkip(curPage, limit);
  const nextPage = curPage+1;
  if (skip < totalDocs) nextUrl = fullUrl+'?page='+nextPage+'&limit='+limit;
  return nextUrl;
}

function getPrevUrl(fullUrl, curPage, limit) {
  let prevUrl = false;
  const skip = computeSkip(curPage, limit);
  const prevPage = curPage-1;
  if (skip > limit) prevUrl = fullUrl+'?page='+prevPage+'&limit='+limit;
  return prevUrl;
}

// NEED TO REFACTOR THIS
async function getLeaderboard(req, res, next) {
  try {
    const {page, limit} = parsePaginationParams(req, next);
    const skip = computeSkip(page, limit);
    const fullUrl = req.protocol + '://' + req.get('host') + req.path;
    const topUsersPromise = getTopUserScores(skip, limit);
    const totalDocs = await User.count({}).exec();

    const resObj = {
      object: 'list',
      page: page,
      limit: limit,
      prev_url: getPrevUrl(fullUrl, page, limit),
      next_url: getNextUrl(fullUrl, page, limit, totalDocs),
      total: totalDocs,
      data: await topUsersPromise
    };
    res.json(resObj);
  } catch (e) {
    next(e);
  }
}

function setup(app) {
  app.get('/api/v1/leaderboard', getLeaderboard);
}

module.exports = setup;
