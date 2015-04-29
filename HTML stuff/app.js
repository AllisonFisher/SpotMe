var app = {};

/* Our global application state */
app.state = {};

app.state.isAdvancedSearch = false;
app.areaList = [];

app.decrementAreaFactory = function (areaName) {
	return function () {
        var q = app.buildQuery();
 	    var results = app.performQuery(q);
        results = results.sort(
                function (area1,area2) {
                    return area1.name - area2.name;
                });
        var num = q.desiredSeats;

		area = app.areaList.filter(function (x) { return x.name.toString() === areaName.toString(); })[0];
        var areaIdx = results.indexOf(area);


        var newNum = document.getElementsByClassName("confirmDesiredSeats")[areaIdx];
        var opt = document.getElementsByClassName("spotOption")[areaIdx];

        if (newNum !== null && newNum.value.length >= 1) {
            var num = parseInt(newNum.value, 10);
        }
        switch (opt.value) {
            case "Checking in" :
                area.current_occupants += num;
                area.current_occupants = Math.min(area.current_occupants, area.chairs);
                break;
            case "Checking out" :
                area.current_occupants -= num;
                area.current_occupants = Math.max(area.current_occupants, 0);
                break;
            case "Reporting" :
                area.current_occupants = num;
                if (area.current_occupants < 0) {
                    area.current_occupants = 0;
                }
                if (area.current_occupants > area.chairs) {
                    area.current_occupants = area.chairs;
                }
        }
		app.redraw();
	}
}

// BEGIN CODE FOR DISPLAYING RESULTS

/* @function drawPic
*  @param (area) : a single area
*  @return (String) : the html code for diplaying area.pic (a picture)
*  @async true?
*  @details Returns the string to put in the html code to display and area's pic.
*/
app.drawPic = function (area) {
    var picStr = area.pic;
    return '<img src='+picStr+' />'
}

/* @function toYesNo
*  @param (bool) : any bool
*  @return (string) : 'Yes' for true or 'No' for false
*  @async true?
*  @details Translates true/false to the more natural Yes/No for readability.
*/
app.toYesNo = function (tf) {
    if (tf === true) { return 'Yes';}
    else { return 'No';}
}

/* @function drawArea
*  @param (area) : a single area
*  @return (String) : the html code for diplaying the desired attributes of a given area
*  @async true?
*  @details Returns the string to put in the html code to display a
*       bunch of things about the area.
*/
app.drawArea = function (area) {

    // strings of area attributes

    var pic = app.drawPic(area);
    var name = area.name.toString();
    var floor = area.floor.toString() + 'th floor';
    var description = 'TODO: we need a description...';
    var spaceLeft = area.chairs - area.current_occupants;
    var openSeats = 'Open seats: ' + spaceLeft.toString();
    var current = 'Current occupancy: ' + area.current_occupants.toString();
    var chairs = 'Total chairs: ' + area.chairs.toString();
    var comfyChairs = ', including ' + area.comfy_chairs.toString() + ' comfy chairs';
    var tables = 'Total tables: ' + area.tables.toString();
    var wbTables = ', including ' + area.whiteboard_tables.toString() + ' whiteboard tables';
    var outlets = 'Total outlets: ' + area.outlets.toString();
    var whiteboard = 'Whiteboard: ' + app.toYesNo(area.whiteboard);
    var quiet = 'Quiet study: ' + app.toYesNo(area.quiet);
    var areaInfoList =
        '<li>' + pic + '<div>'
        + '<h2>' + name + '</h2>' +
        floor + '<br />' +
        description +
        '<br /><br /' +
        '<p><b>' + openSeats + '</b><br />'+
        '<b>' + current + '</b></p>' +
        chairs + comfyChairs + '<br />' +
        tables + wbTables + '<br />' +
        outlets + '<br />' +
        whiteboard + '<br />' +
        quiet + '<br /><br />'

    // button stuff

    var id = area.name;
    var defaultNumPpl = app.buildQuery().desiredSeats; // default # of ppl to check in/out
    var buttonString =
        '<form class="submitForm"> <select class="spotOption">' +
            '<option>Checking in</option>' +
            '<option>Checking out</option>' +
            '<option>Reporting</option>' +
        '</select>' +
        ' <input type="text" class="confirmDesiredSeats" placeholder="'
            + defaultNumPpl.toString() + '" /> people. </form>' +
        '<button class="spotMeButton" onclick=app.decrementAreaFactory("' + id + '")()> SpotMe! </button>'

    var toReturn = areaInfoList + buttonString + '</div></li>';
    return toReturn;
}

/* @function drawResults
*  @param (array)
*  @return (String) : a string version of html code for the array, which is assumed to be the results list
*  @async true?
*  @details Returns an html version of the results list so that we can display it.
*/
app.drawResults = function (res) {
    var strArray = res.map(app.drawArea);
    return strArray.join(''); // removes commas between elements of array
}

// END CODE FOR DISPLAYING RESULTS


// BEGIN QUERY LOGIC

app.query = {};

app.query.defaultDesiredSeats = 1;

/* An example query with (possibly) all attributes specified.
 * (We don't need a default query. We just won't apply the
 * filters for attributes that aren't included in the query.)
 *
 * TODO: change which attributes could be in query?
 *      do we want id? name? other?
 */
app.query.defaults = {
	chairs: 1,
	comfy_chairs: 0,
	tables: 0,
	whiteboard_tables: 0,
	whiteboard: false,
	outlets: 0,
	floor: [6,7,8,9],
	quiet: true,
	desiredSeats: 1
};

// Filter functions

/* @function filterTables
*  @param (int) tableNum : the number of tables for a desired area to have
*  @return (bool) *unnamed* : whether the area has enough total (not necessarily free) tables
*  @async false
*  @details Checks whether an area has at least the number of tables given
*
*  NOTE: whiteboard_tables ARE considered tables for this function.
*/
app.query.filterTables = function (tableNum) {
    return function (area) {
        return (area.tables + area.whiteboard_tables) >= tableNum;
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
*  @details Checks whether an area has at least the number of free seats given.
*           (Assumes area.chairs is the total number of seats.)
*/
app.query.filterSeats = function (desiredSeats) {
    return function (area) {
        var totalSeats = area.chairs;
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
*/
app.performQuery = function(query) {
	exists = function (x) {
        return x != null && x != undefined;
    }
    var filtered = app.areaList;
    if (exists(query.tables)) {
        filtered = filtered.filter(app.query.filterTables(query.tables))
    }
    if (exists(query.whiteboard)) {
        filtered = filtered.filter(app.query.filterWhiteboard(query.whiteboard))
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

/* @function buildQuery
*  @return (Object) : a query object
*  @async false?
*  @details : Serializes the info from the advanced search form. Builds a query object
*             and returns it.
*/
app.buildQuery = function() {
	var q = {};
	var formInfo = $('#contentForm').serializeArray();
	var isSelected = function(attr) {
		return formInfo.filter(function (elem) {return elem.name === attr}).length > 0;
	}

	var getSelected = function (attr) {
		return formInfo.filter(function (elem) {return elem.name === attr})[0].value;
	}

	if (isSelected("isAdvancedFloors")) {
		q.floor = [];
		isSelected("floor6") ? q.floor.push(6) : null;
		isSelected("floor7") ? q.floor.push(7) : null;
		isSelected("floor8") ? q.floor.push(8) : null;
		isSelected("floor9") ? q.floor.push(9) : null;
	}
	if (isSelected("isAdvancedQuietStudy")) {
		q.quiet = (isSelected("quietStudy") ? getSelected("quietStudy")==="yes" : null);
	}

	if (isSelected("isAdvancedWhiteboards")) {
		q.whiteboard = (isSelected("whiteboards") ? getSelected("whiteboards")==="yes" : null);
	}
	if (isSelected("desiredSeats")) {
		q.desiredSeats = getSelected("desiredSeats");
		if (q.desiredSeats.length < 1) {
			q.desiredSeats = app.query.defaults.desiredSeats;
		}
	}

	// Check if the confirmDesiredSeats value would override the current q.desiredSeats
	var confirmInfo = $('.confirmDesiredSeats').serialize();
	console.log(confirmInfo);

	return q;
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

/* @function redraw
*  @param (Object) state : global app state object
*  @param (Function) next() : optional callback
*  @return (none)
*  @async false
*  @details Redraws the application view given the application state.
*/
app.redraw = function(state, next) {


	// advanced search
	if (app.state.isAdvancedSearch) {
		$('#advancedSearch').removeClass('hidden');
		$('.advancedSearchToggle').html('Advanced Search ^');
	} else {
		$('#advancedSearch').addClass('hidden');
		$('.advancedSearchToggle').html('Advanced Search >>');
	}

	//@TODO: set form values to appropriate values

	// parse form and perform query

	var q = app.buildQuery();
	var results = app.performQuery(q);
    results = results.sort(
                function (area1,area2) {
                    return area1.name - area2.name;
                });

	// hide unnecessary form elements
	if (q.floor !== undefined && q.floor !== null) {
		$('.floorCheckboxes').removeClass('hidden');
	} else {
		$('.floorCheckboxes').addClass('hidden');
	}

	if (q.quiet !== undefined && q.quiet !== null) {
		$('.quietStudyCheckboxes').removeClass('hidden');
	} else {
		$('.quietStudyCheckboxes').addClass('hidden');
	}

	if (q.whiteboard !== undefined && q.whiteboard !== null) {
		$('.whiteboardCheckboxes').removeClass('hidden');
	} else {
		$('.whiteboardCheckboxes').addClass('hidden');
	}


	// Make the desiredSeats show up in each of the SpotMe text boxes
	$('.confirmDesiredSeats input').val(q.desiredSeats.toString());
    // This displays the actual results list under the "Results" heading.
    $('#resultsHeading').html('Results ('+results.length.toString() + ')');
    $('#resultList').html(app.drawResults(results));


	if (next) {
		next();
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
		.attr("placeholder", app.query.defaults.desiredSeats);

	var q = app.buildQuery();
	// confirm spotme text inputs
	//$('.confirmDesiredSeats')[0]   .attr("placeholder", 1);

	// advanced search
	var advancedSearchToggle = function (e) {
		e.preventDefault();
		app.state.isAdvancedSearch = !app.state.isAdvancedSearch;
		app.redraw();
	}

	$('.advancedSearchToggle').on('click', advancedSearchToggle);


	// search button
	var searchButtonBinding = function (e) {
		e.preventDefault();
		app.redraw();
	}

	$('.searchButton').on('click', searchButtonBinding);

    $('#contentForm').change(app.redraw);

    // Listener for changes to "desiredSeats" text input
    $('input[name=desiredSeats]').on('input', app.redraw);

   	/* End app.query logic */

	// results
	//app.areaList = jQuery.getJSON("/api/areas/")

	/* Initialize dummy data for display */
    app.areaList = app.realData;

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
	name: 9235,
	last_updated: 1427655295469,
	current_occupants: 0,
	dirty: false,
    pic: '"Pics/Gates 6/back left-0.JPG"'
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
	name: 6702,
	last_updated: 1427655295469,
	current_occupants: 4,
	dirty: false,
    pic: '"Pics/Gates 6/kitchen-0.JPG"'
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
	name: 8105,
	last_updated: 1427655295469,
	current_occupants: 0,
	dirty: false,
    pic: '"Pics/Gates 6/orange chairs-0.JPG"'
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
	name: 7438,
	last_updated: 1427655295469,
	current_occupants: 4,
	dirty: false,
    pic: '"Pics/Gates 7/kitchen-0.JPG"'
}
]

app.realData = [
{
	id: 0,
	chairs: 54,
	comfy_chairs: 24,
	tables: 11,
	whiteboard_tables: 0,
	whiteboard: false,
	outlets: 10,
	floor: 6,
	quiet: true,
	name: 6101,
	last_updated: Date.now(),
	current_occupants: 0,
	dirty: false,
    pic: '"Pics/Gates 6/orange chairs-0.JPG"'
},
{
	id: 1,
	chairs: 21,
	comfy_chairs: 3,
	tables: 5,
	whiteboard_tables: 2,
	whiteboard: true,
	outlets: 18,
	floor: 6,
	quiet: true,
	name: 6012,
	last_updated: Date.now(),
	current_occupants: 0,
	dirty: false,
    pic: '"Pics/Gates 6/back left-0.JPG"'
},
{
	id: 2,
	chairs: 10,
	comfy_chairs: 10,
	tables: 4,
	whiteboard_tables: 0,
	whiteboard: true,
	outlets: 8,
	floor: 6,
	quiet: false,
	name: 6210,
	last_updated: Date.now(),
	current_occupants: 0,
	dirty: false,
    pic: '"Pics/Gates 6/kitchen-0.JPG"'
},
{
	id: 3,
	chairs: 36,
	comfy_chairs: 7,
	tables: 3,
	whiteboard_tables: 0,
	whiteboard: false,
	outlets: 54,
	floor: 7,
	quiet: true,
	name: 7107,
	last_updated: Date.now(),
	current_occupants: 0,
	dirty: false,
    pic: '"Pics/Gates 7/big area under stairs-0.JPG"'
},
{
	id: 4,
	chairs: 9,
	comfy_chairs: 3,
	tables: 3,
	whiteboard_tables: 1,
	whiteboard: true,
	outlets: 8,
	floor: 7,
	quiet: true,
	name: 7012,
	last_updated: Date.now(),
	current_occupants: 0,
	dirty: false,
    pic: '"Pics/Gates 7/back left-0.JPG"'
},
{
	id: 5,
	chairs: 11,
	comfy_chairs: 0,
	tables: 6,
	whiteboard_tables: 0,
	whiteboard: true,
	outlets: 10,
	floor: 7,
	quiet: true,
	name: 7210,
	last_updated: Date.now(),
	current_occupants: 0,
	dirty: false,
    pic: '"Pics/Gates 7/kitchen-0.JPG"'
},
{
	id: 6,
	chairs: 5,
	comfy_chairs: 3,
	tables: 2,
	whiteboard_tables: 0,
	whiteboard: true,
	outlets: 8,
	floor: 8,
	quiet: false,
	name: 8025,
	last_updated: Date.now(),
	current_occupants: 0,
	dirty: false,
    pic: '"Pics/Gates 8/back right corner-0.JPG"'
},
{
	id: 7,
	chairs: 14,
	comfy_chairs: 3,
	tables: 4,
	whiteboard_tables: 2,
	whiteboard: true,
	outlets: 8,
	floor: 8,
	quiet: true,
	name: 8014,
	last_updated: Date.now(),
	current_occupants: 0,
	dirty: false,
    pic: '"Pics/Gates 8/back left-0.JPG"'
},
{
	id: 8,
	chairs: 19,
	comfy_chairs: 4,
	tables: 7,
	whiteboard_tables: 0,
	whiteboard: true,
	outlets: 8,
	floor: 8,
	quiet: true,
	name: 8210,
	last_updated: Date.now(),
	current_occupants: 0,
	dirty: false,
    pic: '"Pics/Gates 8/kitchen-0.JPG"'
},
{
	id: 9,
	chairs: 8,
	comfy_chairs: 0,
	tables: 4,
	whiteboard_tables: 0,
	whiteboard: true,
	outlets: 10,
	floor: 8,
	quiet: true,
	name: 8813,
	last_updated: Date.now(),
	current_occupants: 0,
	dirty: false,
    pic: '"Pics/Gates 8/elevator-0.JPG"'
},
{
	id: 10,
	chairs: 2,
	comfy_chairs: 2,
	tables: 1,
	whiteboard_tables: 0,
	whiteboard: true,
	outlets: 6,
	floor: 9,
	quiet: false,
	name: 9025,
	last_updated: Date.now(),
	current_occupants: 0,
	dirty: false,
    pic: '"Pics/Gates 9/back right corner-0.JPG"'
},
{
	id: 11,
	chairs: 9,
	comfy_chairs: 0,
	tables: 1,
	whiteboard_tables: 0,
	whiteboard: true,
	outlets: 8,
	floor: 9,
	quiet: true,
	name: 9012,
	last_updated: Date.now(),
	current_occupants: 0,
	dirty: false,
    pic: '"Pics/Gates 9/back left-0.JPG"'
},
{
	id: 12,
	chairs: 15,
	comfy_chairs: 0,
	tables: 3,
	whiteboard_tables: 0,
	whiteboard: true,
	outlets: 8,
	floor: 9,
	quiet: false,
	name: 9210,
	last_updated: Date.now(),
	current_occupants: 0,
	dirty: false,
    pic: '"Pics/Gates 9/kitchen-0.JPG"'
},
{
	id: 13,
	chairs: 3,
	comfy_chairs: 3,
	tables: 2,
	whiteboard_tables: 0,
	whiteboard: true,
	outlets: 10,
	floor: 9,
	quiet: true,
	name: 9813,
	last_updated: Date.now(),
	current_occupants: 0,
	dirty: false,
    pic: '"Pics/Gates 9/elevator-0.JPG"'
},
{
	id: 14,
	chairs: 4,
	comfy_chairs: 4,
	tables: 0,
	whiteboard_tables: 0,
	whiteboard: false,
	outlets: 8,
	floor: 9,
	quiet: false,
	name: 9122,
	last_updated: Date.now(),
	current_occupants: 0,
	dirty: false,
    pic: '"Pics/Gates 9/front right-0.JPG"'
}
]

