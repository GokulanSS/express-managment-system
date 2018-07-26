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
                highlight-current>
                </el-tree>
            </div>
            <el-button type="primary" plain class="save-btn" @click="getCheckedNodes">保存</el-button>
            <p class="tip-message" v-if="tipMessage">请为角色分配权限！</p>
            <p class="tip-message" v-if="tipWithoutName">请为角色添加名称！</p>
        </div>
    </div>
</template>

<script>
import treeDetail from './buildTree'

export default {
    name:'tree',
    data(){
        return {
            permissionTree: treeDetail.data,
            tipMessage:false,
            tipWithoutName:false,
            haveChildrenNodes:["switch_site","statistics"],
            copyPermission:[],
            checkedArr:[]
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

            if(that.$store.state.inputRole.length == 0){
                that.tipWithoutName = true;
                return;
            }else{
                that.tipWithoutName = false;
            }

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
            //console.log(newArr);        //keyong
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
            let reg =  /id[':"]*(\w*)['"]/g;
            let temPermission = [];
            let matchStr = JSON.stringify(copyPermission);
            matchStr.replace(reg, function($0, $1){
                temPermission.push($1);
            })
            console.log(temPermission);
            let token = localStorage.getItem('token');
            that.$ajax(that, 'post', that.$api.addRole, {"permission":temPermission, "role_name":that.$store.state.inputRole}, token, function(res){
                console.log(res);
                if(res.data.code == 0){
                    that.$store.state.inputRole = '';
                    that.$notify({
                        title: '成功',
                        message: `角色${that.$store.state.inputRole}添加成功`,
                        type: 'success'
                    });
                    that.$router.push('/manage/role/list');
                }else{
                    that.$notify.error({
                        title: '添加角色失败',
                        message: res.data.error
                    });
                }
            })
        },
        getParent(nodes){
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
        }
    },
    mounted(){
        this.copyPermission = JSON.parse(JSON.stringify(this.permissionTree));
    }
}
</script>

<style lang='less'>
@rem:100rem;

.tree{
    width:100%;
    .tip-message{
        color:#409eff;
        font-size:14/@rem;
        margin-top:10/@rem;
    }
}

</style>
