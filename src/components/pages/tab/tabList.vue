<template>
  <div class="tab-list">
      <div class="tab-container">
          <tabs></tabs>
      </div>
  </div>
</template>

<script>
import nav from './dataDesign'
import tabs from './tabs'

export default {
    name:'tabList',
    components:{
        tabs
    },
    data(){
        return {
            navigation:nav.data,
        }
    },
    methods:{},
    created(){
        
    },
    mounted(){
        
    },
    computed:{
        onRoutes(){
            return this.$route.path
        }
    }
}
</script>

<style lang='less'>
@rem:100rem;

.tab-list{
    width: 240/@rem;
    background: #08111f;
}
</style>
