<template>
  <div class="code-method">
      <div class="code-method-container">
          <div class="choose-method">
            <div class="title">
                <p>取件码生成方式选择: </p>
                <el-select v-model="chooseMethod" placeholder="请选择" @change="codeMethod">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>  
            <div class="save">
                <el-button type="primary" class="save-btn" @click="saveMethod">保存</el-button>
            </div>
          </div>
          <div class="method-tips">
              <p>说明 :</p>
              <p>1. 此权限设置由高级管理员设置并下发至管理员端。</p>
              <p>2. 短信发送方式配置设定后，会遵循设定，向用户发送快递信息和通知信息。</p>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name:'codeMethod',
    data(){
        return {
            options:[
                {value:'combination', label:'货架号码和运单号组合生成取件码'},
                {value:'increment', label:'递增生成取件码'},
                {value:'static', label:'货架号'}
            ],
            chooseMethod:'combination'
        }
    },
    methods:{
        codeMethod(val){
            console.log(val);
            this.chooseMethod = val;
        },
        saveMethod(){
            let that = this;
            let token = localStorage.getItem('token');
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            that.$axios.post(that.$api.codeMethod, {"pickup_code_gen_method": that.chooseMethod}, {
                headers:{
                    "Content-Type":"application/json",
                    "token":token
                }
            }).then(function(res){
                let choose = that.chooseMethod;
                let codeContent = '';
                for(let i=0; i<that.options.length; i++){
                    if(that.options[i]['value'] == choose){
                        codeContent = that.options[i]['label'];
                    }
                }
                if(res.data.code == 0){
                    that.$notify({
                        title: '修改成功',
                        message: `当前取件码方式为 : ${codeContent}`,
                        type: 'success'
                    })
                }else{
                    this.$notify.error({
                        title: '失败',
                        message: res.data.error
                    })
                }
                loading.close();
            })
        },
        getMethod(){
            let that = this;
            let token = localStorage.getItem('token');
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            that.$ajax(that, 'get', that.$api.getPackageCode, null, token, function(res){
                if(res.data.code == 0){
                    that.chooseMethod = res.data.data;
                }
                loading.close();
            })
        }
    },
    mounted(){
        this.getMethod();
    }
}
</script>

<style lang='less'>
@rem:100rem;

.code-method{
    width: 100%;
    display: flex;
    justify-content: center;
    .code-method-container{
        width: 50%;
        margin-top: 100/@rem;
        .choose-method{
            width: 100%;
            display: flex;
            flex-direction: column;
            .title{
                width: 100%;
                display: flex;
                align-items: center;
                p{
                    font-size: 24/@rem;
                    margin-right: 42/@rem;
                }
                .el-input{
                    width: 400/@rem;
                }
            }
            .save{
                width: 50%;
                display: flex;
                justify-content: center;
                margin-top: 50/@rem;
                .save-btn{
                    width: 150/@rem;
                }
            }
        }
        .method-tips{
            font-size: 16/@rem;
            color: #999999;
            line-height: 40/@rem;
            margin-top: 108/@rem;
        }
    }
}

</style>
