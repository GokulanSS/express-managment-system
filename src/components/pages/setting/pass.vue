<template>
    <div class="edit-pass">
        <div class="edit-pass-container">
            <el-form :label-position="labelPosition" label-width="80px" :model="settingTable">
                <el-form-item class="tips" v-show="showTips.mismatching">
                    <span class="save-tips">{{mismatchingTips}}</span>
                </el-form-item>
                <el-form-item label="原密码">
                    <el-input type="password" v-model="settingTable.pw_old" @focus="hiddenTip"></el-input>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-input type="password" v-model="settingTable.pw_new" @focus="hiddenTip"></el-input>
                </el-form-item>
                
                <el-form-item class="tips" v-show="showTips.confirmTips">
                    <span class="save-tips">{{confirmPassTip}}</span>
                </el-form-item>
                <el-form-item label="确认输入">
                    <el-input type="password" v-model="confirmPass" @blur="confirmDouble"   @focus="hiddenTip"></el-input>
                </el-form-item>
                <el-form-item class="setting-btns">
                    <el-button type="primary" @click="onEdit">修改</el-button>
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
                pw_old: '',
                pw_new: ''
            },
            confirmPass: '',
            confirmPassTip:'两次密码不同',
            saveTips:'密码修改成功',
            mismatchingTips:'',
            showTips:{
                saveTips:false,
                confirmTips:false,
                mismatching: false
            }

        }
    },
    methods:{
        onEdit(){
            let token = localStorage.getItem('token')
            let that = this;
            this.confirmDouble();
            this.$axios.post(that.$api.editPass, this.settingTable, {
                headers:{
                    'Content-Type':'application/json',
                    'token': token
                }
            }).then(function(data){
                console.log(data);
                if(data.data.code == 0){
                    that.showTips.saveTips = true;
                    that.showTips.mismatching = false;
                }else{
                    that.mismatchingTips = data.data.error;
                    that.showTips.saveTips = false;
                    that.showTips.mismatching = true;
                }
            })
        },
        hiddenTip(){
            this.showTips.saveTips = false;
        },
        confirmDouble(){
            if(this.settingTable.pw_new != this.confirmPass){
                this.showTips.confirmTips = true;
            }else{
                this.showTips.confirmTips = false;
            }
        }
    }
}
</script>

<style lang='less'>
@rem:100rem;

.edit-pass{
    width: 100%;
    display: flex;
    justify-content: center;
    .edit-pass-container{
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
