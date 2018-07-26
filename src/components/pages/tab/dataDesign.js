//侧边栏渲染数据
const permission = {
    data:[
        {
            name:'数据大盘',
            path:'manage/chart',
            children:[],
            meta:{
                permission:'data_board',
                icon:'share'
            }
        },
        {   
            name:'快递管理',
            path:'manage/express',
            meta:{
                permission:'package_management',
                icon:'menu'
            },
            children:[
                {name:'快递出库', path:'manage/express/output' , meta:{permission:'deliver_package'}},
                {name:'快递入库', path:'manage/express/input', meta:{permission:'store_package'}},
                {name:'快递移库', path:'manage/express/move', meta:{permission:'transfer_package'}},
                {name:'快递查询', path:'manage/express/query', meta:{permission:'get_package_detail_by_tracking_number'}},
                {name:'滞留查询', path:'manage/express/retention', meta:{permission:'query_delayed_package'}}
            ]   
        },
        {
            name:'通知管理',
            path:'manage/notice',
            meta:{
                icon:'phone',
                permission:'notice_management'
            },
            children:[
                {name:'短信模板', path:'manage/notice/message_model', meta:{permission:'get_text_message_template_codes'}},
                {name:'微信模板', path:'manage/notice/wx_model', meta:{permission:'get_wechat_template_codes'}}
            ]
        },
        {
            name:'站点管理',
            path:'manage/station',
            meta:{
                icon:'location',
                permission:'site_info'
            },
            children:[
                {name:'站点详情', path:'manage/station/detail', meta:{permission:'get_site_detail'}},
                {name:'新增人员', path:'manage/station/add_staff', meta:{permission:'add_staff'}},
                {name:'发送方式', path:'manage/station/message_method', meta:{permission:'deliver_package'}},
                {name:'人员管理', path:'manage/station/staff', meta:{permission:'get_staff_list'}},
                {name:'取码方式', path:'manage/station/code_method', meta:{permission:'update_pickup_code_gen_method'}},
                {name:'用户反馈', path:'manage/station/feedback', meta:{permission:'get_user_feedback'}}
            ]
        },
        {
            name:'广告管理',
            path:'manage/ad',
            meta:{
                icon:'picture',
                permission:'advertisement_management'
            },
            children:[
                {name:'取件广告', path:'manage/ad/get_package', meta:{permission:'get_ad_list'}},
                // {name:'推送广告', path:'manage/ad/send'},
                {name:'添加广告', path:'manage/ad/add', meta:{permission:'add_ad'}}
            ]
        },
        {
            name:'角色管理',
            path:'manage/role',
            meta:{
                icon:'date',
                permission:'role_management'
            },
            children:[
                {name:'角色列表', path:'manage/role/list', meta:{permission:'get_role_list'}},
                {name:'角色添加', path:'manage/role/add', meta:{permission:'get_role_resource_list'}}
            ]
        }
    ]
}



export default permission;