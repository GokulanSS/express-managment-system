<template>
  <div class="express-move">
      <div class="input-message">
          <div class="input-message-detail">
              <span>快递单号 :</span>
              <el-input class="input" v-model="message.tracking_number" placeholder="请输入快递单号" @blur="autoFill"></el-input>
          </div>
          <div class="input-message-detail">
              <span>收件姓名 :</span>
              <el-input class="input" v-model="message.recipient_name" placeholder="请输入收件姓名"></el-input>
          </div>
          <div class="input-message-detail">
              <span>联系方式 :</span>
              <el-input class="input" v-model="message.recipient_phone" placeholder="请输入联系方式"></el-input>
          </div>
          <div class="input-message-detail">
              <span>快递公司 :</span>
              <el-select class="input" filterable v-model="message.courier_code" placeholder="请选择快递公司" @change="isDefault">
                    <el-option
                    v-for="item in expressCompany"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
              </el-select>
          </div>
          <div class="input-message-detail">
              <span>取件码 :</span>
              <el-input class="input" v-model="message.pickup_code" placeholder="请输入取件码"></el-input>
          </div>
          <el-button class="confirm" type="primary" @click="confirm">确认移库</el-button>
      </div>
  </div>
</template>

<script>
export default {
    name:'expressMove',
    data(){
        return {
            message:{
                "package_id": "",
                "tracking_number": "",
                "recipient_name": "",
                "recipient_phone": "",
                "recipient_address": "",
                "pickup_code": "",
                "courier_code": ""
            },
            expressCompany:[],
            default:true
        }
    },
    methods:{
        isDefault(){
            this.default = false;
        },
        confirm(){
            let that = this;
            that.message['recipient_address'] = sessionStorage.getItem('school');
            let temMsg = JSON.parse(JSON.stringify(this.message));
            if(this.default){
                temMsg['courier_code'] = this.$transferName(temMsg['courier_code']);
            }
            console.log(temMsg);
            let token = localStorage.getItem('token');
            that.$confirm('请确认快递信息无误, 是否继续?', '移库提示', {
                confirmButtonText: '确定移库',
                cancelButtonText: '取消移库',
                type: 'warning'
            }).then(() => {
                let loading = that.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                that.$ajax(that, 'post', that.$api.move, temMsg, token, function(res){
                    if(res.data.code == 0){
                        that.$notify({
                            title: '移库成功',
                            message: `包裹${temMsg.tracking_number}移库成功`,
                            type: 'success'
                        })
                        let routeParams = that.$route.params;
                        if(routeParams && routeParams.status){
                            that.$router.go(-1);
                        }
                    }else{
                        that.$notify.error({
                            title: '移库失败',
                            message: res.data.error
                        })
                    }
                    loading.close();
                })
            }).catch(() => {
                that.$message({
                    type: 'info',
                    message: '已取消移库'
                })        
            })
        },
        getCompony(){
            // let that = this;
            // let keys = Object.keys(this.$compony);
            // for(let i=0; i<keys.length; i++){
            //     let temObj = {};
            //     temObj.value = keys[i];
            //     temObj.label = this.$compony[keys[i]];
            //     this.expressCompany.push(temObj);
            // } 
            // this.expressCompany.push(this.expressCompany.shift());  
            let that = this;
            let token = localStorage.getItem('token');
            that.$ajax(that, 'get', that.$api.getCompony, null, token, function(res){
                if(res.data.code == 0){
                    that.expressCompany = that.transformCompony(res.data.data);
                }
            })         
        },
        autoFill(){
            let that = this;
            let token = localStorage.getItem('token');
            if(that.message['tracking_number']){
                let loading = that.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                that.$ajax(that,'post', that.$api.packageMsg, {'tracking_number':that.message['tracking_number']}, token, function(res){
                    console.log(res);
                    if(res.data.code == 0){
                        let temData = res.data.data;
                        that.message['package_id'] = temData['id'];
                        that.message['tracking_number'] = temData['tracking_number'];
                        that.message['recipient_name'] = temData['recipient_name'];
                        that.message['recipient_phone'] = temData['recipient_phone'];
                        that.message['pickup_code'] = temData['pickup_code'];
                        that.message['courier_code'] = temData['courier_code'];
                        that.message['recipient_address'] = sessionStorage.getItem('school');
                        that.default = false;
                    }
                    loading.close();
                })
            }
        },
        routeJump(){
            let that = this;
            let routeParams = that.$route.params;
            if(routeParams && routeParams.status){
                let params = routeParams.status;
                that.message = {
                    "package_id": params['pacakge_id'],
                    "tracking_number": params['tracking_number'],
                    "recipient_name": params['recipient_name'],
                    "recipient_phone": params['recipient_phone'],
                    "recipient_address": params['site_name'],
                    "pickup_code": params['pickup_code'],
                    "courier_code": params['courier_code']
                }
            }else{
               that.message = {
                    "package_id": "",
                    "tracking_number": "",
                    "recipient_name": "",
                    "recipient_phone": "",
                    "recipient_address": "",
                    "pickup_code": "",
                    "courier_code": ""
                } 
            }
        }
    },
    mounted(){
        this.getCompony();
    },
    activated(){
        this.routeJump();
    }
}
</script>

<style lang='less'>
@rem:100rem;

.express-move{
    width: 100%;
    display: flex;
    justify-content: center;
    .input-message{
        width: 640/@rem;
        margin-top: 100/@rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        .input-message-detail{
            width: 100%;
            height: 90/@rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            span{
                font-size: 16/@rem;
                letter-spacing: 1/@rem;
            }
            .input{
                width: 500/@rem;
            }
        }
        .confirm{
            margin-top: 70/@rem;
        }
    }
}
</style>
