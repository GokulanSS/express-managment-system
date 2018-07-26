<template>
  <div class="chart" v-if="userHavePer.indexOf('data_board') >= 0">
      <div class="chart-container">
          <div class="today-data" v-if="userHavePer.indexOf('homepage_statistic') >= 0">
              <el-table
                :data="todayData"
                border
                style="width: 100%">
                <el-table-column
                prop="collected"
                label="今日总采集量">
                </el-table-column>
                <el-table-column
                prop="stored"
                label="今日入库量">
                </el-table-column>
                <el-table-column
                prop="delivered"
                label="今日出库量">
                </el-table-column>
                <el-table-column
                prop="delayed"
                label="今日滞留量">
                </el-table-column>
                <el-table-column
                prop="transfered"
                label="今日移库量">
                </el-table-column>
                <el-table-column
                prop="auto_delivered"
                label="今日自取量">
                </el-table-column>
            </el-table>
          </div>
          <div class="query" v-if="userHavePer.indexOf('homepage_statistic_query') >= 0">
              <div class="query-header">
                  <!-- <p><span>当前站点 :</span> {{nowStation}}</p> -->
                  <div class="query-date">
                      <span class="query-date-header">日期查询 : </span>
                      <el-date-picker
                        v-model="queryDate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                  </div>
              </div>
              <div class="query-type">
                  <span class="query-type-header">查询类型 : </span>
                  <el-checkbox-group v-model="queryCondition['package_states']">
                    <el-checkbox label="collected">总采集量</el-checkbox>
                    <el-checkbox label="stored">入库件数</el-checkbox>
                    <el-checkbox label="delivered">出库件数</el-checkbox>
                    <el-checkbox label="delayed">滞留件数</el-checkbox>
                    <el-checkbox label="transfered">移库件数</el-checkbox>
                    <el-checkbox label="auto_delivered">自取件数</el-checkbox>
                    <el-checkbox label="scanned">已扫描</el-checkbox>
                  </el-checkbox-group>
                  <el-button type="primary" class="query-btn" @click="queryData">查询</el-button>
              </div>
          </div>
          <div class="detail-chart" id="detail-chart"></div>
      </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts';

export default {
    name:'detail',
    data(){
        return {
            detail:[],
            chartOptions:{
                chart:{
                    type:'column'
                },
                credits:{
                    enabled:false
                },
                title:{
                    text:`站点7天总件量`
                },
                xAxis:{
                    categories:[]
                },
                yAxis:{
                    title:{
                        text:'站点详情'
                    }
                },
                series:[]
            },
            todayData:[],
            queryDate:[],
            queryCheckList:[],
            token:'',
            queryCondition:{
                package_states: [],
                start_date: "",
                end_date: ""
            },
            queryLength:7,
            oldVal:0,
            currentStation:'',
            userHavePer:[],
            allStatus:['collected','stored','delivered','delayed','transfered','auto_delivered','scanned']
        }
    },
    mounted(){
        let token = localStorage.getItem('token');
        this.token = token;
        // this.nowStation = sessionStorage.getItem('school');
        this.getData();
        this.getRoleList();
    },
    activated(){
        let id = sessionStorage.getItem('station');
        if(id != this.oldVal){
            this.getData();
        }
    },
    deactivated(){
        let id = sessionStorage.getItem('station');
        this.oldVal = id;
    },
    methods:{
        drawChart(){
            let packages = this.detail;
            // console.log(packages);
            let categories = [];
            let series = [];
            let keyList = Object.keys(packages[0]['package_statistic']);
            for(let i=0; i<packages.length; i++){
                categories.push(packages[i].date);
            }
            for(let i=0; i<keyList.length; i++){
                let chartCloumn = {
                    name:'',
                    data:[]
                }
                chartCloumn.name = this.$store.state.expressStatus[keyList[i]];
                for(let j=0; j<packages.length; j++){
                    chartCloumn.data.push(parseInt(packages[j]['package_statistic'][keyList[i]]));
                }
                series.push(chartCloumn);
            }
            // console.log(series);
            this.chartOptions.xAxis.categories = categories;
            this.chartOptions.series = series;
            Highcharts.chart('detail-chart',this.chartOptions);
        },
        getData(){
            let that = this;
            that.$axios.get(that.$api.indexChart,{
                headers:{
                    "Content-Type":"application/json",
                    "token":that.token
                }
            }).then(function(res){
                if(res.data.code == 0){
                    // console.log(res.data.data);
                    that.todayData = [];
                    that.detail = res.data.data['current_week'];
                    that.todayData.push(res.data.data['current_day'][0]['package_statistic']);
                    that.chartOptions.title.text = `站点7天总件量`;
                    that.drawChart();
                }else{
                    that.$notify.error({
                        title: '获取数据失败',
                        message: '请刷新页面，尝试重新获取数据'
                    });
                }
            })
        },
        queryData(){
            let queryDate = this.queryDate;
            if(queryDate.length == 0){
                this.$notify({
                    title: '提示',
                    message: '请选择日期查询范围',
                    type: 'warning'
                })
                return;
            }

            let startTime = this.dateFormat(new Date(this.queryDate[0]).getTime());
            let endTime = this.dateFormat(new Date(this.queryDate[1]).getTime());
            this.queryCondition['start_date'] = startTime;
            this.queryCondition['end_date'] = endTime;
            let that = this;
            console.log(this.queryCondition);
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            that.$axios.post(that.$api.indexQuery, this.queryCondition, {
                headers:{
                    "Content-Type":"application/json",
                    "token":that.token
                }
            }).then(function(res){
                if(res.data.code == 0){
                    
                    let queryDataContent = res.data.data;
                    let temArr = [];
                    let keys = Object.keys(queryDataContent);

                    if(that.queryCondition['package_states'].length != 0){
                        
                        for(let i=0; i<keys.length; i++){
                            let temObj = {};
                            temObj.date = keys[i];
                            temObj['package_statistic'] = queryDataContent[keys[i]];
                            temArr.push(temObj);
                        }
                        // console.log(temArr);
                        let condition = that.queryCondition['package_states'];
                        let statusKeys = JSON.parse(JSON.stringify(that.allStatus));
                        // console.log(condition);
                        for(let i=0; i<condition.length; i++){
                            let index = statusKeys.indexOf(condition[i]);
                            statusKeys.splice(index,1);
                        }
                        temArr.forEach((item,index,arr) => {
                            statusKeys.forEach( (subItem,i) => {
                                delete item['package_statistic'][subItem];
                            })
                        })
                        
                    }else{
                        for(let i=0; i<keys.length; i++){
                            let temObj = {};
                            temObj.date = keys[i];
                            temObj['package_statistic'] = queryDataContent[keys[i]];
                            temArr.push(temObj);
                        }
                    }
                    
                    that.detail = temArr;
                    let dataLength = temArr.length;
                    that.chartOptions.title.text = `站点${dataLength}天总件量`;
                    that.drawChart();
                }else{
                    that.$notify.error({
                        title: '查询错误',
                        message: '查询出现错误，请稍后再试'
                    })
                }
                loading.close();
            })
        },
        getRoleList(){
            let that = this;
            let temPer = that.$store.state.permission;
            let token = localStorage.getItem('token');
            if(temPer.length == 0){
                that.$ajax(that, 'get', that.$api.userInfo, null, token, function(res){
                    // console.log(res);
                    if(res.data.code == 0){
                        that.userHavePer = that.getPermissionArr(res.data.data.permissions);
                    }
                })
            }else{
                that.userHavePer = temPer;
            }
        }
    },
    computed:{
        // nowStation(){
        //     let station = this.$store.state.university;
        //     return station;
        // },
        changeStationId(){
            return this.$store.state.stationId;
        }
    },
    watch:{
        changeStationId(){
            this.getData();
        }
    }
}
</script>

<style lang='less'>
@rem:100rem;

.chart{
    width: 1620/@rem;
    .chart-container{
        .today-data{
            margin-top: 30/@rem;
        }

        .detail-chart{
            width: 1620/@rem;;
            height: 600/@rem;
            margin-top: 40/@rem;
        }

        .query{
            display: flex;
            flex-direction: column;
            margin-top: 50/@rem;
            width: 100%;
            box-sizing: border-box;
            padding:0 100/@rem ;
            border-top: 1/@rem solid #ebeef5;
            border-bottom: 1/@rem solid #ebeef5;
            .query-header{
                display: flex;
                align-items: center;
                margin-top: 25/@rem;
                p{
                    font-size: 18/@rem;
                    span{
                        margin-right: 30/@rem;
                    }
                }
                .query-date{
                    display: flex;
                    align-items: center;
                    .query-date-header{
                        font-size: 18/@rem;
                        margin-right: 30/@rem;
                    }
                }
            }
            .query-type{
                display: flex;
                align-items: center;
                margin-top: 40/@rem;
                margin-bottom: 15/@rem;
                .query-type-header{
                    margin-right: 30/@rem;
                    font-size: 18/@rem;
                }
                .query-btn{
                    margin-left: 100/@rem;
                }
            }
        }
    }
    
}

</style>
