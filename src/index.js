import "simplelightbox/dist/simple-lightbox";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import NewsApiService from './js/api-service';
import getRefs from '../src/js/getRefs';
import LoadMoreBtn from '../src/js/load-more-btn';
import axios from "axios";

import listOfPhotos from '../src/templates/listOfPhotos.hbs';

import './css/styles.css';
import "simplelightbox/dist/simple-lightbox.min.css";


// ====================================================


const refs = getRefs();
const newsApiService = new NewsApiService();
const loadMoreBtn = new LoadMoreBtn({selector: '.load-more'});
let gallery = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onFormSubmit);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);


loadMoreBtn.disable();

async function onSerchQuery() {
    
    try {
        newsApiService.searchQuery = refs.input.value;
    newsApiService.resetPage();
    loadMoreBtn.show();
    loadMoreBtn.disable();

   const data = await newsApiService.fetchSerchQuery()
        
     if (data.data.total === 0) {
        onFetchNull();
     } else {
         Notify.success(`Hooray! We found ${data.data.totalHits} images.`, { position: 'left-top', distance: '20px', }) 
         loadMoreBtn.enable();
    }
    
     let elements = {};          
        elements =  data.data.hits.map(getRenderQuery).join('');
        
    //  let gallery = new SimpleLightbox('.gallery a');
        gallery.open('.gallery a');

        const { height: cardHeight } = document.querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({top: cardHeight / 2, behavior: "smooth",});
     
          
      } catch (error) {
        onFetchError()  
        console.dir(error)
      }          
}

async function onLoadMore() {
    try {
        const data = await newsApiService.fetchSerchQuery()
     if (data.data.hits.length === 0) {
         Notify.failure('The End!!!')
         loadMoreBtn.disable();
     }
       
  const loadMoreData = await data.data.hits.map(getRenderQuery).join('');

    } catch (error) {
        console.dir(error.response.data)
        if (error.response.data === "[ERROR 400] \"page\" is out of valid range.") {
            Notify.info("We're sorry, but you've reached the end of search results.");
            loadMoreBtn.hide();
        }
    }
    
}

function onFormSubmit(e) {
    e.preventDefault();
    clearGalleryPage()
    onSerchQuery();
}

function getRenderQuery(items) {
    let markup = '';
    markup = listOfPhotos(items);
    refs.galleryBox.insertAdjacentHTML('beforeend', markup);
    
}

function onFetchNull() {
     Notify.failure("Sorry, there are no images matching your search query. Please try again.") ; 
}

function onFetchError() {
   Notify.failure("Sorry, there is crush!") ; 
}

function clearGalleryPage() {
refs.galleryBox.innerHTML = '';
}

//     let gallery = new simpleLightbox('.gallery a');
// gallery.on('show.simplelightbox', getRenderQuery() {
// 	console.log(simpleLightbox)
// });


           
        