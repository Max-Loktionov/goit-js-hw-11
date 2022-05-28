

const BASE_URL = `https://pixabay.com/api`;
const KEY = '27626475-8422ee6256ea07f97d3a4bc44';
const axios = require('axios');

export default class NewsApiService {

    constructor() {
        this.searchQuery = '';
        this.page = 1;
     }
 
    async fetchSerchQuery() {
    const url = `${BASE_URL}/?page=${this.page}&key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`

      const response = await axios.get(url);
        const data = response;
        this.incrementPage();
        
        return data;
    };

    incrementPage() {
        this.page += 1;
    };

    resetPage() {
        this.page = 1;
    }

  get query() {
        return this.searchQuery;
    };

  set query(newQuery) {
        this.searchQuery = newQuery;
    }

}





