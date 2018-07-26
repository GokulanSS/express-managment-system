<template>
  <div class="add-ad">
      <div class="add-ad-container">
          <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="广告类型">
                    <el-select v-model="form.type" placeholder="请选择广告类型" class="choose-ad-type">
                        <el-option label="取件广告" value="1"></el-option>
                        <el-option label="推送广告" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告品牌">
                    <el-input v-model="form.vendor"></el-input>
                </el-form-item>
                <el-form-item label="广告文本">
                    <el-input v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item label="广告链接">
                    <el-input v-model="form.image_link"></el-input>
                </el-form-item>
                <el-form-item label="广告图片">
                    <input type="file" id="file" @change="uploadImg($event)">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <div class="el-upload__tip">上传图片大小为750px*1134px</div>
                </el-form-item>
                <el-form-item label="广告投放时间">
                    <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item> 
                <el-form-item label="投放站点选择">
                    <el-checkbox-group v-model="form['active_sites']">
                        <el-checkbox v-for="(item,index) in siteList" :key="index" :label="item['site_id']" >{{item['site_name']}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="联系方式">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSave">保存</el-button>
                    <el-button @click="onPreview">预览</el-button>
                </el-form-item>
          </el-form>

          <el-dialog title="广告预览" :visible.sync="previewVisible">
            <div class="preview-content" v-if="form['type'] == 1">
                <p class="preview-title">{{form.vendor}}</p>
                <p class="preview-text">{{form.content}}</p>
                <a :href="form.image_link" target="_blank">
                    <img id="ad-image" :src="form.image_url" alt="">
                </a>
            </div>
            <div class="preview-content" v-else>
                <p class="preview-title">{{form.vendor}}</p>
                <p class="preview-text">
                    <a :href="form.image_link">
                        {{form.content}}
                    </a>
                </p>
            </div>  
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="previewCloseBtn">确 定</el-button>
            </div>
          </el-dialog>
      </div>
  </div>
</template>

<script>
export default {
    name:'addAd',
    data(){
        return {
            form:{
                vendor: "",
                content: "",
                image_url: "",
                active_time_start: 0,
                active_time_end: 0,
                image_link: "",
                phone: "",
                active_sites: [],
                is_active: false,
                type: ''
            },
            dateRange:[],
            imageUrl:'',
            siteList:[],
            previewVisible:false,
            token:'',
            headers:{
                "Content-Type":"multipart/form-data",
                "token":this.token
            },
            userPermission:[]
        }
    },
    methods:{
        uploadImg(ev){
            let that = this;
            let formData = new FormData();
            let token = localStorage.getItem('token');
            formData.append('image', ev.target.files[0]);
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            that.$ajax(that, 'post', that.$api.adImgUpload, formData, token, function(res){
                if(res.data.code == 0){
                    that.imageUrl = that.$api.BASE+'/'+res.data.data;
                    that.form['image_url'] = that.imageUrl;
                }else{
                    that.$notify.error({
                        title: '上传失败',
                        message: res.data.error
                    })
                }
                loading.close();
            })
        },
        onSave(){
            this.form['active_time_start'] = this.timeStamp(this.dateRange[0])/1000;
            this.form['active_time_end'] = this.timeStamp(this.dateRange[1])/1000;
            let temForm = JSON.parse(JSON.stringify(this.form));

            if(temForm['type'].length == 0){
                this.$notify({
                    title: '广告类型',
                    message: '请选择广告类型',
                    type: 'warning'
                })
                return;
            }else{
                temForm['type'] = parseInt(temForm['type']);
            }

            if(temForm['vendor'].length == 0){
                this.$notify({
                    title: '广告品牌',
                    message: '请填写广告品牌',
                    type: 'warning'
                })
                return;
            }

            if(temForm['content'].length == 0){
                this.$notify({
                    title: '广告文本',
                    message: '请填写广告文本',
                    type: 'warning'
                })
                return;
            }

            if(temForm['image_link'].length == 0){
                this.$notify({
                    title: '广告图片',
                    message: '请上传一张广告图片',
                    type: 'warning'
                })
                return;
            }

            if(temForm['active_sites'].length == 0){
                this.$notify({
                    title: '广告图片',
                    message: '请上传一张广告图片',
                    type: 'warning'
                })
                return;
            }else{
                temForm['active_sites'] = temForm['active_sites'].map(item => {
                    return Number(item);
                })
            }

            let that = this;
            let token = localStorage.getItem('token');
            // console.log(temForm);
            //通过网络添加广告
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            that.$ajax(that, 'post', that.$api.adAdd, that.form, token, function(res){
                // console.log(res);
                if(res.data.code == 0){
                    that.form = {};
                    that.$notify({
                        title: '添加成功',
                        message: '广告添加成功',
                        type: 'success'
                    })
                    that.$router.push('/manage/ad/get_package');
                }else{
                    that.$notify.error({
                        title: '广告添加失败',
                        message: res.data.error
                    })
                }
                loading.close();
            })
        },
        onPreview(){
            if(this.form.type.length == 0){
                this.$notify({
                    title: '警告',
                    message: '请选择广告类型',
                    type: 'warning'
                });
                return;
            }
            this.previewVisible = true;
        },
        previewCloseBtn(){
            this.previewVisible = false;
        }
    },
    mounted(){
        this.siteList = JSON.parse(sessionStorage.getItem('siteList'));
        this.token = localStorage.getItem('token');
        this.headers.token = this.token;
    }
}
</script>

<style lang='less'>
@rem:100rem;

.add-ad{
    width: 100%;
    display: flex;
    justify-content: center;
    //上传输入框配置
     .ad-picture-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .ad-picture-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .ad-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    #ad-image{
        height: 1134/@rem;
        width: 750/@rem;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    
    .add-ad-container{
        width: 50%;
        margin-top: 40/@rem;
        .el-select{
            width: 100%;
        }

        .preview-content{
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }
}
</style>
