<template>
  <div class="summarize">
      <div class="content">
          <p>
              <span>{{model}}</span>
              <span v-show="value || $store.state.summarize.title">--</span> 
              <span>{{school || content.siteName}}</span>
          </p>
      </div>
      <div class="school"  v-if="userPermission.indexOf('swtich_site') >= 0" >
          <img src="../../assets/icons/location.png" alt="">
          <el-select v-model="value" @change='changeSelect' :placeholder="school || content.siteName">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.id">
            </el-option>
          </el-select>
      </div>
  </div>
</template>

<script>

export default {
    name:'summarize',
    props:['content'],
    data(){
        return {
            value:'',
            options:[],
            header:{},
            school:null,
            model:null,
            userPermission:[],
            siteId:''
        }
    },
    methods:{
        changeSelect(value){
            let that = this;
            let stationId = '';
            let stationName = '';
            let token = localStorage.getItem('token');
            for(let i=0; i<this.options.length; i++){
                if(this.options[i]['id'] == this.value){
                    stationId = that.options[i]['id'];
                    that.$store.state.university = that.options[i]['value'];
                    stationName = that.options[i]['value'];
                }
            }
            let station = that.$store.state.university;
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            // console.log(stationId);
            that.$axios.post(that.$api.switchStation, {"site_id":stationId}, {
                headers:{
                    "Content-Type":"application/json",
                    "token":token
                }
            }).then(function(res){
                if(res.data.code == 0){
                    that.$notify({
                        title: '站点切换成功',
                        message: `当前站点${station}`,
                        type: 'success'
                    })
                    sessionStorage.setItem('station', stationId);
                    sessionStorage.setItem('school', stationName);
                    that.school = stationName;
                    that.$store.state.stationId = stationId;
                    that.$store.state.university = stationName;
                }else{
                    that.$notify.error({
                        title: '站点切换失败',
                        message: '请重新尝试站点切换'
                    })
                }
                loading.close();
            })
        },
        getRoleList(){
            let that = this;
            let temPer = that.$store.state.permission;
            let token = localStorage.getItem('token');
            if(temPer.length == 0){
                that.$ajax(that, 'get', that.$api.userInfo, null, token, function(res){
                    if(res.data.code == 0){
                        that.userPermission = that.getPermissionArr(res.data.data);
                        that.$store.state.permission = that.userPermission;
                        that.siteId = res.data.data['site_id'];
                    }
                })
            }else{
                that.userPermission = temPer;
            }
        },
        getSite(){
            let that = this;
            let token = localStorage.getItem('token');
            let siteId = sessionStorage.getItem('station');
            this.$axios.get(that.$api.stationList, {
                headers:{
                    'Content-Type':'application/json',
                    'token':token
                }
            }).then(function(res){
                //console.log(res);
                if(res.data.code == 0){
                    let stations = res.data.data;
                    let temBox = [];
                    for(let i=0; i<stations.length; i++){
                        let temObj = {};
                        temObj['value'] = temObj['label'] = stations[i]['site_name'];
                        temObj['id'] = stations[i]['site_id'];
                        temBox.push(temObj);
                    }
                    temBox.forEach(item => {
                        if(item['id'] == siteId){
                            that.school = item['label'];
                            sessionStorage.setItem('school', item['label']);
                        }
                    })
                    that.options = temBox;
                    that.$store.state.university = that.options[0]['value'];
                    // that.value = sessionStorage.getItem('siteId');
                    that.value = sessionStorage.getItem('station');
                    console.log(that.value);
                }
            })
        }
    },
    mounted(){
        this.getRoleList();
        this.getSite();
        this.school = sessionStorage.getItem('school');
        this.model = sessionStorage.getItem('model');
    },
    computed:{
        currentStationId(){
            return sessionStorage.getItem('station');
        },
        currentModel(){
            return this.$store.state.summarize.title;
        }
    },
    watch:{
        currentStationId(){
            this.value = sessionStorage.getItem('station');
        },
        currentModel(){
            this.model = sessionStorage.getItem('model');
        }
    }
}
</script>

<style lang='less'>
@rem:100rem;

.summarize{
    width: 100%;
    height: 90/@rem;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e0e0e0;
    .content{
        height: 80%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        p{
            font-size: 18/@rem;
            color: #434a5f;
        }
        span{
            font-size: 16/@rem;
            color: #666666;
        }
    }
    .school{
        height: 100%;
        display: flex;
        align-items: center;
        img{
            height: 38/@rem;
            width: 38/@rem;
            margin-right: 14/@rem;
        }
    }
}
</style>
