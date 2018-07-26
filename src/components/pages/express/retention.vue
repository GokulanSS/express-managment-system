<template>
  <div class="express-retention">
      <div class="retention-container">
          <div class="retention-item">
              <div class="query-message">
                    <div class="message">
                        <span>快递单号 :</span>
                        <el-input v-model="query.tracking_number" placeholder="单号查询" class="message-content"></el-input>
                    </div>
                    <div class="message">
                        <span>电话 :</span>
                        <el-input v-model="query.recipient_phone" placeholder="电话查询" class="message-content"></el-input>
                    </div>
                    <div class="message">
                        <span>姓名 :</span>
                        <el-input v-model="query.recipient_name" placeholder="姓名查询" class="message-content"></el-input>
                    </div>
                    <div class="message">
                        <span>取件码 :</span>
                        <el-input v-model="query.pickup_code" placeholder="取件码查询" class="message-content"></el-input>
                    </div>
                    <div class="message">
                        <span>快递公司 :</span>
                        <el-select v-model="query.courier_code" filterable placeholder="请选择快递公司" class="message-content">
                            <el-option
                            v-for="item in expressCompany"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
              </div>
              <div class="query-btns">
                  <el-button type="primary" size="small" @click="countRention">统计滞留件</el-button>
                  <el-button type="primary" size="small" @click="searchData">数据查询</el-button>
                  <el-button type="primary" size="small" @click="outputTable" v-if="userPermission.indexOf('export_delayed_package') >= 0">导出表格</el-button>
              </div>
          </div>
          <div class="retention-table">
              <div class="query-table">
              <div class="table">
                <el-table
                    :data="retention.data"
                    border
                    height="450"
                    ref="multipleTable"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="selectionChange">
                    <el-table-column
                    type="selection"
                    width="40">
                    </el-table-column>
                    <el-table-column
                    prop="tracking_number"
                    label="单号"
                    width="200">
                    </el-table-column>
                    <el-table-column
                    prop="recipient_name"
                    label="姓名"
                    width="95">
                    </el-table-column>
                    <el-table-column
                    prop="recipient_phone"
                    label="电话"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="site_name"
                    label="快递站点">
                    </el-table-column>
                    <el-table-column
                    prop="last_noticed_at"
                    label="最后通知时间"
                    width="200">
                    </el-table-column>
                    <el-table-column
                    prop="pickup_code"
                    label="取件码"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="state_code"
                    label="当前状态">
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    width="176">
                        <template slot-scope="scope">
                            <el-button @click="output(scope.row)" type="text" size="medium">出库</el-button>
                            <el-button @click="input(scope.row)" type="text" size="medius">入库</el-button>
                            <el-button @click='detail(scope.row)' type="text" size="medium">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
              </div>
              <div class="pages">
                  <div class="export-table">
                      <el-button type="primary" size="small" class="send-message" @click="sendMessage">发送消息</el-button>
                      <span class="tips">已选择{{checkedCount}}件</span>
                  </div>
              </div>
          </div>
          </div>
          <div class="query-dialog" v-if="userPermission.indexOf('export_delayed_package') >= 0">
                <el-dialog title="下载地址" :visible.sync="dialogVisible">
                    <a :href="tableSrc">{{tableSrc}}</a>
                </el-dialog>
          </div>
      </div>
  </div>
</template>

<script>
export default {    
    name:'express',
    data(){
        return {
            expressCompany:[],
            query:{
                "tracking_number": "",
                "recipient_phone": "",
                "recipient_name": "",
                "pickup_code": "",
                "courier_code": ""
            },
            retention:{
                data: []
            },
            pagination:{
                pageSize:100,
                total:1000,
                currentPage:1
            },
            checkedCount:0,
            checkList:[],
            token:'',
            dialogVisible:false,
            tableSrc:'',
            userPermission:[]
        }
    },
    methods:{
        output(val){
            let that = this;
            sessionStorage.setItem('packageNum', val.tracking_number);
            that.$router.push({ name: '快递出库', params: { status: 'output' }});
        },
        input(val){
            let that = this;
            sessionStorage.setItem('packageNum', val.tracking_number);
            that.$router.push({ name: '快递入库', params: { status: val }});
        },
        detail(val){
            sessionStorage.setItem('packageNum', val.tracking_number);
            this.$router.push("/manage/express/detail");
        },
        handleSizeChange(){},
        handleCurrentChange(){},
        selectionChange(tableList){
            this.checkList = tableList;
            this.checkedCount = tableList.length;
        },
        getCompony(){
            // let that = this;
            // let keys = Object.keys(this.$compony);
            // for(let i=0; i<keys.length; i++){
            //     let temObj = {};
            //     temObj.value = keys[i];
            //     temObj.label = this.$compony[keys[i]];
            //     this.expressCompany.push(temObj);
            // } 
            let that = this;
            let token = localStorage.getItem('token');
            that.$ajax(that, 'get', that.$api.getCompony, null, token, function(res){
                if(res.data.code == 0){
                    that.expressCompany = that.transformCompony(res.data.data);
                }
            }) 
        },
        searchData(){
            console.log(this.query);
            let that = this;
            let token = that.token;
            that.$axios.post(that.$api.retention, that.query, {
                headers:{
                    "Content-Type":"application/json",
                    "token":token
                }
            }).then(function(res){
                console.log(res);
                if(res.data.code == 0){
                    that.retention.data = res.data.data.package;
                    that.retention.data.forEach( item => {
                        item.state_code = '滞留件';
                    })
                }else{
                    that.$notify.error({
                        title: '滞留查询失败',
                        message: res.data.error
                    }); 
                }
            })
        },
        outputTable(){
            let that = this;
            that.$ajax(that, 'post', that.$api.outputRetentionTable, that.query, that.token, function(res){
                console.log(res);
                if(res.data.code == 0){
                    that.dialogVisible = true;
                    that.tableSrc = that.$api.BASE + res.data.data['file_link'];
                }else{
                    that.$notify.error({
                        title: '导出表单错误',
                        message: res.data.error
                    });   
                }
            })
        },
        sendMessage(){
            let that = this;
            if(this.checkedCount == 0){
                return;
            }
            let checkedList = this.checkList;
            let token = localStorage.getItem('token');
            checkedList.forEach(item => {
                let loading = that.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                that.$ajax(that, 'post', that.$api.sendRetentionMsg, {"package_id":item['package_id']}, token, function(res){
                    if(res.data.code == 0){
                        console.log('send success');
                    }else{
                        that.$notify.error({
                            title: '发送信息失败',
                            message: res.data.error
                        })
                    }
                    loading.close();
                })
            })
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
        },
        countRention(){
            let that = this;
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            let token = localStorage.getItem('token');
            that.$ajax(that, 'get', that.$api.countRetention, null, token, function(res){
                if(res.data.code == 0){
                    that.$notify({
                        title: '统计成功',
                        message: `滞留件已统计成功`,
                        type: 'success'
                    })
                }else{
                    that.$notify.error({
                        title: '统计失败',
                        message: res.data.error
                    })
                }
                loading.close();
            })
        }
    },
    mounted(){
        this.getCompony();
        this.getRoleList();
        this.token = localStorage.getItem('token');
    }
}
</script>

<style lang='less'>
@rem:100rem;

.el-message-box{
    width: auto;
}
.express-retention{
    width: 100%;
    display: flex;
    justify-content: center;
    .retention-container{
        width: 1486/@rem;
        margin-top: 30/@rem;
        
        .retention-item{
            width: 100%;
            .query-message{
                width: 100%;
                display: flex;
                justify-content: space-between;
                .message{
                    height: 70/@rem;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    span{
                        font-size: 16/@rem;
                    }
                    .message-content{
                        width: 200/@rem;
                        margin-left: 10/@rem;
                        .el-select > .el-input{
                            height: 100%;
                        }
                    }
                }
            }
            .query-btns{
                width: 100%;
                margin-top: 30/@rem;
                display: flex;
                justify-content: flex-end;
            }
        }
        .retention-table{
            margin-top: 30/@rem;
            .pages{
                width: 100%;
                height: 90/@rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .export-table{
                    height: 40/@rem;
                    display: flex;
                    align-items: center;
                    .tips{
                        height: 100%;
                        display: flex;
                        font-size: 14/@rem;
                        margin-left: 18/@rem;
                        color: #ff0000;
                        align-items: flex-end;
                        letter-spacing: 1/@rem;
                    }
                }
            }
        }
    }
}
</style>
