document.addEventListener('DOMContentLoaded', function() {

	// make xml http request to /users
	let xhr = new XMLHttpRequest();
	xhr.onload = function() {
		// update #current_users with user list
		let userList = '';
		let users = JSON.parse(this.responseText);
		for ( let i = 0; i < users.length; i++ ) {
			userList = userList + `<li id="user_${users[i].id}">${users[i].firstname} ${users[i].lastname}`;
		}

		document.getElementById('current_users').innerHTML = userList;
	};
	xhr.open('GET', '/users');
	xhr.send();
	
	// when I click a user, load their information in the form for editing
	document.getElementById('current_users').addEventListener('click', function(event) {
		if ( event.target.nodeName == 'LI' ) {
			let element = event.target;
			let user_id = element.id.split('_')[1];

			// fetch user information
			let xhr = new XMLHttpRequest();
			xhr.onload = function() {
				let user = JSON.parse(this.responseText);

				// and put on the form!
				// update our current form to be an "update" form, instead of a new user form
				document.getElementById('user_heading').innerHTML = 'Update User - ' + user.firstname;
				document.getElementById('user_form').innerHTML = '<input type="hidden" name="user_id" id="user_id" value="' + user.id + '">' + document.getElementById('user_form').innerHTML;
				document.getElementById('firstname').value = user.firstname;
				document.getElementById('lastname').value = user.lastname;
				document.getElementById('email').value = user.email;
				document.getElementById('submit_button').value = 'Update User ' + user.firstname;
			}
			xhr.open('GET', '/user/' + user_id);
			xhr.send();
		}
		
		
	});

});