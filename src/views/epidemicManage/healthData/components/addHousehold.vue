<template>
  <div id="addHousehold" class="chart"></div>
</template>

<script>
// import { loadNation } from '@/api/dataCenter'

export default {
	name: 'addHousehold',
	props: ['newHouseholdsData','weekTime'],
  data () {
    return {
			// infoData: {
			// 	'汉族': 4,
			// 	'维吾尔族': 4,
			// 	'羌族': 4,
			// 	'蒙古族': 4,
			// 	'藏族': 4,
			// },
			verifyLoading: false
    }
  },
  created(){		
	},
  methods: {
		// loadNation() {
		// 	let _this = this
		// 	_this.verifyLoading = true
    //   loadNation({}).then( response => {
		// 		_this.verifyLoading = false
    //     if (response && response.status === 0) {					
		// 			_this.infoData = Object.assign(_this.infoData,response.content)
		// 			_this.drawBarChart()
    //     }            
    //   }).catch(function (a) {
		// 		_this.verifyLoading = false
    //     console.error(a)
    //   })
    // },
    drawBarChart () {
      let barChart = this.$echarts.init(document.getElementById('addHousehold'))  
      barChart.setOption({
        title: {					         	
					text: '本周新增住户数',                
					textStyle:{				
						color:'#223040',
						fontSize: 16,
						fontWeight: '500',
					},
					padding:[16,0,0,0],	
					x: 'center',           
        },
        color: ['#2DA0FE'],
        tooltip : {
					trigger: 'axis',
					axisPointer : {            // 坐标轴指示器，坐标轴触发有效
						type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
        },
        grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
        },
        xAxis : [
					{
						type : 'category',
						data : this.weekTime,
						axisTick: {
							show: false, //隐藏刻度线
						},
						axisLine: {
							lineStyle: {
								color: '#D8D8D8',
							}
						},
						axisLabel: {
							interval:0,  //label斜向显示
							rotate:40,   //label斜向显示
							textStyle: {
								fontSize: 10,
							}
						}  
					}
        ],
        yAxis : [
					{
						type : 'value',
						axisLine: {
							lineStyle: {
								color: '#D8D8D8',
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
					}
        ],
        axisLabel:{				
					inside:false,		//---坐标轴 标签
					show:true,					//---是否显示			//---是否朝内
					rotate:0,					//---旋转角度	
					margin: 5,					//---刻度标签与轴线之间的距离
					color:'#aaa',			//---默认取轴线的颜色
        },
        series : [
					{
						name:'新增住户数',
						type:'bar',
						barWidth: '22%',
						barGap: '10%',
						barCategoryGap: '10%',
						data: this.newHouseholdsData, //柱形数据						
						itemStyle: {
							normal: {
								barBorderRadius: [0,0,0,0], //柱形圆角
								label: { //柱形上面label
									show: true,
									position: 'top',   
									formatter: '{c}',
									color: '#fff'                           
								}
							},                   
						}
					}
        ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.chart{
  width: 100%;
  height: 100%;  
}

</style>
