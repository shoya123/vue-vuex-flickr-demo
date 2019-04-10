<template>
	<nav class="nav">
		<h1>Vue + Vuex + Flickr App</h1>
		<form class="searchForm" @submit.prevent="searchByText">
			<div class="searchForm__item">
				<div class="formItem">
					<label class="formItem__label">キーワード検索</label>
					<input class="formItem__input" type="text" placeholder="キーワード検索" v-model="text">
				</div>
			</div>
			<div class="searchForm__item">
				<div class="formItem">
					<label class="formItem__label">ソート（時間は無視）</label>
					<select class="formItem__select" @change="changeSortType($event)" :value="sort">
						<option v-for="pattern in sortPattern" :value="pattern.value" :key="pattern.value">{{ pattern.text }}</option>
					</select>
				</div>
			</div>
			<div class="searchForm__item">
				<label class="formItem__label">読み込む数</label>
				<select class="formItem__select" @change="changePerPage($event)" :value="perPage">
					<option v-for="pattern in perPagePattern" :value="pattern.value" :key="pattern.value">{{ pattern.text }}</option>
				</select>
			</div>
		</form>
	</nav>
</template>

<script>
import formValuePattern from '@/data/formValuePattern'

export default {
	data () {
		return {
			text: '',
			sortPattern: formValuePattern.sort,
			perPagePattern: formValuePattern.perPage
		}
	},
	methods: {
		searchByText () {
			this.$eventHub.$emit('loadItems', { text: this.text, user_id: '' })
		},
		changeSortType (e) {
			this.$eventHub.$emit('loadItems', { sort: e.target.value })
		},
		changePerPage (e) {
			this.$eventHub.$emit('loadItems', { per_page: e.target.value })
		}
	},
	computed: {
		sort () {
			return this.$store.state.searchParams.sort
		},
		perPage () {
			return this.$store.state.searchParams.per_page
		}
	}
}
</script>

<style lang="scss">
.nav {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  background-color: #fff;
  z-index: 9999;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
.searchForm {
	display: flex;
	&__item {
		margin-left: 10px;
	}
}
.formItem {
	&__input,
	&__select {
		display: block;
		height: 30px;
		width: 200px;
	}
}
</style>
