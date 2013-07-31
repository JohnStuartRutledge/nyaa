(function (NyaaJS) {

//============================================================================
//============================================================================
//============================================================================

// TODO
// Abstract the base model so that it can be used to prototype new
// new models. Currently it only creates anime objects

function Model(storage) {
	// create a new Model instance and hookup the localStorage DB
	//   @storage : reference to the client side storage class
	this.storage = storage;
}

Model.prototype.create = function (fansubber, title, fidelity, air_day, animeplanet, callback) {
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

Model.prototype.read = function (query, callback) {
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

Model.prototype.update = function (id, data, callback) {
	// Update Model by givigin it an ID, data, and callback to fire on complete 
	//   @id       : id of model to update
	//   @data     : new data you want the model to be updated with
	//   @callback : callback to fire after model is updated
	this.storage.save(id, data, callback);
};

Model.prototype.remove = function (id, callback) {
	// Remove a model from storage
	//   @id       : id of teh model you want removed
	//   @callback : callback to fire after model is removed
	this.storage.remove(id, callback);
};

Model.prototype.removeAll = function (callback) {
	// Clears all data from the localStorage DB
	//   @callback : callback funtion to fire on completion
	this.storage.drop(callback);
};

Model.getSettings = function () {
	// return the nyaa settings configuration for this user
	var nyaa_settings = {
		english_only : false,
		night_mode   : false,
		animeplanet  : false
	};

	//this.storage.find({'nyaa_settings'})
	// TODO
	// modify the Store.prototype.find() method in your db.js file
	// so that it can search for the nyaa_settings variable instead
	// of just being limited to search for anime only

};

// TODO 
// create a model to hold trusted fansubbers


// Export to window
NyaaJS.Model = Model;


//============================================================================
//============================================================================
//============================================================================

})(NyaaJS);
