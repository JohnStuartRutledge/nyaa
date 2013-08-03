
// construct nested HTML divs for holding my list of anime
$('body').attr('id', 'nyaa_main'); // add id for custom styling
$('#main').prepend(
    $(document.createElement('div')).attr('id', 'nyaajs_wrapper')
);

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
        // create the sidebar from the template
        $('#nyaajs_wrapper').html(response.sidebar);

        // configure the sidebar using the user settings
        sidebarConfig(response.settings);

        // if anime is restricted to english-translated search only 
        if (response.settings.english_only) {
            $('.inputsearchcategory option[value="1_0"]').removeAttr('selected');
            $('.inputsearchcategory option[value="1_37"]').attr('selected', 'selected');
        }

        // highlight matching anime on the page
        $.each(response.animeList, function(i) {
            highlightAnime(response.animeList[i]);
        });
    }
});

function sidebarConfig (settings) {
    // this function configures the sidebar 
    
    // TODO
    // make this toggle between sorting on the title of the anime
    // and sorting on the release date

    // setup the sort button to sort the table
    var i = 1;
    $("#nyaajs_wrapper table").tablesorter({ sortList: [[0, 0]] }); 
    // resort your anime when they click the sort button
    $("#nyaajs_btn_sort").click(function() { 
        i++;
        var sorting = ((i % 2) !== 0) ? [[0, 0]] : [[0, 1]];
        $("#nyaajs_wrapper table").trigger("sorton", [sorting]); 
        return false; // this prevents default link action
    }); 

    // show the animeplanet links if the animeplanet setting is checked
    if (settings.animeplanet) $('.opt_animeplanet').show();
};

function highlightAnime (anime) {
    // TODO
    // case insensitive matching is not working properly
    // e.g, "Blood lad" only works if it is "Blood Lad"

    // function for highlighting anime on the page
    var escaped_pattern = new RegExp("[\\s+\\_\\-\\.]", "g");
    var title_regex = anime.title.replace(
                        escaped_pattern, "[\\s+\\_\\-\\.]");
    // _nartuo_shippuden 
    // [\s+\_\-\.]naruto[\s+\_\-\.]shippuden
    var pg_matches = $(
        '.content tr a:containsRegex("/'+ title_regex +'/i"):contains("'
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
}


/*----------------------------------------------------------------------------
// TODO
//----------------------------------------------------------------------------

- find a more efficent way to highlight anime on the page
- persist sidebar sort order across page loads using local storage
- sort by both date, and 2ndary sort by title
- only highlight undownloaded anime
- when searching for raw anime the url should include: &cats=1_11
- fix your css class names
- everytime you click the download link of a particular anime you should run a
  search that checks the current page for all titles in local storage and when
  it finds a match it should update the latest number you have downloaded. That
  way you can force nyaa to only highlight anime you have not yet downloaded.

*/
