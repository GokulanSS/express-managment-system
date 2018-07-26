<template>
  <div class="manage">
    <div class="navigation">
      <div class="nav-header">
        <span>快递智能管理系统</span>
      </div>
      <tab-list></tab-list>
      <div class="nav-setting">
          <router-link class="message-setting nav-footer" id="个人设置" @click.native="changeRoute($event)" to="/manage/setting">
              <i class="el-icon-setting"></i>
              <span id="个人设置.">个人设置</span>
          </router-link>
          <div class="logout nav-footer" @click="logout">
              <i class="el-icon-news"></i>
              <a id="退出平台">退出平台</a>
          </div>
      </div>
    </div>
    <div class="output">
      <div class="output-container">
        <summarize :content='siteObject'></summarize>
        <keep-alive>
          <router-view ></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import tabList from '../tab/tabList'
import summarize from '../../public/summarize'

export default {
    name:'manage',
    data(){
      return {
        permissionDetail:{
            data:[]
        },
        allPermission:[],
        token:'',
        siteObject:{
            siteId:'',
            siteName:''
        }
      }
    },
    components:{
      tabList,
      summarize
    },
    mounted(){
        let token = localStorage.getItem('token');
        this.token = token;
        let that = this;
        //获取用户信息，判断token是否过期
        that.$ajax(that, 'get', that.$api.userInfo, null, token, function(res){
            if(res.data.code != 0){
                that.$router.push({path:'/login'})
                return;
            }else{
                // console.log(res);
                sessionStorage.setItem('roleId', res.data.data['role_id']);
                // sessionStorage.setItem('siteId', res.data.data['site_id']);
                let roleId = res.data.data['role_id'];
                that.getStation(res.data.data.site_id);
                that.$ajax(that, 'get', that.$api.roleDetail+roleId, null, token, function(subRes){
                    if(subRes.data.code == 0){
                        that.getPermission(subRes.data.data, that.$store.state.permission);
                    }
                }) 
            }
        })
    },
    methods:{
        getPermission(data, destination){
            let reg =  /code[':"]*(\w*)['"]/g;
            let permission = [];
            let matchStr = JSON.stringify(data);
            matchStr.replace(reg, function($0, $1){
                permission.push($1);
            })
            destination = permission;
        },
      
        changeRoute(ev){
            this.$store.state.summarize.title = ev.srcElement.id;
        },
        logout(){
            let token = localStorage.getItem('token');
            let that = this;
            that.$axios.get(that.$api.logout,{
                headers:{
                    'Content-Type':'application/json',
                    'token':token
                }
            }).then(function(data){
                console.log(data);
                localStorage.removeItem('token');
                sessionStorage.clear();
                that.$router.push({path:'/login'});
            })
        },
        getStation(id){
            let that = this;
            that.$ajax(that, 'get', that.$api.stationList, null, that.token, function(res){
                if(res.data.code == 0){
                    sessionStorage.setItem('siteList', JSON.stringify(res.data.data));
                    let sites = res.data.data;
                    that.siteObject.siteId = id;
                    sites.forEach(item => {
                        if(item['site_id'] == id){
                            that.siteObject.siteName = item['site_name'];
                        }
                    });
                }
            })
        },
        getRoles(){
            let that = this;
            that.$ajax(that, 'get', that.$api.roleList, null, that.token, function(res){
                if(res.data.code == 0){
                    sessionStorage.setItem('roles', JSON.stringify(res.data.data));
                }else{
                    that.$notify.error({
                        title: '获取角色列表失败',
                        message: res.data.error
                    }) 
                }
            })
        }
    }
}
</script>

<style lang='less'>
@rem:100rem;

.manage{
  width: 1920/@rem;
  height: 100%;
  display: flex;

  .navigation{
    width: 235/@rem;
    background: #08111f;
    overflow: hidden;
    position: relative;
    .nav-header{
      width: 100%;
      height: 90/@rem;
      background: #1f67b1;
      text-align: center;
      line-height: 90/@rem;
      font-size: 25/@rem;
      color: #fff;
    }
    .nav-setting{
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        .nav-footer{
            width: 100%;
            height: 48/@rem;
            box-sizing: border-box;
            padding-left: 20/@rem;
            background: #3c4254;
            border-bottom: 1px solid black;
            line-height: 48/@rem;
            font-size: 14/@rem;
            i{
                width: 24/@rem;
                color: #909399;
                font-size: 18/@rem;
                text-align: center;
                vertical-align: middle;
                margin-right: 5/@rem;
            }
            a{
                color: #fff;
            }
        }

        .message-setting{
            width: 100%;
            height: 48/@rem;
            display: flex;
            i{
                line-height: 48/@rem;
            }
            span{
                color: #fff;
                margin-left: 6/@rem;
            }
        }
        .message-setting:hover{
            background: #303543;
        }
        .message-setting:active{
            span{
                color: #409eff;
            }
            
        }


        .logout{
            cursor: pointer;
        }
        .logout:hover{
            background: #303543;
        }
        .logout:active{
            a{
                color: #409eff;
            }
        }
    }
  }

  .output{
    width: 1680/@rem;
    display: flex;
    justify-content: center;
    background: #f1f6fd;
    .output-container{
      width: 1660/@rem;
      box-sizing: border-box;
      padding: 20/@rem;
      background: #fff;
      margin-top: 20/@rem;
      overflow: scroll;
    }
  }
}

</style>
