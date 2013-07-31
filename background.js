
// NyaaJS is global

/*
function Anime(name) {
    this.storage    = new NyaaJS.Store(name);
    this.model      = new NyaaJS.Model(this.storage);
    this.view       = new NyaaJS.View();
    this.controller = new NyaaJS.Controller(this.model, this.view);
}

window.anime = new Anime('AnimeDB');
var anime_list = [];

window.anime.model.read(function(item) {
    anime_list.push(item);
});

*/

// TODO
// in contentscript.js sendMessage to background.js requesting anime_list

// onload - sendMessage to options.js requesting the anime_list and save it
//          into the window object. Then as a callback function 

// Send the localStorage contents to the contentscript.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    chrome.runtime.sendMessage({cmd: "makeAnimeList"}, function(response) {
        console.log(response);
    });

    sendResponse({
        'status': 'good',
        'monster': 'mash'
    });
});

/*
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        console.log(msg);
    });
});
*/

/*
chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {status: 'good'}, function(response) {
        console.log(response);
    });
});
*/

/*

chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.cmd == "getStoredAnime") {
            sendResponse({
                'status': 'good'
            });
        }
    });
});

// Send the localStorage contents to the contentscript.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.cmd === "getStoredAnime") {

            sendResponse({
                'status': 'good',
                'anime': anime
            });
        }

        if (request.cmd === 'load') {
            sendResponse(anime.model.read());
        }

    }
);
*/


/*
// Run at startup
chrome.windows.getCurrent(function(currentWindow) {
  window.windowId = currentWindow.id;
});
*/
