
// select elements on the page
var anime_list,
    storage          = chrome.storage.local,
    the_fansubber    = document.querySelector('#fansubber'),
    the_anime_title  = document.querySelector('#anime_title'),
    the_fidelity     = document.querySelector('#fidelity'),
    the_release_date = document.querySelector('#release_date'),
    the_anime_planet = document.querySelector('#animeplanet'),
    resetButton      = document.querySelector('button.reset'),
    saveButton       = document.querySelector('button.save'),
    printButton      = document.querySelector('button.print_storage'),
    animeButton      = document.querySelector('button.print_anime');


var editButtons = document.querySelectorAll('.edit_anime');

// add event listeners for our buttons
saveButton.addEventListener('click', createAnime);
resetButton.addEventListener('click', reset);
printButton.addEventListener('click', printStorage);
animeButton.addEventListener('click', printAnime);

//loadChanges();
window.onload = loadChanges;

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------

function Anime(fansubber, title, fidelity, release_date, anime_planet) {
    // class that holds functionality pretaining to the storage of anime
    // and the creation of some its UI elements

    if (isBlank(title)) { message("You must specify an anime title"); return; }
    //if (fansubber==='none') fansubber = '';
    fansubber = (isBlank(fansubber)) ? '' : fansubber;
    if (fidelity==='none' || isBlank(fidelity)) fidelity = '';
    if (release_date==='unknown' || isBlank(release_date)) release_date = '?';
    if (isBlank(anime_planet)) {
        anime_planet = '';
    } else if (anime_planet.indexOf("anime-planet.com") !== -1) {
        // pass
    } else {
        anime_planet = 'http://www.anime-planet.com/anime/'+anime_planet;
    }

    var self = {};
    self.fansubber    = fansubber;
    self.title        = title;
    self.fidelity     = fidelity;
    self.release_date = release_date;
    self.anime_planet = anime_planet.replace(/\s+/g, '-');
    self.id           = (fansubber + title + fidelity).replace(/\s+/g, '');

    self.getIndex = function() {
        // get index of where this anime exists w/in the local storage array
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
        // update existing anime details and resave to local storage
        var info_div = document.getElementById('div_'+self.id),
            form_div = document.getElementById('form_'+self.id);

        // extract new information from the
        // div and resave the new to storage

        // update the info_divs values with new info

        // unhide the info div
        info_div.style.display = 'visible';

        // remove the form element
        form_div.parentNode.removeChild(form_div);


        loadChanges();
    };

    self.remove = function() {
        // remove anime from local storage
        var idx = self.getIndex();
        if (idx) {
            storage.remove('anime_list', function() {
                anime_list.splice(idx, 1);
                storage.set({"anime_list": anime_list}, function() {
                    message(self.title + " was removed!");
                    loadChanges();
                });
            });
        }
    };

    self.makeForm = function () {
        // construct and return an editable form
        var li         = document.getElementById(self.id),
            info_div   = document.getElementById('div_'+self.id),
            form_div   = document.createElement('div'),
            delete_btn = document.createElement('button');

        form_div.id = 'form_'+self.id;
        form_div.innerHTML = '<form class="anime_form">'
            + '<select></select>'
            + '<input type="text" />'
            + '<select></select>'
            + '<select></select>'
            + '<input type="text" />'
            + '<button type="submit">update</button>'
        + '</form>';

        delete_btn.innerHTML = 'delete';
        delete_btn.addEventListener('click', self.remove);
        form_div.appendChild(delete_btn);

        // hide the info div
        info_div.style.display = 'none';

        // add the form to the page
        li.appendChild(form_div);
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

function drawAnimeList(anime_list) {

    // get container div and clear it so we can start with a blank slate
    var list_div = document.getElementById('my_anime');
    list_div.innerHTML = '';

    // append a div with the anime info to the options page
    for (var i in anime_list) {

        var x           = anime_list[i],
            li          = document.createElement('li'),
            div         = document.createElement('div'),
            edit        = document.createElement('button'),
            animeplanet = document.createElement('a');

        li.id  = x.id;
        div.id = 'div_'+x.id;
        animeplanet.setAttribute('href', x.anime_planet);
        animeplanet.innerHTML = 'anime planet';
        edit.setAttribute('class', 'edit_anime');
        edit.innerHTML = 'edit';
        edit.addEventListener('click', editAnime);

        div.innerHTML = "["+ x.fansubber +"] "+ x.title +" "+ x.fidelity +" "+
            x.release_date + " ";

        div.appendChild(animeplanet);
        div.appendChild(edit);
        li.appendChild(div);
        list_div.appendChild(li);
    }
}

function editAnime(elem) {
    // function that gets invoked when the user clicks the 'edit' button
    // for an existing anime in the 'watched anime' list
    var line_id = this.parentNode.parentNode.id;

    getAnimeById(line_id, function(anime) {
        anime.makeForm();
    });
}

function getAnimeById(anime_id, callback) {
    // takes in the anime id and returns its info from storage
    // and instantiates an Anime object
    storage.get('anime_list', function(items) {
        for(i in items.anime_list) {
            if (items.anime_list[i].id === anime_id) {
                var x = items.anime_list[i];
                var anime = new Anime(x.fansubber, x.title, x.fidelity,
                                      x.release_date, x.anime_planet);
                callback(anime);
            }
        }
    });
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
    'Commie': 'http://commiesubs.com',
    'FFF': 'http://fffansubs.org',
    'Hadena': 'http://hadena-subs.com',
    'HorribleSubs': 'horriblesubs.info',
    'gg': 'http://www.ggkthx.org',
    'Mazui': 'http://mazuisubs.com',
    'sage': 'http://www.sagesubs.com',
    'SubDESU': 'http://www.subdesu.org',
    'UTW': 'http://utw.me',
    'yibis': 'http://www.yibis.com',
    'Zero-Raws': ''
};


//----------------------------------------------------------------------------
// TODOS
//----------------------------------------------------------------------------
/*

- make forms fansubber select item optional and change it to a text input

*/
