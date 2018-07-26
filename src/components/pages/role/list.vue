<template>
    <div class="role-list">
        <div class="role-list-container">
            <el-tabs class="add-tabs" :tab-position="tabPosition" style="height: 200px;" @tab-click='mainTab($event)'>
                <el-tab-pane disabled label="角色列表" name="role-detail">
                    <div class="add-role-title">
                        <span>修改权限/角色列表</span>
                    </div>
                    <div class="add-role-description">
                        <p>修改用户权限，查看角色列表</p>
                    </div>
                </el-tab-pane>
                <el-tab-pane v-for="(item,index) in roleList" :key="index" :label="item.role_name" :name="item.role_name">
                    <div class="get-role-list">
                        <div class="btns-group">
                             <!-- v-if="userPermission.indexOf('get_role_resource_list') >= 0" -->
                            <el-radio-group v-model="tableList" style="margin-bottom: 0.3rem;" @change="handleChange">
                                <el-radio-button label="list">获取管理员列表</el-radio-button>
                                <el-radio-button label="permission">获取角色权限</el-radio-button>
                            </el-radio-group>
                        </div>
                        <div class="tree-box" v-if="showTree">
                            <!-- v-if="userPermission.indexOf('update_role_resources') >= 0" -->
                            <tree-delete :content='treeContent' ></tree-delete>
                        </div>
                        <div class="table-box" v-if="showTable">
                            <express-table :table='tableContent' @refreshParent = 'refreshData'></express-table>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import treeDelete from './treeDelete'
import permission from '../tab/dataDesign'
import expressTable from '../../public/table' 

export default {
    name:'roleList',
    data(){
        return {
            tabPosition: 'left',
            roleName:'',
            permission:permission.data,
            activeName:'',
            token:'',
            roleList:null,
            roleId:'',
            treeContent:null,
            tableContent:null,
            showTree: false,
            showTable:true,
            tableList:'list',
            userPermission:[]
        }
    },
    methods:{
        handleChange(val){
            let id = this.roleId;
            let that = this;
            if(val == 'permission'){
                that.showTree = true;
                that.showTable = false;
            }else if(val == 'list'){
                that.showTree = false;
                that.showTable = true;
            }
        },
        mainTab(ev){
            console.log(ev.name);
            let that = this;
            let roleList = this.roleList;
            let temRoleId = '';
            for(let i=0; i<roleList.length; i++){
                if(roleList[i]['role_name'] == ev.name){
                    this.roleId = roleList[i]['id'];
                    temRoleId = roleList[i]['id'];
                    sessionStorage.setItem('role', this.roleId);
                }
            }
            console.log(temRoleId);
            let token = localStorage.getItem('token');
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            that.$ajax(that,'get', that.$api.roleDetail+temRoleId, null, token, function(res){
                console.log(res);
                if(res.data.code == 0){
                    that.tableContent = res.data.data.admins;
                    that.treeContent = that.getPermission(res.data.data.permissions);
                    that.tableList = 'list';
                    that.showTree = false;
                    that.showTable = true;
                }else{
                    that.$notify.error({
                        title: '获取角色详情失败',
                        message: res.data.error
                    })
                }
                loading.close();
            })
        },
        getRoleList(){
            let that = this;
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            let token = localStorage.getItem('token');
            that.$ajax(that, 'get', that.$api.roleList, null, token, function(res){
                if(res.data.code == 0){
                    that.roleList = res.data.data;
                    that.$store.state.roles = res.data.data;
                    sessionStorage.setItem('roles', JSON.stringify(res.data.data));
                }
                loading.close();
            })
        },
        getPermission(data){
            let reg =  /code[':"]*(\w*)['"]/g;
            let permission = [];
            let matchStr = JSON.stringify(data);
            matchStr.replace(reg, function($0, $1){
                permission.push($1);
            })
            return permission;
        },
        getPerList(){
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
        },
        refreshData(){
            let that = this;
            let temRoleId = that.roleId;
            let token = localStorage.getItem('token');
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            that.$ajax(that,'get', that.$api.roleDetail+temRoleId, null, token, function(res){
                console.log(res);
                if(res.data.code == 0){
                    that.tableContent = res.data.data.admins;
                    that.treeContent = that.getPermission(res.data.data.permissions);
                    that.tableList = 'list';
                    that.showTree = false;
                    that.showTable = true;
                }else{
                    that.$notify.error({
                        title: '获取角色详情失败',
                        message: res.data.error
                    })
                }
                loading.close();
            })
        }
    },
    mounted(){
        this.token = localStorage.getItem('token');
        this.getRoleList();
        this.getPerList();
    },
    components:{
        treeDelete,
        expressTable
    }
}
</script>

<style lang='less'>
@rem:100rem;

.role-list{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 50/@rem;
    height: 600/@rem;
    .role-list-container{
        width: 1512/@rem;
        height: 100%;
        .add-tabs{
            min-height: 1200/@rem;
            max-height: 1400/@rem;

            .el-tabs__item{
                font-size: 16/@rem;
            }

            .add-role-description{
                font-size: 18/@rem;
                margin-top: 65/@rem;
                color: #409eff;
            }

            .el-tabs__header{
                margin-right: 35/@rem;
            }
            .add-role-title{
                width: 1182/@rem;
                height: 60/@rem;
                line-height: 60/@rem;
                border-bottom: 1px solid #e4e4e4;
                span{
                    font-size: 16/@rem;
                }
            }

            .get-role-list{

            }
        }
    }
}
</style>
