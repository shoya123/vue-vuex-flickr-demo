import axios from 'axios'

const baseUrl = 'https://api.flickr.com/services/rest/'
const apiKey = '1b1a51aaed2ae7637dfd3cae262ef088'
const method = 'flickr.photos.search'
const extras = 'url_n,url_m,url_z,url_o,description,owner_name,date_taken,date_upload,tags'
const format = 'json'
const nojsoncallback = 1
const safeSearch = 1

export function createUrl (params) {
	let url = `${baseUrl}?api_key=${apiKey}&method=${method}&extras=${extras}&format=${format}&nojsoncallback=${nojsoncallback}&safe_search=${safeSearch}`

	Object.keys(params).forEach(key => {
		if (params[key] !== '') {
			url += `&${key}=${params[key]}`	
		}
	})

	return url
}

export function fetchItems (params) {
	return axios.get(createUrl(params))
}

