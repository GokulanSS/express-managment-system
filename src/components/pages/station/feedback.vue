<template>
  <div class="feedback">
      <div class="feedback-container">
          <el-table
            :data="feedback.data"
            style="width: 100%">
            <el-table-column
                prop="username"
                label="反馈用户"
                width="180">
            </el-table-column>
            <el-table-column
                prop="content"
                label="反馈内容"
                >
            </el-table-column>
            <el-table-column
                prop="created_at"
                label="反馈时间"
                width="180">
            </el-table-column>
          </el-table>

          <div class="pagination">
              <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :page-size="pagination.pageSize"
                    :total="pagination.total">
               </el-pagination>
          </div>  
      </div>
  </div>
</template>

<script>
export default {
    name:'feedback',
    data(){
        return {
            feedback:{
                data:[]
            },
            token:'',
            pagination:{
                pageSize:30,
                total:0
            }
        }
    },
    methods:{
        getFeedback(){
            let that = this;
            if(that.feedback.data.length == 0){
                let loading = that.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                that.$ajax(that, 'get', that.$api.feedback, null, that.token, function(res){
                    console.log(res);
                    if(res.data.code == 0){
                        let temData = res.data.data;
                        for(let i=0; i<temData.length; i++){
                            temData[i]['created_at'] = that.secondsFormat(temData[i]['created_at']);
                        }
                        console.log(temData);
                        that.feedback.data = temData;
                        that.pagination.total = temData.length;
                    }else{
                        that.$notify.error({
                            title: '获取用户反馈错误',
                            message: res.data.error
                        });
                    }
                    loading.close();
                })
            }
        }
    },
    mounted(){
        this.token = localStorage.getItem('token');
        this.getFeedback();
    }
}
</script>

<style lang='less'>
@rem:100rem;

.feedback{
    width: 100%;
    display: flex;
    justify-content: center;
    .feedback-container{
        width: 80%;
        margin-top: 140/@rem;
        .pagination{
            width: 100%;
            margin-top: 80/@rem;
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
