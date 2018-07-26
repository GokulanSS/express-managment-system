<template>
  <div class="send-ad">
      <div class="send-ad-container">
          <table>
              <thead>
                  <tr>
                      <th>状态</th>
                      <th>广告品牌</th>
                      <th>广告投放时间段</th>
                      <th>广告链接</th>
                      <th>指定广告投放点</th>
                      <th>广告操作</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(item,index) in renderAdList" :key="index">
                      <td>
                          <input type="checkbox" :id="item.id" :checked='checkedList.indexOf(item.id) >= 0' @click='setActive(item.id,$event)'>
                          <label class="disabled-checkbox" :for="item.id" v-if="checkedList.indexOf(item.id) < 0">已禁用</label>
                          <label class="used-checkbox"  :for="item.id" v-else>已使用</label>
                      </td>
                      <td>{{item.vendor}}</td>
                      <td>{{item['active_time_start']}} 至 {{item['active_time_end']}}</td>
                      <td>{{item['image_link']}}</td>
                      <td>{{item['active_sites'].toString()}}</td>
                      <td>
                          <el-button type="text" @click="editAd(item.id)">修改</el-button>
                          <el-button type="text" @click='deleteAd(item.id)'>删除</el-button>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
  </div>
</template>

<script>
export default {
    name:'sendAd',
    data(){
        return {
            adList:{
                data: []
            },
            renderAdList:[],
            checkedList:[],
            adForm:{},
            token:''
        }
    },
    methods:{
        setActive(data,ev){
            let isChecked = ev.srcElement.checked;
            if(isChecked){
                this.checkedList.push(data);
                //通过ID修改默认值
            }else{
                for(let i=0; i<this.checkedList.length; i++){
                    if(data == this.checkedList[i]){
                        this.checkedList.splice(i,1);
                    }
                }
            }
        },
        editAd(id){
            let renderAdList = this.renderAdList;
            for(let i=0; i<renderAdList.length; i++){
                if(renderAdList[i]['id'] == id){
                    this.$store.state.editAd = renderAdList[i];
                    this.$router.push({path:`/manage/ad/edit`});
                }
            }
        },
        getAdList(){
            let that = this;
            that.$ajax(that, 'get', that.$api.adList, null, that.token, function(res){
                console.log(res);
                if(res.data.code == 0){
                    return;
                    let adListData = res.data.data;
                    for(let i=0; i<adListData.length; i++){
                        adListData[i]['active_time_start'] = that.secondsFormat(adListData[i]['active_time_start']);
                        adListData[i]['active_time_end'] = that.secondsFormat(adListData[i]['active_time_end']);
                        // let activeSites = adListData[i]['active_sites'];
                        // let realActiveSites = [];
                        // for(let j=0; j<activeSites.length; j++){
                        //     realActiveSites.push(this.$store.state.universityCode[activeSites[j]]);
                        // } 
                        // adListData[i]['active_sites'] = realActiveSites;
                    }
                    that.renderAdList = adListData;
                }else{
                    that.$notify.error({
                        title: '获取广告列表错误',
                        message: res.data.error
                    })
                }
            })
        }
    },
    mounted(){
        this.token = localStorage.getItem('token');
        this.getAdList();
    }
}
</script>

<style lang='less'>
@rem:100rem;

.send-ad{
    width: 100%;
    display: flex;
    justify-content: center;
    .send-ad-container{
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
    }
}

</style>
