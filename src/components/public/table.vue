<template>
    <div class="express-table">
        <div class="express-table-container">
            <el-table
                :data="table"
                stripe
                style="width: 100%">
                <el-table-column
                prop="name"
                label="姓名">
                </el-table-column>
                <el-table-column
                prop="username"
                label="用户名">
                </el-table-column>
                <el-table-column
                prop="phone"
                label="电话">
                </el-table-column>
                <el-table-column
                prop="created_at"
                label="入职时间"
                width="200">
                </el-table-column>
                <el-table-column
                label="操作"
                width="200">
                    <template slot-scope="scope">
                        <el-button @click="resetManager(scope.row)" type="text" size="medium">修改</el-button>
                        <el-button class="deactive" @click="deactiveManager(scope.row)"  type="text" size="medium" v-if="userPermission.indexOf('deactive_admin') >= 0" v-show="scope.row['is_active'] == 1">禁用</el-button>
                        <el-button @click="reactiveManager(scope.row)" type="text" size="medium" v-if="userPermission.indexOf('active_admin') >= 0" v-show="scope.row['is_active'] == 0">激活</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="edit-dialog">
                <el-dialog title="修改信息" :visible.sync="editVisible">
                <el-form :model="editStaff">
                    <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="editStaff.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="入职时间" :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="editStaff.created_at"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                    </el-form-item>
                    <el-form-item label="联系电话" :label-width="formLabelWidth">
                        <el-input v-model="editStaff.phone" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="角色定位" :label-width="formLabelWidth">                      
                        <el-select v-model="editStaff.role_name" placeholder="请选择" >
                            <el-option
                                v-for="item in roles"
                                :key="item['id']"
                                :label="item['role_name']"
                                :value="item['role_name']">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelEditModel">取 消</el-button>
                    <el-button type="primary" @click="confirmEditModel">确 定</el-button>
                </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'expressTable',
    props:['table'],
    data(){
        return {
            expressTableData:[
                {name:'姓名', station:'中国药科大学',tel:'12345678912',create_time:'2018-01-20',role:'管理员'}
            ],
            token:'',
            editVisible:false,
            editStaff:{
                id: '',
                name: '',
                phone: '',
                created_at: '',
                role_name: '',
                role_id: ''
            },
            formLabelWidth: '120px',
            deleteVisible: false,
            roles:[],
            userPermission:[]
        }
    },
    methods:{
        resetManager(row){
            let that = this;
            that.editVisible = true;
            that.editStaff = row;
        },
        deactiveManager(row){
            let managerId = Number(row.id);
            let that = this;
            let token = localStorage.getItem('token');
            that.$confirm('禁用确认, 是否继续?', '禁用提示', {
                confirmButtonText: '确定禁用',
                cancelButtonText: '取消禁用',
                type: 'warning'
            }).then(() => {
                let loading = that.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                that.$ajax(that, 'post', that.$api.deactiveManager, {"id": managerId}, token, function(res){
                    if(res.data.code == 0){
                        that.$notify({
                            title: '禁用成功',
                            message: `管理员${row.name}已禁用成功`,
                            type: 'success'
                        })
                        that.$emit('refreshParent');
                    }else{
                        that.$notify.error({
                            title: '禁用失败',
                            message: res.data.error
                        })
                    }
                    loading.close();
                })
            }).catch(() => {
                that.$message({
                    type: 'info',
                    message: '已取消禁用'
                })        
            })
        },
        reactiveManager(row){
            let managerId = Number(row.id);
            let that = this;
            let token = localStorage.getItem('token');
            that.$confirm('激活确认, 是否继续?', '激活提示', {
                confirmButtonText: '确定激活',
                cancelButtonText: '取消激活',
                type: 'warning'
            }).then(() => {
                let loading = that.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                that.$ajax(that, 'post', that.$api.reactiveManager, {"id": managerId}, token, function(res){
                    if(res.data.code == 0){
                        that.$notify({
                            title: '激活成功',
                            message: `管理员${row.name}已激活成功`,
                            type: 'success'
                        })
                        that.$emit('refreshParent');
                    }else{
                        that.$notify.error({
                            title: '激活失败',
                            message: res.data.error
                        })
                    }
                    loading.close();
                })
            }).catch(() => {
                that.$message({
                    type: 'info',
                    message: '已取消激活'
                })        
            })
        },
        cancelEditModel(){
            this.editVisible = false;
            this.editStaff = {};
        },
        confirmEditModel(){
            let that = this;
            let roleList = JSON.parse(sessionStorage.getItem('roles'));
            roleList.forEach( (item,index) => {
                if(item['role_name'] == that.editStaff['role_name']){
                    that.editStaff['role_id'] = item['id'];
                }
            })
            console.log(that.editStaff);
            let temObj = {
                "id": that.editStaff.id,
                "name": that.editStaff.name,
                "phone": that.editStaff.phone,
                "role_id": that.editStaff['role_id'],
                "created_at": that.editStaff['created_at'],
            }
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            let token = localStorage.getItem('token');
            that.$ajax(that, 'post',that.$api.updateManager, temObj, token, function(res){
                if(res.data.code == 0){
                    that.$notify({
                        title: '信息修改成功',
                        message: `管理员${temObj.name}信息修改成功`,
                        type: 'success'
                    })
                    that.editVisible = false;
                }else{
                    that.$notify.error({
                        title: '信息修改失败',
                        message: res.data.error
                    })
                }
                loading.close();
            })
        },
        cancelDelete(){},
        confirmDelete(){},
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
        let token = localStorage.getItem('token');
        let that = this;
        that.roles = JSON.parse(sessionStorage.getItem('roles'));
        that.getRoleList();
    }
}
</script>

<style lang='less'>
@rem:100rem;

.express-table{
    width: 80%;
    .express-table-container{
        .deactive{
            color: #ff0000;
        }
    }
}

</style>
