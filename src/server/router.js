const getMovie = require('./capture');
const querystring = require('querystring');

const router = (app) => {
  // router
  app.get('/v2/movie/top250', (req, res) => {
    let path = req.path;
    let query = req.query;
    getMovie(path + '?' + querystring.stringify(query), res);
    // res.send('Hello world!');
  })
}

module.exports = router;