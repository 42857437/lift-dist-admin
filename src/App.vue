<template>
	<div id="app">
		<transition name="fade">
			<router-view v-if="isRouterAlive"/>
		</transition>
    <!--加载动画-->
    <div class="loading-box" v-if="state.isLoading">
      <nt-pulse-loader :loading="state.isLoading"></nt-pulse-loader>
    </div>
	</div>
</template>

<script>
	export default {
		name: 'App',
    provide(){
		  return {
		    reload:this.reload
      }
    },
    computed: {
      state() {
        return this.$store.state;
      },
    },
    data(){
		  return{
        isRouterAlive:true
      }
    },
    methods:{
		  reload(){
		    this.isRouterAlive=false;
        this.$nextTick(function () {
          this.isRouterAlive=true;
        })
      }
    }
	}
</script>

<style>
	#app {
		text-align: center;
    	color: #000;
	}
  .loading-box{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 100;
  }
</style>
