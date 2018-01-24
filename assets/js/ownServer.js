function startSession(id_token,redirect_URL){
	data = {
		id_token : id_token
	};

	$.ajax({
		url : 'http://13se.hol.es/back_YTAdmin/authUser.php',
		data : data,
		type : 'POST',
		dataType :'json',
		success : function(json){
			console.log(json.session_token);
			console.log(json.id_token);
			setCookie("session_token",json.session_token);
			window.location.href = redirect_URL;
		},
		error : function(xhr,status){
			console.log(xhr);
			console.log(status);
		}
	});
}

function closeSession(redirect_URL,usuarioG){
	$.ajax({
		url : "http://13se.hol.es/back_YTAdmin/authUser.php",
		data : {closeSession:true},
		type : 'POST',
		dataType : 'json',
		success : function(json){
			console.log(json);
			//deleteCookie("session_token");
			setCookie("session_token",false,true);
			gapi.auth2.getAuthInstance().signOut();
			//usuarioG.GoogleAuth.signOut();
			if(redirect_URL){
				window.location.href = redirect_URL;
			}
		},
		error : function(xhr,status){
			console.log(xhr);
			console.log(status);
		}
	});
}

function validateSession(session_token){
	data = {
		session_token : session_token
	};
	$.ajax({
		url : 'http://13se.hol.es/back_YTAdmin/authUser.php',
		data : data,
		type : 'POST',
		dataType : 'json',
		success : function(json){
			console.log(json);
		},
		error : function(xhr,status){
			console.log(xhr);
			console.log(status);
		}
	});
}