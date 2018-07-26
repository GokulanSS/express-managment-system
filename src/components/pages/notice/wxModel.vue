<template>
    <div class="wx-model">
        <div class="wx-model-container">
            <el-form label-width="80px" :model="formContent">
                <el-form-item label="入库微信">
                    <el-input v-model="formContent.stored_template_code" @focus="changeSave"></el-input>
                    <el-button v-show="testBtn" @click="inputPhone('input',$event)" v-if="userPermission.indexOf('send_test_wechat_stored') >= 0">发送测试</el-button>
                </el-form-item>
                <el-form-item label="出库微信">
                    <el-input v-model="formContent.delivered_template_code" @focus="changeSave"></el-input>
                    <el-button v-show="testBtn" @click="inputPhone('output',$event)" v-if="userPermission.indexOf('send_test_wechat_delivered') >= 0">发送测试</el-button>
                </el-form-item>
                <el-form-item label="移库微信">
                    <el-input v-model="formContent.transferred_template_code" @focus="changeSave"></el-input>
                    <el-button v-show="testBtn" @click="inputPhone('move',$event)" v-if="userPermission.indexOf('send_test_wechat_transferred') >= 0">发送测试</el-button>
                </el-form-item>
                <el-form-item label="滞留微信">
                    <el-input v-model="formContent.delayed_template_code" @focus="changeSave"></el-input>
                    <el-button v-show="testBtn" @click="inputPhone('retention',$event)" v-if="userPermission.indexOf('send_test_wechat_delayed') >= 0">发送测试</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSave" v-show="saveBtn" v-if="userPermission.indexOf('set_wechat_template_codes') >= 0">保存</el-button>
                    <el-button type="primary" @click="onReset" v-show="resetBtn" v-if="userPermission.indexOf('set_wechat_template_codes') >= 0">修改</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name:'wxModel',
    data(){
        return {
            formContent: {
                "stored_template_code": "",
                "transferred_template_code": "",
                "delayed_template_code": "",
                "delivered_template_code": ""
            },
            token:'',
            saveBtn:false,
            resetBtn:true,
            testBtn:true,
            phoneNum:'',
            userPermission:[]
        }
    },
    methods:{
        onSave(){
            let that = this;
            let token = localStorage.getItem('token')
            that.$ajax(that, 'post', that.$api.setWxModel, that.formContent, token, function(res){
                if(res.data.code == 0){
                    that.saveBtn = false;
                    that.resetBtn = true;
                    that.testBtn = true;
                    that.$notify({
                        title: '保存成功',
                        message: '微信模板保存成功',
                        type: 'success'
                    })
                }else{
                    that.$notify.error({
                        title: '保存失败',
                        message: '微信模板保存错误！'
                    })
                }
            })
        },
        onReset(){
            this.saveBtn = true;
            this.resetBtn = false;
            this.testBtn = false;
        },
        getMsg(){
            let that = this;
            let token = localStorage.getItem('token')
            this.$ajax(that, 'get', that.$api.wxModel, null, token, function(res){
                if(res.data.code == 0){
                    that.formContent = res.data.data;
                }
            })
        },
        inputPhone(code, ev){
            let that = this;
            let token = localStorage.getItem('token');
            let url = '';
            switch (code){
                case 'input':
                    url = that.$api.testInputWx;
                    break;
                case 'output':
                    url = that.$api.testOutputWx;
                    break;
                case 'move':
                    url = that.$api.testMoveWx;
                    break;
                case 'retention':
                    url = that.$api.testDelayedWx;  
                    break;            
            }
            
            that.$prompt('请输入电话号码', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^1[2|3|4|5|6|7|8][0-9]\d{8}$/,
                inputErrorMessage: '号码格式不正确'
                }).then(({ value }) => {
                    that.phoneNum = value;
                    that.$ajax(that, 'post', url, {"phone":value}, token, function(res){
                        if(res.data.code == 0){
                            that.$notify({
                                title: '短信发送成功',
                                message: `信息已成功发送至${value}`,
                                type: 'success'
                            })
                        }else{
                            that.$notify.error({
                                title: '短信发送错误',
                                message: res.data.error
                            })
                        }
                    })
                }).catch(() => {
                that.$notify.info({
                    title: '提示消息',
                    message: '取消短信发送'
                })   
            })
        },
        changeSave(){
            this.saveBtn = true;
            this.resetBtn = false;
            this.testBtn = false;
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
        this.getMsg();
        this.getRoleList();
    }
}
</script>

<style lang='less'>
@rem:100rem;

.wx-model{
    width: 100%;
    display: flex;
    justify-content: center;
    .wx-model-container{
        width: 80%;
        margin-top: 45/@rem;
        margin-left: 300/@rem;
        .tips{
            color: #409EFF;
        }
        .el-form-item__content{
            display: flex;
        }
        .el-input{
            width: 500/@rem;
            margin-right: 20/@rem;
        }
    }
}

</style>
