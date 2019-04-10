<template>
  <div id="app">
    <navbar></navbar>
		<div class="main">
			<item-list></item-list>
		</div>
		<transition>
    	<item-popup :item="popupItem" v-if="dispPopup"></item-popup>
		</transition>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import ItemList from '@/views/ItemList.vue'
import ItemPopup from '@/components/ItemPopup.vue'

export default {
	name: 'app',
	components: {
		Navbar,
		ItemList,
		ItemPopup
	},
	data () {
		return {
			dispPopup: false,
			popupItem: {}
		}
	},
	methods: {
		showPopup (item) {
			this.dispPopup = true
			this.popupItem = item
		},
		closePopup () {
			this.dispPopup = false
			this.popupItem = {}
		}
	},
	mounted () {
		this.$eventHub.$on('showPopup', this.showPopup)
		this.$eventHub.$on('closePopup', this.closePopup)
	}
}
</script>

<style lang="scss">
// リセット
*{
	box-sizing: border-box;
}
h1 {
  color: #444;
  margin: 10px 0px;
}
dt {
	font-weight: bold;
}
dd {
	margin: 0px 0px 20px 0px;
}

// コンポーネント
.button {
	padding: 10px;
	cursor: pointer;

	&_color_gray {
		border: 1px solid #888;
		color: #888;

		&:hover {
			background-color: #888;
			color: #fff;
		}
	}
}
.buttonWrapper {
	width: 100%;
	text-align: center;
	margin: 50px 0px;;
}
.main {
	width: 100%;
  margin-top: 170px;
}
.link {
  &__text {
    color:mediumblue;
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      color: red;
    }
  }
}
.spinner {
	position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.v-enter {
  opacity: 0;
}
.v-enter-active {
  transition: opacity 200ms ease-out;
}
.v-leave-to {
  opacity: 0;
}
.v-leave-active {
  transition: opacity 200ms ease-out;
}
</style>
