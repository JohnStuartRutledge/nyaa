
//----------------------------------------------------------------------------
// Helper Functions
//----------------------------------------------------------------------------

var
    $ = function(id) { return document.getElementById(id); },
    matches = function(regex) { return document.body.innerText.match(regex); };


// set default selection to english translated anime

// handle requests sent by the popup bar
function onRequest(request, sender, sendResponse) {
    // get
}

// listen for the popup script to send a message to the options page
chrome.extension.onRequest.addListener(onRequest);