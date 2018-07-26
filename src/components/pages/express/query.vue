<template>
  <div class="express-query">
      <div class="query-container">
          <div class="query-item">
              <div class="query-message">
                  <div class="message">
                      <span>快递单号 :</span>
                      <el-input v-model="query.tracking_number" placeholder="请输入内容" class="message-content"></el-input>
                  </div>
                  <div class="message">
                      <span>电话 :</span>
                      <el-input v-model="query.recipient_phone" placeholder="请输入内容" class="message-content"></el-input>
                  </div>
                  <div class="message">
                      <span>姓名 :</span>
                      <el-input v-model="query.recipient_name" placeholder="请输入内容" class="message-content"></el-input>
                  </div>
                  <div class="message">
                      <span>取件码 :</span>
                      <el-input v-model="query.pickup_code" placeholder="请输入内容" class="message-content"></el-input>
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
              <div class="query-date">
                  <span>日期查询 :</span>
                  <el-date-picker
                        class="choose-date"
                        v-model="datePicker"
                        type="daterange"
                        align="center"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions">
                  </el-date-picker>
              </div>
              <div class="query-state">
                  <span class="state-title">快递状态 :</span>
                  <el-checkbox class="check-all" :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllItem">全部</el-checkbox>
                  <el-checkbox-group v-model="checkList" @change="checkItem">
                        <el-checkbox v-for="(item,index) in checkContent" :label="item.id" :key="index">{{item.title}}</el-checkbox>
                  </el-checkbox-group>
                  <el-button class="query-data" size="small" type="primary" @click="dataQuery">数据查询</el-button>
                  <el-button class="refresh-query" size="small" type="primary" @click="refreshQuery">刷新</el-button>
              </div>
          </div>
          <div class="query-table">
              <div class="table">
                  <el-table
                    :data="tables.data"
                    border
                    height="1000"
                    style="width: 100%">
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
                    label="所在学校">
                    </el-table-column>
                    <el-table-column
                    prop="state_updated_at"
                    label="状态修改时间"
                    width="200">
                    </el-table-column>
                    <el-table-column
                    prop="pickup_code"
                    label="取件码"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="courier_code"
                    label="快递公司"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="state_code"
                    label="当前状态">
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    width="220">
                        <template slot-scope="scope">
                            <el-button @click="output(scope.row)" type="text" size="medium" v-if="userPermission.indexOf('deliver_package') >= 0">出库</el-button>
                            <el-button @click="input(scope.row)" type="text" size="medium" v-if="userPermission.indexOf('store_package') >= 0">入库</el-button>
                            <el-button @click="move(scope.row)" type="text" size="medium" v-if="userPermission.indexOf('transfer_package') >= 0">移库</el-button>
                            <el-button @click='detail(scope.row)' type="text" size="medium" v-if="userPermission.indexOf('get_package_detail_by_tracking_number') >= 0">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
              </div>
              <div class="pages">
                  <div class="pagination">
                      <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="pagination.currentPage"
                        :page-size="pagination.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="pagination.total">
                    </el-pagination>
                  </div>
                  <div class="export-table" v-if="userPermission.indexOf('query_package_export') >= 0">
                      <el-button type="primary" size="small" @click="outputTable">导出表格</el-button>
                  </div>
              </div>
          </div>
          <div class="query-dialog" v-if="userPermission.indexOf('query_package_export') >= 0">
                <el-dialog title="下载地址" :visible.sync="dialogVisible">
                    <a :href="tableSrc">{{tableSrc}}</a>
                </el-dialog>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name:'expressQuery',
    data(){
        return {
            checkOptions:[],
            checkList:[],
            checkAll:false,
            isIndeterminate:true,
            checkContent:[
                {id:0, title:'已采集', name:'collected'},
                {id:1, title:'已入库/未取', name:'stored'},
                {id:2, title:'已出库', name:'delivered'},
                {id:3, title:'滞留', name:'delayed'},
                {id:4, title:'已扫描', name:'scanned'},
            ],
            expressStatus:{
                collected:'已采集',
                stored:'已入库/未取',
                delivered:'已出库',
                delayed:'滞留',
                scanned:'已扫描'
            },
            query:{
                "tracking_number": "",
                "recipient_phone": "",
                "recipient_name": "",
                "pickup_code": "",
                "start_date": 0,
                "end_date": 0,
                "courier_code": "",
                "package_states": [],
                "page": 1,
                "page_size": 50
            },
            expressCompany:[],
            datePicker:[],
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
            tables:{
              data:[]
            },
            pagination:{
                pageSize:50,
                total:1,
                currentPage:1
            },
            token:'',
            dialogVisible:false,
            tableSrc:'',
            userPermission:[]
        }
    },
    methods:{
        checkAllItem(val){
            this.checkList = val ? this.checkOptions : [];
            this.isIndeterminate = false;
            //checkList用于记录当前选项的index
            console.log(this.checkList);
        },
        checkItem(val){
            let checkedCount = val.length;
            this.checkAll = checkedCount === this.checkOptions.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkOptions.length;
            console.log(this.checkList);
            let checkContent = this.checkContent;
            let temArr = [];
            for(let i=0, list=this.checkList; i<list.length; i++){
                for(let j=0; j<checkContent.length; j++){
                    if(list[i] == checkContent[j]['id']){
                        temArr.push(checkContent[j]['name'])
                    }
                }
            }
            //console.log(temArr);
            this.query['package_states'] = temArr;
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
        output(val){
            let that = this;
            sessionStorage.setItem('packageNum', val.tracking_number);
            that.$router.push({ name: '快递出库', params: { status: 'output' }});
        },
        input(val){
            let that = this;
            sessionStorage.setItem('packageNum', val.tracking_number);
            that.$router.push({ name: '快递入库', params: { status: val}});
        },
        move(val){
            let that = this;
            sessionStorage.setItem('packageNum', val.tracking_number);
            that.$router.push({ name: '快递移库', params: { status: val }});
        },
        detail(val){
            sessionStorage.setItem('packageNum', val.tracking_number);
            sessionStorage.setItem('packageId',val.pacakge_id);
            this.$router.push("/manage/express/detail");
        },
        handleSizeChange(val){
            console.log(val);
        },
        handleCurrentChange(val){
            console.log(val);
            let that = this;
            that.query.page = val;
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            that.$ajax(that, 'post', that.$api.query, that.query, that.token, function(res){
                if(res.data.code == 0){
                    let temData = res.data.data.packages;
                    for(let i=0; i<temData.length; i++){
                        temData[i]['state_code'] = that.expressStatus[temData[i]['state_code']];
                        temData[i]['courier_code'] = that.$compony[temData[i]['courier_code']];
                    }
                    that.tables.data = res.data.data.packages;
                }else{
                    that.$notify.error({
                        title: '查询错误',
                        message: res.data.error
                    })
                }
                loading.close();
            })
        },
        dataQuery(){
            let dateRang = this.datePicker;
            let queryCondition = this.query;
            queryCondition.start_date = parseInt(this.timeStamp(dateRang[0])/1000);
            queryCondition.end_date = parseInt(this.timeStamp(dateRang[1])/1000);
            console.log(queryCondition);
            // return;
            let that = this;
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            that.$axios.post(that.$api.query, queryCondition, {
                headers:{
                    "Content-Type":"application/json",
                    "token":that.token
                }
            }).then(function(res){
                console.log(res);
                if(res.data.code == 0){
                    if(res.data.data.packages.length == 0){
                        that.$notify.info({
                            title: '提示消息',
                            message: '未查询到任何数据'
                        });
                    }else{
                        that.pagination.total = res.data.data['total_count'];
                        that.pagination.currentPage = parseInt(res.data.data['current_page']);
                        let temData = res.data.data.packages;
                        for(let i=0; i<temData.length; i++){
                            temData[i]['state_code'] = that.expressStatus[temData[i]['state_code']];
                            temData[i]['courier_code'] = that.$compony[temData[i]['courier_code']];
                        }
                        that.tables.data = res.data.data.packages;
                    }
                }else{
                    that.$notify.error({
                        title: '查询错误',
                        message: res.data.error
                    })
                }
                loading.close();
            })
        },
        refreshQuery(){
           let temData = this.tables.data;
           if(temData.length == 0){
               return;
           } 
           this.dataQuery();
        },
        outputTable(){
            let that = this;
            that.$ajax(that, 'post', that.$api.outputQueryTable, that.query, that.token, function(res){
                console.log(res);
                if(res.data.code == 0){
                    that.dialogVisible = true;
                    that.tableSrc = that.$api.BASE + res.data.data['file_link'];
                }else{
                    that.$notify.error({
                        title: '导出表单错误',
                        message: res.data.error
                    })
                }
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
        }
    },
    mounted(){ 
        this.checkContent.forEach( (item,index) => {
            this.checkOptions.push(index);
        })
        this.getCompony();
        this.token = localStorage.getItem('token');
        this.getRoleList();
    }
}
</script>

<style lang='less'>
@rem:100rem;

.express-query{
    width: 100%;
    display: flex;
    justify-content: center;
    .query-container{
        width: 1486/@rem;
        margin-top: 30/@rem;
        .el-message-box{
            width: auto;
        }
        .query-item{
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
            .query-date{
                width: 100%;
                margin-top: 30/@rem;
                span{
                    font-size: 16/@rem;
                }
                .choose-date{
                    margin-left: 7/@rem;
                }
            }
            .query-state{
                width: 100%;
                margin-top: 30/@rem;
                display: flex;
                align-items: center;
                .state-title{
                    font-size: 16/@rem;
                    margin-right: 7/@rem;
                }
                .check-all{
                    margin-right: 30px;
                    margin-left: 6/@rem;
                }
                span{
                    font-size: 16/@rem;
                }
                .query-data{
                    margin-left: 180/@rem;
                }
            }
        }
        .query-table{
            margin-top: 40/@rem;
        }
        .pages{
            width: 100%;
            height: 90/@rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
}

</style>
