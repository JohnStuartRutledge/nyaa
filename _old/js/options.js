// Store CSS data in the "local" storage area.
//
// Usually we try to store settings in the "sync" area since a lot of the time
// it will be a better user experience for settings to automatically sync
// between browsers.
//
// However, "sync" is expensive with a strict quota (both in storage space and
// bandwidth) so data that may be as large and updated as frequently as the CSS
// may not be suitable.

var storage = chrome.storage.local;

// select elements on the page
var fansubber    = document.querySelector('#fansubber'),
    anime_title  = document.querySelector('#anime_title'),
    release_date = document.querySelector('#release_date'),
    animeplanet  = document.querySelector('#animeplanet'),
    submitButton = document.querySelector('button.submit');

// Load any data that may have previously been saved.
loadChanges();

// fire the saveChanges function whenever somone clicks the 'add anime' button
submitButton.addEventListener('click', saveChanges);

function saveChanges() {
    // get the values from the submitted form
    var fansub = fansubber.value;

    // Get the current CSS snippet from the form.
    var cssCode = textarea.value;

    // Check that there's some code there.
    if (!fansub) {
        message('Error: No fansubber was specified');
        return;
    }

    // Save it using the Chrome extension storage API.
    storage.set({'fansubber': fansub}, function() {
        // Notify that we saved.
        message('Settings saved');
    });
}


function loadChanges() {
    storage.get('fansubber', function(items) {
        // To avoid checking items.css we could specify storage.get({css: ''}) to
        // return a default value of '' if there is no css value yet.
        if (items.fansubber) {
            textarea.value = items.fansubber;
            message('Loaded saved fansubber');
        }
    });
}

function reset() {
    // Remove the saved value from storage. storage.clear would achieve the same
    // thing.
    storage.remove('css', function(items) {
        message('Reset stored CSS');
    });
    // Refresh the text area.
    textarea.value = '';
}

function message(msg) {
    var message = document.querySelector('.message');
    message.innerText = msg;
    setTimeout(function() {
        message.innerText = '';
    }, 3000);
}

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------

//var bgPage = chrome.extension.getBackgroundPage();

function runTest() {
    alert('Test Successful');
};

function getPath() {
    var pathname = window.location.pathname;
    alert('your path is: '+ pathname);
};


// save & load fansubbers

// save & load anime

// get anime-planet anime name



