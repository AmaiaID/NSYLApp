document.getElementById("loginChat").addEventListener("click", login);
document.getElementById("logInB").addEventListener("click", login);
document.getElementById("create-post").addEventListener("click", writeNewPost);
$(".advice").hide();
$("#posts").hide();

/*
	document.getElementById("posts").style.display="none";
		document.getElementsByClassName("advice").style.display="none";
*/

getPosts();
// Function to check if the login has been made, and consequently hide and show the login/out button
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		// User is signed in.
		$(".advice").hide();
		$("#logInButton").hide();
		$("#posts").show();
		$("#logOutButton").show();
		$("#loginChat");	
	/*Another way to do it instead of using JQuery
    document.getElementById("logInButton").style.display="none";
		document.getElementsByClassName("advice").style.display="none";
		document.getElementByID("logOutButton").style.display="inline-block";
		document.getElementByID("posts").style.display="inline-block";*/
		console.log("User in");	
	} else {
		$(".advice").show();
		/*$("#posts").hide();*/
		$("#logOutButton").hide();
		$("#logInButton").show();
				
	/*	Another way to do it using JQuery	
		document.getElementById("logInButton").style.display="inline-block";
		document.getElementsByClassName("advice").style.display="inline-block";
		document.getElementByID("logOutButton").style.display="none";
		document.getElementByID("posts").style.display="none";*/
		// No user is signed in.		
	}
});

function login(event) {
console.log(event.target.id);
	console.log("in");
	
	// Log the Chat via GOOGLE
if(event.target.id === "loginChat"){
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(provider)
		.then(function () {
				hideAndShow("tenth"); //So the chat shows up directly
					getPosts();
		})
		.catch(function () {
			alert("Something went wrong");
		});
	}
	
	// Log the Chat via email
	if (event.target.id === "logInB"){ 			
	var form = document.getElementsByClassName("information");
	console.log(form);
	firebase.auth().signInWithEmailAndPassword(form[0].value, form[1].value).then(function () {
   console.log("OK login email"); 		 
	hideAndShow("tenth"); // So that the chat comes up directly
					getPosts();
	}).catch(function (error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		console.log("BAD");
		// ...
	});
			
	}
}

function writeNewPost() {

	if (!$("#textInput").val()) {
		return
	}
	var text = document.getElementById("textInput").value;
	var userName = firebase.auth().currentUser.displayName;
	// A post entry.
	var postData = {
		name: userName,
		body: text
	};
	// Get a key for a new Post.
	var newPostKey = firebase.database().ref().child('ubiqum').push().key;
	var updates = {};
	updates[newPostKey] = postData;
	$("#textInput").val("");
	audio.play();
	return firebase.database().ref().child('ubiqum').update(updates);
}


function getPosts() {
	firebase.database().ref('ubiqum').limitToLast(10).on('value', function (data) {
		var logs = document.getElementById("posts");
		logs.innerHTML = "";
		var posts = data.val();
		var template = "";
		for (var key in posts) {
			if (( firebase.auth().currentUser != null) && posts[key].name == firebase.auth().currentUser.displayName) {
			template += `
          <div class="notification is-info">
            <p class="name">${posts[key].name} says:</p>
            <p>${posts[key].body}</p>
          </div>
        `;
			} else {
				template += `
          <div class="notification is-primary">
            <p class="name">${posts[key].name} says:</p>
            <p>${posts[key].body}</p>
          </div>
        `;
			}
		}

		logs.innerHTML = template;

		$(".box").animate({
			scrollTop: $(".box").prop("scrollHeight")
		}, 500);
	});
}
