<template>
  <div class="message-method">
      <div class="message-method-container">
          <div class="choose-method">
              <div class="title">
                <p>信息优先发送配置: </p>
                <el-select v-model="chooseMethod" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
              </div>
              <div class="save">
                  <el-button type="primary" class="save-btn"  @click="messageMethod">保存</el-button>
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
    name:'messageMethod',
    data(){
        return {
            options:[
                {value:'wechat', label:'微信发送'},
                {value:'text_message', label:'短信发送'}
            ],
            chooseMethod:'wechat',
            token:''
        }
    },
    methods:{
        messageMethod(val){
            //console.log(val);
            let that = this;
            if(that.chooseMethod.length == 0){
                that.$notify({
                    title: '缺少参数',
                    message: '请选择一种信息发送方式',
                    type: 'warning'
                })
            }else{
                console.log(that.chooseMethod);
                let loading = that.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                that.$ajax(that, 'post', that.$api.messageMethod, {"method":that.chooseMethod}, that.token, function(res){
                    if(res.data.code == 0){
                        let temMethod = '';
                        for(let i=0; i<that.options.length; i++){
                            if(that.chooseMethod == that.options[i]['value']){
                                temMethod = that.options[i]['label'];
                            }
                        }
                        that.$notify({
                            title: '设置成功',
                            message: '当前信息发送方式为:'+temMethod,
                            type: 'success'
                        });
                    }else{
                        that.$notify.error({
                            title: '设置失败',
                            message: res.data.error
                        })
                    }
                    loading.close();
                })
            }
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
            that.$ajax(that, 'get', that.$api.getMsgMethod, null, token, function(res){
                if(res.data.code == 0){
                    that.chooseMethod = res.data.data;
                }
                loading.close();
            })
        }
    },
    mounted(){
        this.getMethod();
        this.token = localStorage.getItem('token');
    }
}
</script>

<style lang='less'>
@rem:100rem;

.message-method{
    width: 100%;
    display: flex;
    justify-content: center;
    .message-method-container{
        width: 50%;
        margin-top: 100/@rem;
        .choose-method{
            p{
                font-size: 24/@rem;
                letter-spacing: 1/@rem;
            }
            .current-station{
                margin-bottom: 40/@rem;
                span{
                    margin-left: 30/@rem;
                }
            }
            .title{
                width: 100%;
                display: flex;
                align-items: center;
                p{
                    margin-right: 40/@rem;
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
