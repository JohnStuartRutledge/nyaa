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

	// get the default settings
	this.model.getSettings(function(nyaa_settings) {
		this.nyaa_settings = nyaa_settings;
	}.bind(this));
};

Controller.prototype.updateSettings = function (checkbox) {
	// they updated their settings panel
	var checkbox_name = checkbox.attr('name');
	this.nyaa_settings[checkbox_name] = checkbox.is(':checked');

	// save changes to the DB	
	this.model.saveSettings(this.nyaa_settings, function(settings) {
		message('settings were updated', 'success');
		location.reload();
	});
};

Controller.prototype.loadAnime = function () {
	// load anime
	var context = this;
	var view = this.view;
	this.model.read(function (animeList) {
		$('#anime_table tbody').html(view.renderTable(animeList));
		applySettings(context);
		tableUpdated();	
	});
};

Controller.prototype.makeSideBar = function (callback) {
	// render the anime sidebar for the contentscript
	var context = this;
	var view = this.view;
	var url = "http://www.nyaa.eu/?page=search"
	var animeplanetRoot = "http://www.anime-planet.com/anime/";

	this.model.read(function (animeList) {
		// TODO
		// Make the URI encoding a seperate function that lets you pass in
		// an object to use for encoding. 

		// TODO
		// find a way to move this settings lookup into the makeNyaaURL
		// function without having to recall it each time in the $.each loop

		// If they have animeplanet option on
		context.model.getSettings(function (settings) {
			if (settings['english_only']) url = url + '&cats=1_37';
		});

		// deep copy the object in order to send raw data to contentscript pg.
		var originalList = $.extend(true, {}, animeList);

		// modify the data for display in the sidebar template
		$.each(animeList, function(i) {
			var anime = animeList[i];

			// Encode the URL
			animeList[i]['url'] = makeNyaaURL(url, anime);

			// truncate anime titles that are too long to fit in the sidebar
			var display_title = (anime.title.length <= 31
				) ? anime.title : anime.title.substring(0, 31) + '..';
			animeList[i]['title'] = display_title;

			// convert animeplanet names to their proper urls
			if (anime.animeplanet) {
				animeList[i].animeplanet = animeplanetRoot + anime.animeplanet; 
			} else {
				animeList[i].animeplanet = '#';
			}

			// highlight anime whose air date is today
			animeList[i]['highlight'] = isToday(anime.air_day) ? true : false; 
		});

		// get the anime and settings from the DB and pass it in the callback
		callback(view.renderSidebar(animeList), originalList);
	});
}

Controller.prototype.addAnime = function () {
	// they are saving a new anime to the DB
	var context = this;
	var fansubber   = $('#fansubber').val(),
		title       = sanitizeTitle($('#main_title').val()),
		fidelity    = $('#fidelity').val(),
		air_day     = $('#air_day').val(),
		animeplanet = $('#animeplanet_input').val();

	fidelity = (fidelity === 'none') ? '' : fidelity;
	air_day  = (air_day === 'unknown') ? '?' : air_day;

	this.model.create(fansubber, title, fidelity, air_day, animeplanet, function() {
		context.loadAnime();
		message('anime successfully saved', 'success');
	});
};

Controller.prototype.updateAnime = function (elem) {
	// Update the anime with new data	
	var view = this.view;
	var context = this;
	var newData = {
		id          : elem.attr('data-anime-id'),
		fansubber   : elem.find('.form_fansubber').val(),
		title       : sanitizeTitle(elem.find('.form_title').val()),
		fidelity    : elem.find('.form_fidelity').val(),
		air_day     : elem.find('.form_air_day').val(),
		animeplanet : elem.find('.form_animeplanet').val()
	};
	newData.fidelity = (newData.fidelity === 'none') ? '' : newData.fidelity;
	newData.air_day  = (newData.air_day === 'unknown') ? '?' : newData.air_day;
	this.model.update(lookupId(elem), newData, function(newerData) {
		elem.replaceWith(view.renderTable([newData]));
		applySettings(context);
		tableUpdated();
		message('your anime was updated', 'success');
	});
};

Controller.prototype.deleteAnime = function (elem) {
	// Delete an anime from the database
	var context = this;
	this.model.remove(lookupId(elem), function() {
		context.loadAnime();
		message('your anime was deleted', 'success');
	});
};

Controller.prototype.removeAll = function () {
	// remove all anime from the Database
	var context = this;
	if(confirm("Are you sure you want to delete all your anime?")) {
		this.model.removeAll(function () {
			context.loadAnime();
			message('successfully deleted all anime', 'success');
		});	
	}
};

Controller.prototype.editAnime = function (elem) {
	// they hit the edit button so render the editable table row
	var view = this.view;
	var context = this;
	this.model.read(lookupId(elem), function(anime) {
		elem.replaceWith(view.renderForm(anime));
		applySettings(context);
		tableUpdated();
	});
};

Controller.prototype.cancelEdit = function (elem) {
	// cancel editing this anime and return the normal info <tr>	
	var view = this.view;
	var context = this;
	this.model.read(lookupId(elem), function(anime) {
		elem.replaceWith( view.renderTable(anime) );
		applySettings(context);
		tableUpdated();
	});
};

//----------------------------------------------------------------------------
// Functions
//----------------------------------------------------------------------------

function applySettings(context) {
	// get the settings from the DB and enact them
	context.model.getSettings(function (settings) {
		for (var name in settings) {
			// make sure the checkboxes match the values in the DB
			if (settings.hasOwnProperty(name)) {
				$('#settings_'+name).attr('checked', settings[name]);
			}
		}

		// If they have animeplanet option on
		if (settings['animeplanet']) {
			$('#animeplanet_input').show(); // show animeplanet input on add-form
			$('.opt_animeplanet').show();
		}

		// if they have english only option on
		// if (settings['english_only']) console.log('english only is on');

		// if they have night_mode on
		if (settings['night_mode']) $('body').addClass('nyaajs_nightmode');

	});
}

function makeNyaaURL(url, anime) {
	// Encode the URL
	// http://www.nyaa.eu/?page=search&cats=1_37&filter=0&term=
	// &filter=0   Show all
	// &filter=1   Filter remakes
	// &filter=2   Trusted only
	// &filter=3   A+ only

	// TODO
	// add ability to manipulate &filter
	var query = anime.title + " " + anime.fansubber + " " + anime.fidelity;
	var term  = escapeURIparam(query) + "&sort=1";
	return url + "&filter=0&term=" + term;
}

var serializeURL = function(obj) {
	// e.g.
	//   serializeURL({'filter':0, 'term':encodeURIComponent(query), 'sort':1})
	// example response
	//   filter=0&term=naruto&sort=1
	 var pairs = [];
	 for (var prop in obj) {
		  if (!obj.hasOwnProperty(prop)) continue;
		  pairs.push(prop + '=' + obj[prop]);
	 }
	 return pairs.join('&');
}

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

function escapeURIparam (url) {
    // Encode a query string to be sent to a web server
    //   @url : the url you want escaped and encoded
    if (encodeURIComponent) url = encodeURIComponent(url);
    else if (encodeURI) url = encodeURI(url);
    else url = escape(url);
    url = url.replace(/\+/g, '%2B'); // Force the replacement of "+"
    return url;
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
