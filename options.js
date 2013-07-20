
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

//----------------------------------------------------------------------------
// LocalStorage CRUD  
//----------------------------------------------------------------------------

var storageCRUD = {
    // TODO - abstract this so that it can work for any databse and not just
    //        designed to store anime
    // Based on:
    // http://mrbool.com/creating-a-crud-form-with-html5-local-storage-and-json/26719

    var operation = "A",     // "A"=Adding; "E"=Editing
        selected_index = -1, // Index of the selected list item
        db = localStorage.getItem("db"), // Retrieve the stored data
        db = (db === null) ? [] : JSON.parse(db); // convert to JS obj 

    add: function () {
        // storageCRUD.add(anime)
        var anime = JSON.stringify({
            fansubber   : $('td[class*="fansubber"]'  ).val(),
            main_title  : $('td[class*="main_title"]' ).val(),
            fidelity    : $('td[class*="fidelity"]'   ).val(),
            release_day : $('td[class*="release_day"]').val(),
            animeplanet : $('td[class*="animeplanet"]').val()
        });
        db.push(anime);
        localStorage.setItem("db", JSON.stringify(db));
        console.log('your anime was saved.');
        return true;
    },
    edit: function() {
        db[selected_index] = JSON.stringify({
                fansubber   : $('td[class*="fansubber"]'  ).val(),
                main_title  : $('td[class*="main_title"]' ).val(),
                fidelity    : $('td[class*="fidelity"]'   ).val(),
                release_day : $('td[class*="release_day"]').val(),
                animeplanet : $('td[class*="animeplanet"]').val()
            });//Alter the selected item on the table
        localStorage.setItem("db", JSON.stringify(db));
        console.log("The anime was edited.");
        operation = "A"; //Return to default value
        return true;
    },
    get: function(idx) {
        // takes in the anime id and returns its info from storage
        // and instantiates an Anime object
        //   storageCRUD.get(1) 
        //   storageCRUD.get.all()
        //   storageCRUD.get.filter( function(i, anime){} )

        // check if what you are lookin for is anywhere in storage
        var store = [];
        if ([undefined, null].indexOf(localStorage["db"]) !== -1) {
            store = $.parseJSON(localStorage["db"]);
        } else {
            return store;
        }

        // get the index and return if it exists
        if (idx) return new Anime(store[idx]);

        // other wise return all the get methods
        return {
            all: function() {
                return store; // return all the anime in the DB
            },
            filter: function(fn) {
                // return anime as defined by the function you pass in
                // your function must return a boolean true or false value
                var foo = [];
                $.each(store, function(i, anime) {
                    if (fn(i, anime) === true) foo.push(anime);
                });
                return foo;
            }
        };

        /*
        storage.get('db', function(items) {
            for (i in items.anime_list) {
                if (items.anime_list[i].id === idx) {
                    var x = items.anime_list[i];
                    var anime = new Anime(x.fansubber, x.title, x.fidelity,
                                          x.release_date, x.anime_planet);
                    callback(anime);
                }
            }
        });
        */

    },
    delete: function() {
        db.splice(selected_index, 1);
        localStorage.setItem("db", JSON.stringify(db));
        console.log("Anime deleted.");
    },
    reset: function() {
        var am_sure = confirm("You sure you want to delete all your anime?");
        if (am_sure === true) localStorage.clear();
    }, 
    list: function(alpha_sort) { 
        if (alpha_sort === true) ? true : false; 

        $("#animeList").html("");
        $("#animeList").html(
            "<thead>"+
            "   <tr>"+
            "   <th>Fansubber</th>"+
            "   <th>Main Title</th>"+
            "   <th>Fidelity</th>"+
            "   <th>Release Date</th>"+
            "   <th>Animeplanet</th>"+
            "   <th></th>"+
            "   </tr>"+
            "</thead>"+
            "<tbody>"+
            "</tbody>");

        for(var i in db) {
            var anime = JSON.parse(db[i]);
            $("#animeList tbody").append("<tr>"+
                 "  <td>"+anime.fansubber+"</td>" + 
                 "  <td>"+anime.main_title+"</td>" + 
                 "  <td>"+anime.fidelity+"</td>" + 
                 "  <td>"+anime.release_day+"</td>" + 
                 "  <td>"+anime.animeplanet+"</td>" + 
                 "  <td><img src='edit.png' alt='Edit"+i+"' class='btnEdit'/><img src='delete.png' alt='Delete"+i+"' class='btnDelete'/></td>" + 
                 "</tr>");
        }

}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------

// functions that run depending what button the user presses
var btn = {
    edit: function(elem) {
        // get the <li> id of this button and replace row with a form
        // function that gets invoked when the user clicks the 'edit' button
        // for an existing anime in the 'watched anime' list



        elem.toggle();
        // form.show();
        elem.makeForm();
        // on done elem.hide()
    },
    update: function(elem) {
        // extract new anime data from the form
        var anime = {
           fansubber   : $(elem).find('.form_fansubber').val(),
           main_title  : $(elem).find('.form_main_title').val(),
           fidelity    : $(elem).find('.form_fidelity').val(),
           release_day : $(elem).find('.form_release_day').val(),
           animeplanet : $(elem).find('.form_animeplanet').val()
        }

        // update the local storage
        storageCRUD.get('anime_list');

        storage.set({"anime_list": anime_list}, function() {
            message(self.title + " was updated");
            // remove the form element
            // form_div.parentNode.removeChild(form_div);
            loadChanges();
        });

    },
    delete: function(elem) {
        // remove anime from local storage
        storage.remove('anime_list', function() {

            anime_list.splice(elem.idx, 1);

            storage.set({"anime_list": anime_list}, function() {
                message(elem.main_title + " was removed!");
                loadChanges();
            });
        });
    },
    cancel: function(elem) {
        // TODO
        // make it so the cancel button only closes the specific
        // anime you are editing, vs the current behavior which will close
        // all anime when the screen is redrawn
        // jquery toggle would go nice here
        elem.toggle();
    }
}

$("#my_anime").on("click", function(evt) {
    $target = $(evt.target);
    var li = $($target.closest('li'));

    var anime = {
        // TODO - replace your li's with tables
        fansubber:   li('td[class*="fansubber"]'  ).val(),
        main_title:  li('td[class*="main_title"]' ).val(),
        fidelity:    li('td[class*="fidelity"]'   ).val(),
        release_day: li('td[class*="release_day"]').val(),
        animeplanet: li('td[class*="animeplanet"]').val()
    }

    btn[ $target.text ](anime);
});

//----------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------


function Anime(fansubber, title, fidelity, release_date, anime_planet) {
    // class that holds functionality pretaining to the storage of anime
    // and the creation of some its UI elements

    // make sure the default values for your arguments are in order
    if (isBlank(title)) { message("You must specify an anime title"); return; }
    fansubber = (isBlank(fansubber)) ? '' : fansubber;
    if (fidelity==='none' || isBlank(fidelity)) fidelity = '';
    if (release_date==='unknown' || isBlank(release_date)) release_date = '?';
    if (anime_planet.indexOf("anime-planet.com") !== -1) {}
    else if (isBlank(anime_planet)) anime_planet = '';
    else anime_planet = 'http://www.anime-planet.com/anime/'+anime_planet;

    // setup global properties for this class
    var self = {};
    self.fansubber    = fansubber;
    self.title        = title;
    self.fidelity     = fidelity;
    self.release_date = release_date;
    self.anime_planet = anime_planet.replace(/\s+/g, '-');

    self.add = function() {
        // add the anime to anime_list in local storage if it's not already
        // in there. If it already exists then return an error message.
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
            form_div = document.getElementById('form_'+self.id),
            form     = form_div.childNodes[0],
            idx      = self.getIndex();

        // extract new information from the forms
        for (var i=0; i<form.childNodes.length; i++) {
            switch (form.childNodes[i].className) {
                case "form_fansubber":
                    self.fansubber = form.childNodes[i].value;
                    if (isBlank(self.fansubber)) self.fansubber = '';
                    break;
                case "form_anime_title":
                    var new_title = form.childNodes[i].value;
                    if (isBlank(new_title)) {
                        message("You must specify an anime title.");
                        return;
                    } else { self.title = new_title; }
                    break;
                case "form_fidelity":
                    self.fidelity = form.childNodes[i].value;
                    if (self.fidelity==='none' || isBlank(self.fidelity)) {
                        self.fidelity = '';
                    }
                    break;
                case "form_release_date":
                    self.release_date = form.childNodes[i].value;
                    if (self.release_date==='unknown' || isBlank(self.release_date)) {
                        self.release_date = '?';
                    }
                    break;
                case "form_animeplanet":
                    self.anime_planet = form.childNodes[i].value;
                    if (self.anime_planet.indexOf("anime-planet.com") !== -1) {}
                    else if (isBlank(self.anime_planet)) self.anime_planet = '';
                    else self.anime_planet = 'http://www.anime-planet.com/anime/'+self.anime_planet;
                    break;
            }
        }

        // update the div id of the parent div to reflect any changes
        self.id = (
            self.fansubber + self.title + self.fidelity).replace(/\s+/g, '');

        // grab the global anime_list, update it, and save it to storage
        anime_list[idx] = {
            'id'          : self.id,
            'fansubber'   : self.fansubber,
            'title'       : self.title,
            'fidelity'    : self.fidelity,
            'release_date': self.release_date,
            'anime_planet': self.anime_planet
        };

        storage.set({"anime_list": anime_list}, function() {
            message(self.title + " was updated");

            // remove the form element
            // form_div.parentNode.removeChild(form_div);
            loadChanges();
        });

    };


    self.makeForm = function(anime) {
        // construct and return an editable form
        // main input form is #animeform
        $theform = $('form').html([
            "<input type='text' class='form_fansubber' value='"+anime.fansubber+"'>",
            "<input type='text' class='form_anime_title' value='"+anime.main_title+"'>",
            "<select class='form_fidelity'>",
            "  <option>none</option>",
            "  <option>480p</option>",
            "  <option>720p</option>",
            "  <option>1080p</option>",
            "</select>",
            "<select class='form_release_date'>",
            "  <option>?</option>",
            "  <option>mon</option>",
            "  <option>tue</option>",
            "  <option>wed</option>",
            "  <option>thu</option>",
            "  <option>fri</option>",
            "  <option>sat</option>",
            "  <option>sun</option>",
            "</select>",
            "<input type='text' class='form_animeplanet' value='"+anime.animeplanet+"'>"
        ].join('\n'));

        // select the proper select boxes
        $theform.find('.option:contains("'+anime.fidelity+'")')
            .attr('selected', 'selected');
        $theform.find('.option:contains("'+anime.release_date+'")')
            .attr('selected', 'selected');

        // add the three buttons to the end of the form
        $theform.append($('div').attr('class', 'button_box').html([
            "<button>update</button>",
            "<button>delete</button>",
            "<button>cancel</button>",
        ]));

        return $theform;
    };

    return self;
}


function drawAnimeList(anime_list) {
    // TODO - use event bubbling here instead of attaching
    //        the event listener using a for loop

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
        animeplanet.setAttribute('target', '_blank');
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


$("#anime_options input[type=checkbox]").change(function(){
    // keep an ear out for changes to dark theme
    // animeplanet, etc
    $this = $(this);
    localStorage[$this.attr("name")] = $this.attr("checked");
});

function message(msg) {
    var message = document.querySelector('.message');
    message.innerText = msg;
    setTimeout(function() {
        message.innerText = '';
    }, 6000);
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
    'HorribleSubs': 'horriblesubs.info', // http://www.nyaa.eu/?user=64513
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

- Add link to previous page, AKA a back button. Also make sure hitting back
  in your browser will take you to the previous page regardless of how many
  anime you have edited.
- make info_div and form_div global variables w/in the Anime class
- automatically create links out of the fansubber tags (e.g., [HorribleSubs])
  to the fansubbers home site if the fansubber is in our trusted list.
- make the dark theme an option like reddit does (night mode)
- make animeplanet urls and tracking optional. If the checkbox is not activated
  the remove all animeplanet related stuff.
- put list of anime in a table so and label the columns.
- add color coded error messages to the message() function
- create function for extracting anime data from forms. Curently you have some
  repetative code when instantiating a new Anime class and when updating
  an anime.
- add links to fansubber/user page on nyaa.



[UTW-Mazui] Toaru Kagaku no Railgun S 720p ? to-aru-kagaku-no-railgun-s
[HorribleSubs] Naruto Shippuuden 720p thu  naruto-shippuden
[Anime-Koi] Dansai Bunri no Crime Edge 720p wed dansai-bunri-no-crime-edge
[Commie] Red Data Girl wed red-data-girl
[HorribleSubs] DEVIL SURVIVOR 2 THE ANIMATION 720p thu devil-survivor-2-the-animation
[HorribleSubs] Haiyore! Nyaruko-san W 720p sun haiyore-nyaruko-san-w
[UTW-Vivid] Suisei no Gargantia 720p sun suisei-no-gargantia
[HorribleSubs] Hunter X Hunter 720p sun hunter-x-hunter
[Anime-Koi] Karneval 720p fri karneval
[Commie] Hataraku Maou-sama! thu hataraku-maou-sama
[gg] Shingeki no Kyojin sat shingeki-no-kyojin 
[HorribleSubs] Mushibugyo 720p mon mushibugyou
[yibis] One Piece 720p ? one-piece
[HorribleSubs] Majestic Prince 720p thu ginga-kikoutai-majestic-prince
*/
