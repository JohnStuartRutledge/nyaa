$(document).ready(function(){

    // set default selection to english translated anime
    $('.inputsearchcategory option[value="1_37"]').attr('selected', 'selected');

    // get current day
    var d = new Date();
    var weekday = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    var today   = weekday[d.getDay()];

    // trusted fansub groups and their websites
    var fansubbers = {
        'CMS': "http://colormesubbed.com", // http://www.nyaa.eu/?page=torrents&user=91833
    };

    // upcoming anime
    // http://www.animenewsnetwork.com/encyclopedia/anime/upcoming/tv

    // define an object to serve as your anime database
    var myanime = {
        'Bakuman S3': {"sub":"SFW-Sage", "fidelity":"720p", "date":"?", "animeplanet": "bakuman-2012"},
    };

    // construct nested HTML divs for holding my list of anime
    var mywrapper = $(document.createElement('div')).attr('id', 'stu_wrapper');
    var mydiv     = $(document.createElement('div')).attr('id', 'stu_showtimes');
    var stubutton = $(document.createElement('a'))
                        .attr('id', 'stu_btn')
                        .attr('href', '#')
                        .text('sort me');

    // establish variables you'll need to create the URL
    var animelist = $('<ul>').attr('id', 'stu_anime_list');
    var nyaa      = "http://www.nyaa.eu/?page=search&cats=1_37&filter=0&term=";
    var anplanet  = "http://www.anime-planet.com/anime/";

    // define function for detecting if a string is blank
    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    };

    // highlight all anime from all fansubbers that I care about right now
    for (var anime in myanime) {
        var obj = myanime[anime];

        // make sure not to search on undefined properties
        var fidelity = isBlank(obj["fidelity"]) ? '' : ':contains('+ obj["fidelity"] +')';
        var fansuber = isBlank(obj["sub"]) ? '' : ':contains('+ obj["sub"] +')';

        // highlight matching anime on nyaa's list of torrents
        $('a'+ fansuber +':contains('+ anime +')'+ fidelity).highlight(anime);

        // create links for searching nyaa for the specific anime in your list
        var anime_link = nyaa + encodeURIComponent(anime +' '+ obj['sub'] +' '+ obj['fidelity']);
        var li = $('<li>').attr('data', obj['date']).appendTo(animelist);

        // Build link for searching nyaa for your specific anime
        var aa = $('<a>')
            .addClass('stu_anime')
            .text(anime +' ('+obj['date']+')')
            .attr('href', anime_link+"&sort=1")
            .appendTo(li);

        // highlight anime whose release date is today
        if (obj['date'] === today) aa.addClass('stu_today');

        // add link to each animes anime-planet profile page
        var xx = $('<a>')
            .addClass('stu_anime_planet')
            .text('A')
            .attr('href', anplanet+obj['animeplanet'])
            .attr('target', '_blank')
            .appendTo(li);
    };


    // toggle the sort functionality when clicking the 'sort me' button
    stubutton.click(function(){
        var anime_list = $('ul#stu_anime_list>li');
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


    // persist the anime-list's sort state across page refreshes.
    // setTimeout is used to recursively run this function until
    // the dynamically created #stu_anime_list object exists
    function sortAnime() {
        var anime_list = $('ul#stu_anime_list>li');
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

    // append your completed HTML to the webpage and sort your list
    mydiv.append(stubutton);
    mydiv.append(animelist);
    mywrapper.append(mydiv);
    $('#main').prepend(mywrapper);
    sortAnime();

// TODO
// sort by both date, and 2ndary sort by title
// create a chrome extension out of this file
// create an interface for adding/removing anime
// only highlight undownloaded anime
// when searching for raw anime the url should include: &cats=1_11
// remove or relocate ads to the bottom

});