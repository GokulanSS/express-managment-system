<template>
  <div class="get-package-ad">
      <div class="package-ad-container">
          <table>
              <thead>
                  <tr>
                      <th v-if="userHavePermission.indexOf('change_ad_state') >= 0">状态</th>
                      <th>广告品牌</th>
                      <th>广告投放时间段</th>
                      <th>广告链接</th>
                      <th>指定广告投放点</th>
                      <th>广告操作</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(item,index) in renderAdList" :key="index">
                      <td v-if="userHavePermission.indexOf('change_ad_state') >= 0">
                          <input type="checkbox" v-if="userHavePermission.length > 0 || userHavePermission.indexOf('change_ad_state') >= 0" :id="item.id" :checked='item["is_active"]' @click='setActive(item.id,$event)'>
                          <label class="disabled-checkbox" :for="item.id" v-if="!item['is_active']" >已禁用</label>
                          <label class="used-checkbox"  :for="item.id" v-else >已使用</label>
                      </td>
                      <td>{{item.vendor}}</td>
                      <td>{{item['active_time_start']}} 至 {{item['active_time_end']}}</td>
                      <td>{{item['image_link']}}</td>
                      <td>{{item['active_sites'].toString()}}</td>
                      <td>
                          <el-button type="text" @click="editAd(item)" v-if="userHavePermission.indexOf('update_ad_info') >= 0">修改</el-button>
                          <el-button type="text" @click='deleteAd(item.id)' v-if="userHavePermission.indexOf('delete_add') >= 0">删除</el-button>
                      </td>
                  </tr>
              </tbody>
          </table>
          <div class="station-code">
              <div class="station-box" v-for="(item,index) in stationList" :key="index">
                  <span>{{item['site_id']}}--</span>
                  <span>{{item['site_name']}}</span>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name:'getPackageAd',
    data(){
        return {
            adList:{
                data: []
            },
            renderAdList:[],
            checkedList:[],
            adForm:{},
            token:'',
            btnDisabled:false,
            userHavePermission:[],
            stationList:[],
        }
    },
    methods:{
        setActive(data,ev){
            let that = this;
            let isChecked = ev.srcElement.checked;
            console.log(data);
            if(isChecked){
                that.$confirm('确认激活, 是否继续?', '激活提示', {
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
                    that.$ajax(that, 'post', that.$api.adActived, {"ad_id":data, "is_active":true}, that.token, function(res){
                        if(res.data.code == 0){
                            that.$notify({
                                title: '激活成功',
                                message: '广告激活成功',
                                type: 'success'
                            })
                        }else{
                            that.$notify.error({
                                title: '激活失败',
                                message: res.data.error
                            })
                        }
                        that.getAdList();
                        loading.close();
                    })
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消激活'
                    })        
                })
            }else{
                that.$confirm('确认禁用, 是否继续?', '禁用提示', {
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
                    that.$ajax(that, 'post', that.$api.adActived, {"ad_id":data, "is_active":false}, that.token, function(res){
                        if(res.data.code == 0){
                            that.$notify({
                                title: '禁用成功',
                                message: '广告禁用成功',
                                type: 'success'
                            })
                        }else{
                            that.$notify.error({
                                title: '禁用失败',
                                message: res.data.error
                            })
                        }
                        that.getAdList();
                        loading.close();
                    })
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消禁用'
                    })        
                })
            }
        },
        editAd(item){
            console.log(item);
            let renderAdList = this.renderAdList;
            for(let i=0; i<renderAdList.length; i++){
                if(renderAdList[i]['id'] == item['id']){
                    this.$store.state.editAd = renderAdList[i];
                    this.$router.push({path:`/manage/ad/edit`});
                }
            }
            console.log(this.$store.state.editAd);
        },
        getAdList(){
            let that = this;
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            that.$ajax(that, 'get', that.$api.adList, null, that.token, function(res){
                console.log(res);
                if(res.data.code == 0){
                    let adListData = res.data.data;
                    console.log(adListData);
                    for(let i=0; i<adListData.length; i++){
                        adListData[i]['active_time_start'] = that.secondsFormat(adListData[i]['active_time_start']);
                        adListData[i]['active_time_end'] = that.secondsFormat(adListData[i]['active_time_end']);
                        adListData[i]['active_sites'] = adListData[i]['active_sites'].sort((a1, a2) => {
                            return a1 - a2;
                        })
                    }

                    that.renderAdList = adListData;
                }else{
                    that.$notify.error({
                        title: '获取广告列表错误',
                        message: res.data.error
                    })
                }
                loading.close();
            })
        },
        deleteAd(id){
            console.log(id);
            let that = this;
            that.$confirm('确认删除, 是否继续?', '删除提示', {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消删除',
                type: 'warning'
            }).then(() => {
                let loading = that.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                that.$ajax(that, 'post', that.$api.adDelete, {"id":id}, that.token, function(res){
                    if(res.data.code == 0){
                        that.$notify({
                            title: '删除成功',
                            message: '广告删除成功',
                            type: 'success'
                        })
                        that.getAdList();
                    }else{
                        that.$notify.error({
                            title: '删除失败',
                            message: res.data.error
                        })
                    }
                    loading.close();
                })
            }).catch(() => {
                that.$message({
                    type: 'info',
                    message: '已取消删除'
                })        
            })
        },
        getUserPermission(){
            let that = this;
            let temPer = that.$store.state.permission;
            if(temPer.length == 0){
                that.$ajax(that, 'get', that.$api.rolePermission, null, that.token, function(res){
                    if(res.data.code == 0){
                        that.userHavePermission = that.getPermissionArr(res.data.data);
                    }else{
                        that.$notify.error({
                            title: '获取权限失败',
                            message: res.data.error
                        })
                    }
                })
            }else{
                that.userHavePermission = temPer;
            }
        }
    },
    mounted(){
        this.token = localStorage.getItem('token');
        this.getAdList();
        this.getUserPermission();
        this.stationList = JSON.parse(sessionStorage.getItem('siteList'));
    },
    activated(){
        console.log(this.$route);
        if(this.$route.params.key == 'editSuccess'){
            this.getAdList();
        }
        
    }
}
</script>

<style lang='less'>
@rem:100rem;

.get-package-ad{
    width: 100%;
    display: flex;
    justify-content: center;
    .package-ad-container{
        width: 90%;
        margin-top: 100/@rem;
        table, table th, table td{
            border: 1/@rem solid #cccccc;
        }
        table{
            border-collapse: collapse;
            text-align: center;
            vertical-align: middle;
            width: 100%;
            th{
                color: #434a5f;
                height: 40/@rem;
                background: #fafafa;
                font-weight: normal;
                font-size: 18/@rem;
                vertical-align: middle;
            }
            td{
                font-size: 14px;
                input{
                    vertical-align: middle;
                }
            }
            .disabled-checkbox{
                color: #ff0000;
            }
            .used-checkbox{
                color: #409eff;
            }
        }
        .station-code{
            margin-top: 20/@rem;
            width: 100%;
            display: flex;
            justify-content: flex-start;
            .station-box{
                margin-right: 20/@rem;
                span{
                    font-size: 18/@rem;
                    color: #409eff
                }
            }
        }
    }
}

</style>
