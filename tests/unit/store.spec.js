import { expect } from 'chai'
import { mockParams, mockData } from './mock-data'
import { state } from '@/store/index'
import mutations from '@/store/mutations'
import actionsInjector from 'inject-loader!@/store/actions'

describe('mutations', () => {
	describe('SET_RESPONSE_DATA', () => {
		it('', () => {
			const data = mockData()
			mutations.SET_RESPONSE_DATA(state, data)
			expect(state.responseData).to.equal(data)
		})
	})

	describe('SET_ITEMS', () => {
		const data = mockData()
		it('取得したデータのページが1ならば、state.items配列を取得したデータで初期化できる', () => {
			state.items = data.photos.photo
			mutations.SET_ITEMS(state, data)
			expect(state.items.length).to.equal(data.photos.photo.length)
		})
		it('取得したデータのページが2以上ならば、state.items配列に取得したデータを連結できる', () => {
			state.items = data.photos.photo
			data.photos.page = 2
			mutations.SET_ITEMS(state, data)
			expect(state.items.length).to.equal(data.photos.photo.length*2)
		})
	})

	describe('SET_SEARCH_PARMS', () => {
		it('全プロパティ上書きできる', () => {
			mutations.SET_SEARCH_PARMS(state, mockParams())
			expect(state.searchParams).to.deep.equal(mockParams())
		})
		it('差分上書きできる', () => {
			const diff = { text: 'dog', page: 2 }
			mutations.SET_SEARCH_PARMS(state, diff)
			expect(state.searchParams).to.deep.equal(Object.assign(mockParams(), diff))
		})
	})
})

// actionから発火する外部のAPIサーバーへのリクエスト用関数をモック化
const data = mockData()
const actions = actionsInjector({
	'../api/index.js': {
		fetchItems () {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve({ data: data })
				}, 1000)
			})
		}
	}
}).default

// アクションで渡されるcommitをモック化する
const testAction = (action, payload, state, expectedMutations, done) => {
	let count = 0
	
	const commit = (type, payload) => {
		const mutation = expectedMutations[count]

		try {
			expect(type).to.equal(mutation.type)
			if (payload) {
				expect(payload).to.deep.equal(mutation.payload)
			}
		} catch (error){
			done(error)
		}

		count++
		if (count >= expectedMutations.length) {
			done()
		}
	}

	action({ commit, state }, payload)

	if (expectedMutations.length === 0) {
		expect(count).to.equal(0)
		done()
	}
}

describe('actions', () => {
	describe('FETCH_ITEMS', () => {
		it('想定したcommitを全て実施し、正しいpayloadでcommitできる', done => {
			testAction(actions.FETCH_ITEMS, state.searchParams, {}, [
				{ type: 'SET_SEARCH_PARMS' , payload: state.searchParams },
				{ type: 'SET_RESPONSE_DATA', payload: data },
				{ type: 'SET_ITEMS'        , payload: data }
			], done)
		})
	})
})
