<template>
	<div class="wrapper">
		<clip-loader :loading="initLoading" :class="'spinner'"></clip-loader>
		<transition>
			<ul class="gallery" v-if="!initLoading">
				<item class="gallery__item" v-for="item in items"  :item="item" :key="item.id"></item>
			</ul>
		</transition>
			<div class="buttonWrapper" v-if="hasMore && !initLoading">
				<a class="button button_color_gray" @click="loadMore">もっと見る</a>
			</div>
			<div class="noDataAnymore" v-if="items.length === 0 && !initLoading">
				no data available
			</div>
	</div>
</template>

<script>
import Item from '@/components/Item.vue'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

export default {
	components: {
		Item,
		ClipLoader
	},
	data () {
		return {
			hasMore: true, // もっと見るボタン
			initLoading: true // pageを1から読む時に、画像を読み込み開始するまでのローディング中の画面を制御
		}
	},
	computed: {
		items () {
			return this.$store.getters.items
		}
	},
	methods: {
		loadItems (params) {
			if (!params.page) {
				params.page = 1
				this.initLoading = true
			}
			return this.$store.dispatch('FETCH_ITEMS', params)
				.then(() => {
					const data = this.$store.state.responseData
					this.hasMore = data.photos.page <= data.photos.pages
					this.initLoading = false
				})
		},
		loadMore () {
			this.loadItems({ page: this.$store.state.searchParams.page + 1 })
		}
	},
	mounted () {
		this.loadItems({})
		this.$eventHub.$on('loadItems', this.loadItems)
	}
}
</script>

<style lang="scss">
.gallery {
	display: flex;
	flex-wrap: wrap;
  // justify-content: space-between;
  padding-left: 0px;
  
  &__item {
    list-style: none;
    width: 25%;
    height: 300px ;
    position: relative;
  }
}
</style>
