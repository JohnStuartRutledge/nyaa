

// append three new methods to the localstorage object
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    var object = value && JSON.parse(value);
    if (typeof object == 'string') {
        object = object && JSON.parse(object);
    }
    return object;
};

Storage.prototype.removeObject = function (key) {
    this.removeItem(key);
};

// create db object
var db = {
    store: function (key, object) {
      localStorage.setObject(key, object);
    },
    retrieve: function (key) {
      return localStorage.getObject(key);
    },
    remove: function () {
      localStorage.removeObject(key);
    },
    exists: function (key) {
      var obj = localStorage.getObject(key);
      return !!obj && !!Object.keys(obj).length;
    },
    clear: function () {
      localStorage.clear();
    }
};


function Table (table_name, db_name, table_data) {
    if (!table_data) table_data = {};
    this.table_name = table_name;
    this.db_name = db_name;
    this.table_data = table_data;
}

Table.prototype.save = function(new_db) {
    db.store(this.db_name, new_db);
    var mydb = db.retrieve(this.db_name);
    this.table_data = mydb[this.table_name];
    return this;
};

Table.prototype.add = function(table_data) {
    if (typeof table_data !== 'object') {
        throw new Error('Expecting an object but got '+ typeof table_data)
    }
    var mydb = db.retrieve(this.db_name);
    mydb[this.table_name].push(table_data);
    return this.save(mydb);
};

Table.prototype.get = function(idx) {
    var mydb = db.retrieve(this.db_name);
    var table = mydb[this.table_name];
    if (Object.keys(table).length < 1) throw new Error('The database is empty');
    if (idx) {
        if (!table[idx-1]) throw new Error('No record exists at that index');
        return table[idx-1];
    }
    return table;
};

Table.prototype.update = function(idx, table_data) {
    if(!idx) throw new Error('You did not provide a record index');
    if(!table_data) throw new Error('No data was given to update table with');
    var old_data = this.get(idx);
    // make sure new_data has same keys and number of fields
    var oldKeys = JSON.stringify(Object.keys(old_data).sort());
    var newKeys = JSON.stringify(Object.keys(table_data).sort());
    if (!(oldKeys === newKeys)) {
        throw new Error('The fields in your records do not match!');
    }
    // replace the record
    var mydb = db.retrieve(this.db_name);
    mydb[this.table_name][idx-1] = table_data;
    return this.save(mydb);
};

Table.prototype.remove = function(idx) {
    if(!idx) throw new Error('You did not provide a record index to remove');
    var old_data = this.get(idx); // make sure the record exists
    var mydb = db.retrieve(this.db_name);
    mydb[this.table_name].splice(idx-1, 1);
    return this.save(mydb);
};

Table.prototype.find = function(field, query) {
    // try and locate the index of the data being searched for
    if (!field) throw new Error('find() must include the field you wish to search on.');
    if (!query) throw new Error('find() must include a query to search on');
    var table = this.get();
    var fields = JSON.stringify(Object.keys(table[0]));
    if (fields.indexOf(field) < 1) throw new Error(field+' Does not exist');

    var matches = [];
    for (var idx in table) {
        for (var table_field in table[idx]) {
            if (field === table_field) {
                if (JSON.stringify(table[idx][field]).indexOf(query) !== -1) {
                    matches.push(table[idx]);
                }
            }
        }
    }
    return matches;
};




function MyDB (db_name) {
    if (!db_name) throw new Error('Please provide a name for the db');
    // create a namespaced object
    db.store(db_name, {});
    this.db_name = db_name;
    this.tables = [];
}

MyDB.prototype.create_table = function(table_name, data) {
    if (!table_name) throw new Error('Please specify a table name');
    // set the object
    var mydb = db.retrieve(this.db_name);
    mydb[table_name] = data || [];
    db.store(this.db_name, mydb);
    this.tables.push(table_name);
    return new Table(table_name, this.db_name);
};

MyDB.prototype.get_table = function(table_name) {
    if (!table_name) throw new Error('Please specify a table name');
    var mydb = db.retrieve(this.db_name);
    if (!mydb[table_name]) throw new Error('Table: "'+table_name+'" does not exist!');
    var table = new Table(table_name, this.db_name, mydb[table_name]);
    return table;
    //return mydb[table_name];
};

MyDB.prototype.remove_table = function(table_name) {
    if (!table_name) throw new Error('Please specify a table_name to remove');
    var index = this.tables.indexOf(table_name); // remove fromtables 
    if (index < 0) throw new Error('Table does not exist');
    // remove just the table you want then resave the db without it
    this.tables.splice(index, 1);
    var mydb = db.retrieve(this.db_name);
    delete mydb[table_name];
    db.store(this.db_name, mydb);
    return this;
};

MyDB.prototype.clear_table = function (table_name) {
    if (!table_name) throw new Error('Missing name of table to clear!');
    // remove from the db
    var mydb = db.retrieve(this.db_name);
    mydb[table_name] = [];
    db.store(this.db_name, mydb);
    return this;
};

