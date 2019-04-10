import { assert, expect } from 'chai'
import { createUrl, fetchItems } from '@/api/index'
import { mockParams } from './mock-data'

describe('API', () => {
	describe('createUrl', () => {
		it('渡したオブジェクトの値を全てクエリに変換できる', () => {
			const url = createUrl(mockParams())
			const params = mockParams()
			Object.keys(params).forEach(key => {
				if (params[key] !== '') {
					let reg = new RegExp(`&${key}=${params[key]}`)
					if (!reg.test(url)) {
						throw new Error('URLに必要なクエリが含まれていません')
					}
				}
			})
		})
		it('渡したオブジェクトのうち、プロパティの値が空文字の場合は除外してクエリを作成できる', () => {
			const params = mockParams({ text: '' })
			const url = createUrl(params)

			Object.keys(params).forEach(key => {
				if (params[key] !== '') {
					let reg = new RegExp(`&${key}=${params[key]}`)
					if (!reg.test(url)) {
						throw new Error('URLに必要なクエリが含まれていません')
					}
				}
			})
			
			if (/&text=/.test(url)) {
				throw new Error('URLに不要なクエリが含まれています')
			}			
		})
	})
	describe('fetchItems', () => {
		describe('FlickrのAPIサーバーからデータを取得', () => {

			it('取得できる', () => {
				return fetchItems(mockParams())
					.then(res => {
						expect(res.data.stat).to.equal('ok')
					})
					.catch((error) => {
						throw new Error(error.message)
					})
			})

			it('指定のユーザーのデータのみ取得できる', () => {
				const userId = '31676563@N05' // ランダムに抜粋したので、ユーザーが退会等するとエラーになる可能性が高い
				const params = mockParams({ user_id: userId })
				return fetchItems(params)
					.then(res => {
						res.data.photos.photo.forEach(photo => {
							expect(photo.owner).to.equal(userId)
						})
					})
					.catch((error) => {
						throw new Error(error.message)
					})
			})

			describe('テキスト', () => {
				it('タイトル、説明文、タグのいずれかに指定の文字列が含まれるデータを取得できる', () => {
					const text = '桜'
					const reg = new RegExp(text)
					const params = mockParams({ text: text, per_page: 100})
					return fetchItems(params)
						.then(res => {
							const matchedArr = res.data.photos.photo.filter(photo => {
								return reg.test([photo.title, photo.tags, photo.description._content].join(''))
							})
							expect(matchedArr.length).to.equal(res.data.photos.photo.length)
						})
						.catch((error) => {
							throw new Error(error.message)
						})
				})
			})

			describe('撮影日', () => {
				it('降順で取得できる（時間は無視）', () => {
					const params = mockParams({ sort: 'date-taken-desc', per_page: 100})
					return fetchItems(params)
						.then(res => {
							if (!compareTakenDate(res.data.photos.photo, 'desc')) {
								assert.fail('撮影日の降順になっていません')
							}
						})
						.catch((error) => {
							throw new Error(error.message)
						})
				})
				
				it('昇順で取得できる（時間は無視）', () => {
					const params = mockParams({ sort: 'date-taken-asc', per_page: 100})
					return fetchItems(params)
						.then(res => {
							if (!compareTakenDate(res.data.photos.photo, 'asc')) {
								assert.fail('撮影日の昇順になっていません')
							}
						})
						.catch((error) => {
							throw new Error(error.message)
						})
				})
			})

			describe('投稿日', () => {
				it('降順で取得できる（時間は無視）', () => {
					const params = mockParams({ sort: 'date-posted-desc', per_page: 100})
					return fetchItems(params)
						.then(res => {
							if (!comparePostDate(res.data.photos.photo, 'desc')) {
								assert.fail('投稿日の降順になっていません')
							}
						})
						.catch((error) => {
							throw new Error(error.message)
						})
				})
				
				it('昇順で取得できる（時間は無視）', () => {
					const params = mockParams({ sort: 'date-posted-asc', per_page: 100})
					return fetchItems(params)
						.then(res => {
							if (!comparePostDate(res.data.photos.photo, 'asc')) {
								assert.fail('投稿日の昇順になっていません')
							}
						})
						.catch((error) => {
							throw new Error(error.message)
						})
				})
			})
		})
	})
})

// 撮影日付比較のヘルパー
function compareTakenDate (photo, sortType) {
	for (let i = 1, len = photo.length; i < len; i++) {
		let a = new Date(String(photo[i-1].datetaken))
		let b = new Date(String(photo[i].datetaken))
		if (!compareDate(a, b, sortType)) {
			console.log(a, b)
			return false
		}
	}
	return true
}

// 投稿日付比較のヘルパー
function comparePostDate (photo, sortType) {
	for (let i = 1, len = photo.length; i < len; i++) {
		let a = new Date(Number(photo[i-1].dateupload + '000'))
		let b = new Date(Number(photo[i].dateupload + '000'))
		if (!compareDate(a, b, sortType)) {
			console.log(a, b)
			return false
		}
	}
	return true
}

// 日付比較のヘルパー
// 時間は無視する
function compareDate (a, b, sortType) {
	const datesIgnoreTime = [a, b].map(date => {
		return new Date(`${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}`)
	})
	
	if (sortType === 'desc' || '') {
		return datesIgnoreTime[0].getTime() >= datesIgnoreTime[1].getTime()
	} else if (sortType === 'asc') {
		return datesIgnoreTime[0].getTime() <= datesIgnoreTime[1].getTime()
	}
}