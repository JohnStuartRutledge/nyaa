
// select elements on the page
var anime_list,
    test_list = {},
    storage          = chrome.storage.local,
    the_fansubber    = document.querySelector('#fansubber'),
    the_anime_title  = document.querySelector('#anime_title'),
    the_fidelity     = document.querySelector('#fidelity'),
    the_release_date = document.querySelector('#release_date'),
    the_anime_planet = document.querySelector('#animeplanet'),
    resetButton      = document.querySelector('button.reset'),
    saveButton       = document.querySelector('button.save'),
    printButton      = document.querySelector('button.print_storage'),
    animeButton      = document.querySelector('button.print_anime'),
    anime_text       = document.querySelector('#anime_txt');

loadChanges();

// add event listeners for our buttons
saveButton.addEventListener('click', createAnime);
resetButton.addEventListener('click', reset);
printButton.addEventListener('click', printStorage);
animeButton.addEventListener('click', printAnime);

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------

function Anime(fansubber, title, fidelity, release_date, anime_planet) {
    // class for containing a particular anime.

    if (isBlank(title)) { message("Error: you must specify an anime title"); }
    if (fansubber==='none') fansubber = '';
    if (fidelity==='none' || isBlank(fidelity)) fidelity = '';
    if (release_date==='unknown' || isBlank(release_date)) release_date = '?';
    anime_planet = (isBlank(anime_planet)) ? '' : 'http://www.anime-planet.com/anime/'+anime_planet;

    var self = {};
    self.fansubber    = fansubber;
    self.title        = title;
    self.fidelity     = fidelity;
    self.release_date = release_date;
    self.anime_planet = anime_planet;
    self.id           = fansubber + title + fidelity;

    self.getIndex = function() {
        for (var i=0, anime; anime=anime_list[i++];) {
            if (anime.id===self.id) return i-1;
        }
        return null;
    };

    self.add = function() {
        // add anime to anime_list in local storage if it's not already in
        // there. If it already exists then return an error message.
        var idx = self.getIndex();
        if (idx || idx === 0) {
            message('That anime already exists');
            return;
        } else {
            anime_list.push({
                'id'          : self.id,
                'fansubber'   : self.fansubber,
                'title'       : self.title,
                'fidelity'    : self.fidelity,
                'release_date': self.release_date,
                'anime_planet': self.anime_planet
            });
            storage.set({"anime_list": anime_list}, function() {
                message(self.title +' was added to the list');
                loadChanges();
            });
        }
    };

    self.update = function () {

        loadChanges();
    };

    self.remove = function() {
        // remove anime from local storage
        var idx = self.getIndex();
        if (idx) {
            console.log('anime index found');
            storage.remove('anime_list', function() {
                anime_list.pop(idx);
                storage.set({"anime_list": anime_list}, function() {
                    message(self.title + " was removed!");
                    loadChanges();
                });
            });
        }
    };

    self.makeListItem = function() {
        // create a text based list item that when clicked on turns into a form
        var li = document.createElement('li'),
            aa = document.createElement('a');

        li.id = "anime_"+self.title;

        aa.setAttribute('class', 'options_anime');
        aa.setAttribute('href', '');
        aa.innerHTML = "["+
            self.fansubber +"] "+
            self.title +" "+
            self.fidelity +" "+
            self.release_date +" "+
            self.anime_planet;
        aa.click(self.makeForm());
        li.appendChild(aa);
        return li;
    };

    self.makeForm = function () {
        // construct a form
        console.log('makeForm was called');
    };

    return self;
}


function createAnime() {
    // create an anime and save it to local storage when the user clicks
    // the add anime button.
    var anime = new Anime(
        the_fansubber.value,
        the_anime_title.value,
        the_fidelity.value,
        the_release_date.value,
        the_anime_planet.value,
        the_fansubber.value + the_anime_title.value + the_fidelity.value)
    anime.add();
}

function loadChanges() {
    // update page and load current storage state into the anime_list variable
    storage.get('anime_list', function(items) {
        if (items.anime_list) {
            anime_list = items.anime_list;
            drawAnimeList(anime_list);
        } else {
            anime_list = [];
        }
    });
}

function reset() {
    var x = confirm("WARNING! You sure you want to delete everything?");
    if (x == true) {
        // Remove the anime_list from storage.
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
    }, 8000);
}

function drawAnimeList(anime_list) {

    // get container div and clear it so we can start with a blank slate
    var list_div = document.getElementById('my_anime');
    list_div.innerHTML = '';

    // append a div with the anime info to the options page
    for (var i in anime_list) {

        var x = anime_list[i];

        var li         = document.createElement('li'),
           edit        = document.createElement('a'),
           animeplanet = document.createElement('a');

        li.id = x.id;
        li.setAttribute('class', 'anime_li_item');
        li.setAttribute('idx', i);


        animeplanet.setAttribute('href', x.anime_planet);
        animeplanet.innerHTML = 'anime planet';

        edit.setAttribute('class', 'edit_anime');
        edit.setAttribute('href', '');
        edit.innerHTML = 'edit';

        li.innerHTML = "["+ x.fansubber +"] "+ x.title +" "+ x.fidelity +" "+
            x.release_date + " ";

        li.appendChild(animeplanet);
        li.appendChild(edit);
        list_div.appendChild(li);
    }
}


//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------

// helper function for printing out the full contents of local storage
function printStorage() {
    chrome.storage.local.get(null, function(all){console.log(all)});
}

function printAnime() {
    for (i in anime_list) {
        console.log(anime_list[i]);
    }
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
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
