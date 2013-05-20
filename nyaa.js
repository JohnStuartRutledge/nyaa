$(document).ready(function(){

    // set default selection to english translated anime
    $('.inputsearchcategory option[value="1_37"]').attr('selected', 'selected');

    // get current day
    var d = new Date();
    var weekday = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    var today   = weekday[d.getDay()];

    // trusted fansub groups and their websites
    var fansubbers = {
        'CMS':          "http://colormesubbed.com", // http://www.nyaa.eu/?page=torrents&user=91833
        "Commie":       "http://commiesubs.com/",   // http://www.nyaa.eu/?page=torrents&user=76430
        "gg":           "http://www.ggkthx.org/",   // http://www.nyaa.eu/?page=torrents&user=9001
        "Hadena":       "http://hadena-subs.com/",  // http://www.nyaa.eu/?page=torrents&user=99024
        "HorribleSubs": "http://horriblesubs.info", // http://www.nyaa.eu/?page=torrents&user=64513
        "Mazui":        "http://mazuisubs.com/",    // http://www.nyaa.eu??page=torrents&user=69762
        "SubDESU":      "http://www.subdesu.org/",  // http://www.nyaa.eu/?page=torrents&user=63756
        "UTW":          "http://utw.me/",           // http://www.nyaa.eu/?page=torrents&user=71629
        "sage":         "http://sagesubs.com",      // http://www.nyaa.eu/?page=torrents&user=129334
        "Zero-Raws":    "http://zero-raws.com/"     // http://www.nyaa.eu/?page=torrents&user=118009
    };

    // upcoming anime
    // http://www.animenewsnetwork.com/encyclopedia/anime/upcoming/tv

    // define an object to serve as your anime database
    var myanime = {
        'Bakuman S3':                        {"sub":"SFW-Sage",     "fidelity":"720p", "date":"?",   "animeplanet": "bakuman-2012"},
        'Boku_Ha_Tomodachi_Ga_Sukunai_NEXT': {"sub":"Mazui",        "fidelity":"",     "date":"?",   "animeplanet": "boku-wa-tomodachi-ga-sukunai-next"},
        'Busou Shinki':                      {"sub":"Commie",       "fidelity":"",     "date":"thu", "animeplanet": "busou-shinki"},
        'Chuunibyou_demo_Koi_ga_Shitai':     {"sub":"URW",          "fidelity":"720p", "date":"thu", "animeplanet": "chuunibyou-demo-koi-ga-shitai"},
        'Fairy Tail':                        {"sub":"HorribleSubs", "fidelity":"720p", "date":"fri", "animeplanet": "Fairy-Tail"},
        'Gintama':                           {"sub":"HorribleSubs", "fidelity":"720p", "date":"thu", "animeplanet": "gintama-2012"},
        'Holy Knight':                       {"sub":"CMS",          "fidelity":"",     "date":"?",   "animeplanet": "holy-knight"},
        'Hunter X Hunter':                   {"sub":"HorribleSubs", "fidelity":"720p", "date":"sat", "animeplanet": "hunter-x-hunter-2011"},
        'Ixion Saga DT':                     {"sub":"HorribleSubs", "fidelity":"720p", "date":"sun", "animeplanet": "ixion-saga-dimension-transfer"},
        'Jormungand Perfect Order':          {"sub":"",             "fidelity":"",     "date":"?",   "animeplanet": "jormungand-perfect-order"},
        'Kamisama Kiss':                     {"sub":"HorribleSubs", "fidelity":"720p", "date":"wed", "animeplanet": "kamisama-hajimemashita"},
        'Little Busters!':                   {"sub":"UTW",          "fidelity":"720p", "date":"sun", "animeplanet": "little-busters"},
        'Magi':                              {"sub":"gg",           "fidelity":"",     "date":"sun", "animeplanet": "magi"},
        'Mangirl!':                          {"sub":"HorribleSubs", "fidelity":"72op", "date":"?",   "animeplanet": "mangirl"},
        'Maoyuu Maou Yuusha':                {"sub":"HorribleSubs", "fidelity":"720p", "date":"?",   "animeplanet": "maoyuu-maou-yuusha"},
        'Naruto Shippuuden':                 {"sub":"HorribleSubs", "fidelity":"720p", "date":"thu", "animeplanet": "naruto-shippuden"},
        'PSYCHO-PASS':                       {"sub":"HorribleSubs", "fidelity":"720p", "date":"thu", "animeplanet": "psycho-pass"},
        'Saint Seiya Omega':                 {"sub":"HorribleSubs", "fidelity":"720p", "date":"wed", "animeplanet": "saint-seiya-omega"},
        'Sakurasou no Pet na Kanojo':        {"sub":"Hadena",       "fidelity":"720p", "date":"tue", "animeplanet": "sakurasou-no-pet-na-kanojo"},
        'Senjou no Valkyria 3':              {"sub":"CMS",          "fidelity":"",     "date":"?",   "animeplanet": "valkyria-chronicles"},
        'Senran Kagura':                     {"sub":"Commie",       "fidelity":"",     "date":"?",   "animeplanet": "senran-kagura"},
        'Senyuu':                            {"sub":"HorribleSubs", "fidelity":"720p", "date":"?",   "animeplanet": "senyuu"},
        'Shinsekai Yori':                    {"sub":"Commie",       "fidelity":"",     "date":"sat", "animeplanet": "from-the-new-world"},
        'Space Brothers':                    {"sub":"HorribleSubs", "fidelity":"720p", "date":"sat", "animeplanet": "space-brothers"},
        'Sukitte Ii na yo':                  {"sub":"HorribleSubs", "fidelity":"720p", "date":"sun", "animeplanet": "suki-tte-ii-na-yo"},
        'Tamako_Market':                     {"sub":"Mazui",        "fidelity":"",     "date":"?",   "animeplanet": "tamako-market"},
        'Tanken_Driland':                    {"sub":"sage",         "fidelity":"720p", "date":"?",   "animeplanet": "driland"},
        'Tari Tari':                         {"sub":"HorribleSubs", "fidelity":"720p", "date":"sun", "animeplanet": "tari-tari"},
        'To Love Ru Darkness':               {"sub":"Commie",       "fidelity":"",     "date":"thu", "animeplanet": "to-love-ru-darkness"},
        'Zetsuen no Tempest':                {"sub":"HorribleSubs", "fidelity":"720p", "date":"thu", "animeplanet": "zetsuen-no-tempest-the-civilization-blaster"}
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