const TEM = 'https://www.yundiniao.cn/';
// const TEM = '/api'

let apiGroup = {
    BASE:'http://www.yundiniao.cn',
    login:`${TEM}/admin/login`,
    logout:`${TEM}/admin/logout`,
    userInfo:`${TEM}/admin/info`,
    setting:`${TEM}/admin/info/update`,
    editPass:`${TEM}/admin/info/password/update`,
    stationList:`${TEM}/admin/site/list`,
    switchStation:`${TEM}/admin/site/swtich`,
    stationDetail:`${TEM}/admin/site/info`,
    getCompony:`${TEM}/admin/system/courier/list`,

    staffList:`${TEM}/admin/site/staff/list`,
    editStaffMsg:`${TEM}/admin/site/staff/info/update`,
    getRoleList:`${TEM}/admin/role/list`,
    addStaff:`${TEM}/admin/site/staff/add`,
    deleteStaff:`${TEM}/admin/site/staff/delete`,
    addManage:`${TEM}/admin/site/admin/add`,
    codeMethod:`${TEM}/admin/site/pickup_code/gen_method`,
    messageMethod:`${TEM}/admin/notice/send_method`,
    feedback:`${TEM}/admin/site/feedback/1`,
    sendMsgMethod:`${TEM}/admin/notice/send_method`,
    deactivated:`${TEM}/admin/site/staff/deactive`,
    reactivated:`${TEM}/admin/site/staff/active`,
    getMsgMethod:`${TEM}/admin/notice/send_method`,
    getPackageCode:`${TEM}/admin/site/pickup_code/gen_method`,
    updateSiteMsg:`${TEM}/admin/site/info/update`,

    indexChart:`${TEM}/admin/statistics/query/today`,
    indexQuery:`${TEM}/admin/statistics/query`,

    packageMsg:`${TEM}/admin/package/info`,          //post
    expressDetail:`${TEM}/admin/package/info/`,      //get   
    expressDetailPost:`${TEM}/admin/package/info`,
    output:`${TEM}/admin/package/deliver`,
    input:`${TEM}/admin/package/store`,
    move:`${TEM}/admin/package/transfer`,
    query:`${TEM}/admin/package/query`,
    outputQueryTable:`${TEM}/admin/package/query/export`,
    retention:`${TEM}/admin/package/query/delayed`,
    sendRetentionMsg:`${TEM}/admin/notice/send/delayed`,
    move:`${TEM}/admin/package/transfer`,
    outputRetentionTable: `${TEM}/admin/package/query/delayed/export`,
    updatePackage:`${TEM}/admin/package/info/update`,
    countRetention:`${TEM}/admin/package/delayed/generate`,
    
    messageModel:`${TEM}/admin/notice/text_message/template/info`, 
    setMessageModel:`${TEM}/admin/notice/text_message/template/update`, 
    testInputMessage:`${TEM}/admin/notice/text_message/send_test_message/stored`,
    testMoveMessage:`${TEM}/admin/notice/text_message/send_test_message/transferred`,
    testOutputMessage:`${TEM}/admin/notice/text_message/send_test_message/delivered`,
    testDelayedMessage:`${TEM}/admin/notice/text_message/send_test_message/delayed`,
    testPhoneMessage:`${TEM}/admin/notice/text_message/send_test_message/captcha`,
    wxModel:`${TEM}/admin/notice/wechat/template/info`,
    setWxModel:`${TEM}/admin/notice/wechat/template/update`,
    testInputWx:`${TEM}/admin/notice/wechat/send_test_message/stored`,
    testMoveWx:`${TEM}/admin/notice/wechat/send_test_message/transferred`,
    testOutputWx:`${TEM}/admin/notice/wechat/send_test_message/delivered`,
    testDelayedWx:`${TEM}/admin/notice/wechat/send_test_message/delayed`,

    adList:`${TEM}/admin/ad/list`,
    adUpdate:`${TEM}/admin/ad/update`,
    adActived:`${TEM}/admin/ad/state/update`,
    adDelete:`${TEM}/admin/ad/delete`,       
    adImgUpload:`${TEM}/admin/ad/upload_image`,
    adAdd:`${TEM}/admin/ad/add`,

    roleList:`${TEM}/admin/role/list`,
    allPermission:`${TEM}/admin/resource/all`,
    rolePermission:`${TEM}/admin/role/detail/1`,
    managerList:`${TEM}/admin/site/admin/list`,
    updatePermission:`${TEM}/admin/role/permission/update`,
    deactiveManager:`${TEM}/admin/site/admin/deactive`,
    reactiveManager:`${TEM}/admin/site/admin/active`,
    addRole:`${TEM}/admin/role/permission/add`,
    roleDetail:`${TEM}/admin/role/detail/`,
    updateManager:`${TEM}/admin/site/admin/info/update`
}

export default apiGroup;