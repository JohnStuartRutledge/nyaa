
/*============================================================================
//                        UNIT TESTS FOR NYAA.JS
//============================================================================
http://net.tutsplus.com/tutorials/javascript-ajax/how-to-test-your-javascript-code-with-qunit/

http://api.qunitjs.com/category/assert/
assert.ok             // passes if argument is truthy 
assert.equal          // == 
assert.notEqual       // !==
assert.strictEqual    // ===
assert.notStrictEqual // !===
assert.DeepEqual      // nested object comparison. Arrays, objs, regex, functs
assert.notDeepEqual   // reverse of DeepEqual
assert.raises         // test if callback throws error

expect(0);  // equivalent to python pass statment. 

//----------------------------------------------------------------------------

// testing specific function
test('isEven()', function() { 
    ok( isEven(0),  'Zero is an even number'); 
    ok( isEven(2),  'So is two'); 
    ok( isEven(-4), 'So is negative four'); 
    ok(!isEven(1),  'One is not an even number'); 
    ok(!isEven(-7), 'Neither is negative seven');  
});

// testing objects and arrays. same() uses ===
test('test', function() {
    equal(1, 1, 'one equals one');
    deepEqual({}, {}, 'obj equals obj');
    deepEqual({a:1}, {a:1}, '{a:1} === {a:1}');
    deepEqual([], [], '[] === []');
    equal(0, false, '0 == false');
    equal(null, undefined, 'null == undefined');
    //deepEqual(  null, undefined, 'null === undefined');
});

// more complex example
test("a test", function(assert) {
    function square(x) { return x * x; }
    var result = square(2);
    assert.equal(result, 4, "square(2) equals 4");
});

*/

var fixtures = [
    {fansubber: 'HorribleSubs', title: 'Naruto Shippuuden', fidelity: '720', air_day: 'thu', animeplanet: 'naruto-shippuden'},
    {fansubber: 'Leopard-Raws', title: '', fidelity: '', air_day: '', animeplanet: ''},
    {fansubber: 'S.N', title: '_Shingeki_no_Kyojin_', fidelity: '', air_day: '', animeplanet: ''},
    {fansubber: '초다링-Raws', title: 'Love Lab', fidelity: '', air_day: '', animeplanet: ''},
    {fansubber: '', title: '', fidelity: '', air_day: '', animeplanet: ''},
    {fansubber: '', title: '', fidelity: '', air_day: '', animeplanet: ''},
    {fansubber: '', title: '', fidelity: '', air_day: '', animeplanet: ''},
];


//============================================================================
//
//                             DB.js Tests
//
//============================================================================

var testdb,
    mydb,
    mytable;

module('DB.js', {
    setup: function() {
        // create a test database
        db.store('test_db', {});
        db.store('test_db2', {});
        testdb = db.retrieve('test_db');

        mydb = new MyDB('TestDB');
        mydb.create_table('table1', {'uno': 'one'});
        mydb.create_table('table2', [
            {'uno':'one'}, {'dos':'two'}, {'san':'three'}]);
        mytable = mydb.create_table('table3');
    },
    teardown: function() {
        db.remove('test_db'); // remove the test database
        db.remove('test_db2');
        db.remove('TestDB');
        delete testdb;
        delete mydb;
        delete mytable;
    }
});

//----------------------------------------------------------------------------
// DB Object
//----------------------------------------------------------------------------

test("db.store()", function() {
    strictEqual(db.exists('test_db'), true, 'can create new databases');
});

test("db.exists()", function() {
    strictEqual(db.exists('test_db'), true, 'db.exists() returns true');
});

test("db.empty()", function() {
    strictEqual(db.empty('test_db'), true, 'db.empty() checks if db === {}');
});

test("db.retrieve()", function() {
    var result = db.retrieve('test_db');
    deepEqual(result, {}, 'can retrive the database tables');
});

test("db.remove()", function() {
    db.remove('test_db');
    strictEqual(db.exists('test_db'), false, 'test_db was removed');
    // make sure it only removed the test_db
    strictEqual(db.exists('test_db2'), true, 'test_db2 still exists');
});

test("db.clear()", function() {
    expect(0); 
    //db.clear();
    //strictEqual(db.exists('test_db'), false, 'test_db was removed');
    //strictEqual(db.exists('test_db2'), false, 'test_db2 was removed');
});

//----------------------------------------------------------------------------
// myDB methods
//----------------------------------------------------------------------------
test("myDB()", function() {
    ok(mydb, 'MyDB.create_table() properly creates a new table in the DB');

    raises(function() { MyDB(); },
    Error, "raise error when initializing DB without a name");

});

test("myDB.create_table", function() {
    var test_table = mydb.create_table('test_table');
    strictEqual(test_table.table_name, 'test_table', 'testing create_table method');

    // make sure you can create a table with data object
    var table1 = mydb.get_table('table1'),
        table2 = mydb.get_table('table2');

    deepEqual(table1.table_data, [{'uno':'one'}],
        "data parameter accepts a single object {key: val}");

    // make sure you can create a table with lots of data in array
    deepEqual(table2.table_data, 
    [{'uno':'one'}, {'dos':'two'}, {'san':'three'}],
    "data parameter accepts array with multilple data objects");

    raises(function() { mydb.create_table(); },
    Error, "raise error when forgetting to specifiy the table name");

});

test("myDB.list_tables", function() {
    deepEqual(mydb.list_tables(), ["table1", "table2", "table3"],
        "list_tables() method returns array of table names");
});

test("myDB.get_table", function() {
    var table = mydb.get_table('table1');
    strictEqual(table.table_name, 'table1', 
        'get_table() method properly returns the table object');

    raises(function() { mydb.get_table(); },
    Error, 
    "throws error when calling get_table() without a name parameter");

    raises(function() { mydb.get_table('adlkjadfkljadfj'); },
    DoesNotExistError, 
    "throws DoesNotExistError when calling get_table() with non-existant name");
});

test("myDB.table_exists", function() {
    raises(function() { mydb.table_exists(); }, Error, 
    "throws error if called without the table_name parameter");

    strictEqual(mydb.table_exists('table1'), true, 
        'return true if table exists');

    strictEqual(mydb.table_exists('non_existant'), false,
        'return false if table does not exist');
});

test("myDB.remove_table", function() {
    mydb.remove_table('table1');
    deepEqual(mydb.list_tables(), ["table2", "table3"],
        "remove_table() properly removes the table from the DB");

    raises(function() { mydb.remove_table(); }, Error, 
        "raises error if missing table name to remove");

    raises(function() { mydb.remove_table('adfljadlfjdf'); },
        DoesNotExistError, 
        "raise error if table_name does not exist in the DB");
});

test("myDB.clear_table", function() {
    mydb.clear_table('table1');
    var table = mydb.get_table('table1');

    deepEqual(table.table_data, [], 'table data was properly deleted');

    raises(function() { mydb.clear_table('scoobydoo'); },
    DoesNotExistError, 
    "raise error if the table name you want cleared does not exist in the DB");
});

//----------------------------------------------------------------------------
// Table Object
//----------------------------------------------------------------------------

test("Table", function() {
    // check if you can create a table object
    raises(function() { var test_table = new Table(); },
    Error, 
    "Checking to make sure you can not instantiate a table w/out a name");

    // check to make sure a table object gets created
    var test_table = new Table('mine_table', 'mine_db')
    strictEqual(
        test_table.table_name + test_table.db_name,
        'mine_tablemine_db',
        'make sure table object gets instantiated properly');
});

test("Table.save(new_db)", function() {
    // check ff saves to the existing database when no parameters given
    var savedb = db.retrieve('TestDB'),
        result = mytable.save(savedb);
    strictEqual(result.table_name+result.db_name, 'table3TestDB',
        'save() method returns the table for the proper database');

    // TODO
    // add ability to save the table to a different DB

});

test("Table.add(table_data, unique)", function() {

    // make sure that tyring to add non-object types to the DB raises error
    raises(function() { mytable.add('string'); },
        Error, 
        "trying to add a string to the database raises error");
    raises(function() { mytable.add(5); },
        Error, 
        "trying to add a number to the database raises error");

    // make sure you can add objects to the database
    var result = mytable.add({'one':1});
    deepEqual(result.table_data, [{'one':1}],
    'add a single object to the table');

    // make sure you can add an array of objects to the database
    var result = mytable.add( [ {'two':2}, {'three':3} ] );
    deepEqual(result.table_data, [{'one':1}, {'two':2}, {'three':3}],
    'add an array of objects to the table.');

    // adding duplicate data raises an error
    raises(function() { mytable.add({'one':1}); },
        Error,
        "adding duplicate data causes an error");

    // if unique is false, make sure you can submit duplicate data
    var result = mytable.add({'one':1}, false);
    deepEqual(result.table_data, [{'one':1}, {'two':2}, {'three':3}, {'one':1}],
    'if unique is set to false, you can add duplicate data');
});

test("Table.get(idx)", function() {
    var table = mydb.get_table('table2');

    // make sure that if you don't specify an idx it returns all data
    deepEqual(table.get(), [{'uno':'one'}, {'dos':'two'}, {'san':'three'}],
        'if .get() is called without index parameter, all data is returned');

    // make sure calling with an index returns the proper data
    deepEqual(table.get(1), {'uno':'one'},
        '.get(idx) returns the data object at that index');

    // make sure calling a non-existant index throws an error
    raises(function() { table.get(99); }, DoesNotExistError,
        "calling a non-existant index throws an error");
});

test("Table.update(idx, table_data)", function() {
    var table = mydb.get_table('table2');

    raises(function() { table.update(); }, Error,
        "throws error if missing index parameter");

    raises(function() { table.update(1); }, Error,
        "throws error if missing table_data parameter");

    raises(function() { table.update(99); }, Error,
        "throws error when calling a non-existant index");

    raises(function() { table.update(1, {'shark':'robot'}); }, Error,
        "throw error if existing.datas.keys !== updated.datas.keys");

    var result_table = table.update(2, {'dos':'robot'});
    var updated_data = result_table.get(2);
    deepEqual(updated_data, {'dos':'robot'},
        'table data can be successfully updated');

});

test("Table.remove(idx)", function() {
    var table = mydb.get_table('table2');

    raises(function() { table.remove(); }, Error,
        "throws error if missing index parameter");

    raises(function() { table.remove(99); }, DoesNotExistError,
        "calling a non-existant index throws an error");

    table.remove(2);
    deepEqual(table.get(), [{'uno':'one'}, {'san':'three'}],
        'calling remove properly deletes the item from the array');
});

test("Table.find(field, query)", function() {
    var table = mydb.get_table('table2');

    raises(function() { table.find(); }, Error,
        "throws error if missing field parameter");

    raises(function() { table.find('uno'); }, Error,
        "throws error if missing query parameter");

    raises(function() { table.find('slinky', 'robot'); }, DoesNotExistError,
        "searching for a non-existant field throws an error");

    deepEqual(table.find('uno', 'bob'), [],
        'when your query is not matched, an empty array is returned');

    deepEqual(table.find('uno', 'one'), [0],
        'records indexes that match your query are returned in an array');
});



//============================================================================
//
//                            Nyaa.js Tests
//
//============================================================================

var nyaa_settings, anime1, anime2, anime3, anime4, anime5;

module('options.js', {
    setup: function() {
        // create a test database
        mydb = new MyDB('test_db');
        mytable = mydb.create_table('anime_table');
        nyaa_settings = {
            'english_only':true, 'nightmode':true, 'animeplanet':true
        }

        //mytable = mydb.get_table('anime_table'),
        //mytable.table_data 
    },
    teardown: function() {
        db.remove('test_db');
        delete mydb;
        delete mytable;
    }
});

// Anime - Create 
test('Anime Object', function() {

    anime1 = new Anime('HorribleSubs', 'Naruto', '720p', 'sun', 'naruto');
    strictEqual(anime1.stringify(), 'HorribleSubs Naruto 720p sun naruto',
        'anime objects are properly instantiated');

    raises(function() { var x = new Anime('HorribleSubs')}, Error,
        "throw error if Anime is missing its main_title field");
    /*
    anime2 = new Anime(null, 'gantz', 'none', '?');
    strictEqual(anime2.stringify(), 'gantz ?',
        "make sure that Anime default arguments work");

    anime3 = new Anime('A', 'B', '720p', 'sun', 'http://www.anime-planet.com/anime/naruto');
    strictEqual(anime3.stringify(), 'A B 720p sun naruto',
        "remove url from animeplanet parameter");

    anime4 = new Anime('A', 'B', '720p', 'sun', 'naruto shippuden');
    strictEqual(anime4.stringify(), 'A B 720p sun naruto-shippuden',
        "replace spaces with dashes in animeplanet parameter");
    */

});

// Anime - edit

// Anime - save

// Anime - update

// Anime - delete

// Anime - to_table

// Anime - to_form


//============================================================================
//
//                           Contentscript.js
//
//============================================================================
//module('contentscript.js');


