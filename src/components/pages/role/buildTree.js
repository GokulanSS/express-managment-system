//建立包含所有权限内容的权限树

export default {
    data: [
        {
            "label": "个人中心",
            "id": "admin_info",
            "children": [
                {
                    "label": "获取用户反馈",
                    "id": "get_user_feedback"
                }
            ]
        },
        {
            "label": "广告管理",
            "id": "advertisement_management",
            "children": [
                {
                    "label": "获取广告列表",
                    "id": "get_ad_list"
                },
                {
                    "label": "激活/禁用广告",
                    "id": "change_ad_state"
                },
                {
                    "label": "更新广告信息",
                    "id": "update_ad_info"
                },
                {
                    "label": "新增广告",
                    "id": "add_ad"
                },
                {
                    "label": "删除广告",
                    "id": "delete_add"
                },
                {
                    "label": "上传广告图片",
                    "id": "ad_upload_image"
                }
            ]
        },
        {
            "label": "数据大盘",
            "id": "data_board",
            "children": [
                {
                    "label": "首页包裹统计",
                    "id": "homepage_statistic"
                },
                {
                    "label": "首页包裹统计查询",
                    "id": "homepage_statistic_query"
                }
            ]
        },
        {
            "label": "通知管理",
            "id": "notice_management",
            "children": [
                {
                    "label": "发送取件通知",
                    "id": "send_stored_notice"
                },
                {
                    "label": "发送滞留通知",
                    "id": "send_delayed_notice"
                },
                {
                    "label": "发送移库通知",
                    "id": "send_transfered_notice"
                },
                {
                    "label": "设定消息发送方式",
                    "id": "set_notice_sending_method"
                },
                {
                    "label": "获取消息发送方式",
                    "id": "get_notice_sending_method"
                },
                {
                    "label": "设定短信通知模板",
                    "id": "set_text_message_template_codes"
                },
                {
                    "label": "获取短信模板代码",
                    "id": "get_text_message_template_codes"
                },
                {
                    "label": "设置微信模板代码",
                    "id": "set_wechat_template_codes"
                },
                {
                    "label": "获取微信模板代码",
                    "id": "get_wechat_template_codes"
                },
                {
                    "label": "发送测试短信",
                    "id": "send_test_text_message",
                    "children": [
                        {
                            "label": "发送测试入库短信",
                            "id": "send_test_text_message_stored"
                        },
                        {
                            "label": "发送测试移库短信",
                            "id": "send_test_text_message_transferred"
                        },
                        {
                            "label": "发送测试滞留短信",
                            "id": "send_test_text_message_delayed"
                        },
                        {
                            "label": "发送测试出库短信",
                            "id": "send_test_text_message_delivered"
                        },
                        {
                            "label": "发送测试手机验证码",
                            "id": "send_test_captcha"
                        }
                    ]
                },
                {
                    "label": "发送测试微信",
                    "id": "send_test_wechat",
                    "children": [
                        {
                            "label": "发送测试出库微信",
                            "id": "send_test_wechat_delivered"
                        },
                        {
                            "label": "发送测试入库微信",
                            "id": "send_test_wechat_stored"
                        },
                        {
                            "label": "发送测试滞留微信",
                            "id": "send_test_wechat_delayed"
                        },
                        {
                            "label": "发送测试移库微信",
                            "id": "send_test_wechat_transferred"
                        }
                    ]
                }
            ]
        },
        {
            "label": "快递管理",
            "id": "package_management",
            "children": [
                {
                    "label": "获取包裹详情",
                    "id": "get_package_detail"
                },
                {
                    "label": "根据订单号查询包裹详情",
                    "id": "get_package_detail_by_tracking_number"
                },
                {
                    "label": "入库包裹",
                    "id": "store_package"
                },
                {
                    "label": "出库包裹",
                    "id": "deliver_package"
                },
                {
                    "label": "移库包裹",
                    "id": "transfer_package"
                },
                {
                    "label": "查询包裹",
                    "id": "query_package"
                },
                {
                    "label": "查询包裹结果导出表格",
                    "id": "query_package_export"
                },
                {
                    "label": "查询当天滞留件",
                    "id": "query_delayed_package"
                },
                {
                    "label": "导出滞留件列表",
                    "id": "export_delayed_package"
                }
            ]
        },
        {
            "label": "角色管理",
            "id": "role_management",
            "children": [
                {
                    "label": "获取角色列表",
                    "id": "get_role_list"
                },
                {
                    "label": "获取所有的权限列表",
                    "id": "get_all_resource"
                },
                {
                    "label": "角色详情",
                    "id": "get_role_resource_list"
                },
                {
                    "label": "更新角色权限",
                    "id": "update_role_resources"
                },
                {
                    "label": "添加角色",
                    "id": "add_role_resources"
                },
                {
                    "label": "删除角色",
                    "id": "delete_role_resources"
                }
            ]
        },
        {
            "label": "站点",
            "id": "site_info",
            "children": [
                {
                    "label": "获取站点列表",
                    "id": "get_site_list"
                },
                {
                    "label": "获取站点详情",
                    "id": "get_site_detail"
                },
                {
                    "label": "获取管理员列表",
                    "id": "get_admin_list"
                },
                {
                    "label": "获取员工列表",
                    "id": "get_staff_list"
                },
                {
                    "label": "新增管理员",
                    "id": "add_admin"
                },
                {
                    "label": "禁用管理员",
                    "id": "deactive_admin"
                },
                {
                    "label": "激活管理员",
                    "id": "active_admin"
                },
                {
                    "label": "新增员工",
                    "id": "add_staff"
                },
                {
                    "label": "禁用员工",
                    "id": "deactive_staff"
                },
                {
                    "label": "激活员工",
                    "id": "active_staff"
                },
                {
                    "label": "更新员工信息",
                    "id": "update_staff"
                },
                {
                    "label": "更新取件码生成方式",
                    "id": "update_pickup_id_gen_method"
                },
                {
                    "label": "获取取件码生成方式",
                    "id": "get_pickup_id_gen_method"
                }
            ]
        },
        {
            "label": "切换站点",
            "id": "swtich_site"
        },
        {
            "label": "流水线操作",
            "id": "system"
        }
    ]
}