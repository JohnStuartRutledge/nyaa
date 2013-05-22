
// JQuery Highlight
jQuery.fn.highlight=function(c){function e(b,c){var d=0;if(3==b.nodeType){var a=b.data.toUpperCase().indexOf(c);if(0<=a){d=document.createElement("span");d.className="highlight";a=b.splitText(a);a.splitText(c.length);var f=a.cloneNode(!0);d.appendChild(f);a.parentNode.replaceChild(d,a);d=1}}else if(1==b.nodeType&&b.childNodes&&!/(script|style)/i.test(b.tagName))for(a=0;a<b.childNodes.length;++a)a+=e(b.childNodes[a],c);return d}return this.length&&c&&c.length?this.each(function(){e(this,c.toUpperCase())}): this};jQuery.fn.removeHighlight=function(){return this.find("span.highlight").each(function(){this.parentNode.firstChild.nodeName;with(this.parentNode)replaceChild(this.firstChild,this),normalize()}).end()};

// TINYSORT
(function(c){var e=!1,f=null,j=parseFloat,g=Math.min,i=/(-?\d+\.?\d*)$/g,h=[],d=[];c.tinysort={id:"TinySort",version:"1.4.29",copyright:"Copyright (c) 2008-2012 Ron Valstar",uri:"http://tinysort.sjeiti.com/",licensed:{MIT:"http://www.opensource.org/licenses/mit-license.php",GPL:"http://www.gnu.org/licenses/gpl.html"},plugin:function(k,l){h.push(k);d.push(l)},defaults:{order:"asc",attr:f,data:f,useVal:e,place:"start",returns:e,cases:e,forceStrings:e,sortFunction:f}};c.fn.extend({tinysort:function(o,k){if(o&&typeof(o)!="string"){k=o;o=f}var p=c.extend({},c.tinysort.defaults,k),u,D=this,z=c(this).length,E={},r=!(!o||o==""),s=!(p.attr===f||p.attr==""),y=p.data!==f,l=r&&o[0]==":",m=l?D.filter(o):D,t=p.sortFunction,x=p.order=="asc"?1:-1,n=[];c.each(h,function(G,H){H.call(H,p)});if(!t){t=p.order=="rand"?function(){return Math.random()<0.5?1:-1}:function(O,M){var N=e,J=!p.cases?a(O.s):O.s,I=!p.cases?a(M.s):M.s;if(!p.forceStrings){var H=J&&J.match(i),P=I&&I.match(i);if(H&&P){var L=J.substr(0,J.length-H[0].length),K=I.substr(0,I.length-P[0].length);if(L==K){N=!e;J=j(H[0]);I=j(P[0])}}}var G=x*(J<I?-1:(J>I?1:0));c.each(d,function(Q,R){G=R.call(R,N,J,I,G)});return G}}D.each(function(I,J){var K=c(J),G=r?(l?m.filter(J):K.find(o)):K,L=y?""+G.data(p.data):(s?G.attr(p.attr):(p.useVal?G.val():G.text())),H=K.parent();if(!E[H]){E[H]={s:[],n:[]}}if(G.length>0){E[H].s.push({s:L,e:K,n:I})}else{E[H].n.push({e:K,n:I})}});for(u in E){E[u].s.sort(t)}for(u in E){var A=E[u],C=[],F=z,w=[0,0],B;switch(p.place){case"first":c.each(A.s,function(G,H){F=g(F,H.n)});break;case"org":c.each(A.s,function(G,H){C.push(H.n)});break;case"end":F=A.n.length;break;default:F=0}for(B=0;B<z;B++){var q=b(C,B)?!e:B>=F&&B<F+A.s.length,v=(q?A.s:A.n)[w[q?0:1]].e;v.parent().append(v);if(q||!p.returns){n.push(v.get(0))}w[q?0:1]++}}D.length=0;Array.prototype.push.apply(D,n);return D}});function a(k){return k&&k.toLowerCase?k.toLowerCase():k}function b(m,p){for(var o=0,k=m.length;o<k;o++){if(m[o]==p){return !e}}return e}c.fn.TinySort=c.fn.Tinysort=c.fn.tsort=c.fn.tinysort})(jQuery);
/* Array.prototype.indexOf for IE (issue #26) */
if(!Array.prototype.indexOf){Array.prototype.indexOf=function(b){var a=this.length,c=Number(arguments[1])||0;c=c<0?Math.ceil(c):Math.floor(c);if(c<0){c+=a}for(;c<a;c++){if(c in this&&this[c]===b){return c}}return -1}};

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------

// set default selection to english translated anime
$('.inputsearchcategory option[value="1_0"]').removeAttr('selected');
$('.inputsearchcategory option[value="1_37"]').attr('selected', 'selected');

// get current day
var d = new Date();
var weekday = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
var today   = weekday[d.getDay()];

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------

// construct nested HTML divs for holding my list of anime
var mywrapper = $(document.createElement('div')).attr('id', 'stu_wrapper');
var mydiv     = $(document.createElement('div')).attr('id', 'stu_showtimes');
var animelist = $(document.createElement('ul')).attr('id', 'stu_anime_list');
var stubutton = $(document.createElement('a')).attr('id', 'stu_btn')
                    .attr('href', '')
                    .text('sort me');


function loadAnime() {
    // load anime from local storage and append it as a list on side bar.
    // Highlight the users saved anime/preferences and apply them to page.
    chrome.storage.local.get('anime_list', function(result) {
        if (result.anime_list==undefined) {
            var options_link = $('<a>')
                .attr("href", chrome.extension.getURL("options.html"))
                .text("Click To Add Anime");
            $('#stu_anime_list').append(options_link);
            return;
        }

        for (var i in result.anime_list) {

            var anime = result.anime_list[i];

            // create li element to hold each anime the user is watching
            var li = $('<li>')
                .attr('data', anime.release_date)
                .appendTo(animelist);

            // generate link for finding proper anime on nyaa
            var anime_link = "http://www.nyaa.eu/?page=search&cats=1_37&filter=0&term=" +
                encodeURIComponent(anime.title +" "+ anime.fansubber +" "+ anime.fidelity) +
                "&sort=1";

            // add the anime title as a link and append to the sidebar
            var aa = $('<a>')
                .addClass('stu_anime')
                .text(anime.title +' ('+ anime.release_date +')')
                .attr('href', anime_link)
                .appendTo(li);

            // add link to each animes anime-planet profile page
            $('<a>')
                .addClass('stu_anime_planet')
                .text('A')
                .attr('href', anime.anime_planet)
                .attr('target', '_blank')
                .appendTo(li);

            // highlight matching anime on nyaa's list of torrents
            //$('a'+ anime.fansubber + ':contains('+ anime.title +')'+ anime.fidelity).highlight(anime.title);
            $('a:contains('+ anime.fansubber +'):contains('+ anime.title +'):contains('+ anime.fidelity +')').highlight(anime.title);

            // highlight anime whose release date is today
            if (anime.release_date === today) { aa.addClass('stu_today'); }
        }

    });
}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------

stubutton.click(function(){
    // toggle the sort functionality when clicking the 'sort me' button
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

function isBlank(str) {
    // function for detecting if a sting is blank
    return (!str || /^\s*$/.test(str));
};

function sortAnime() {
    // persist the anime-list's sort state across page refreshes.
    // setTimeout is used to recursively run this function until
    // the dynamically created #stu_anime_list object exists
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

// load anime from local strage
loadAnime();

// append your completed HTML to the webpage and sort your list
mydiv.append(stubutton);
mydiv.append(animelist);
mywrapper.append(mydiv);
$('#main').prepend(mywrapper);
sortAnime();

//----------------------------------------------------------------------------
// TODO
//----------------------------------------------------------------------------
// sort by both date, and 2ndary sort by title
// only highlight undownloaded anime
// when searching for raw anime the url should include: &cats=1_11
// make an icon that shows in the address bar on nyaa that takes you to the option page
// fix your css class names
