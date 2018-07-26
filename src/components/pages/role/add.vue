<template>
  <div class="add-role">
      <div class="add-role-container">
          <el-tabs class="add-tabs" :tab-position="tabPosition" style="height: 200px;">
                <el-tab-pane disabled label="功能选择">
                    <div class="add-role-title">
                        <span>添加角色/分配角色权限</span>
                    </div>
                    <div class="add-role-description">
                        <p>请谨慎为角色分配权限，权限控制将影响角色查看的信息。</p>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="角色名称">
                    <div class="add-role-title">
                        <span>角色名称</span>
                    </div>
                    <div class="add-role-input">
                        角色名称 :
                        <el-input
                            class="input-message"
                            placeholder="请输入角色名称"
                            v-model="roleName"
                            @input="inputRoleName($event)">
                        </el-input>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="角色权限">
                    <div class="add-role-title">
                        <span>角色权限</span>
                    </div>
                    <!-- <div class="permisson-container" >
                        <div class="permission" v-for="(item,index) in permission" :key="index">
                            <check :item='item' :componentId='index' @permission='permissionControl' @cancelPermission='cancelPermissionControl'></check>
                        </div>
                    </div> -->
                    <div class="permission-container">
                        <tree></tree>
                    </div>
                </el-tab-pane>
          </el-tabs>
      </div>
  </div>
</template>

<script>
import permission from '../tab/dataDesign'
import check from './check'
import tree from './tree'

export default {
    name:'add-staff',
    data(){
        return {
            tabPosition: 'left',
            roleName:'',
            permission:permission.data,
            userPermission:[]
        }
    },
    methods:{
        permissionControl(data){
            let userPermission = this.userPermission;
            if(userPermission.length == 0){
                this.userPermission.push(data);
            }else{
                for(let i=0; i<userPermission.length; i++){
                if(data.id == userPermission[i].id){
                    this.userPermission.splice(i,1)
                    }
                }
                this.userPermission.push(data);
            }
            console.log(this.userPermission);
        },
        cancelPermissionControl(data){
            this.userPermission.forEach((item,index) => {
                if(item.id == data.id){
                    this.userPermission.splice(index,1);
                }
            })
            console.log(this.userPermission);
        },
        inputRoleName(val){
            this.$store.state.inputRole = val;
        }
    },
    mounted(){
        console.log(permission);
    },
    components:{
        check,
        tree
    },
}
</script>

<style lang='less'>
@rem:100rem;

.add-role{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 50/@rem;
    height: 600/@rem; 

    .permission{
        margin: 20/@rem 0
    }

    .el-tabs__item{
        font-size: 16/@rem;
    }

    .add-role-container{
        width: 1512/@rem;
        height: 100%;

        .add-tabs{
            min-height: 1000/@rem;
            max-height: 1100/@rem;

            .permission-container{
                height: 100%;
                width: 1182/@rem;
                margin-top: 30/@rem;
            }

            .save-btn{
                margin-top: 45/@rem;
            }
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
        .add-role-input{
            margin-top: 70/@rem;
            display: flex;
            align-items: center;
            font-size:16/@rem;
            .input-message{
                width: 800/@rem;
                margin-left: 40/@rem;
            }
        }
    }
}
</style>
