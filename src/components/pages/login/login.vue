<template>
  <div class="login">
      <div class="login-container">
          <div class="login-content">
              <div class="login-title">
                  <div class="title">
                      <p>快递管理系统</p>
                      <p>Express Management System</p>
                  </div>
                  <div class="tip">
                      <span>请登录</span>
                      <img src="~/assets/login/arrow.png" alt="">
                  </div>
              </div>
              <div class="login-message">
                  <div class="account message">
                      <span>Account</span>
                      <div class="account-input">
                          <img src="~/assets/login/user.png" alt="">
                          <input type="text" v-model="userMsg.username" placeholder="请输入账号">
                      </div>
                  </div>
                  <div class="password message">
                      <span>Password</span>
                      <div class="account-input">
                          <img src="~assets/login/password.png" alt="">
                          <input type="password" v-model="userMsg.password" placeholder="请输入个人密码">
                      </div>
                  </div>
                  <div class="error">
                      <div class="error-box" v-show="errorTip">
                        <img src="~assets/login/tip.png" alt="">
                        <span>{{errorMsg}}</span>
                      </div>
                      
                  </div>
                  <div class="remenber">
                      <el-checkbox class="remenber-btn" v-model="checked" @change="tipsPass($event)">记住账号密码</el-checkbox>
                  </div>
                  <div class="login-submit">
                      <el-button class="submit-btn" @click="login">登陆</el-button>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Base64 } from 'js-base64'

export default {
    name:'login',
    data(){
        return {
            checked:false,
            userMsg:{
                username:'',
                password:''
            },
            errorTip:false,
            errorMsg:'',
            apis:null
        }
    },
    methods:{
        login(){
            let that = this;
            that.$ajax(that, 'post', that.$api.login, that.userMsg, null, function(res){
                if(res.data.code == 0){
                    let token = res.data.data.token;
                    localStorage.setItem('token', token);
                    that.$ajax(that, 'get', that.$api.userInfo, null, token, function(res){
                        if(res.data.code == 0){
                            if(that.checked){
                                localStorage.setItem('name', that.userMsg.username);
                                localStorage.setItem('pass', Base64.encode(that.userMsg.password));
                            }else{
                                localStorage.removeItem('name');
                                localStorage.removeItem('pass');
                            }
                            sessionStorage.setItem('siteId', res.data.data['current_site_id']);
                            that.$router.push('/manage/chart');
                        }
                    })
                    
                }else{
                    that.$notify.error({
                        title: '登录失败',
                        message: res.data.error
                    })
                    return; 
                }
            })
        },
        tipsPass(ev){
            console.log(ev);
            if(ev){
                this.$notify({
                    title: '警告',
                    message: '请不要在公共网络环境保存密码!',
                    type: 'warning'
                })
            }
        }    
    },
    mounted(){
        let that = this;
        let username = localStorage.getItem('name');
        let userpass = localStorage.getItem('pass');
        if(username && userpass){
            that.checked = true;
            that.userMsg.username = username;
            that.userMsg.password = Base64.decode(userpass);
        }
        document.onkeyup = function(e){
            let key = e.keyCode;
            if(key == 13){
                that.login();
            }
        }
    }
}
</script>

<style lang='less'>
@rem:100rem;

.login{
    width: 1920/@rem;
    height: 100%;
    background: url('../../../assets/login/login_bg.jpg') no-repeat;
    .login-container{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-end;
        .login-content{
            width: 760/@rem;
            height: 500/@rem;
            background: #fff;
            overflow: hidden;
            border-radius: 10/@rem;
            display: flex;
            align-items: center;
            margin: 237/@rem 150/@rem 0 0;
            .login-title{
                width: 300/@rem;
                height: 100%;
                background: url('../../../assets/login/login_sm_bg.png');
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                .title{
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    color: #fff;
                    p:first-child{
                        font-size: 36/@rem;
                        margin-top: 50/@rem;
                    }
                    p:last-child{
                        font-size: 18/@rem;
                        margin-top: 18/@rem;
                    }
                }
                .tip{
                    height: 70/@rem;
                    width: 223/@rem;
                    border: 1px solid #fff;
                    border-radius: 5px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 45/@rem;
                    span{
                        font-size: 24/@rem;
                        color: #fff;
                        margin-right: 11/@rem;
                    }
                    img{
                        height: 26/@rem;
                        width: 23/@rem;
                    }
                }
            }
            .login-message{
                width: 460/@rem;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                .message{
                    width: 380/@rem;
                    display: flex;
                    flex-direction: column;
                    span{
                        font-size: 24/@rem;
                        color: #dbd9dc;
                        margin-top: 40/@rem;
                        margin-bottom: 10/@rem;
                    }
                    .account-input{
                        height: 56/@rem;
                        width: 380/@rem;
                        display: flex;
                        align-items: center;
                        border-bottom: 2/@rem solid #eaeaea;
                        img{
                            height: 36/@rem;
                            width: 30/@rem;
                            margin-right: 14/@rem;
                        }
                        input{
                            font-size: 24/@rem;
                            color: #6d6b6e;
                            border: none;
                            outline: none;
                        }
                    }
                }
                .error{
                    width: 380/@rem;
                    height: 22/@rem;
                    margin-top: 14/@rem;
                    .error-box{
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        font-size: 14/@rem;
                        color: #ff0000;
                    }
                    img{
                        height: 20/@rem;
                        width: 20/@rem;
                        margin-right: 22/@rem;
                    }
                }
                .remenber{
                    width: 380/@rem;
                    height: 30/@rem;
                    display: flex;
                    align-items: center;
                    margin: 21/@rem 0;
                    .remenber-btn{
                        height: 36/@rem;
                        width: 30/@rem;
                        .el-checkbox__label{
                            font-size: 16/@rem;
                        }
                        
                    }
                }
                .login-submit{
                    height: 60/@rem;
                    width: 380/@rem;
                    .submit-btn{
                        height: 100%;
                        width: 100%;
                        color: #fff;
                        font-size: 26/@rem;
                        background: #6c8dd6;
                    }
                }
            }
        }
    }
    
}
</style>
