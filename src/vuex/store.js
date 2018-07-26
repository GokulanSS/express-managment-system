import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

let store = new Vuex.Store({
    state:{
        summarize:{
            title:'',
            description:''
        },
        university:'',
        stationId:'',
        universityCode:{
            '1':'中国药科大学',
            '2':'中国清华大学',
            '3':'中国北京大学'
        },
        expressStatus:{
            collected:'总采集量',
            stored:'入库件量',
            delivered:'出库件量',
            delayed:'滞留件量',
            transfered:'移库件量',
            auto_delivered:'自助取件量',
            scanned:'已扫描'
        },
        expressStatusKeys:['collected','stored','delivered','delayed','transfered','auto_delivered','scanned'],
        roles:{
            "super-manager":'超级管理员',
            "normal-manager":'普通管理员',
            "staff":'员工'
        },
        editAd:null,
        adType:{
            '1':'取件广告',
            '2':'微信广告'
        },
        permission:[],
        allPermission:[],
        inputRole:'',
        outputPackage:null,
        inputPackage:null,
        movePackage:null
    },
    mutations:{
        increment(state){
            console.log(state);
        }
    },
    actions:{
        getMsg(context){   
        }
    }
})

export default store;