<template>
  <div class="edit-ad">
      <div class="edit-ad-container">
          <el-form ref="form" :model="editAd" label-width="120px">
                <el-form-item label="广告类型">
                    <el-select v-model="adType" placeholder="请选择广告类型" class="choose-ad-type" no-data-text='now' @change='showAdType($event)'>
                        <el-option label="取件广告" value="1"></el-option>
                        <el-option label="微信广告" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告品牌">
                    <el-input v-model="editAd.vendor"></el-input>
                </el-form-item>
                <el-form-item label="广告文本">
                    <el-input v-model="editAd.content"></el-input>
                </el-form-item>
                <el-form-item label="广告链接">
                    <el-input v-model="editAd.image_link"></el-input>
                </el-form-item>
                <el-form-item label="广告图片">
                    <img :src="editAd['image_url']" alt="" class="avatar">
                    <input value="更换图片" type="file" id="file" @change="uploadImg($event)">
                    <div class="el-upload__tip">上传图片大小为750px*1134px</div>
                    <!-- <el-upload
                        class="ad-picture-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAdSuccess">
                        <img v-if="editAd['image_url']" :src="editAd['image_url']" class="avatar">
                        <i v-else class="el-icon-plus ad-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">上传图片大小为750px*1134px</div>
                    </el-upload> -->
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
                    <el-checkbox-group
                        v-model="checkedUniversity">
                        <el-checkbox v-for="(item,index) in siteList" :key="index" :label="item['site_id']" >{{item['site_name']}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="联系方式">
                    <el-input v-model="editAd.phone"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSave">保存</el-button>
                    <el-button @click="onPreview">预览</el-button>
                </el-form-item>
          </el-form>

          <el-dialog title="预览" :visible.sync="previewVisible">
            <div class="preview-content" v-if="$store.state.editAd['type'] == 1">
                <p class="preview-title">{{$store.state.editAd.vendor}}</p>
                <p class="preview-text">{{$store.state.editAd.content}}</p>
                <a :href="$store.state.editAd.image_link" target="_blank">
                    
                    <img v-if="!changeImg" :src="$store.state.editAd.image_url" alt="">
                    <img v-else :src="editAd['image_url']" alt="">
                </a>
            </div>
            <div class="preview-content" v-else>
                <p class="preview-title">{{$store.state.editAd.vendor}}</p>
                <p class="preview-text">
                    <a :href="$store.state.editAd.image_link">
                        {{$store.state.editAd.content}}
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
            dateRange:'',
            imageUrl:'',
            adType:'',
            checkedUniversity:[],
            previewVisible:false,
            currentAd:null,
            token:'',
            AD:0,
            siteList:[],
            default:true,
            changeImg:false
        }
    },
    methods:{
        showAdType(val){
            this.default = false;
            this.AD = val;
        },
        handleAdSuccess(res, file){
            let imageUrl = URL.createObjectURL(file.raw);
            this.$store.state.editAd['image_url'] = imageUrl;
        },
        onSave(){
            let that = this;
            let temEditAd  = JSON.parse(JSON.stringify(that.$store.state.editAd));
            if(!that.default){
                temEditAd['type'] = that.AD;
            }
            temEditAd['active_sites'] = that.checkedUniversity;
            let temStartTime = new Date(that.dateRange[0]);
            let temEndTime = new Date(that.dateRange[1]);
            temEditAd['active_time_start'] = parseInt(that.timeStamp(temStartTime)/1000);
            temEditAd['active_time_end'] = parseInt(that.timeStamp(temEndTime)/1000);
            temEditAd['active_sites'] = temEditAd['active_sites'].map( item => Number(item));
            temEditAd['id'] = Number(temEditAd['id']);
            temEditAd['type'] = Number(temEditAd['type']);
            if(!temEditAd['active_time_start'] || !temEditAd['active_time_end']){
                that.$notify({
                    title: '输入内容提示',
                    message: '请选择需要投放的时间段',
                    type: 'warning'
                })
                return;
            }

            if(temEditAd['active_sites'].length == 0){
                that.$notify({
                    title: '站点选择提示',
                    message: '请选择需要投放的站点',
                    type: 'warning'
                })
                return;
            }

            if(!temEditAd['content'] || temEditAd['content'].length == 0){
                that.$notify({
                    title: '广告文本提示',
                    message: '请输入广告文本内容',
                    type: 'warning'
                })
                return;
            }
            console.log(temEditAd);
            let loading = that.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            that.$ajax(that, 'post', that.$api.adUpdate, temEditAd, that.token, function(res){
                if(res.data.code == 0){
                    that.$notify({
                        title: '保存成功',
                        message: '广告信息已经保存成功',
                        type: 'success'
                    })
                    that.$router.push({name:'广告列表', params:{key:'editSuccess'}});
                }else{
                    that.$notify.error({
                        title: '保存失败',
                        message: res.data.error
                    })
                }
                loading.close();
            })
        },
        onPreview(){
            this.previewVisible = true;
        },
        previewCloseBtn(){
            this.previewVisible = false;
        },
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
                    that.editAd['image_url'] = that.imageUrl;
                    that.changeImg = true;
                }else{
                    that.$notify.error({
                        title: '上传失败',
                        message: res.data.error
                    })
                }
                loading.close();
            })
        }
    },
    computed:{
      editAd(){
        if(this.$store.state.editAd != null){
          this.adType = this.$store.state.adType[this.$store.state.editAd.type];
          return this.$store.state.editAd;
        }else{
          return;
        }
      }
    },
    mounted(){},
    activated(){
        console.log(this.$store.state.editAd);
        if(this.$store.state.editAd == null){
            this.$router.push('/manage/ad/get_package')
        }else{
            let temAD = this.$store.state.editAd;
            this.dateRange = [temAD['active_time_start'], temAD['active_time_end']];
            this.currentAd = temAD;
            this.token = localStorage.getItem('token');
            this.siteList = JSON.parse(sessionStorage.getItem('siteList'));
            this.checkedUniversity = temAD['active_sites'].map( item => item.toString());
        }
    }
}
</script>

<style lang='less'>
@rem:100rem;

.edit-ad{
    width: 100%;
    display: flex;
    justify-content: center;
    //上传输入框配置
     .edit-picture-uploader .el-upload {
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
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .edit-ad-container{
        width: 50%;
        margin-top: 40/@rem;
        .el-select{
            width: 100%;
        }
        .preview-content{
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            .preview-title{
                font-size: 18/@rem;
                margin-bottom: 10/@rem;
            }
            .preview-text{
                font-size: 14/@rem;
                margin-bottom: 6/@rem;
            }
            img{
                width: 750/@rem;
                height: 1134/@rem;
            }
        }
    }
}
</style>
