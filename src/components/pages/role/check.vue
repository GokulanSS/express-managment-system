<template>
  <div class="check">
        <div class="role-permission">
            <div class="checkbox-header">
                <input :value="item.name" type="checkbox" :name="item.name" :id="item.name" @click='chooseAll' :checked='checkAll'>
                <label :for="item.name">{{item.name}}</label>
            </div>
            <div class="child-box" v-if="item.children.length > 0">
                <div class="child-detail" v-for="(subItem,i) in item.children" :key="i">
                    <input :value="subItem.name" :checked='checkList.indexOf(subItem.id) >= 0' type="checkbox" :name="subItem.name"  @click='choose(subItem.id,$event)'>
                    <label>{{subItem.name}}</label>
                </div>
            </div>
        </div>
  </div>
</template>

<script>
export default {
    name:'check',
    props:['item','componentId'],
    data(){
        return {
            isIndeterminate:true,
            check: false,
            checkAll:false,
            checkList: [],
            options: [],
            checkedCount: 0,
            componentRoute: {}
        }
    },
    methods:{
        chooseAll(e){
            let checked = e.srcElement.checked;
            if(checked){
                this.checkAll = true;
                this.options.forEach((item,index) => {
                    this.checkList.push(index);
                })
                this.$emit('permission',{
                    id:this.componentId,
                    name:this.item.name,
                    path:this.item.path,
                    children:this.item.children || []
                })
            }else{
                this.checkAll = false;
                this.checkList = [];
                this.$emit('cancelPermission',{
                    id:this.componentId
                })
            }
        },
        choose(id,ev){
            let checked = ev.srcElement.checked;
            let idIndex = this.checkList.indexOf(id);
            if(idIndex < 0 && checked){
                this.checkList.push(id);
            }else if(idIndex >=0 && !checked){
                this.checkList.splice(idIndex,1);
            }
            if(this.checkList.length == this.options.length){
                this.checkAll = true;
            }else{
                this.checkAll = false;
            }

            let list = this.checkList;
            let children = [];
            if(list.length == 0){
                this.$emit('cancelPermission',{
                    id:this.componentId
                })
            }else{
                for(let i=0; i<this.options.length; i++){
                    for(let j=0; j<list.length; j++){
                        if(this.options[i].id == list[j]){
                            children.push(this.options[i]);
                        }
                    }
                }
                this.$emit('permission',{
                    id:this.componentId,
                    name:this.item.name,
                    path:this.item.path,
                    children:children
                })
            }
        },
        addId(arr){
            if(arr.length == 0){
                return;
            }else{
                arr.forEach((item,index) => {
                    item.id = index;                    
                });
            }
            return arr;
        }
    },
    mounted(){
        if(this.item.children){
            let children = this.item.children;
            this.options = this.addId(children);
        }else{
            this.options = [];
        }
    },
    computed:{
        
    }
}
</script>

<style lang='less'>
@rem:100rem;

.check{
    font-size: 14/@rem;
    .role-permission{
        margin-top: 20/@rem;

        input{
            height: 16/@rem;
            width: 16/@rem;
        }

        .checkbox-header{
            height: 24/@rem;
            width: 1180/@rem;
            display: flex;
            align-items: center;
            color: #409eff;
            letter-spacing: 1/@rem;
            font-size: 16/@rem;
            label{
                height: 100%;
                line-height: 24/@rem;
                margin-left: 10/@rem;
            }
        }
        .child-box{
            width: 1180/@rem;
            height: 36/@rem;
            display: flex;
            align-items: center;
            .child-detail{
                height: 100%;
                display: flex;
                align-items: center;
                margin-left: 15/@rem;
                label{
                    margin-left: 10/@rem;
                    letter-spacing: 1/@rem;
                    height: 100%;
                    line-height: 36/@rem;
                }
            }
            .child-detail:first-child{
                margin-left: 0;
            }
        }
    }
}


</style>
