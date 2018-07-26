<template>
    <div class="package-detail">
        <div class="package-detail-container">
            <div class="express-detail">
                <div class="detail-header">
                    <span>快递详情</span>
                </div>
                <el-button type="primary" @click="backStep" size="medium">返回</el-button>
                <el-button type="primary" v-show="!showEdit" @click="editMsg" size="medium">修改</el-button>
                <el-button type="primary" v-show="showEdit" @click="cancelEditMsg" size="medium">取消修改</el-button>
                <el-button type="primary" @click="saveMsg" size="medium">保存</el-button>
                <div class="detail-content">
                    <div class="content-message">
                        <div class="message">
                            <span>包裹ID :</span>
                            <span>{{detail.data.id}}</span>
                        </div>
                        <div class="message">
                            <span>快递单号 :</span>
                            <span>{{detail.data.tracking_number}}</span>
                        </div>
                        <div class="message">
                            <span>快递状态 :</span>
                            <span>{{detail.data.state_text}}</span>
                        </div>
                        <div class="message">
                            <span>收件姓名 :</span>
                            <span v-show="!showEdit">{{detail.data.recipient_name}}</span>
                            <input type="text" v-show="showEdit" v-model="detail.data.recipient_name">
                        </div>
                        <div class="message">
                            <span>联系号码 :</span>
                            <span v-show="!showEdit">{{detail.data.recipient_phone}}</span>
                            <input type="text" v-show="showEdit" v-model="detail.data.recipient_phone">
                        </div>
                        <div class="message">
                            <span>站点名称 :</span>
                            <span>{{detail.data.site_id}}</span>
                        </div>
                        <div class="message">
                            <span>快递公司 :</span>
                            <span v-show="!showEdit">{{detail.data.courier_code}}</span>
                            <el-select v-show="showEdit" v-model="detail.data.courier_code" filterable placeholder="请选择快递公司" class="message-content" @change="switchCompony">
                                <el-option
                                v-for="item in expressCompany"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="message">
                            <span>入库时间 :</span>
                            <span>{{detail.data.arrived_at}}</span>
                        </div>
                        <div class="message">
                            <span>取件码 :</span>
                            <span>{{detail.data.pickup_code}}</span>
                        </div>
                        <div class="message">
                            <span>图片 :</span>
                            <div class="cover" @click="showLargeImg">
                                <img :src="detail.data.cover_url" v-if="detail.data.cover_url" alt="">
                                <img src="~assets/images/empty.png" v-else alt="">
                            </div>
                        </div>
                    </div>
                    <div class="content-progress">
                        <div class="progress-tree">
                            <el-steps direction="vertical" :active="detail.data['package_log'].length" space="200">
                                <el-step v-for="(item,index) in detail.data['package_log']" :key="index" :title="item.title" :description="item.content"></el-step>
                            </el-steps>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name:'packageDetail',
    data(){
        return {
            detail:{
                data: {
                    "id": null,
                    "tracking_number": "",
                    "arrived_at": null,
                    "state_code": "",
                    "state_text": "",
                    "courier_code": "",
                    "pickup_code": "",
                    "recipient_phone": "",
                    "recipient_name": "",
                    "site_id": null,
                    "user_id":'',
                    "cover_url":null,
                    "package_log": [
                        {
                            "id": null,
                            "created_at": null,
                            "title":"",
                            "content": "",
                            "type": null
                        },
                    ]
                }
            },
            expressCompany:[],
            showEdit:false,
            buttonMsg:'修改',
            changeCompony:false
        }
    },
    mounted(){
        this.getCompony();
        //console.log(this.$route.params.id);
    },
    activated(){
        this.buttonMsg = '修改';
        this.getMessage();
    },
    methods:{
        switchCompony(){
            this.changeCompony = true;
        },
        getMessage(){
            let id = sessionStorage.getItem('packageNum');
            let token = localStorage.getItem('token');
            let that = this;
            let loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
            })
            that.$axios.post(that.$api.expressDetailPost, {"tracking_number": id}, {
                headers:{
                    "Content-Type":"application/json",
                    "token":token
                }
            }).then(function(res){
                if(res.data.code == 0){
                    let temObj = res.data.data;
                    let stationList = JSON.parse(sessionStorage.getItem('siteList'));
                    temObj['arrived_at'] = that.secondsFormat(temObj['arrived_at']);
                    temObj['courier_code'] = that.$compony[temObj['courier_code']];
                    stationList.forEach((item,index) => {
                        if(item['site_id'] == temObj['site_id']){
                            temObj['site_id'] = item['site_name']
                        }
                    });
                    that.detail.data = temObj;
                }else{
                    this.$notify.error({
                        title: '获取详情错误',
                        message: res.data.error
                    })
                }
                loading.close();
            })
        },
        backStep(){
            this.showEdit = false;
            this.$router.go(-1);
        },
        showLargeImg(){
            window.open(this.detail.data.cover_url);
        },
        getCompony(){
            // let that = this;
            // let keys = Object.keys(that.$compony);
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
        editMsg(){
            this.showEdit = true; 
        },
        cancelEditMsg(){
            this.showEdit = false;
            this.getMessage();
        },
        saveMsg(){
            if(!this.showEdit){
                return;
            }
            let that = this;
            let token = localStorage.getItem('token');
            let temObj = {
                id: that.detail.data['id'],
                recipient_name: that.detail.data['recipient_name'],
                recipient_phone: that.detail.data['recipient_phone'],
                courier_code: that.detail.data['courier_code'],
            }
            if(!that.changeCompony){
                temObj.courier_code = that.$transferName(temObj['courier_code']);
            }
            that.buttonMsg = false;
            // console.log(temObj);
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            that.$ajax(that, 'post', that.$api.updatePackage, temObj, token, function(res){
                if(res.data.code == 0){
                    that.$notify({
                        title: '保存成功',
                        message: `信息修改保存成功`,
                        type: 'success'
                    }) 
                    that.$router.push('/manage/express/query')
                }else{
                    that.$notify.error({
                        title: '错误',
                        message: res.data.error
                    })
                }
                loading.close();
            })
        }
    }
}
</script>

<style lang='less'>
@rem:100rem;

.package-detail{
    width: 100%;
    .express-detail{
        width: 100%;
        margin-top: 20/@rem;
        .el-button{
            margin-top: 20/@rem;
        }
        .detail-header{
            width: 100%;
            height: 60/@rem;
            display: flex;
            align-items: center;
            border-bottom: 1/@rem solid #cccccc;
            span{
                font-size: 18/@rem;
                font-weight: 500;
                letter-spacing: 1/@rem;
            }
        }
        .detail-content{
            width: 100%;
            margin-top: 34/@rem;
            display: flex;
            min-height: 506/@rem;
            flex-wrap: wrap;
            .content-message{
                width: 50%;
                display: flex;
                flex-direction: column;
                .message{
                    height: 52/@rem;
                    line-height: 52/@rem;
                    font-size: 16/@rem;
                    margin-left: 200/@rem;
                    letter-spacing: 1/@rem;
                    input{
                        width: 200/@rem;
                        outline-color: #e9e9e9;
                    }
                }
                .message:last-child{
                    .cover{
                        width: 505/@rem;
                    }
                    img{
                        width: 505/@rem;
                    }
                }
            }
            .content-progress{
                width: 50%;
                display: flex;
                flex-wrap: wrap;
                .progress-tree{
                    margin-left: 200/@rem;
                    .el-step{
                        height:100/@rem;
                    }
                }
            }
        }
    }
}
</style>
