var app = {};

/* Our global application state */
app.state = {};

app.state.isAdvancedSearch = false;
app.state.isShowResults = false;
app.state.results = [];
app.state.query = {};

/* @function redraw
*  @param (Object) state : global app state object
*  @param (Function) next() : optional callback
*  @return (none)
*  @async false
*  @details Redraws the application view given the application state.
*/
app.redraw = function(state, next) {
	// @TODO set .val of search bar to query.desiredSeats

	// advanced search
	if (app.state.isAdvancedSearch) {
		$('#advancedSearch').removeClass('hidden');
		$('.advancedSearchToggle').html('Advanced Search ^');
	} else {
		$('#advancedSearch').addClass('hidden');
		$('.advancedSearchToggle').html('Advanced Search >>');
	}

	//@TODO: set form values to appropriate values

	if (next) {
		next();
	}

}

// BEGIN QUERY LOGIC

app.query = {};

app.query.defaultDesiredSeats = 1;

/* An example query with (possibly) all attributes specified.
 * (We don't need a default query. We just won't apply the
 * filters for attributes that aren't included in the query.)
 *
 * TODO: change which attributes could be in query?
 *      do we want id? name?
 *      how do chairs/comfy_chairs/desiredSeats work?
 *      which are free ___s and which are total ___s?
 */
app.query.exampleQuery = {
	chairs: 1,
	comfy_chairs: 1,
	tables: 1,
	whiteboard_tables: 1,
	whiteboard: true,
	outlets: 0,
	floor: [6,7,8,9],
	quiet: true,
	desiredSeats: 1
};


// Filter functions (incomplete)
//
// TODO:
// change some functions to check for the number of free ___s instead of the number of total ___s
// make sure function(s) dealing with chairs/comfy_chairs/desiredSeats are what we want
// add function(s) to filter by area name and/or id
// more?


/* @function filterTables
*  @param (int) tableNum : the number of tables for a desired area to have
*  @return (bool) *unnamed* : whether the area has enough total (not necessarily free) tables
*  @async false
*  @details Checks whether an area has at least the number of tables given
*
*  NOTE: whiteboard_tables ARE considered tables for this function.
*  TODO: change to FREE tables?
*/
app.query.filterTables = function (tableNum) {
    return function (area) {
        return (area.tables + area.whiteboard_tables) >= tableNum;
    }
}

/* @function filterWbTables
*  @param (int) wbTableNum : the number of whiteboard_tables for a desired area to have
*  @return (bool) *unnamed* : whether the area has enough total (not necessarily free) whiteboard_tables
*  @async false
*  @details Checks whether an area has at least the number of whiteboard_tables given
*
*  TODO: change to FREE whiteboard_tables?
*/
app.query.filterWbTables = function (wbTableNum) {
    return function (area) {
        return area.whiteboard_tables >= wbTableNum;
    }
}

/* @function filterWhiteboard
*  @param (bool) board : whether a whiteboard is desired (true) or not (false)
*  @return (bool) *unnamed* : whether the area has a whiteboard if wanted or
*       doesn't have a whiteboard if unwanted
*  @async false
*  @details Checks whether an area has the "status" of whiteboard desired.
*
*  NOTE: whiteboard_tables are NOT considered whiteboards for this function.
*/
app.query.filterWhiteboard = function (board) {
    return function (area) {
        return area.whiteboard === board;
    }
}

/* @function filterOutlets
*  @param (int) outletNum : the number of outlets for a desired area to have
*  @return (bool) *unnamed* : whether the area has enough total (not necessarily free) outlets
*  @async false
*  @details Checks whether an area has at least the number of outlets given
*/
app.query.filterOutlets = function (outletNum) {
    return function (area) {
        return area.outlets >= outletNum;
    }
}

/* @function filterFloor
*  @param (Array) floorArray : the acceptable floors for a desired area to be on
*  @return (bool) *unnamed* : whether the area is on one of the desired floors or not
*  @async false
*  @details Checks whether an area is on any of the floors given in an array of floors
*/
app.query.filterFloor = function (floorArray) {
    return function (area) {
        return floorArray.indexOf(area.floor) !== -1;
    }
}

/* @function filterQuiet
*  @param (bool) quiet : whether a quiet area is desired (true) or not (false)
*  @return (bool) *unnamed* : whether the area is a quiet area if wanted or
*       not if unwanted
*  @async false
*  @details Checks whether an area has the "status" of quiet area desired
*/
app.query.filterQuiet = function (quiet) {
    return function (area) {
        return area.quiet === quiet;
    }
}

/* @function filterSeats
*  @param (int) desiredSeats : the number of free seats for a desired area to have
*  @return (bool) *unnamed* : whether the area has enough free seats
*  @async false
*  @details Checks whether an area has at least the number of free seats given. Includes
*       both chairs and comfy_chairs.
*
*  NOT SURE THIS IS RIGHT SINCE IDK WHY WE HAVE chairs, comfy_chairs, AND desiredSeats
*/
app.query.filterSeats = function (desiredSeats) {
    return function (area) {
        var totalSeats = area.chairs + area.comfy_chairs;
        return (totalSeats - area.current_occupants) >= desiredSeats;
    }
}


// overall Filter function

/* @function performQuery
*  @param (Object) query : the query string to perform
*  @return (Object) filtered : the filtered result list to display
*  @async false
*  @details Performs a query- filters the area list based on the
*       query and returns a result list.
*
*       CURRENTLY INCOMPLETE- ONLY FILTERS BY floor, chairs, whiteboard
*/
app.performQuery = function(query) {
	var exists = function (x) {
        return x != null && x != undefined;
    }
    var filtered = app.areaList;
    if (exists(query.tables)) {
        filtered = filtered.filter(app.query.filterTables(query.tables))
    }
    if (exists(query.whiteboard_tables)) {
        filtered = filtered.filter(app.query.filterWbTables(query.whiteboard_tables))
    }
    if (exists(query.whiteboard)) {
        filtered = filtered.filter(app.query.filterWhiteboard(query.whiteboard))
    }
    if (exists(query.outlets)) {
        filtered = filtered.filter(app.query.filterOutlets(query.outlets))
    }
    if (exists(query.floor)) {
        filtered = filtered.filter(app.query.filterFloor(query.floor))
    }
    if (exists(query.quiet)) {
        filtered = filtered.filter(app.query.filterQuiet(query.quiet))
    }
    if (exists(query.desiredSeats)) {
        filtered = filtered.filter(app.query.filterSeats(query.desiredSeats))
    }
    return filtered;
}


// END QUERY LOGIC


/* @function updateObject
*  @param (Object) obj
*  @param (Function) next(err,obj): optional callback function that recieves the error or updated object
*  @return (none)
*  @async true
*  @details If obj.dirty===true, then constructs a server query to
*  update the object, sets obj.dirty to false, and calls callback if given
*/
app.updateObject = function(obj, next) {
	if (next) {
		next(null, {});
	}
}

/* @function init
*  @param (none)
*  @return (none)
*  @async true
*  @details Miscellaneous app initialization, binding of callbacks to HTML
*/
app.init = function() {
	// search bar
	$('#contentForm input[name="desiredSeats"]')
		.attr("placeholder", app.query.defaultDesiredSeats);

	// advanced search
	var advancedSearchToggle = function (e) {
		e.preventDefault();
		app.state.isAdvancedSearch = !app.state.isAdvancedSearch;
		app.redraw();
	}

	$('.advancedSearchToggle').on('click', advancedSearchToggle);

	// results

    app.areaList = app.fakeData;

	// redraw our application
	app.redraw(app.state, function() {
		console.log('App initialized!');
	});
}


/* Register app.init to be called when page loads */
$(app.init);

app.fakeData = [
{
	id: 1,
	chairs: 4,
	comfy_chairs: 2,
	tables: 1,
	whiteboard_tables: 0,
	whiteboard: false,
	outlets: 4,
	floor: 9,
	quiet: true,
	name: 'Gates 9 by elevator',
	last_updated: 1427655295469,
	current_occupants: 0,
	dirty: false
},
{
	id: 2,
	chairs: 12,
	comfy_chairs: 2,
	tables: 3,
	whiteboard_tables: 2,
	whiteboard: true,
	outlets: 8,
	floor: 6,
	quiet: true,
	name: 'Gates 6 by Pausch Bridge',
	last_updated: 1427655295469,
	current_occupants: 4,
	dirty: false
},
{
	id: 3,
	chairs: 0,
	comfy_chairs: 3,
	tables: 1,
	whiteboard_tables: 0,
	whiteboard: false,
	outlets: 2,
	floor: 8,
	quiet: true,
	name: 'Gates 8 by Staircase',
	last_updated: 1427655295469,
	current_occupants: 0,
	dirty: false
},
{
	id: 4,
	chairs: 6,
	comfy_chairs: 0,
	tables: 2,
	whiteboard_tables: 0,
	whiteboard: true,
	outlets: 0,
	floor: 7,
	quiet: true,
	name: 'Gates 7 by elevator',
	last_updated: 1427655295469,
	current_occupants: 4,
	dirty: false
}
]
