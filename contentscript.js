
//var storage = (localStorage) ? localStorage : chrome.storage.local;
//var storage = chrome.storage.local;

// set default selection to english translated anime
$('.inputsearchcategory option[value="1_0"]').removeAttr('selected');
$('.inputsearchcategory option[value="1_37"]').attr('selected', 'selected');

// get current day
var d = new Date();
var weekday = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
var today   = weekday[d.getDay()];

// construct nested HTML divs for holding my list of anime
var mywrapper = $(document.createElement('div')).attr('id', 'nyaajs_wrapper');
var mydiv     = $(document.createElement('div')).attr('id', 'nyaajs_showtimes');
var animelist = $(document.createElement('ul')).attr('id', 'nyaajs_anime_list');
var optionspg = $(document.createElement('a')).attr('id', 'btn_add_anime')
                    .attr("href", chrome.extension.getURL("options.html"))
                    .text("add anime");
var nyaajs_btn = $(document.createElement('a')).attr('id', 'nyaajs_btn')
                    .attr('href', '')
                    .text('sort me');


//----------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------


/*
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (sender.tab) {
        console.log('from a content script:'+sender.tab.url);
    } else {
        console.log('from the extension');
    }
    if (request.status === 'good') sendResponse({data: 'your data'});
});
*/

/*
var port = chrome.runtime.connect({name: 'nyaadb'});
port.postMessage({joke: 'knock knock'});
port.onMessage.addListener(function(msg) {
    console.log(msg);
});
*/

chrome.runtime.sendMessage({cmd: "getStoredAnime"}, function(response) {
    console.log(response);
});




// append your completed HTML to the webpage and sort your list
mydiv.append(nyaajs_btn);
mydiv.append(optionspg);
mydiv.append(animelist);
mywrapper.append(mydiv);
$('#main').prepend(mywrapper);


//----------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------
/*
function loadAnime() {
    // load anime from local storage and append it as a list on side bar.
    // Highlight the users saved anime/preferences and apply them to page.


    storage.get('animeList', function(result) {
        // make a link to the options page when no anime is found
        if (result.animeList === undefined) {
            var options_link = $('<a>')
                .attr("href", chrome.extension.getURL("options.html"))
                .text("Add New Anime");
            $('#nyaajs_anime_list').append(options_link);
            return;
        }

        //$.each(result.animeList, function(){});
        for (var i in result.animeList) {

            var anime = result.animeList[i];

            // create li element to hold each anime the user is watching
            var li = $('<li>')
                .attr('data', anime.release_date)
                .appendTo(animelist);

            // generate link for finding proper anime on nyaa
            var anime_link = (
                "http://www.nyaa.eu/?page=search&cats=1_37&filter=0&term=" 
                + encodeURIComponent(anime.title +" "+ anime.fansubber +" "
                + anime.fidelity) + "&sort=1");

            // truncate anime titles that are too long to fit in the sidebar
            var display_title = (anime.title.length <= 31
                    ) ? anime.title : anime.title.substring(0, 31) + '..';

            // add the anime title as a link and append to the sidebar
            var aa = $('<a>')
                .addClass('nyaajs_anime')
                .text(display_title +' ('+ anime.release_date +')')
                .attr('href', anime_link)
                .appendTo(li);

            // add link to each animes anime-planet profile page
            $('<a>')
                .addClass('nyaajs_anime_planet')
                .text('A')
                .attr('href', anime.anime_planet)
                .attr('target', '_blank')
                .appendTo(li);

            // ensure that the anime gets highlighted regardles of whether
            // whitespace, underscores, dashes, or periods seperate the words
            var escaped_pattern = new RegExp("[\\s|\\_|\\-|\\.]", "g");
            var title_regex = anime.title.replace(
                                    escaped_pattern, "[\\s|\\_|\\-|\\.]")
            matching_anime = $(
                'a:containsRegex("/'+ title_regex +'/i"):contains("'
                + anime.fansubber +'"):contains("'+ anime.fidelity +'")');

            matching_anime.each(function() {
                // TODO
                // move the variable declerations out of the each statement
                // you only need to resave them once per anime.title
                // this is also better done with a regex

                // highlight just the title and not the whole line
                var txt = $(this).text(),
                    words       = anime.title.match(/\S+/gi),
                    first_word  = words[0],
                    last_word   = words[words.length-1],
                    start_index = txt.indexOf(words[0]),
                    start_end   = start_index + first_word.length,
                    end_index   = txt.lastIndexOf(last_word)+last_word.length,
                    end_start   = end_index - last_word.length;

                var foo = txt.substring(0, start_index)
                    + '<span class="highlight">'
                    + txt.substring(start_index, end_index)
                    + '</span>'
                    + txt.substring(end_index, txt.length);

                $(this).html(foo);
            });

            // highlight matching anime on nyaa's list of torrents
            //$('a:contains('+ anime.fansubber +'):contains('+ anime.title +'):contains('+ anime.fidelity +')').highlight(anime.title);

            // highlight anime whose release date is today
            if (anime.release_date === today) { aa.addClass('nyaajs_today'); }
        }

    });
}
*/

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------
/*
nyaajs_btn.click(function(){
    // toggle the sort functionality when clicking the 'sort me' button
    var anime_list = $('ul#nyaajs_anime_list>li');
    if(sessionStorage.animeSortState==0) {
        anime_list.tsort('', {attr:'data'});
        sessionStorage.animeSortState=1;
    } else if (sessionStorage.animeSortState==1) {
        anime_list.tsort();
        sessionStorage.animeSortState=0;
    } else {
        anime_list.tsort();
        sessionStorage.animeSortState=0;
    }
});


function sortAnime() {
    // persist the anime-list's sort state across page refreshes.
    // setTimeout is used to recursively run this function until
    // the dynamically created #nyaajs_anime_list object exists
    var anime_list = $('ul#nyaajs_anime_list>li');
    if(anime_list) {
        if(sessionStorage.animeSortState==0) {
            anime_list.tsort();
        } else if(sessionStorage.animeSortState==1) {
            anime_list.tsort('', {attr:'data'});
        } else {
            anime_list.tsort();
        }
    } else {
        setTimeout(sortAnime(), 2000);
    }
}


// load anime from local strage
//loadAnime();

// append your completed HTML to the webpage and sort your list
mydiv.append(nyaajs_btn);
mydiv.append(optionspg);
mydiv.append(animelist);
mywrapper.append(mydiv);
$('#main').prepend(mywrapper);
//sortAnime();
*/

//----------------------------------------------------------------------------
// TODO
//----------------------------------------------------------------------------
/*
- sort by both date, and 2ndary sort by title
- only highlight undownloaded anime
- when searching for raw anime the url should include: &cats=1_11
- fix your css class names
- use chrome local storage to store sort state
- everytime you click the download link of a particular anime you should run a
  search that checks the current page for all titles in local storage and when
  it finds a match it should update the latest number you have downloaded. That
  way you can force nyaa to only highlight anime you have not yet downloaded.
- be sure to highlight anime with and without underscores between the words
  in it's title. as it stands you are highlighting literal matches only.

replace your jquery sort library with:
    http://mottie.github.io/tablesorter/docs/
*/
