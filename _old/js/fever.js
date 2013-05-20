(function(view) {
"use strict";

var
    document = view.document,
    $ = function(id) {
        return document.getElementById(id);
    }, 
    session = view.sessionStorage,
    
    // only get URL when necessary in case BlobBuilder.js hasn't defined it yet
    get_blob_builder = function() {
        return view.BlobBuilder || view.WebKitBlobBuilder || view.MozBlobBuilder;
    },
    text              = $("text"),
    text_options_form = $("text-options"),
    text_filename     = $("text-filename");


if (session.text) {
  text.value = session.text;
} if (session.text_filename) {
    text_filename.value = session.text_filename;
}

text_options_form.addEventListener("submit", function(event) {
    event.preventDefault();
    var BB = get_blob_builder();
    var bb = new BB;
    bb.append(text.value || text.placeholder);
    saveAs(
        bb.getBlob("text/plain;charset=" + document.characterSet),
        (text_filename.value || text_filename.placeholder) + ".txt"
    );
}, false);


view.addEventListener("unload", function() {
    session.text = text.value;
    session.text_filename = text_filename.value;
}, false);


// get url of current window and it into textarea
$('getURLbtn').onclick = function() {
    chrome.windows.getCurrent(function (w) {
        chrome.tabs.getSelected(w.id, function (response){
            var txt = $('text').value
            $('text').value = txt ? txt += '\n'+response.url : response.url;
        });
    });
};


}(self));