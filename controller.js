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
		tableUpdated();	
	});

	// update the settings options with values from DB
	for (var name in this.nyaa_settings) {
		if (this.nyaa_settings.hasOwnProperty(name)) {
			$('#settings_'+name).attr('checked', this.nyaa_settings[name]);
		}
		// unhide the animeplanet field if the animeplanet setting is true
		// TODO - make sure this is not toggling every other insertion
		if (this.nyaa_settings['animeplanet']) $('#animeplanet').show();
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

		// deep copy the object in order to send raw data to contentscript pg.
		var originalList = $.extend(true, {}, animeList);

		$.each(animeList, function(i) {
			var anime = animeList[i];

			// Encode the URL
			var urlquery = encodeURIComponent(anime.title + ' ' 
				+ anime.fansubber + ' ' + anime.fidelity) + '&sort=1';
			animeList[i]['url'] = url + urlquery;

			// truncate anime titles that are too long to fit in the sidebar
			var og_title = anime.title;
			var display_title = (anime.title.length <= 31
				) ? anime.title : anime.title.substring(0, 31) + '..';
			animeList[i]['title'] = display_title;

			// if animeplanet is active, convert to proper link
			animeList[i]['highlight'] = isToday(anime.air_day) ? true : false; 
		});
		callback(view.renderSidebar(animeList), originalList);
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
		title       = sanitizeTitle($('#main_title').val()),
		fidelity    = $('#fidelity').val(),
		air_day     = $('#air_day').val(),
		animeplanet = $('#animeplanet').val();

	fidelity = (fidelity === 'none') ? '' : fidelity;
	air_day  = (air_day === 'unknown') ? '?' : air_day;
	this.model.create(fansubber, title, fidelity, air_day, animeplanet, function() {
		message('anime successfully saved', 'success');
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
		title       : sanitizeTitle(elem.find('.form_title').val()),
		fidelity    : elem.find('.form_fidelity').val(),
		air_day     : elem.find('.form_air_day').val(),
		animeplanet : elem.find('.form_animeplanet').val()
	};
	newData.fidelity = (newData.fidelity === 'none') ? '' : newData.fidelity;
	newData.air_day  = (newData.air_day === 'unknown') ? '?' : newData.air_day;
	this.model.update(lookupId(elem), newData, function() {
		message('your anime was updated', 'success');
	});

	this.loadAnime(); 
};

Controller.prototype.deleteAnime = function (elem) {
	// Delete an anime from the database
	var controller = this;
	this.model.remove(lookupId(elem), function() {
		message('your anime was deleted', 'success');
	});
	this.loadAnime();
	tableUpdated();
};

Controller.prototype.removeAll = function () {
	// remove all anime from the Database
	if(confirm("Are you sure you want to delete all your anime?")) {
		this.model.removeAll(function () {
			message('successfully deleted all anime', 'success');
		});	
	}
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
// Helpers
//----------------------------------------------------------------------------

function isToday(airday) {
	// A function that returns true if an animes release date is today
	var d = new Date(),
		weekday = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
	    today   = weekday[d.getDay()];
	if (airday === today) return true;
	return false
}

function sanitizeTitle(title) {
	// Removes unecessary extra spaces from title from a title
	// TODO - make sure first character in title is a [a-aA-Z0-9]
	//        and if it's not then remove the initial character till it is
	title = title.replace(/\s+/g, ' ');
	return title.trim();
}

function tableUpdated() {
	var sorting;
	$('#anime_table').trigger('update');
	try { sorting = $('#anime_table').get(0).config.sortList; } 
	catch (exception) { sorting = [0, 0]; }
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
