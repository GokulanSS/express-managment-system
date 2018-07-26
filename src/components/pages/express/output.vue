<template>
  <div class="express-out">
      <div class="code-input" v-if="userPermission.indexOf('get_package_detail_by_tracking_number') >= 0">
          <div class="input">
              <span>快递单号 :</span>
              <el-input
                class="express-code"
                placeholder="请输入快递单号"
                v-model="expressCode">
              </el-input>
          </div>
          <div class="confirm-btn">
               <el-button type="primary" @click="confirmOutput">确认出库</el-button>
               <el-button type="primary" @click="expressQuery">快递查询</el-button>
          </div>
      </div>
      <div class="express-detail" >
          <div class="detail-header">
              <span>快递详情</span>
          </div>
          <div class="detail-content" v-if="$store.state.permission.indexOf('get_package_detail') >= 0">
              <div class="content-message" v-if="showDetail">
                  <div class="message">
                      <span>包裹ID :</span>
                      <span>{{detail.data.id}}</span>
                  </div>
                  <div class="message">
                      <span>快递单号 :</span>
                      <span>{{detail.data.tracking_number}}</span>
                  </div>
                  <div class="message">
                      <span>快递状态 :</span>
                      <span>{{detail.data.state_text}}</span>
                  </div>
                  <div class="message">
                      <span>收件姓名 :</span>
                      <span>{{detail.data.recipient_name}}</span>
                  </div>
                  <div class="message">
                      <span>联系号码 :</span>
                      <span>{{detail.data.recipient_phone}}</span>
                  </div>
                  <div class="message">
                      <span>学校名称 :</span>
                      <span>{{detail.data.site_id}}</span>
                  </div>
                  <div class="message">
                      <span>快递公司 :</span>
                      <span>{{detail.data.courier_code}}</span>
                  </div>
                  <div class="message">
                      <span>入库时间 :</span>
                      <span>{{detail.data.arrived_at}}</span>
                  </div>
                  <div class="message">
                      <span>取件码 :</span>
                      <span>{{detail.data.pickup_code}}</span>
                  </div>
              </div>
              <div class="content-progress" v-if="showDetail">
                  <div class="progress-tree">
                    <el-steps direction="vertical" :active="detail.data['package_log'].length" space="200">
                        <el-step v-for="(item,index) in detail.data['package_log']" :key="index" :title="item.title" :description="item.content"></el-step>
                    </el-steps>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name:'expressOut',
    data(){
        return {
            expressCode:'',
            detail:{
                data: {
                    "id": null,
                    "tracking_number": "",
                    "arrived_at": null,
                    "state_code": "",
                    "state_text": "",
                    "courier_code": "",
                    "pickup_code": "",
                    "recipient_phone": "",
                    "recipient_name": "",
                    "site_id": null,
                    "package_log": [
                        {
                            "id": null,
                            "created_at": null,
                            "title":"",
                            "content": "",
                            "type": null
                        },
                    ]
                }
            },
            token:'',
            showDetail:false,
            userPermission:[]
        }
    },
    methods:{
        expressDetail(){
            let that = this;
            let token = localStorage.getItem('token');
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            that.$ajax(that, 'post', that.$api.packageMsg, {"tracking_number":that.expressCode}, token, function(res){
                if(res.data.code == 0){
                    let data = res.data;
                    let temData = data['data'];
                    let stationList = JSON.parse(sessionStorage.getItem('siteList'));
                    temData['arrived_at'] = that.secondsFormat(temData['arrived_at']);
                    temData['courier_code'] = that.$compony[temData['courier_code']];  
                    stationList.forEach((item,index) => {
                        if(item['site_id'] == temData['site_id']){
                            temData['site_id'] = item['site_name']
                        }
                    });
                    that.detail = data;
                    that.showDetail = true;
                }else{
                    that.$notify.error({
                        title: '获取详情失败',
                        message: res.data.error
                    })
                }
                loading.close();
            })
        },
        expressQuery(){
            if(this.expressCode.length == 0){
                this.$notify({
                    title: '输入提示',
                    message: '请输入快递单号',
                    type: 'warning'
                })
            }else{
                this.expressDetail();
            }
        },
        confirmOutput(){
            if(this.expressCode.length == 0){
                this.$notify({
                    title: '输入提示',
                    message: '请输入快递单号',
                    type: 'warning'
                })
                return;
            }

            let that = this;
            let token = localStorage.getItem('token');
            this.$confirm('请确认快递详情无误, 是否继续?', '出库提示', {
                confirmButtonText: '确定出库',
                cancelButtonText: '取消出库',
                type: 'warning'
            }).then(() => {
                let loading = that.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                that.$ajax(that, 'post', that.$api.output, {"package_id":that.detail.data.id}, token, function(res){
                    if(res.data.code == 0){
                        that.$message({
                            type: 'success',
                            message: '出库成功!'
                        })
                    }else{
                        that.$notify.error({
                            title: '出库错误',
                            message: res.data.error
                        })
                    }
                    loading.close();
                })
                
            }).catch(() => {
                that.$message({
                    type: 'info',
                    message: '已取消删除'
                })        
            })
        },
        routeJump(){
            let that = this;
            let routeParams = that.$route.params;
            if(routeParams && routeParams.status && routeParams.status == 'output'){
                that.expressCode = sessionStorage.getItem('packageNum');
                that.expressDetail();
            }else{
                that.showDetail = false;
                that.expressCode = '';
                that.detail.data = {
                    "id": null,
                    "tracking_number": "",
                    "arrived_at": null,
                    "state_code": "",
                    "state_text": "",
                    "courier_code": "",
                    "pickup_code": "",
                    "recipient_phone": "",
                    "recipient_name": "",
                    "site_id": null,
                    "package_log": [
                        {
                            "id": null,
                            "created_at": null,
                            "title":"",
                            "content": "",
                            "type": null
                        },
                    ]
                }
            }
        },
        getRoleList(){
            let that = this;
            let temPer = that.$store.state.permission;
            let token = localStorage.getItem('token');
            if(temPer.length == 0){
                that.$ajax(that, 'get', that.$api.userInfo, null, token, function(res){
                    if(res.data.code == 0){
                        that.userPermission = that.getPermissionArr(res.data.data.permissions);
                        that.$store.state.permission = that.userPermission;
                    }
                })
            }else{
                that.userPermission = temPer;
            }
        }
    },
    mounted(){
        this.token = localStorage.getItem('token');
        this.getRoleList();    
    },
    activated(){
        this.routeJump();
        // let that = this;
        // let temPer = that.$store.state.permission;
        // let token = localStorage.getItem('token');
        
        // that.getUserPermission(temPer, that.userPermission, that, token, that.$api.userInfo);
        // console.log(that.userPermission);
    }
}
</script>

<style lang='less'>
@rem:100rem;

.express-out{
    width: 100%;
    .code-input{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 50/@rem;
        .input{
            width: 80%;
            height: 64/@rem;
            display: flex;
            align-items: center;
            .express-code{
                width: 80%;
                height: 48/@rem;
            }
            span{
                display: block;
                font-size: 18/@rem;
                margin-right: 50/@rem;
            }
        }
        .confirm-btn{
            width: 64%;
            margin-top: 32/@rem;
        }
    }
    .express-detail{
        width: 100%;
        margin-top: 20/@rem;
        .detail-header{
            width: 100%;
            height: 60/@rem;
            display: flex;
            align-items: center;
            border-bottom: 1/@rem solid #cccccc;
            span{
                font-size: 18/@rem;
                font-weight: 500;
                letter-spacing: 1/@rem;
            }
        }
        .detail-content{
            width: 100%;
            margin-top: 34/@rem;
            display: flex;
            min-height: 506/@rem;
            flex-wrap: wrap;
            .content-message{
                width: 50%;
                display: flex;
                flex-direction: column;
                .message{
                    height: 52/@rem;
                    line-height: 52/@rem;
                    font-size: 16/@rem;
                    margin-left: 200/@rem;
                    letter-spacing: 1/@rem;
                }
            }
            .content-progress{
                width: 50%;
                display: flex;
                flex-wrap: wrap;
                .progress-tree{
                    margin-left: 200/@rem;
                    .el-step{
                        height:100/@rem;
                    }
                }
            }
        }
    }
}

</style>
