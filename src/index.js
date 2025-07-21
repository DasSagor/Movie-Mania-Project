import { getMovieReviewData } from "./data.js";

let sortDesc = false

function init(){
    const movieReviewData = getMovieReviewData();

    registerHandlers(movieReviewData);
    paintStatistics(movieReviewData);
    paintMovieData(movieReviewData);
    

}

function paintStatistics(movieReviewData){
    
    const flatReviewsData = movieReviewData.flat();

    const totalMovies = movieReviewData.length;

    const totalReviews = flatReviewsData.length;

    const totalRating = flatReviewsData.reduce((acc, item) => {
       return acc + item.rating
    }, 0);

    const averageRating = (totalRating / totalReviews).toFixed(2);

    document.getElementById('tMoviesId').innerText = totalMovies;

    document.getElementById('tReviewsId').innerText = totalReviews;

    document.getElementById('tAvgRatingId').innerText = averageRating;
    
}

function paintMovieData(movieReviewData){
    const flatReviewsData = movieReviewData.flat();
    const movieListEL = document.querySelector('#movieListId ul');
    
    const sortedData = flatReviewsData.toSorted((a,b) => {
        return new Date(a.on) - new Date(b.on);
    })

    addMovieReviewData(movieListEL,sortedData)
}
function registerHandlers(movieReviewData){
    const srtBtn = document.getElementById('srtBtn');
    const grpBtn = document.getElementById('grpBtn')

    srtBtn.addEventListener('click', () => srtByReview(movieReviewData) )
    grpBtn.addEventListener('click', () => grpReviewByTitle(movieReviewData) )
}

function srtByReview(movieReviewData){
    console.log('srtByReview');
    sortDesc =!sortDesc

    const flatReviewData = movieReviewData.flat()

    let sortReviewData = sortDesc 
     ? flatReviewData.toSorted((a,b) => b.rating - a.rating)
     : flatReviewData.toSorted((a,b) => a.rating - b.rating)

    const movieListEL = document.querySelector('#movieListId ul')

    removeAllChildNodes(movieListEL)
    addMovieReviewData(movieListEL,sortReviewData)

}

function grpReviewByTitle(movieReviewData){
    console.log('Group by title', movieReviewData)

    const flatReviewData = movieReviewData.flat()
    const groupedReviews = Object.groupBy(flatReviewData, ({title}) => title)
    // console.log(groupedReviews);

    const titleKeys = Reflect.ownKeys(groupedReviews)
    // console.log(titleKeys);
    const movieListEL = document.querySelector('#movieListId ul')
    removeAllChildNodes(movieListEL)

    titleKeys.forEach((title) => {
        const liElem  = document.createElement('li');
        liElem.classList.add('card','p-2','my-2');

        const hEl = document.createElement('h2')
        hEl.classList.add('text-3xl')
        hEl.innerText = title

        liElem.appendChild(hEl)

        const reviews = groupedReviews[title]

        reviews.forEach((review) =>{
            const reviewElem = document.createElement('p');
            reviewElem.classList.add('mx-2','my-2')

            const message = `<strong>${review.by}</strong> has given <strong>${review.rating}</strong> rating with a comment, <i>${review.content}</i>.`

            reviewElem.innerHTML = message

            liElem.appendChild(reviewElem)

        })
        movieListEL.appendChild(liElem)

    })
}

function addMovieReviewData(movieListEL,movieReview){
    movieReview.map((movies) =>{
        // console.log(movies);
 
        const liElem  = document.createElement('li');
        liElem.classList.add('card','p-2','my-2');
        
        const titleElem = document.createElement('p');
        titleElem.classList.add('text-xl','mb-2')
        titleElem.innerText = `${movies.title} - ${movies.rating}`;
        liElem.appendChild(titleElem);

        const reviewElem = document.createElement('p');
        reviewElem.classList.add('mx-2','mb-2')
        reviewElem.innerText = `${movies.content}`;
        liElem.appendChild(reviewElem);

        const byElem = document.createElement('p');
        byElem.classList.add('mx-2','mb-2')
        byElem.innerText = `By: ${movies.by} on ${new Date(movies.on).toDateString()}`;

        liElem.appendChild(byElem);

        
        movieListEL.appendChild(liElem);
    })
}

function removeAllChildNodes(parent){
    while(parent.firstChild){
        parent.removeChild(parent.firstChild)
    }
}
init();