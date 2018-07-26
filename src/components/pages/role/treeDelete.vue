<template>
    <div class="tree">
        <div class="tree-container">
            <div class="tree-detail">
                <el-tree
                :data="permissionTree"
                show-checkbox
                accordion
                node-key="id"
                ref="tree"
                :default-checked-keys="content"
                highlight-current>
                </el-tree>
            </div>
            <div class="tree-btn-group">
                <el-button type="primary" plain class="save-btn tree-btn" @click="getCheckedNodes" size="small" v-if="userPermission.indexOf('update_role_resources') >= 0">保存角色</el-button>
                <p class="tip-message" v-if="tipMessage">请为角色分配权限！</p>
            </div>
            
        </div>
    </div>
</template>

<script>
import buildTree from './buildTree'

export default {
    name:'tree',
    props:['content'],
    data(){
        return {
            permissionTree:buildTree.data,
            tipMessage:false,
            haveChildrenNodes:["switch_site", "system"],
            copyPermission:[],
            checkedArr:[],
            checkedKeys:[],
            userPermission:[]
        }
    },
    methods:{
        getCheckedNodes(){
            let checkedKeys = this.$refs.tree.getCheckedKeys();
            let checkedNodes = this.$refs.tree.getCheckedNodes();
            let halfCheckedNodes = this.$refs.tree.getHalfCheckedNodes();
            let that = this;
            if(checkedKeys.length == 0){
                this.tipMessage = true;
                return;
            }else{
                this.tipMessage = false;
            }

            console.log(checkedNodes);
            //获取所有被选子项的父项及根项
            for(let i=0; i<checkedNodes.length; i++){
                this.getParent(checkedNodes[i]);
            }

            //this.checkedArr去除重复项
            let newArr = [];
            for(var i =0; i<this.checkedArr.length; i++){
            　　 if(newArr.indexOf(this.checkedArr[i]) == -1){
            　　　　newArr.push(this.checkedArr[i]);
            　　}
            }
            let copyPermission = JSON.parse(JSON.stringify(this.copyPermission));

            //一级目录过滤
            for(let i=0; i<copyPermission.length; i++){
                if(newArr.indexOf(copyPermission[i].id ) < 0 ){
                    copyPermission.splice(i,1);
                    i--;
                }
            }

            //二级子项过滤
            this.deleteChildLv2(copyPermission,newArr);

            //三级子项过滤
            for(let i=0; i<copyPermission.length; i++){
                if(copyPermission[i]['children']){
                    this.deleteChildLv3(copyPermission[i]['children'],newArr);
                }
            }
            console.log(copyPermission);
            let temPerArr = that.permissionArr(copyPermission);
            let adminId = sessionStorage.getItem('role');
            let token = localStorage.getItem('token');
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            that.$ajax(that, 'post', that.$api.updatePermission, {"permission":temPerArr, "role_id":adminId}, token, function(res){
                if(res.data.code == 0){
                    that.$notify({
                        title: '成功',
                        message: '角色权限修改成功',
                        type: 'success'
                    });
                }else{
                    that.$notify.error({
                        title: '保存失败',
                        message: res.data.error
                    })
                }
                loading.close();
            })
        },
        getParent(nodes){
            // 如果当前节点的父节点等于权限树，则证明该父节点为根节点
            if(this.$refs.tree.getNode(nodes.id).parent.data == this.permissionTree){
                this.checkedArr.push(nodes.id);
            }else{
                this.checkedArr.push(this.$refs.tree.getNode(nodes.id).parent.data.id);
                this.checkedArr.push(nodes.id);
                this.getParent(this.$refs.tree.getNode(nodes.id).parent.data);
            }
        },
        deleteChildLv2(perVal,rules){
            for(let i=0; i<perVal.length; i++){
                if(perVal[i]['children']){
                    for(let j=0; j<perVal[i].children.length; j++){
                        if(rules.indexOf(perVal[i].children[j].id) < 0){
                            perVal[i].children.splice(j,1);
                            j--;
                        }
                    }
                }
            }
        },
        deleteChildLv3(perVal,rules){
            for(let i=0; i< perVal.length; i++){
                if(perVal[i]['children']){
                    for(let j=0; j<perVal[i]['children'].length; j++){
                        if(rules.indexOf(perVal[i]['children'][j].id) < 0){
                            perVal[i]['children'].splice(j,1);
                            j--;
                        }
                    }
                }
            }
        },
        permissionArr(data){
            let reg =  /id[':"]*(\w*)['"]/g;
            let permission = [];
            let matchStr = JSON.stringify(data);
            matchStr.replace(reg, function($0, $1){
                permission.push($1);
            })
            return permission;
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
        this.copyPermission = JSON.parse(JSON.stringify(this.permissionTree));
        this.getRoleList();
    }
}
</script>

<style lang='less'>
@rem:100rem;

.tree{
    width:100%;
    .tree-btn-group{
        margin-top: 50/@rem;
        .tip-message{
            color:#409eff;
            font-size:14/@rem;
            margin-top:10/@rem;
        }
    }
}

</style>
