<template>
  <div class="tabs">
      <!-- <div v-if="item.children" :index='navIndex' class="nav-list">
          <div class="tabs-header" v-if="item.children && item.children.length > 0">
              <img :src="'~assets/icons/'+item.name+'.png'" alt="">
              <span>{{item.name}}</span>
              <img src="~assets/icons/more.png" alt="">
          </div>
          <div class="tabs-container" v-if="item.children.length > 0">
              <tabs class="tabs-children" v-for='(subItem,i) in item.children' :key="navIndex+'-'+i" :navIndex="navIndex+'-'+i" :item='subItem'></tabs>
          </div>
          <div class="tabs-without-children" v-else>
              <img :src="'../../../assets/icons/'+item.name+'.png'" alt="">
              <router-link @click.native="changeRoute($event)" :id="item.name" class="tabs-main-detail" :to="'/'+item.path">{{item.name}}</router-link>
              <img src="" alt="">
          </div>
      </div>
      <router-link @click.native="changeRoute($event)" :id="item.name" class="tabs-detail" v-else :to="'/'+item.path">{{item.name}}</router-link> -->

      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#3c4254"
        text-color="#fff"
        router
        unique-opened
        active-text-color="#409eff">
            <el-submenu v-for="(item,index) in nav" :key="index" :index="item.name" v-if="item.children && item.children.length > 0 && userPermission.indexOf(item.meta.permission) >= 0">
                <template slot="title">
                <i :class="'el-icon-'+item.meta.icon"></i>
                <span>{{item.name}}</span>
                </template>
                <el-menu-item-group v-for="(subItem,i) in item.children" :key="i">
                    <router-link class="router-jump" :id="subItem.name" @click.native="changeRoute($event)" :to="'/'+subItem.path" v-if="userPermission.indexOf(subItem.meta.permission) >= 0">{{subItem.name}}</router-link>
                </el-menu-item-group>
            </el-submenu>
            <router-link v-else-if="(!item.children || item.children.length == 0) && userPermission.indexOf(item.meta.permission) >= 0"  :id="item.name" class="without-children" @click.native="changeRoute($event)" :to="'/'+item.path">
                <i :class="'el-icon-'+item.meta.icon"></i>
                <span :id="item.name+'.'">{{item.name}}</span>
            </router-link>
      </el-menu>
  </div>
</template>

<script>
import data from './dataDesign'

export default {
    name:'tabs',
    data(){
        return {
            nav:data.data,
            userPermission:[],
            token:''
        }
    },
    mounted(){
        this.token = localStorage.getItem('token');
        this.getRoleList();
    },
    methods:{
        changeRoute(ev){
            this.$store.state.summarize.title = ev.srcElement.id;
            sessionStorage.setItem('model',ev.srcElement.id);
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
    }
}
</script>

<style lang='less'>
@rem:100rem;

.tabs{
    width: 240/@rem;
    margin-bottom: 1px;
    overflow: hidden;

    .el-menu-item{
        padding: 0;
        min-width: 190/@rem;
    }

    .el-menu-item-group__title{
        padding: 0;
    }

    .el-submenu{
        border-bottom: 1px solid black;
    }

    .el-menu-item-group {
        background: #000;
    }

    .router-jump{
        width: 100%;
        height: 40/@rem;
        display: flex;
        box-sizing: border-box;
        padding-left: 64/@rem;
        align-items: center;
        font-size: 14/@rem;
        color: #ffffff;
    }

    .router-jump:hover{
        background: rgba(145, 145, 145, 0.3);
    }

    .router-link-active{
        color: #409eff;
        background: rgba(145, 145, 145, 0.3);
    }

    .el-submenu__title{
        width: 100%;
        height: 58/@rem;
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding-left: 20px;
        font-size: 14/@rem;
        i{
            width: 24/@rem;
            height: 18/@rem;
            color: #909399;
            font-size: 18/@rem;
            margin-right: 5/@rem;
            display: flex;
            align-items: center;

        }
        span{
            height: 100%;
            line-height: 58/@rem;
        }
    }

    .without-children{
        height: 58/@rem;
        width: 100%;
        cursor: pointer;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding-left: 20px;
        font-size: 14/@rem;
        border-bottom: 1px solid black;
        i{
            width: 24/@rem;
            height: 18/@rem;
            text-align: center;
            vertical-align: middle;
            color: #909399;
            font-size: 18/@rem;
            margin-right: 5/@rem;
        }
        span{
            height: 56/@rem;
            line-height: 56/@rem;
            width: 200/@rem;
            font-size: 14/@rem;
            color: #ffffff;
            display: block;
        }
    }

    .without-children:hover{
        background: #303543;
    }
    // .nav-list{
    //     width: 100%;
    //     display: flex;
    //     flex-direction: column;
    //     .tabs-header{
    //         width: 100%;
    //         height: 56/@rem;
    //         display: flex;
    //         justify-content: space-around;
    //         align-items: center;
    //         font-size: 20/@rem;
    //         color: #fff;
    //         background: #3c4254;
    //         cursor: pointer;
    //         img{
    //             height: 30/@rem;
    //             width: 30/@rem;
    //         }
    //     }
    //     .tabs-container{
    //         width: 100%;
    //         display: flex;
    //         flex-wrap: wrap;
    //         .tabs-children{
    //             height: 40/@rem;
    //             width: 90/@rem;
    //             margin: 10/@rem 15/@rem;
    //             display: flex;
    //             justify-content: center;
    //             align-items: center;
    //             .tabs-detail{
    //                 height: 100%;
    //                 width: 100%;
    //                 font-size: 20/@rem;
    //                 line-height: 40/@rem;
    //                 text-align: center;
    //                 display: block;
    //                 color: #999999;
    //             }
    //         }
    //     }
    // }
    // .tabs-without-children{
    //     height: 56/@rem;
    //     width: 100%;
    //     background: #3c4254;
    //     display: flex;
    //     align-items: center;
    //     justify-content: space-around;
    //     img{
    //         height: 30/@rem;
    //         width: 30/@rem;
    //     }
    //     .tabs-main-detail{
    //         // height: 100%;
    //         // width: 100%;
    //         // display: flex;
    //         // justify-content: center;
    //         // align-items: center;
    //         font-size: 20/@rem;
    //         color: #ffffff;
    //     }
    // }

}

</style>
