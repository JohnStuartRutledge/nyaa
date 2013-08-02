(function (NyaaJS) {

//============================================================================
//============================================================================
//============================================================================

function Controller(model, view) {
	// Controls the rendering of Model data into views based on user events
	//   @model : the model constructor
	//   @view  : the view constructor
	this.model = model;
	this.view  = view;

	// the default settings
	// TODO - get this variable via
	// this.nyaa_settings = model.getSettings();
	this.nyaa_settings = {
		english_only : false,
		nightmode    : false,
		animeplanet  : true 
	}

};

Controller.prototype.updateSettings = function (checkbox) {
	// they updated their settings panel
	this.nyaa_settings[name] = checkbox.is(':checked');
	// TODO
	// save your settings to the database
};

Controller.prototype.loadAnime = function () {
	// load anime
	var view = this.view;
	this.model.read(function (animeList) {
		$('#anime_table tbody').html(view.renderTable(animeList));
	});

	// update the settings options with values from DB
	for (var name in this.nyaa_settings) {
		if (this.nyaa_settings.hasOwnProperty(name)) {
			$('#settings_'+name).attr('checked', this.nyaa_settings[name]);
		}
		// unhide the animeplanet field if the animeplanet setting is true
		if (this.nyaa_settings['animeplanet']) $('#animeplanet').toggle();
	}
};

Controller.prototype.makeSideBar = function (callback) {
	// render the anime sidebar for the contentscript
	var view = this.view;
	var url = "http://www.nyaa.eu/?page=search&cats=1_37&filter=0&term=";

	this.model.read(function (animeList) {
		// TODO
		// Make the URI encoding a seperate function that lets you pass in
		// an object to use for encoding. 
		$.each(animeList, function(i) {
			var anime = animeList[i];

			// Encode the URL
			var urlquery = encodeURIComponent(anime.title + ' ' 
				+ anime.fansubber + ' ' + anime.fidelity) + '&sort=1';
			animeList[i]['url'] = url + urlquery;

			// trucate anime titles that are too long to fit in the sidebar
			var display_title = (anime.title.length <= 31
				) ? anime.title : anime.title.substring(0, 31) + '..';
			animeList[i]['title'] = display_title;

			// if animeplanet is active, convert to proper link

		});
		callback(view.renderSidebar(animeList));
	});
}

Controller.prototype.makeList = function (callback) {
	// make an anime list for the sidebar
	var view = this.view;
	var url = "http://www.nyaa.eu/?page=search&cats=1_37&filter=0&term=";

	this.model.read(function (animeList) {
		// TODO
		// Make the URI encoding a seperate function that lets you pass in
		// an object to use for encoding. 
		$.each(animeList, function(i) {
			var anime = animeList[i];

			// Encode the URL
			var urlquery = encodeURIComponent(anime.title + ' ' 
				+ anime.fansubber + ' ' + anime.fidelity) + '&sort=1';
			animeList[i]['url'] = url + urlquery;

			// trucate anime titles that are too long to fit in the sidebar
			var display_title = (anime.title.length <= 31
				) ? anime.title : anime.title.substring(0, 31) + '..';
			animeList[i]['title'] = display_title;

			// if animeplanet is active, convert to proper link

		});
		callback(view.renderList(animeList));
	});
}

Controller.prototype.addAnime = function () {
	// they are saving a new anime to the DB
	var fansubber   = $('#fansubber').val(),
		title       = $('#main_title').val(),
		fidelity    = $('#fidelity').val(),
		air_day     = $('#air_day').val(),
		animeplanet = $('#animeplanet').val();

	this.model.create(fansubber, title, fidelity, air_day, animeplanet, function() {
		console.log('call message function "anime successfully saved" ');
	});

	this.loadAnime(); // refresh the page
};

Controller.prototype.editAnime = function (elem) {
	// they hit the edit button so render the editable table row
	var view = this.view;
	this.model.read(lookupId(elem), function(anime) {
		elem.replaceWith(view.renderForm(anime));
		tableUpdated();
	});

	// change the table row to something the user can edit
	//elem.replaceWith(this.view.renderForm(anime));
};

Controller.prototype.updateAnime = function (elem) {
	// Update the anime with new data	
	var newData = {
		fansubber   : elem.find('.form_fansubber').val(),
		title       : elem.find('.form_title').val(),
		fidelity    : elem.find('.form_fidelity').val(),
		air_day     : elem.find('.form_air_day').val(),
		animeplanet : elem.find('.form_animeplanet').val()
	};

	this.model.update(lookupId(elem), newData, function() {
		console.log('call message: "updated your anime" ');
		tableUpdated();
	});

	this.loadAnime(); 
};

Controller.prototype.deleteAnime = function (elem) {
	// Delete an anime from the database
	var controller = this;
	this.model.remove(lookupId(elem), function() {
		console.log('call message: "successfully removed anime from DB" ');
	});

	this.loadAnime();
};

Controller.prototype.removeAll = function () {
	// remove all anime from the Database
	this.model.removeAll(function () {
		// TODO: make this a confirm()
		console.log('call message: "successfully deleted all anime" ');
	});	

	this.loadAnime();
};

Controller.prototype.cancelEdit = function (elem) {
	// cancel editing this anime and return the normal info <tr>	
	var view = this.view;
	this.model.read(lookupId(elem), function(anime) {
		elem.replaceWith( view.renderTable(anime) );
	});
};

//----------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------

function tableUpdated() {
	$('#anime_table').trigger('update');
	var sorting = $('#anime_table').get(0).config.sortList; 
	$('#anime_table').trigger('sorton', [sorting]);
	//$('#anime_table').trigger('appendCache');
}

function lookupId(elem) {
	// find the model ID of the DOM element you clicked on
	//   @target = the originating DOM object your clicked on
	return $(elem).attr('data-anime-id');
}

function message(msg, msgtype) {
    // Print a message to the screen.
    // @msg     - the message you want to print
    // @msgtype - success, info, error, warning. Defaults to 'info'
    if (!msg) throw new Error('You must provide a message type');
    msgtype = (msgtype===undefined) ? 'info' : msgtype;
    var message = $("#message"),
        div     = $("<div>").addClass(msgtype).text(msg);
    message.append(div);
    message.fadeOut(8000);
}

//============================================================================
//============================================================================
//============================================================================

// Export to window
NyaaJS.Controller = Controller;

})(NyaaJS);
