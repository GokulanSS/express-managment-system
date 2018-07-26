import api from '../apis/api'
import compony from './expressCompany'

let plugin = {};
plugin.install = function (Vue, options) {
    Vue.prototype.$api = api;
    Vue.prototype.$compony = compony;

    //将快递公司代号转换为快递公司名称
    Vue.prototype.$transferCode = function(code){
        return compony[code];
    }

    //将快递公司名称转换为快递公司代号
    Vue.prototype.$transferName = function(str){
        let keys = Object.keys(compony);
        for(let i=0; i<keys.length; i++){
            if(compony[keys[i]] == str){
                return keys[i];
            }
        }
    }
    
    //将时间戳转换为xxxx-xx-xx格式
    Vue.prototype.dateFormat = function(stamp){
        let time = new Date(stamp);
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        if(month < 10){
            month = `0${month}`;
        }
        let day = time.getDate();
        if(day < 10){
            day = `0${day}`;
        }
        return `${year}-${month}-${day}`;
    }

    //将时间戳(单位为秒)转换为xxxx-xx-xx格式
    Vue.prototype.secondsFormat = function(stamp){
        let time = new Date(stamp*1000);
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        if(month < 10){
            month = `0${month}`;
        }
        let day = time.getDate();
        if(day < 10){
            day = `0${day}`;
        }
        return `${year}-${month}-${day}`;
    }

    //标准时间转换为时间戳
    Vue.prototype.timeStamp = function(str){
        return new Date(str).getTime();
    }

    //将电话转换成xxx-xxxx-xxxx的格式
    Vue.prototype.phoneFormat = function(phoneNum){
        let firstGroup = phoneNum.slice(0,3);
        let secondGroup = phoneNum.slice(3,7);
        let thirdGroup = phoneNum.slice(7);
        return `${firstGroup}-${secondGroup}-${thirdGroup}`;
    }

    // 将快递公司列表转换为键值对的形式{value:'sf', lable:'顺丰速运'}
    Vue.prototype.transformCompony = function(list){
        let temArr = [];
        list.forEach((item,index) => {
            let temObj = {};
            temObj.value = item['courier_code'];
            temObj.label = item['courier_name'];
            temArr.push(temObj);
        })
        return temArr;
    }


    /**
     * 将通过ajax请求返回的权限对象转换为权限数组
     * 
     * @param { Object } data
     * @return { Array } 
     */
    Vue.prototype.getPermissionArr = function(data){
        let reg =  /code[':"]*(\w*)['"]/g;
        let permission = [];
        let matchStr = JSON.stringify(data);
        matchStr.replace(reg, function($0, $1){
            permission.push($1);
        })
        return permission;
    }

    // 33-0 ??
    Vue.prototype.getUserPermission = function(permissionArr, target, context, token, api){
        if(permissionArr.length == 0){
            context.$axios({
                method: 'get',
                url: api,
                data: null,
                headers:{
                    "Content-Type":"application/json",
                    "token":token
                }
            }).then(function(res){
                console.log(res);
                if(res.data.code == 0){
                    let reg =  /code[':"]*(\w*)['"]/g;
                    let permission = [];
                    let matchStr = JSON.stringify(res.data.data.permissions);
                    matchStr.replace(reg, function($0, $1){
                        permission.push($1);
                    })
                    target = permission;
                    permissionArr = permission;
                    console.log(target);
                }
            }) 
        }else{
            target = permissionArr;
        }
    }

    /**
     * 发送ajax请求获取数据
     * 
     * @author zhangkang
     * @param { Object } context      : 执行上下文 
     * @param { String } method       : 发送请求的方式，get/post/put/delete
     * @param { String } api          : 发送请求的api接口
     * @param { Object } data         : 需要传输的数据,如何无则为null
     * @param { String } token        : 请求头中附加token
     * @param { Function } resHandle  : 请求返回后的处理函数
     */
    Vue.prototype.$ajax = function(context, method, api, data, token, resHandle){
        context.$axios({
            method: method,
            url: api,
            data: data,
            headers:{
                "Content-Type":"application/json",
                "token":token
            }
        }).then(function(res){
            resHandle(res);
        })
    }
}

export default plugin;