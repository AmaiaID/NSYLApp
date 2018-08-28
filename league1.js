hideAndShow("first");

var app = new Vue({
	el: '#app',
	data: {
		teams: [],
		matches: [],
		locations: [],
		specificLocation: {}, // To store the map corresponding to a specific team
		leaderBoard: [], // The leaders in the classification
		teamUpcomingGames: [] // the next matches
	},
	methods: {

		getUpcoming: function (team) {
			console.log(team);
			getUpcoming(team);
			hideAndShow("sixth");
		},
		getLocation: function (location) {
			getLocation(location);
			console.log(location);
			hideAndShow("seventh");
		},
		logOut: function () {

			logOut();
		},
		login: function () {
			login();
		},

		signIN: function () {
			signIN();
		}
	}
});

app.teams = data.teams;
app.matches = data.matches;
app.locations = data.locations;

sortPoints();

// The date stored the JSON has a different format, change the format to compare it to the current date.//
function reverseData(date) {
	var dd = date.slice(0, 2);
	var mm = date.slice(3, 5);
	var yyyy = date.slice(6, 10);
	return yyyy + "/" + mm + "/" + dd;
}

function getUpcoming(team) {
	var today = new Date();
	var filteredMatches = [];

	for (i = 0; i < app.matches.length; i++) {

		var gameDate = new Date(reverseData(app.matches[i].date));
		if ((app.matches[i].Team_a == team || app.matches[i].Team_b == team) && gameDate >= today) {
			filteredMatches.push(app.matches[i]);
		}
	}
	console.log(filteredMatches);
	app.teamUpcomingGames = filteredMatches;
}

function getLocation(location) {
	app.specificLocation = data.locations[location];
}

function sortPoints() {
	var sortedTeams = [];
	for (var i = 0; i < data.teams.length; i++) {
		sortedTeams.push(data.teams[i]);
	}

	var teamsd = sortedTeams.sort(function (a, b) {
		if (a.points > b.points) {
			return -1;
		} //return -1:  put a before b
		else if (a.points < b.points) {
			return 1;
		} // return 1= put b before a  // Return 0= no change 
		else { // If return=0 , order the number of games from minor to major. 
			var gamesA = a.won + a.lost + a.draw;
			var gamesB = b.won + b.lost + b.draw;
			return gamesA - gamesB; // Order them from minor to major.  THis is giving back the team who has played less matches, we want this to be on top of the classification in case they have the same number of points.
		}
	});
	console.log(teamsd);
	app.leaderBoard = teamsd;
}

function logOut() {
	firebase.auth().signOut().then(function () {
		console.log("Sign-out successful.");

	}).catch(function (error) {
		// An error happened.
		console.log("An error happened.");

	});
}

/** ------------Hide and Show each page----------------------*/
function hideAndShow(id) {
	var x = document.querySelectorAll("div[data-pages]"); //to select all the data attributes that are named "data-pages"
	for (var i = 0; i < x.length; i++) {
		//   if (x[i].style.display === "none") {
		//        x[i].style.display = "block";
		//    } else {
		//        x[i].style.display = "none";
		//    } 
		x[i].style.display = "none"
	}

	var div = document.getElementById(id);
	div.style.display = "block";

	if (id == "ninth") {
		getMap();
	}

	if (id == "second") {
		document.getElementById("logInButton").style.display = "none";
	} else {
		document.getElementById("logInButton").style.display = "";
	}
}

/*--Map with pin markers in each of the wanted locations-*/


function getMap() {

	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 8,
		center: new google.maps.LatLng(43.1817795, -2.478157),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var infowindow = new google.maps.InfoWindow();

	var marker;
	var i;

	for (i = 0; i < data.locations.length; i++) {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(data.locations[i].coordenate[0].latitud, data.locations[i].coordenate[0].longitud),
			map: map
		});

		google.maps.event.addListener(marker, 'click', (function (marker, i) {
			return function () {
				infowindow.setContent(data.locations[i].location_name);
				infowindow.open(map, marker);
			}
		})(marker, i));
	}
}


/*-- SIGN IN to the CHAT--*/

function signIN() {
	var database = firebase.database();
	var form = document.getElementsByClassName("short");
	console.log(form[0].value);
	firebase.auth().createUserWithEmailAndPassword(form[1].value, form[3].value).then(function () {
		console.log("OK");
		var user = firebase.auth().currentUser;
		hideAndShow("tenth");
		/*	user 	
					name:form[0].value,
					team: form[2].value,
					email: form[1].value*/
		user.updateProfile({
			displayName: form[0].value

		}).then(function () {
			// Update successful.
		}).catch(function (error) {
			// An error happened.
		});

	}).catch(function (error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		console.log("BAD");
		// ...
	});
}
