
// select elements on the page
var storage = chrome.storage.local,
    the_fansubber    = document.querySelector('#fansubber'),
    the_anime_title  = document.querySelector('#anime_title'),
    the_fidelity     = document.querySelector('#fidelity'),
    the_release_date = document.querySelector('#release_date'),
    the_anime_planet = document.querySelector('#animeplanet'),
    resetButton = document.querySelector('button.reset'),
    saveButton  = document.querySelector('button.save'),
    printButton = document.querySelector('button.print_storage'),
    anime_text  = document.querySelector('#anime_txt'),
    anime_list;

loadChanges();

saveButton.addEventListener('click', saveChanges);
resetButton.addEventListener('click', reset);
printButton.addEventListener('click', printStorage);

function saveChanges() {
    // get the values from the submitted form

    // var anime = anime_text.value;
    var fansubber    = the_fansubber.value,
        anime_title  = the_anime_title.value,
        fidelity     = the_fidelity.value,
        release_date = the_release_date.value,
        anime_planet = the_anime_planet.value;

    // check that new fansubber was added
    if (!anime_title) {
        message("Error: you failed to specify the anime title");
        return;
    }
    if (anime_planet) {
        anime_planet = 'http://www.anime-planet.com/anime/' + anime_planet;
    }

    if (fansubber==='none') { fansubber = ''; }
    if (fidelity==='none')  { fidelity  = ''; }
    if (release_date==='unknown') { release_date = '?'; }

    //var fidelity = isBlank(obj["fidelity"]) ? '' : ':contains('+ obj["fidelity"] +')';

    anime_list.push({
        'fansubber'   : fansubber,
        'title'       : anime_title,
        'fidelity'    : fidelity,
        'release_date': release_date,
        'anime_planet': anime_planet
    });

    storage.set({"anime_list": anime_list}, function() {
        message('Anime saved!');
    });

}

function loadChanges() {

    storage.get('anime_list', function(items) {
        if (items.anime_list) {
            anime_list = items.anime_list;

            // append a div with the anime info to the options page
            for (var i in items.anime_list) {
                var _li = document.createElement('li');
                _li.id = "anime_" + i;
                _li.innerHTML = items.anime_list[i].fansubber +" "+
                    items.anime_list[i].title +" "+
                    items.anime_list[i].fidelity +" "+
                    items.anime_list[i].release_date +" "+
                    items.anime_list[i].anime_planet;
                document.getElementById('my_anime').appendChild(_li);
            }

        } else {
            anime_list = [];
            console.log('empty anime list');
        }
    });

}

function reset() {
    var x = confirm("WARNING! You sure you want to delete everything?");
    if (x == true) {
        // Remove the saved value from storage. storage.clear does the same thing
        storage.remove('anime_list', function(items) {
            message('Removed All Anime');
            location.reload();
        });
    }
}

function message(msg) {
    var message = document.querySelector('.message');
    message.innerText = msg;
    setTimeout(function() {
        message.innerText = '';
    }, 3000);
}


function printStorage() {
    chrome.storage.local.get(null, function(all){console.log(all)});
}


//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------

// save & load fansubbers

// save & load anime from storage

// get anime-planet anime name


// trusted fansub groups and their websites
var fansubbers = {
    'CMS': "http://colormesubbed.com", // http://www.nyaa.eu/?page=torrents&user=91833
};
