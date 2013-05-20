
function click(e) {
  //chrome.tabs.executeScript(null,
 //     {code:"document.body.style.backgroundColor='" + e.target.id + "'"});
 // window.close();
}

document.addEventListener('DOMContentLoaded', function () {

    // select the "english translated anime" button and make it the default setting
    var inputsearch = document.querySelector('.inputsearchcategory option[value="1_37"]');


    var fansubber    = document.querySelector('#fansubber'),
        anime_title  = document.querySelector('#anime_title'),
        release_date = document.querySelector('#release_date'),
        animeplanet  = document.querySelector('#animeplanet'),
        submitButton = document.querySelector('button.submit');

    /*
    var divs = document.querySelectorAll('div');
    for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
    }
    */
});

console.log('content script working');