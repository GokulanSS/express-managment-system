import $store from '../vuex/store'
import axios from 'axios'
import apis from '../apis/api'

/**
 * 路由跳转进入页面前，首先判断Vuex是否具有权限列表
 * 如果不具有权限列表，发起ajax请求获取权限列表，与参数key比对是否具有该权限
 * 
 * @param { String } key
 * @param { Object } next 
 */
function testBeforeEnter(key, next){
    if($store.state.permission.length == 0){
        let token = localStorage.getItem('token');
        axios.get(apis.rolePermission,{
            headers:{
                "Content-Type":"application/json",
                "token":token
            }
        }).then(function(res){
            let withPermission = [];
            if(res.data.code == 0){
                let reg = /code[':"]*(\w*)['"]/g;
                let temData = JSON.stringify(res.data.data);
                temData.replace(reg,function($0,$1){
                    withPermission.push($1);
                })
                $store.state.permission = withPermission;
                if(withPermission.indexOf(key) < 0){
                    next('/401')
                }else{
                    next();
                }
            }
        })
    }else{
        if($store.state.permission.indexOf(key) < 0){
            next('/401');
        }else{
            next();
        }
    }
    next();
}

//路由跳转，所有路由均为静态路由
const staticRoutes = [
    {
        path: '/',
        name: '首页',
        meta:{
          permission:'home'  
        },
        beforeEnter: (to, from, next) => {
            let token = localStorage.getItem('token');
            if(token){
                next('/manage');
            }else{
                next('/login');
            }
        }
    },
    {
        path:'/login',
        name:'登录',
        meta:{
            permission:'login'
        },
        component: () => import('../components/pages/login/login')
    },
    {
        name:'manage',
        path:'/manage',
        component: () => import('../components/pages/manage/manage'),
        meta:{
            permission:'manage'
        },
        beforeEnter: (to, from, next) => {
            next();
        },
        children:[
            {
                path:'/manage/chart',
                name:'数据大盘',
                meta:{
                    permission:'data_board'
                },
                component: (resolve) => require(['../components/pages/chart/chart'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('data_board',next);
                }
            },
            {
                path:'/manage/express',
                name:'快递管理',
                meta:{
                    permission:'package_management'
                },
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('package_management',next);
                }
            },
            {
                path:'/manage/express/output',
                name:'快递出库',
                meta:{
                    permission:'deliver_package'
                },
                component: (resolve) => require(['../components/pages/express/output'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('deliver_package',next);
                }
            },
            {
                path:'/manage/express/input',
                name:'快递入库',
                meta:{
                    permission:'store_package'
                },
                component: (resolve) => require(['../components/pages/express/input'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('store_package',next);
                }
            },
            {
                path:'/manage/express/move',
                name:'快递移库',
                meta:{
                    permission:'transfer_package'
                },
                component: (resolve) => require(['../components/pages/express/move'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('transfer_package',next);
                }
            },
            {
                path:'/manage/express/query',
                name:'快递查询',
                meta:{
                    permission:'query_package'
                },
                component: (resolve) => require(['../components/pages/express/query'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('query_package',next);
                }
            },
            {
                path:'/manage/express/retention',
                name:'滞留查询',
                meta:{
                    permission:'query_delayed_package'
                },
                component: (resolve) => require(['../components/pages/express/retention'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('query_delayed_package',next);
                }
            },
            {
                path:'/manage/express/detail',
                name:'快递详情',
                meta:{
                    permission:'get_package_detail'
                },
                component: (resolve) => require(['../components/pages/express/detail'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('get_package_detail',next);
                }
            },
            {
                path:'/manage/notice',
                name:'通知管理',
                meta:{
                    permission:'notice_management'
                },
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('notice_management',next);
                }
            },
            // {
            //     path:'/manage/notice/send_message',
            //     name:'短信通知',
            //     meta:{
            //         permission:'send_message'
            //     },
            //     component: () => import('../components/pages/notice/sendMessage')
            // },
            {
                path:'/manage/notice/message_model',
                name:'短信模板',
                meta:{
                    permission:'send_test_text_message'
                },
                component: () => import('../components/pages/notice/messageModel'),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('send_test_text_message',next);
                }
            },
            {
                path:'/manage/notice/wx_model',
                name:'微信模板',
                meta:{
                    permission:'send_test_wechat'
                },
                component: () => import('../components/pages/notice/wxModel'),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('send_test_wechat',next);
                }
            },
            {
                path:'/manage/station',
                name:'站点管理',
                meta:{
                    permission:'site_info'
                },
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('site_info',next);
                }
            },
            {
                path:'/manage/station/detail',
                name:'站点详情',
                meta:{
                    permission:'get_site_detail'
                },
                component: (resolve) => require(['../components/pages/station/detail'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('get_site_detail',next);
                }
            },
            {
                path:'/manage/station/staff',
                name:'人员管理',
                meta:{
                    permission:'get_staff_list'
                },
                component: (resolve) => require(['../components/pages/station/staff'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('get_staff_list',next);
                }
            },
            {
                path:'/manage/station/add_staff',
                name:'新增人员',
                meta:{
                    permission:'add_staff'
                },
                component: (resolve) => require(['../components/pages/station/add'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('add_staff',next);
                }
            },
            {
                path:'/manage/station/message_method',
                name:'信息发送方式',
                meta:{
                    permission:'set_notice_sending_method'
                },
                component: (resolve) => require(['../components/pages/station/messageMethod'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('set_notice_sending_method',next);
                }
            },
            {
                path:'/manage/station/code_method',
                name:'取码方式',
                meta:{
                    permission:'update_pickup_code_gen_method'
                },
                component: (resolve) => require(['../components/pages/station/codeMethod'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('update_pickup_code_gen_method',next);
                }
            },
            {
                path:'/manage/station/feedback',
                name:'用户反馈',
                meta:{
                    permission:'get_user_feedback'
                },
                component: (resolve) => require(['../components/pages/station/feedback'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('get_user_feedback',next);
                }
            },
            {
                path:'/manage/ad',
                name:'广告管理',
                meta:{
                    permission:'advertisement_management'
                },
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('advertisement_management',next);
                }
            },
            {
                path:'/manage/ad/get_package',
                name:'广告列表',
                meta:{
                    permission:'get_ad_list'
                },
                component: (resolve) => require(['../components/pages/ad/getPackage'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('get_ad_list',next);
                }
            },
            // {
            //     path:'/manage/ad/send',
            //     name:'推送广告',
            //     meta:{
            //         permission:'ad_template_push'
            //     },
            //     component: (resolve) => require(['../components/pages/ad/send'],resolve),
            //     beforeEnter: (to, from, next) => {
            //         testBeforeEnter('store_package',next);
            //     }
            // },
            {
                path:'/manage/ad/edit',
                name:'广告修改',
                meta:{
                    permission:'update_ad_info'
                },
                component: (resolve) => require(['../components/pages/ad/editAd'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('update_ad_info',next);
                }
            },
            {
                path:'/manage/ad/add',
                name:'添加广告',
                meta:{
                    permission:'add_ad'
                },
                component: (resolve) => require(['../components/pages/ad/add'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('add_ad',next);
                }
            },
            {
                path:'/manage/role',
                name:'角色管理',
                meta:{
                    permission:'role_management'
                },
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('role_management',next);
                }
            },
            {
                path:'/manage/role/add',
                name:'角色添加',
                meta:{
                    permission:'add_role_resources' 
                },
                component: (resolve) => require(['../components/pages/role/add'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('add_role_resources',next);
                }
            },
            {
                path:'/manage/role/list',
                name:'角色列表',
                meta:{
                    permission:'get_role_list'
                },
                component: (resolve) => require(['../components/pages/role/list'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('get_role_list',next);
                }
            },
            {
                path:'/manage/setting',
                name:'个人设置',
                meta:{
                    permission:'admin_info'
                },
                component: (resolve) => require(['../components/pages/setting/setting'],resolve),
                beforeEnter: (to, from, next) => {
                    testBeforeEnter('admin_info',next);
                }
            },
            {
                path:'/manage/setting/password',
                name:'修改密码',
                meta:{
                    permission:'edit_password'
                },
                component: (resolve) => require(['../components/pages/setting/pass'],resolve)
            }
        ]    
    },
    {
        path:'/404',
        name:'noFound',
        meta:{
            permission:'not_found'
        },
        component: (resolve) => require(['../components/public/noFound'],resolve)
    },
    {
        path:'/401',
        name:'noPermission',
        meta:{
            permission:'forbidden'
        },
        component: (resolve) => require(['../components/public/noPermission'],resolve)
    }    
]




export default staticRoutes;