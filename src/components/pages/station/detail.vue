<template>
  <div class="detail">
      <div class="detail-chart" id="detail-chart"></div>
      <div class="station-msg">
          <div class="station-name">
              <span class="message-title">站点名称:</span>
              <div class="name-box">
                  <span v-show="!showEdit">{{detail.data.info['site_name']}}</span>
                  <el-input v-show="showEdit" v-model="detail.data.info['site_name']" placeholder="请输入内容"></el-input>
              </div>
          </div>
          <div class="station-name">
              <span class="message-title">站点地址:</span>
              <div class="name-box">
                  <span v-show="!showEdit">{{detail.data.info['site_address']}}</span>
                  <el-input v-show="showEdit" v-model="detail.data.info['site_address']" placeholder="请输入内容"></el-input>
              </div>
          </div>
          <div class="station-name">
              <span class="message-title">站点电话:</span>
              <div class="name-box">
                  <span v-show="!showEdit">{{detail.data.info['phone']}}</span>
                  <el-input v-show="showEdit" v-model="detail.data.info['phone']" placeholder="请输入内容"></el-input>
              </div>
          </div>
          <div class="save-btn">
              <el-button v-show="!showEdit" type="primary" size="medium" @click="editStationInfo('edit')">修改站点信息</el-button>
              <el-button v-show="showEdit" type="primary" size="medium" @click="editStationInfo('save')">保存站点信息</el-button>
          </div>
      </div>
      <div class="detail-staff">
          <div class="table-container">
              <el-table
                :data="detail.data.members"
                style="width: 100%">
                <el-table-column
                    prop="name"
                    label="站点人员"
                    >
                </el-table-column>
                <el-table-column
                    prop="created_at"
                    label="入职时间">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="联系电话">
                </el-table-column>
              </el-table>
          </div>
      </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts';

export default {
    name:'detail',
    data(){
        return {
            detail:{
                data:{
                    members:[],
                    info:{}
                }
            },
            chartOptions:{
                chart:{
                    type:'column'
                },
                credits:{
                    enabled:false
                },
                title:{
                    text:'站点7天总件量'
                },
                xAxis:{
                    categories:[]
                },
                yAxis:{
                    title:{
                        text:'站点详情'
                    }
                },
                series:[
                ]
            },
            oldVal:0,
            showEdit:false
        }
    },
    mounted(){
        let id = sessionStorage.getItem('station');
        if(id){
            this.detailMsg();
        }else{
            return;
        }
    },
    activated(){
        let id = sessionStorage.getItem('station');
        console.log(this.$route);
        if(this.$route.params.add){
            this.detailMsg();
        }
        if(id != this.oldVal){
            this.detailMsg();
        }
    },
    deactivated(){
        this.oldVal = sessionStorage.getItem('station');
    },
    methods:{
        drawChart(){
            let packages = this.detail.data.package;
            let packagesLength = packages.length;
            if(packagesLength == 0){
                return;
            }
            if(packagesLength > 7){
               packages = packages.slice(packagesLength-7);
            }
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
            this.chartOptions.xAxis.categories = categories;
            this.chartOptions.series = series;
            Highcharts.chart('detail-chart',this.chartOptions);
        },
        formatDate(dataList){
            for(let i=0; i<dataList.length; i++){
                let date = dataList[i]['created_at'];
                dataList[i]['created_at'] = this.secondsFormat(date);
                if(dataList[i]['is_active'] == 0){
                    dataList.splice(i,1);
                    i--;
                }
            }
        },
        detailMsg(){
            let that = this;
            let token = localStorage.getItem('token');
            let stationId = sessionStorage.getItem('station');
            that.$axios.get(that.$api.stationDetail, {
                headers:{
                    "Content-Type":"application/json",
                    "token":token
                }
            }).then(function(res){
                console.log(res);
                if(res.data.code == 0){
                    that.detail = res.data;
                    that.formatDate(that.detail.data.members);
                    that.drawChart();
                }
            })
        },
        editStationInfo(val){
            this.showEdit = !this.showEdit;
            console.log(val);
            let that = this;
            if(val == 'save'){
                console.log(that.detail.data.info);
                let detail = that.detail.data.info;
                let token = localStorage.getItem('token');
                let loading = that.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                detail['site_id'] = Number(detail['site_id']);
                that.$ajax(that, 'post', that.$api.updateSiteMsg, detail, token, function(res){
                    if(res.data.code == 0){
                        that.$notify({
                            title: '保存成功',
                            message: `站点${detail['site_name']}信息修改成功`,
                            type: 'success'
                        })
                    }else{
                        that.$notify.error({
                            title: '保存失败',
                            message: res.data.error
                        })
                    }
                    loading.close();
                })
            }
        }
    },
    computed:{
        stationId(){
            return this.$store.state.stationId;
        }
    },
    watch:{
        stationId(){
            //console.log('刷新页面');
            this.detailMsg();
        }
    }
}
</script>

<style lang='less'>
@rem:100rem;

.detail{
    width: 1620/@rem;
    .detail-chart{
        width: 1620/@rem;;
        height: 600/@rem;
        margin-top: 40/@rem;
    }
    .detail-staff{
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 40/@rem;
        .table-container{
            width: 80%;
        }
    }
    .station-msg{
        width: 100%;
        margin: 50/@rem 0;
        box-sizing: border-box;
        padding: 0 100/@rem;
        display: flex;
        justify-content: space-around;
        font-size: 14px;
        .station-name{
            height: 40px;
            display: flex;
            align-items: center;
            .message-title{
                margin-right: 20/@rem;
            }
            .name-box{
                span{
                    display: inline-block;
                    width: 202px;
                }
            }
        }
    }
}

</style>
