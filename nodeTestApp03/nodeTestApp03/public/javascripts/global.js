//Userlist data array for filling in info box

var userListData = [];


//DOM Ready 
$(document).ready(function() {

	//Poulate the user table on initial page load
	populateTable();

	//Username link click
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

	//Add user button click
	$('#btnAddUser').on('click', addUser);

	//Delete User link click
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

	//Update user link click
	$('#userList table tbody').on('click', 'td a.linkupdateuser', changeUserInfo);

	//Update user button click
	$('#btnUpdateUser').on('click', updateUser);

	//Cancel user update button click
	$('#btnCancelUpdateUser').on('click', togglePanels);


});


//Functions

//Fill the table with data
function populateTable() {

	var tableContent = '';

	//jQuery AJAX call for JSON
	$.getJSON('/users/userlist', function(data) {

		// Stick user data array into a userlist variable in the global object
		userListData = data;

		// For each item in our JSON, add a table row and cells to the content string
		$.each(data, function(){
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this._id + '">' + this.username + '</a></td>';
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a> / <a href="#" class="linkupdateuser" rel="' + this._id + '">update</a></td>';
			tableContent += '</tr>';
		});

		// Inject the whole content string into our existing HTML table
		$('#userList table tbody').html(tableContent);
	});
};

// Fill the user info box
function showUserInfo(event){

	// Prevent Link from Firing
	event.preventDefault();

	//Retriev username and then its index
	var thisUser_Id = $(this).attr('rel');
	var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id }).indexOf(thisUser_Id);

	//Get userObject and fill the info box
	var thisUserObject = userListData[arrayPosition];
	$('#userInfoUserName').text(thisUserObject.username);
	$('#userInfoFullName').text(thisUserObject.fullname);
	$('#userInfoEmail').text(thisUserObject.email);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);
};

//Add user
function addUser(event){

	event.preventDefault();

	var errorCount = 0

	$('#addUser input').each(function(index, val){
		if($(this).val() === '') { errorCount ++; }
	});

	if(errorCount === 0){
		var newUser = { 
			'username' : $('#addUser fieldset input#inputUserName').val(),
			'email': $('#addUser fieldset input#inputUserEmail').val(),
			'fullname': $('#addUser fieldset input#inputUserFullname').val(),
			'age': $('#addUser fieldset input#inputUserAge').val(),
			'location': $('#addUser fieldset input#inputUserLocation').val(),
			'gender': $('#addUser fieldset input#inputUserGender').val()
		}

		$.ajax({
			type: 'POST',
			data: newUser,
			url: 'users/adduser',
			dataType: 'JSON'
		}).done(function(response){
			if (response.msg ===''){
				$('#addUser fieldset input').val('');
			populateTable();
			}
			else{
				alert('Error: ' + response.msg);
			}
		});
	}
	else{
		alert('Please fill in all fields!')
		return false;
	}
};

// Delete User 
function deleteUser(event){

	event.preventDefault();

	var confirmation = confirm('Are you sure you want to delete this user?');

	if (confirmation === true){
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function(response) {
			if(response.msg === '') {
			}
			else{
				alert('Error: ' + response.msg);
			}
			populateTable();
		});
	}
	else{
		return false;
	}
};

// Switch Add and Update form
function togglePanels(){
	$('#addUserPanel').toggle();
	$('#updateUserPanel').toggle();
};

//Chane user info
function changeUserInfo(event){

	event.preventDefault();

	if($('#addUserPanel').is(":visible")){
		togglePanels();
	}

	//Retriev username and then its index
	var thisUser_Id = $(this).attr('rel');
	var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id }).indexOf(thisUser_Id);

	//Get userObject and fill the info box
	var thisUserObject = userListData[arrayPosition];
	$('#updateUserName').val(thisUserObject.username);
	$('#updateUserFullname').val(thisUserObject.fullname);
	$('#updateUserEmail').val(thisUserObject.email);
	$('#updateUserAge').val(thisUserObject.age);
	$('#updateUserLocation').val(thisUserObject.location);
	$('#updateUserGender').val(thisUserObject.gender);

	$('#updateUser').attr('rel', thisUserObject._id);
}


function updateUser(event){

	event.preventDefault();
	var confirmation = confirm('Are you sure you want to update this user?');

	if (confirmation === true) {
			
			var errorCount = 0

			$('#updateUser input').each(function(index, val){
				if($(this).val() === '') { errorCount ++; }
			});

		if(errorCount === 0){
		var thisUser_Id = $(this).parentsUntil('div').parent().attr('rel');

		var updatedFields = {
			'username': $('#updateUser fieldset input#updateUserName').val(),
			'email': $('#updateUser fieldset input#updateUserEmail').val(),
			'fullname': $('#updateUser fieldset input#updateUserFullname').val(),
			'age': $('#updateUser fieldset input#updateUserAge').val(),
			'location': $('#updateUser fieldset input#updateUserLocation').val(),
			'gender': $('#updateUser fieldset input#updateUserGender').val()
		};

		$.ajax({
			type: 'PUT',
			url: '/users/updateuser/' + thisUser_Id,
			data: updatedFields
		}).done(function (response){
			if(response.msg === '') { togglePanels();}
			else {alert('Error: ' + response.msg);}
			populateTable();
			//showUserInfo(event);
		});
		}
		else{
			alert('Please fill in all fields!')

			return false;
		}
	}
	else{
		return false;
	}
}


