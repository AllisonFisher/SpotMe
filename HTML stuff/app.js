var app = {};

/* The default parameters for a query */
app.defaultQuery = {
	chairs: 1,
	comfy_chairs: 1,
	tables: 1,
	whiteboard_tables: 1,
	whiteboards: 1,
	outlets: 0,
	floor: '6789',
	quiet: true,
	availableSeats: 1
};

/* Our global application state */
app.state = {};

app.state.isAdvancedSearch = false;
app.state.isShowResults = false;
app.state.results = [];
app.state.query = {};

/* @function redraw 
*  @param (Function) next() : optional callback
*  @param (Object) state : global app state object
*  @return (none)
*  @async false
*  @details Redraws the application view given the application state.
*/
app.redraw = function(state, next) {
	// @TODO set .val of search bar to query.availableSeats

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

/* @function performQuery
*  @param (String) query : the query string to perform
*  @param (Function) next(err,data) : the callback function that recieves
*  an error or the JSON result of a query.
*  @return (none)
*  @async true
*  @details Performs a query. (Asks, recieves, passes along)
*/
app.performQuery = function(query, next) {
	if (next) {
		next(null, []);
	}
}


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
	$('#contentForm input[name="availableSeats"]')
		.attr("placeholder", app.defaultQuery.availableSeats);

	// advanced search
	var advancedSearchToggle = function (e) {
		e.preventDefault();
		app.state.isAdvancedSearch = !app.state.isAdvancedSearch;
		app.redraw();
	}

	$('.advancedSearchToggle').on('click', advancedSearchToggle);
	
	// results

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
	whiteboards: 0,
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
	whiteboards: 1,
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
	whiteboards: 0,
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
	whiteboards: 1,
	outlets: 0,
	floor: 7,
	quiet: true,
	name: 'Gates 7 by elevator',
	last_updated: 1427655295469,
	current_occupants: 4,
	dirty: false
}
]