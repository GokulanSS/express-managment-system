<template>
    <div class="no-permission">
        <div class="no-permission-container">
            <div class="content">
                <div class="content-summary">
                    <img src="~assets/images/forbidden.png" alt="">
                    <span>Sorry</span>
                </div>
                <div class="content-detail">
                    <p>404!</p>
                    <p>Page not found!</p>
                </div>
                <router-link class="back" to="/manage" @click.native="goback">返回主页面</router-link>
            </div>
            <div class="avatar">
                <img src="~assets/images/404.jpg" alt="">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'noPermission',
    methods:{
        goback(){
            this.$router.push({path:'/manage'});
        }
    }
}
</script>

<style lang='less'>
@rem:100rem;

.no-permission{
    width: 1920/@rem;
    margin: 0 auto;
    height: 100%;
    display: flex;
    justify-content: center;
    background: #31384a;
    color: #fff;
    .no-permission-container{
        width: 1478/@rem;
        margin-top: 100/@rem;
        display: flex;
        justify-content: space-between;
        .content{
            display: flex;
            flex-direction: column;
            .content-summary{
                height: 82/@rem;
                display: flex;
                align-items: center;
                img{
                    height: 80/@rem;
                    width: 80/@rem;
                }
                span{
                    font-size: 40/@rem;
                    margin-left: 5/@rem;
                    letter-spacing: 2px;
                    font-family:Arial, Helvetica, sans-serif;
                }
            }
            .content-detail{
                margin-top: 104/@rem;
                p:first-child{
                    font-size: 250/@rem;
                    font-weight: 600;
                }
                p:last-child{
                    font-size: 35/@rem;
                    font-family: Arial, Helvetica, sans-serif;
                }
            }
            .back{
                height: 70/@rem;
                width: 300/@rem;
                background: #77c937;
                text-align: center;
                line-height: 70/@rem;
                color: #fff;
                margin-top: 80/@rem;
                border-radius: 10/@rem;
                font-size: 30/@rem;
                letter-spacing: 1px;
            }
        }
    }
}

</style>
