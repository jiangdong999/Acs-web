<template>
  <div id="passChart" class="chart"></div>
</template>

<script>
export default {
	name: 'passNum',
	props: ['passesData','weekTime'],
  data () {
    return {
			nightSignLoading: false,
			infoData: []
    }
  },
  methods: {
    drawBarChart () {
      let barChart = this.$echarts.init(document.getElementById('passChart'))  
      barChart.setOption({
				title: {					         	
					text: '小区本周通行数',                
					textStyle:{					//---主标题内容样式	
						color:'#223040',
						fontSize: 16,
						fontWeight: '500',
					},
					padding:[16,0,0,0],	
					x: 'center'					
				},
				color: ['#2DA0FE'],
				grid: {
					left: '3%',
					right: '4%',
					bottom: '10%',
					containLabel: true
				},
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b}: {c}",
					// position: function(point, params, dom, rect, size){
					// 	//其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小
					// 	let x = point[0];//
					// 	let y = point[1];
					// 	let viewWidth = size.viewSize[0];
					// 	let viewHeight = size.viewSize[1];
					// 	let boxWidth = size.contentSize[0];
					// 	let boxHeight = size.contentSize[1];
					// 	let posX = 0;//x坐标位置
					// 	let posY = 0;//y坐标位置
						
					// 	if(x<boxWidth){//左边放不开
					// 			posX = 5;    
					// 	}else{//左边放的下
					// 			posX = x-boxWidth; 
					// 	}
						
					// 	if(y<boxHeight){//上边放不开
					// 			posY = 5; 
					// 	}else{//上边放得下
					// 			posY = y-boxHeight;
					// 	}
						
					// 	return [posX,posY];
					// }
				},
        xAxis: {
					type: 'category',
          // data: this.getData('key'),
					data: this.weekTime,
					axisTick: {
						show: false, //隐藏刻度线
					},
					axisLine:{
						lineStyle:{
							color:'#D8D8D8'
						}
					},
					// splitLine: {
					// 	show: true, //网线,
					// 	lineStyle:{
					// 		color:'#2DA0FE'
					// 	}
					// },
					axisLabel: {
						interval: 0,  //label斜向显示
						rotate:40,   //label斜向显示
						color: '#aaa',
						fontSize: '10',
					} 
			},
			yAxis: {
				type: 'value',
				axisLine:{
					lineStyle:{
						color:'#D8D8D8'
					}
				},
				axisTick: {
					show: false, //隐藏刻度线
				},
				splitLine: {
					show: true, //网线,
					lineStyle:{
						type:'dashed',
						color:'#eee'
					}
				},
				axisLabel: {
					color: '#aaa',
					fontSize: '11'
				} 
			},
			series: [{
				// name:'应签',
        // data: this.getData('expectedCount'),
        areaStyle: {
          normal: {
            color:'#2DA0FE' //改变区域颜色
          }
        },
        data: this.passesData,
				type: 'line',
				smooth: true,
				color: ['#2DA0FE'],
				symbolSize: 0,   //折线点的大小
				itemStyle:{
					normal:{
						lineStyle:{
							width: 1
						}
					}
				}           
			}]
      })
    }
  }
}
</script>
<style lang="scss" scoped>  
.chart{
  width: 100%;
	// height: 100%;  
	height: 278px;
}
</style>
