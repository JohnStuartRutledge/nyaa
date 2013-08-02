
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

$('body').attr('id', 'nyaa_main'); // add id for custom styling
$('#main').prepend(mywrapper);

//----------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------


chrome.runtime.sendMessage({cmd: "getStoredAnime"}, function(response) {
    // Send message through background.js to options.js to render the
    // the animelist contents of the sidebar

    if (!response.sidebar) {
        $('#nyaajs_wrapper').html(
            $('<a>')
                .attr("href", chrome.extension.getURL("options.html"))
                .text("Add New Anime"));
    } else {
        $('#nyaajs_wrapper').html(response.sidebar);
        sidebarConfig();

        // highlight matching anime on the page
        $.each(response.animeList, function(i) {
            //var anime_name = response.animeList[i].title;
            highlightAnime(response.animeList[i]);
        });
    }
});

function sidebarConfig () {
    // this function configures the sidebar by adding tablesorting to
    // the watched list, and highlighting todays anime
    var i = 1;
    $("#nyaajs_wrapper table").tablesorter({ sortList: [[0,0]] }); 
    $("#nyaajs_btn_sort").click(function() { 
        // TODO - make this toggle between sorting on title and sorting on date
        //        Consider displaying the table headers instead
        i++;
        var sorting = ((i % 2) !== 0) ? [[0, 0]] : [[0, 1]];
        $("#nyaajs_wrapper table").trigger("sorton",[sorting]); 
        return false; // this prevents default link action
    }); 
};

function highlightAnime (anime) {
    // function for highlighting anime on the page
    //var escaped_pattern = new RegExp("[\\s|\\_|\\-|\\.]", "g");
    //var title_regex = anime.title.replace(
    //                    escaped_pattern, "[\\s|\\_|\\-|\\.]");

    var pg_matches = $('.content tr a:contains("'+ anime.title +'"):contains("'
        + anime.fansubber +'"):contains("'+ anime.fidelity +'")');

    pg_matches.each(function() {
        var txt         = $(this).text(),
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
    /*
    matching_anime = $(
        'a:containsRegex("/'+ title_regex +'/i"):contains("'
        + anime.fansubber +'"):contains("'+ anime.fidelity +'")');
    */

}


/*----------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------

TODO
- persist sidebar sort order across page loads

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


}
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
