(function (NyaaJS) {

//============================================================================
//============================================================================
//============================================================================

// TODO
// Abstract the base model so that it can be used to prototype new
// new models. Currently it only creates anime objects

function AnimeModel(storage) {
	// create a new Model instance and hookup the localStorage DB
	//   @storage : reference to the client side storage class
	this.storage = storage;
}

AnimeModel.prototype.create = function (fansubber, title, fidelity, air_day, animeplanet, callback) {
	// Create a new Anime Model
	//   @title    : title of the anime
	//   @callback : callback function to run on completion
	fansubber   = fansubber   || '';
	title       = title       || '';
	fidelity    = fidelity    || '';
	air_day     = air_day     || '?';
	animeplanet = animeplanet || '';
	callback    = callback    || function () {};

	var newItem = {
		fansubber   : fansubber.trim(),
		title       : title.trim(),
		fidelity    : fidelity,
		air_day     : air_day,
		animeplanet : animeplanet.trim()
	};

	this.storage.save(newItem, callback);
};

AnimeModel.prototype.read = function (query, callback) {
	// Find and return Model in storage. If no query given, returns everything
	// If you pass in a string or number it treats it as a lookup by Model ID
	// you can also pass in an object to match against
	//   @query    : A query to match models agains
	//   @callback : the callback to fire when model is found
	// EXAMPLE
	//   model.read(1, func)     // find model with ID 1
	//   model.read('1')         // Same as above
	//   model.read({foo:'bar'}) // finds model where foo equals bar 
	var queryType = typeof query;
	callback = callback || function () {};

	if (queryType === 'function') {
		callback = query;
		return this.storage.findAll(callback);
	} else if (queryType === 'string' || queryType === 'number') {
		this.storage.find({ id: query }, callback);
	} else {
		this.storage.find(query, callback);
	}
};

AnimeModel.prototype.update = function (id, data, callback) {
	// Update Model by givigin it an ID, data, and callback to fire on complete 
	//   @id       : id of model to update
	//   @data     : new data you want the model to be updated with
	//   @callback : callback to fire after model is updated
	this.storage.save(id, data, callback);
};

AnimeModel.prototype.remove = function (id, callback) {
	// Remove a model from storage
	//   @id       : id of teh model you want removed
	//   @callback : callback to fire after model is removed
	this.storage.remove(id, callback);
};

AnimeModel.prototype.removeAll = function (callback) {
	// Clears all data from the localStorage DB
	//   @callback : callback funtion to fire on completion
	this.storage.drop(callback);
};

AnimeModel.prototype.getSettings = function (callback) {
	// return the nyaa settings configuration for this user
	this.storage.getSettings(callback);
};

AnimeModel.prototype.saveSettings = function (new_settings, callback) {
	// save the nyaa settings to the DB
	this.storage.saveSettings(new_settings, callback);
}

// Export to window
NyaaJS.AnimeModel = AnimeModel;


//============================================================================
//============================================================================
//============================================================================

})(NyaaJS);

/*============================================================================
// TODO
//============================================================================

- set and save the nyaa_settings using a class method, Vs the instance
  method (aka prototype method) you are using now

- create a model to hold trusted fansubbers

- modify the Store.prototype.find() method in your db.js file
  so that it can search for the nyaa_settings variable instead
  of just being limited to search for anime only

*/
