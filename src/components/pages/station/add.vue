<template>
  <div class="add" v-if="userPermission.indexOf('add_admin') >= 0 || userPermission.indexOf('add_staff') >= 0">
      <div class="add-container">
          <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="添加类型" class="select-drop">
                <el-select v-model="kind" placeholder="请选择" @change="selectKinds" v-if="userPermission.indexOf('add_admin') >= 0">
                    <el-option
                        v-for="item in addKinds"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="角色设置" class="select-drop" v-show="showRoleList" v-if="userPermission.indexOf('add_admin') >= 0">
                <el-select v-model="form.role_id" placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="登录账号">
                <el-input v-model="form.username"></el-input>
              </el-form-item>
              <el-form-item label="登录密码">
                <el-input v-model="form.password"></el-input>
              </el-form-item>
              <el-form-item label="用户姓名">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="联系方式">
                <el-input v-model="form.phone"></el-input>
              </el-form-item>
              <el-form-item class="add-btn">
                <el-button type="primary" @click="onSubmit">保存</el-button>
              </el-form-item>
          </el-form>
      </div>
  </div>
</template>

<script>
export default {
    name:'add',
    data(){
        return {
            form:{
                username:'',
                password:'',
                name:'',
                phone:'',
                role_id:''
            },
            kind:'',
            options:[],
            addKinds:[
                {value:'1', label:'管理成员'},
                {value:'2', label:'员工'}
            ],
            showRoleList: false,
            dialogVisible:false,
            dialogContent:'',
            userPermission:[],
            rolesDetailList:[]
        }
    },
    methods:{
        onSubmit(){
            let that = this;
            let token = localStorage.getItem('token');
            let roles = JSON.parse(sessionStorage.getItem('roles'));
            let temForm = JSON.parse(JSON.stringify(that.form));
            if(!that.showRoleList){
                that.form['role_id'] = 1;
            }
            if(!roles){
                roles = this.rolesDetailList;
            }
            roles.forEach(item => {
                if(item['role_name'] == temForm['role_id']){
                    temForm['role_id'] = item['id'];
                }
            })
            
            for(let key in this.form){
                if(this.showRoleList == false){
                    if(this.form[key]['length'] == 0){
                        this.dialogContent = '请确认信息填写完整！';
                        this.dialogVisible = true;
                        return;
                    }else{
                        this.dialogVisible = false;
                    }
                }else{
                    if(this.form[key]['length'] == 0){
                        this.dialogContent = '请确认信息填写完整！';
                        this.dialogVisible = true;
                        return;
                    }else{
                        this.dialogVisible = false;
                    }
                }
            }
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            if(!that.showRoleList){   
                that.$axios.post(that.$api.addStaff, that.form, {
                    headers:{
                        "Content-Type":"application/json",
                        "token":token
                    }
                }).then(function(res){
                    console.log(res);
                    if(res.data.code == 0){
                        that.$notify({
                            title: '成功',
                            message: '人员信息添加成功',
                            type: 'success'
                        });
                        that.form = {
                            username:'',
                            password:'',
                            name:'',
                            phone:'',
                            role_id:''
                        }
                        that.$router.push({ name: '站点详情', params: { add: true }})
                    }else{
                        that.$notify({
                            title:'失败',
                            message:res.data.error,
                            type:'error'
                        })
                    }
                    loading.close();
                })
            }else{
                that.$axios.post(that.$api.addManage, temForm, {
                    headers:{
                        "Content-Type":"application/json",
                        "token":token
                    }
                }).then(function(res){
                    //console.log(res);
                    if(res.data.code == 0){
                        that.$notify({
                            title: '成功',
                            message: '管理成员信息添成功',
                            type: 'success'
                        });
                        that.form = {
                            username:'',
                            password:'',
                            name:'',
                            phone:'',
                            role_id:''
                        }
                        that.$router.push('/manage/station/detail');
                    }else{
                        that.$notify({
                            title:'失败',
                            message:res.data.error,
                            type:'error'
                        })
                    }
                    loading.close();
                })
            }     
        },
        roleList(){
            let that = this;
            let token = localStorage.getItem('token');
            
            that.$ajax(that, 'get', that.$api.roleList, null, token, function(res){
                console.log(res);
                if(res.data.code == 0){
                let data = res.data.data;
                let temArr = [];
                data.forEach((item, index, arr) => {
                    let temObj = {};
                    temObj['value'] = item['role_name'];
                    temObj['label'] = item['role_name'];
                    temArr.push(temObj);
                })
                that.options = temArr;
                }
            })
        },
        selectKinds(val){
            console.log(val);
            if(val == '2'){
                this.showRoleList = false;
            }else{
                this.showRoleList = true;
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
        let that = this;
        let token = localStorage.getItem('token');
        this.roleList();
        this.getRoleList();
        this.$ajax(that, 'get', that.$api.roleList, null, token, function(res){
            if(res.data.code == 0){
                that.rolesDetailList = res.data.data;
            }
        })
    }
}
</script>

<style lang='less'>
@rem:100rem;

.add{
    width: 100%;
    display: flex;
    justify-content: center;
    .add-container{
        width: 50%;
        margin-top: 80/@rem;

        .select-drop{
            .el-select{
                width: 100%;
            }
        }
        .add-btn{
            margin-top: 50/@rem;
        }
    }
}
</style>
