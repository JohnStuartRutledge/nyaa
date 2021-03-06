
function Anime(name) {
	this.storage    = new NyaaJS.Store(name);
	this.model      = new NyaaJS.AnimeModel(this.storage);
	this.view       = new NyaaJS.View();
	this.controller = new NyaaJS.Controller(this.model, this.view);
}
var anime = new Anime('AnimeDB');

$(document).ready(function () {
	// refresh the anime list everytime the page loads
	anime.controller.loadAnime();

	// TODO
	// if they click "Air Day" to sort by date in the thead then
	// make the days sort in numeric and not alphabetical order

	// make the anime table sortable
	$('#anime_table').tablesorter({
		sortList: [[0,0], [1,0]],
		textExtraction: function (node) {
			// custom parser for sorting cells that have inputs/selects
			var td = $(node);
			var input_txt = td.find('input[value]').attr('value');
			if (input_txt) return input_txt; 
			var select_txt = td.find('option[selected=selected]').val();
			if (select_txt) return select_txt;
			return td.text();
		}
	}); 

});

$('#anime_form button').on("click", function(evt) {
	// they clicked the form to add a new anime
	evt.preventDefault();
	anime.controller.addAnime();
});

$('.table').on("click", function(evt) {
	// they clicked on one of the many buttons 
	var target = $(evt.target);
	if (target.is(":button")) {
		var btn_name = target.text();
		var anime_row = $(target.closest('tr'));
		if      (btn_name === 'edit')   anime.controller.editAnime(anime_row);
		else if (btn_name === 'update') anime.controller.updateAnime(anime_row);
		else if (btn_name === 'delete') anime.controller.deleteAnime(anime_row);
		else if (btn_name === 'cancel') anime.controller.cancelEdit(anime_row);
	} 
});

$('#reset_btn').on('click', function(evt) {
	// remove all the anime on the page
	anime.controller.removeAll();
});

$('#nyaa_options input[type=checkbox]').change(function() {
	// they made an adjustment to the settings box
	anime.controller.updateSettings($(this));
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// this is a listener that sends an anime list to the contentscript
	// page and is rendered in the sidebar throughout nyaa.eu
	if (request.cmd === 'getStoredAnime') {
		anime.controller.makeSideBar(function (sidebar, animeList) {
			anime.model.getSettings(function (settings) {
				sendResponse({ 
					'sidebar'  : sidebar,
					'animeList': animeList,
					'settings' : settings 
				});
			});
		});
	}
});

