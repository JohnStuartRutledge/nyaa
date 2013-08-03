
var NyaaJS = {};

(function (NyaaJS) {

//var storage = chrome.storage.local;
var storage = (localStorage) ? localStorage : chrome.storage.local;

//----------------------------------------------------------------------------
// 							     HELPERS
//----------------------------------------------------------------------------

makeGUID = function() {
    // Create a Globally Unique Identifier to build unique ID's 
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = (c == 'x') ? r : (r&0x3|0x8);
        return v.toString(16);
    }).toUpperCase();
};

//----------------------------------------------------------------------------
// 							 BASIC CRUD APP 
//----------------------------------------------------------------------------

function Store(name, callback) {
	// Create a new client side storage object and an empty collection
	//   @name     : name of the database AKA client side storage object
	//   @callback : callback function to fire when storage is complete
	var data, dbName;
	callback = callback || function () {};
	dbName   = this._dbName = name;

	if (!storage[dbName]) {
		// create default tables
		data = {
			animeList : [], 
			settings  : {
				english_only : false,
				night_mode   : false,
				animeplanet  : false
			} 
		};
		storage[dbName] = JSON.stringify(data);
	}
	callback.call(this, JSON.parse(storage[dbName]));
};

Store.prototype.find = function (query, callback) {
	// find items based on query given as JS object
	//   @query    : query to match against (i.e. {foo: 'bar'})
	//   @callback : callback to fire when query completed
	if (!callback) return;
	var animeList = JSON.parse(storage[this._dbName]).animeList;

	callback.call(this, animeList.filter(function (anime) {
		for (var q in query) {
			return query[q] === anime[q];
		}
	}));
};

Store.prototype.findAll = function (callback) {
	// Retrives all data from a collection
	//   @callback : the callback that fires on completion
	callback = callback || function () {};
	callback.call(this, JSON.parse(storage[this._dbName]).animeList);
};

Store.prototype.getSettings = function (callback) {
	// Retrives all the settings data from the animedb 
	//   @callback : the callback that fires on completion
	callback = callback || function () {};
	callback.call(this, JSON.parse(storage[this._dbName]).settings);
};

Store.prototype.saveSettings = function (new_settings, callback) {
	// save new settings into the animedb 
	//   @callback : the callback that fires on completion
	callback = callback || function () {};
	var data = JSON.parse(storage[this._dbName]);
	data.settings = new_settings;
	//storage[this._dbName].settings = JSON.stringify(new_settings);
	storage[this._dbName] = JSON.stringify(data);

	callback.call(this, JSON.parse(storage[this._dbName]).settings);
};

Store.prototype.save = function (id, updateData, callback) {
	// Save data to the DB. If no existing item, it creates a new one,
	// otherwise it'll simply update an existing item's properties
	//   @id         : (optional) ID of item to update
	//   @updateData : the data to save into the DB
	//   @callback   : callback to fire after saving
	var data      = JSON.parse(storage[this._dbName]),
		animeList = data.animeList;

	callback = callback || function () {};

	// TODO
	// check for duplicates and return error if anime matches on
	// fansubber + title + fidelity

	// If an ID was actually given, find the item and update each property
	if (typeof id !== 'object') {
		for (var i=0, len=animeList.length; i<len; i++) {
			if (animeList[i].id == id) {
				for (var x in updateData) {
					animeList[i][x] = updateData[x];
				}
			}
		}
		storage[this._dbName] = JSON.stringify(data);
		callback.call(this, JSON.parse(storage[this._dbName]).animeList);
	} else {
		// they are updating, so return the object
		callback   = updateData;
		updateData = id;

		// Generate an ID
		updateData.id = makeGUID();
		animeList.push(updateData);
		storage[this._dbName] = JSON.stringify(data);
		callback.call(this, [updateData]);
	}
};

Store.prototype.remove = function (id, callback) {
	// Remove an item matching the given ID from the DB
	//   @id       : ID of the item you want to remove
	//   @callback : callback function to fire after saving
	var data      = JSON.parse(storage[this._dbName]),
		animeList = data.animeList;

	for (var i=0, len=animeList.length; i<len; i++) {
		if (animeList[i].id == id) {
			animeList.splice(i, 1);
			break;
		}
	}

	storage[this._dbName] = JSON.stringify(data);
	callback.call(this, JSON.parse(storage[this._dbName]).animeList);
};

Store.prototype.drop = function (callback) {
	// Drops the entire DB in storage and starts fresh
	//   @callback : the callback function to fire on after dropping data
	storage[this._dbName] = JSON.stringify({animeList: []});
	callback.call(this, JSON.parse(storage[this._dbName]).animeList);
};

// Export to window
NyaaJS.Store = Store;

//============================================================================
//============================================================================
//============================================================================

})(NyaaJS);


// TODO
// make this file table agnostic. Currently it only works using the 
// animeList table in the DB.
