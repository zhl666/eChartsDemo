const http = require('http');
const config = require('./base');

const getMovie = (url, routerRes) => {
  http.get(`${config.origin}${url}`, (res) => {
    let chunks = '';
    res.on('data', (chunk) => {
      chunks += chunk;
    });
    res.on('end', (err) => {
      if(err) {
        console.log(err)
        routerRes.send(err.message);
      }
      // console.log(chunks);
      // 对数据处理: 增加country字段
      let data = JSON.parse(chunks);
      let countries = config.countyies;
      data.subjects.forEach(item => {
        item.rating.average = item.rating.average.toString().length == 1 ? item.rating.average + '.0' : item.rating.average;
        item.country = countries[Math.floor(Math.random() * countries.length)];
      });
      routerRes.send(data);
    })
  }).on('error', (e) => {
    console.error(`${e.message}`);
  });
}

module.exports = getMovie;