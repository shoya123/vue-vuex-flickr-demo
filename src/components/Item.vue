<template>
	<li @click="$eventHub.$emit('showPopup', item)">
		<a class="itemContent">
			<img class="itemContent__img" :src="item.url_n || item.url_m || item.url_z || item.url_o" @load="loading = false">
			<pulse-loader :loading="loading" :class="'spinner'"></pulse-loader>
			<p class="itemContent__title">
				<span class="itemContent__title-inner">{{ title(item.title) }} </span>
			</p>
		</a>
	</li>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
	components: {
		PulseLoader
	},
	props: ['item'],
	data () {
		return {
			loading: true
		}
	},
	methods: {
		title (title) {
			if (title.length === 0) {
				return 'No Title'
			}
			return title.length > 30 ? title.substr(0, 30) + '...' : title
		}
	}
}
</script>

<style lang="scss">
.itemContent {
	display: block;
	cursor: pointer;
	width: 100%;
	height: 100%;
  z-index: 999;
  
  &:hover{
    opacity: 0.8;
  }
  &__img {
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
  }
  &__title {
    z-index: 999;
    position: absolute;
    bottom: 0px;
    text-align:center;
    background-color: rgba(0,0,0,0.7);
    width: 100%;
    color: #fff;
    margin: 0px;
    padding: 5px 10px;
    height: 50px;
    width: 100%;
    word-wrap: break-word;
    overflow: hidden;

    &-inner {
      display: block;
      width: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }    
  }
}
</style>
