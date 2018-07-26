<template>
  <div class="staff">
    <div class="detail-staff">
      <div class="staff-table-container">
          <el-table
            :data="staffs.data"
            border
            style="width: 100%">
            <el-table-column
                prop="name"
                label="站点人员"
                width="180">
            </el-table-column>
            <!-- <el-table-column
                prop="staffpass"
                label="角色定位"
                width="180">
            </el-table-column> -->
            <el-table-column
                prop="created_at"
                label="入职时间">
            </el-table-column>
            <el-table-column
                prop="phone"
                label="联系电话">
            </el-table-column>
            <el-table-column
                label="管理操作"
                v-if="$store.state.permission.indexOf('update_staff') >= 0 || $store.state.permission.indexOf('deactive_staff') >= 0">
                <template slot-scope="scope">
                    <el-button type="text" @click="editHandle(scope.row)" v-if="userPermission.indexOf('update_staff') >= 0">修改</el-button>
                    <el-button class="deactived" type="text" @click="deactiveHandle(scope.row)" v-show="scope.row['is_active'] == 1">禁用</el-button>
                    <el-button type="text" @click="reactiveHandle(scope.row)" v-show="scope.row['is_active'] == 0">激活</el-button>
                </template>
            </el-table-column>
          </el-table>
      </div>

      <div class="edit-dialog">
        <el-dialog title="修改信息" :visible.sync="editVisible">
          <el-form :model="editStaff">
            <el-form-item label="姓名" :label-width="formLabelWidth">
              <el-input v-model="editStaff.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="入职时间" :label-width="formLabelWidth">
              <el-date-picker
                v-model="editStaff.created_at"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="联系电话" :label-width="formLabelWidth">
              <el-input v-model="editStaff.phone" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="重置密码" :label-width="formLabelWidth">
              <el-input v-model="editStaff.staffpass" auto-complete="off"></el-input>
            </el-form-item>
            <!-- <el-form-item label="角色定位" :label-width="formLabelWidth">
              <el-select v-model="editStaff.role_name" placeholder="请选择" >
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </el-form-item> -->
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelEditModel">取 消</el-button>
            <el-button type="primary" @click="confirmEditModel">确 定</el-button>
          </div>
        </el-dialog>
      </div>    
    </div>
  </div>
</template>

<script>
export default {
  name:'staff',
  data(){
    return {
      staffs:{
        data:[]
      },
      editVisible:false,
      formLabelWidth:'120px',
      editStaff:{
        id:'',
        name:'',
        phone:'',
        created_at:'',
        staffpass:''
      },
      options:[],
      token:'',
      userPermission:[]
    }
  },
  methods:{
    editHandle(row){
      this.editVisible = true;
      this.editStaff = row;
      // console.log(this.editStaff);
    },
    deactiveHandle(row){
      this.editStaff = row;
      // console.log(row);
      let that = this;
      that.$confirm('确认禁用, 是否继续?', '禁用提示', {
          confirmButtonText: '确定禁用',
          cancelButtonText: '取消禁用',
          type: 'warning'
      }).then(() => {
          let loading = that.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
          })
          that.$ajax(that, 'post', that.$api.deactivated, {"id":row.id}, that.token, function(res){
              if(res.data.code == 0){
                  that.$notify({
                      title: '禁用成功',
                      message: `用户${row.name}禁用成功`,
                      type: 'success'
                  })
                  that.staffList();
              }else{
                  that.$notify.error({
                      title: '禁用失败',
                      message: res.data.error
                  })
              }
              loading.close();
          })
      }).catch(() => {
          that.$message({
              type: 'info',
              message: '已取消禁用'
          })        
      })
    },
    reactiveHandle(row){
      let that = this;
      that.$confirm('确认激活, 是否继续?', '激活提示', {
          confirmButtonText: '确定激活',
          cancelButtonText: '取消激活',
          type: 'warning'
      }).then(() => {
          let loading = that.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
          })
          that.$ajax(that, 'post', that.$api.reactivated, {"id":row.id}, that.token, function(res){
              if(res.data.code == 0){
                  that.$notify({
                      title: '激活成功',
                      message: `用户${row.name}激活成功`,
                      type: 'success'
                  })
                  that.staffList();
              }else{
                  that.$notify.error({
                      title: '激活失败',
                      message: res.data.error
                  })
              }
              loading.close();
          })
      }).catch(() => {
          that.$message({
              type: 'info',
              message: '已取消激活'
          })        
      })
    },
    cancelEditModel(){
      this.editVisible = false;
      this.emptyEditStaff();
    },
    confirmEditModel(){
      let editStaff = this.editStaff;
      let token = localStorage.getItem('token');
      let that = this;
      // console.log(editStaff);
      editStaff['created_at'] = this.timeStamp(editStaff['created_at']);
      
      that.$axios.post(that.$api.editStaffMsg, editStaff, {
        headers:{
          "Content-Type":"application/json",
          "token":token
        }
      }).then(function(res){
        //console.log(res);
        if(res.data.code == 0){
          //替换修改的员工信息
          let staffsData = that.staffs.data;
          for(let i=0; i<staffsData.length; i++){
            if(staffsData[i]['id'] == editStaff['id']){
              staffsData.splice(i,1,editStaff);
            }
          }

          that.formatDate(that.staffs.data);
          that.editVisible = false;
          that.emptyEditStaff();
          that.$notify({
            title: '修改成功',
            message: '信息修改成功',
            type: 'success'
          })
          that.staffList();
        }else{
          that.$notify.error({
            title: '信息修改失败',
            message: res.data.error
          })
        }
      })
    },
    cancelDelete(){
      this.deleteVisible = false;
      this.emptyEditStaff();
    },
    confirmDelete(){
      let staffsData = this.staffs.data;
      let that = this;
      let temId = this.editStaff['id'];

      that.$ajax(that, 'post', that.$api.deleteStaff, {"id":temId}, that.token, function(res){
        if(res.data.code == 0){
          for(let i=0; i<staffsData.length; i++){
            if(staffsData[i]['id'] == temId){
              staffsData.splice(i,1);
            }
          }
          that.emptyEditStaff();
          that.deleteVisible = false;
          that.$notify({
            title: '删除成功',
            message: '信息删除成功',
            type: 'success'
          })
        }else{
          that.$notify.error({
            title: '信息删除失败',
            message: res.data.error
          })
        }
      })
      
    },
    emptyEditStaff(){
      this.editStaff = {
        id:'',
        name:'',
        phone:'',
        created_at:'',
        staffpass:''
      }
    },
    formatDate(dataList){
      for(let i=0; i<dataList.length; i++){
        let date = dataList[i]['created_at'];
        dataList[i]['created_at'] = this.dateFormat(date*1000);
      }
    },
    staffList(){
      let token = localStorage.getItem('token');
      let that = this;
      let loading = that.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
      })
      that.$axios.get(that.$api.staffList,{
        headers:{
          "Content-Type":"application/json",
          "token":token
        }
      }).then(function(res){
        // console.log(res);
        if(res.data.code == 0){
          that.staffs = res.data;
          that.formatDate(that.staffs.data);
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
                  that.userPermission = that.getPermissionArr(res.data.data.permissions);
                  that.$store.state.permission = that.userPermission;
                  // console.log(that.userPermission);
                }
            })
        }else{
            that.userPermission = temPer;
        }
    }
  },
  mounted(){
    let that = this;
    this.token = localStorage.getItem('token');
    this.staffList();
    this.getRoleList();

    that.$ajax(that, 'get', that.$api.roleList, null, that.token, function(res){
        // console.log(res);
        if(res.data.code == 0){
          let data = res.data.data;
          let temArr = [];
          data.forEach((item, index, arr) => {
            let temObj = {};
            temObj['value'] = item['role_name'];
            temObj['label'] = item['role_name'];
            temArr.push(temObj);
          })
          that.options = temArr;
        }else{
          that.$notify.error({
            title: '获取角色列表错误',
            message: res.data.error
          });
        }
    })

  },
  computed:{
    university(){
      return this.$store.state.stationId;
    }
  },
  watch:{
    university:function(){
      this.staffList();
    }
  }
}
</script>

<style lang='less'>
@rem:100rem;

.staff{
  width: 100%;
  display: flex;
  justify-content: center;
  .detail-staff{
    width: 80%;
    margin-top: 80/@rem;
  }
  .edit-dialog{
    .el-form-item__content{
      width: 217px;
    }
  }
  .deactived{
    span{
      color: #f56c6c;
    }
  }
}
</style>
