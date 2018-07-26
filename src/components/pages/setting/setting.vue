<template>
    <div class="setting">
        <div class="setting-container">
            <el-form :label-position="labelPosition" label-width="80px" :model="settingTable">
                <el-form-item label="姓名">
                    <el-input v-model="settingTable.name" @focus="hiddenTip"></el-input>
                </el-form-item>
                <el-form-item class="tips" v-show="showTips.telTips">
                    <span class="save-tips">{{telTips}}</span>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="settingTable.phone" @blur="telError" @focus="hiddenTip"></el-input>
                </el-form-item>
                
                <el-form-item class="tips" v-show="showTips.emailTips">
                    <span class="save-tips">{{emailTips}}</span>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="settingTable.email"  @blur="emailError" @focus="hiddenTip"></el-input>
                </el-form-item>
                <el-form-item class="setting-btns">
                    <el-button type="primary" @click="onSave">保存</el-button>
                    <router-link to="/manage/setting/password">修改密码</router-link>
                </el-form-item>
                <el-form-item v-show="showTips.saveTips">
                    <span class="save-tips save">{{saveTips}}</span>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name:"setting",
    data(){
        return{
            labelPosition:'right',
            settingTable: {
                role_id: 0,
                name: '',
                phone: '',
                email: ''
            },
            saveTips:'个人设置修改已保存',
            telTips:'请确认手机号码是否正确',
            emailTips:'请确认邮箱是否正确',
            showTips:{
                saveTips:false,
                telTips:false,
                emailTips:false
            }

        }
    },
    methods:{
        onSave(){
            let token = localStorage.getItem('token')
            this.telError();
            this.emailError();
            let that = this;
            that.settingTable['role_id'] = sessionStorage.getItem('roleId');
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            this.$axios.post(that.$api.setting, this.settingTable, {
                headers:{
                    'Content-Type':'application/json',
                    'token': token
                }
            }).then(function(data){
                console.log(data);
                if(data.data.code == 0){
                    that.showTips.saveTips = true;
                }else{
                    that.showTips.saveTips = false;
                }
                loading.close();
            })
        },
        telError(){
            let regPhone = /^1[2|3|4|5|6|7|8][0-9]\d{8}$/;
            let regTel = /0\d{2,3}-\d{7,8}/;
            if(regPhone.test(this.settingTable.phone) || regTel.test(this.settingTable.phone)){
                this.showTips.telTips = false;
            }else{
                this.showTips.telTips = true;
            }
        },
        emailError(){
            let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if(reg.test(this.settingTable.email)){
                this.showTips.emailTips = false;
            }else{
                this.showTips.emailTips = true;
            }
        },
        hiddenTip(){
            this.showTips.saveTips = false;
        },
        getUserMsg(){
            let that = this;
            let token = localStorage.getItem('token');
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            that.$ajax(that, 'get', that.$api.userInfo, null, token, function(res){
                if(res.data.code == 0){
                    let temData = res.data.data;
                    that.settingTable['name'] = temData['name'];
                    that.settingTable['phone'] = temData['phone'];
                    that.settingTable['email'] = temData['email'];
                }else{
                    that.$notify.error({
                        title: '获取信息失败',
                        message: '您的个人信息获取失败，请稍后再试！'
                    })
                }
                loading.close();
            })
        }
    },
    mounted(){
        this.getUserMsg();
    }
}
</script>

<style lang='less'>
@rem:100rem;

.setting{
    width: 100%;
    display: flex;
    justify-content: center;
    .setting-container{
        width: 50%;
        margin-top: 200/@rem;

        .tips{
            height: 40/@rem;
            margin-bottom: 5/@rem;
            color: #d81e06;
        }

        .save-tips{
            height: 100%;
            display: block;
        }

        .save{
            color: #409eff;
        }
        .setting-btns{
            .el-form-item__content{
                display: flex;
                align-items: flex-end;    
                a{
                    line-height: 20/@rem;
                    font-size: 14/@rem;
                    color: #409eff;
                    margin-left: 40/@rem;
                }
            }
        }
    }
}

</style>
