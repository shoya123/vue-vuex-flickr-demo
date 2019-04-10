<template>
	<div class="popup" @click="closePopup">
		<div class="popup__panel" @click.stop>
			<div class="photo">
				<figure class="photo__fig">
					<img class="photo__fig-img" :src="item.url_n || item.url_m || item.url_z || item.url_o">
				</figure>
				<dl>
					<dt>タイトル</dt>
					<dd>{{ item.title }}</dd>
					<dt>投稿者</dt>
					<dd><a class="link__text" @click="searchByOwnerName(item.owner)">{{ item.ownername }}</a></dd>
					<dt>撮影日</dt>
					<dd>{{ item.datetaken.substr(0, 10) }}</dd>
					<dt>投稿日</dt>
					<dd>{{ formatDate(item.dateupload) }} </dd>
				</dl>
			</div>
			<a class="button button_color_gray" @click="closePopup">閉じる</a>
		</div>
	</div>
</template>

<script>
export default {
	props: ['item'],
	methods: {
		closePopup () {
			this.$eventHub.$emit('closePopup')
		},
		searchByOwnerName (owner) {
			this.$eventHub.$emit('loadItems', { user_id: owner })
			this.closePopup()
		},
		formatDate (dateUpload) {
			const date = new Date(Number(dateUpload + '000'))
			let year = String(date.getFullYear())
			let month = String(date.getMonth()+1)
			let day = String(date.getDate())

			month = month.length === 1 ? '0' + month : month
			day = day.length === 1 ? '0' + day : day

			return `${year}-${month}-${day}`
		}
	}
}
</script>

<style lang="scss">
.popup {
	background-color: rgba(0,0,0,0.8);
	position: fixed;
	top: 0;
	left: 0px;
	height: 100%;
	width: 100%;
  z-index: 9999;
  
  &__panel {
    width: 500px;
    height: 90%;
    margin: 0 auto;
    text-align: center;
    background-color: #fff;
    z-index: 9999;
    padding: 30px;
    margin-top: 20px;
    overflow-y: scroll;
  }
}
.photo {
  &__fig {
    &-img {
      max-width: 100%;
      border: 1px solid #ccc;
    }
  }
}
</style>
