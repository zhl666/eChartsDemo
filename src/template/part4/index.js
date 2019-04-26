const path = require('path');
import React from 'react'
import { render } from 'react-dom'
// 引入 Echarts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
// import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/axisPointer';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
// 按钮图片
import play from './../../static/images/play.png';

class App extends React.Component {
  componentDidMount() {
    const myEchart = echarts.init(document.getElementById('myEchart'));
    myEchart.setOption({
      title: {
        show: true,
        text: 'Echarts示例： 豆瓣最新热映电影评分分析',
        left: 'center',
      },
      toolbox: {
        feature: {
          myLoadData: {
            show: true,
            title: '开始加载数据',
            icon: 'image://' + play,
            onclick: () => {
              this.handleGetData(myEchart);
            }
          },
          saveAsImage: {
            name: 'text',
            title: '保存图片'
          }
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        }
      },
      grid: {
        top: '50%'
      },
      axisPointer: {

      },
      xAxis: {
        data: ['评分1', '评分2', '评分3', '评分4', '评分5']
      },
      yAxis: {},
      series: [{
        name: '默认1',
        type: 'line',
        data: [21,23,16,82,50]
      }]
    })
  }
  
  handleGetData(myEchart) {
    // 加载loading动画
    myEchart.showLoading();
    fetch('http://localhost:60/v2/movie/top250?start=0&count=100')
    .then(response => {
      return response.json();
    })
    .then(myJson => {
      let data = myJson.subjects;
      let scoreObj = {}, xAxisData = [], seriesData = [],
          countryObj = {}, pieData = [];
      data.forEach(item => {
        if(scoreObj[item.rating.average] == undefined) {
          scoreObj[item.rating.average] = 1;
        } else {
          scoreObj[item.rating.average] += 1;
        }
        if(countryObj[item.country] == undefined) {
          countryObj[item.country] = 1;
        } else {
          countryObj[item.country] += 1;
        }
      });

      xAxisData = Object.keys(scoreObj).sort();
      let newScoreObj = {};
      for(let i=0; i<xAxisData.length; i++) {
        let k = xAxisData[i];
        newScoreObj[k] = scoreObj[k];
      }
      seriesData = Object.values(newScoreObj);

      for(let k  in countryObj) {
        pieData.push({
          name: k,
          value: countryObj[k]
        })
      }

      myEchart.setOption({
        xAxis: {
          data: xAxisData
        },
        series: [{
          name: '电影评分统计',
          type: 'line',
          data: seriesData
        }, {
          name: '电影评分统计',
          type: 'pie',
          data: pieData,
          radius: '28%',
          center: ['30%', '35%']
        }]
      });
      myEchart.hideLoading();
      let sign = null;
      myEchart.on('updateaxispointer', (event) => {
        let dataIndex = event.dataIndex;
        if(dataIndex == sign) {
          return;
        } else {
          sign = dataIndex;
        }
        if(dataIndex !== undefined) {
          let scoreType = xAxisData[dataIndex];
          let scoreTypeObj = {};
          let scoreTypeData = [];
          data.forEach(item => {
            let score = item.rating.average;
            if(score == scoreType) {
              if(!scoreTypeObj[item.country]) {
                scoreTypeObj[item.country] = 1;
              } else {
                scoreTypeObj[item.country] += 1;
              }
            }
          });
          for(let key in scoreTypeObj) {
            scoreTypeData.push({
              name: key,
              value: scoreTypeObj[key]
            });
          }

          myEchart.setOption({
            series: [
              {
                name: '电影评分统计',
                type: 'line',
                data: seriesData
              }, {
                name: '电影评分统计',
                type: 'pie',
                data: pieData,
                radius: '28%',
                center: ['30%', '35%']
              }, {
                name: '当前评分电影各国分布',
                type: 'pie',
                data: scoreTypeData,
                radius: '28%',
                center: ['80%', '35%']
              }
            ]
          })
        }
      });
    });
  }

  render() {
    return (
      <div id="myEchart" style={{ width: 800, height: 600}}></div>
    )
  }
}

render(
  <App />,
  document.getElementById('main')
)