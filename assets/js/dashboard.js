var userGoogle = function(){
	this.key = "AIzaSyD6-FIASfSMJH36me_ROIHvFtrnXvVW4OI";
	this.client_id = "602606606274-ecquf7or8dp2fs51q332hqrt7sdk55eu.apps.googleusercontent.com";
	this.scope = 'https://www.googleapis.com/auth/youtube';
	this.discovery_url = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';
	this.misVideos = [];
}

userGoogle.prototype.getPlaylist = function(){

	var usuario = this;
	var request = usuario.gapi.client.youtube.channels.list({
		mine: true,
		part: 'contentDetails'
	});
	request.execute(function(response){
		playlistId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
		//console.log(playlistId);
		$('#main_container').html("");
		usuario.misVideos = [];
		usuario.requestVideoPlayList(playlistId,null,function(item,index){
			//console.log(item);
			var item = new itemViewUpdate(item,index);
			$('#main_container').append(item.item);
		});
		//console.log(playlistId);
	});
}

userGoogle.prototype.checkAuth = function() {
	gapi.auth2.authorize({
		client_id : CLIENT_ID,
		scope : SCOPE,
		immediate : true, function(authResult){
			console.log(authResult);
		}
	});
}

userGoogle.prototype.requestVideoPlayList = function (playlistId,pageToken,callback){
	var usuario = this;
	var requestOptions = {
		playlistId: playlistId,
		part: 'snippet,status',
		maxResults: 40
	};
	if (pageToken) {
		requestOptions.pageToken = pageToken;
	}
	var request = usuario.gapi.client.youtube.playlistItems.list(requestOptions);
	request.execute(function(response){
		nextPageToken = response.result.nextPageToken;
		var nextVis = nextPageToken ? 'visible' : 'hidden';
		//console.log("nextVis",nextVis);
		prevPageToken = response.result.prevPageToken;
		var prevVis = prevPageToken ? 'visible' : 'hidden';
		//console.log("prevVis",prevVis);

		var playlistItems = response.result.items;

		if(playlistItems){
			$.each(playlistItems, function(index,item){
				usuario.misVideos.push(item);
				callback(item,index);
			});
		}else{
			console.log("SIN VIDEOS");
		}

	});
}

userGoogle.prototype.updateSigninStatus = function(isSignedIn){
	
	var usuario = this;

	if(isSignedIn){
		var uploadVideo = new UploadVideo();
		usuario.gapi = gapi;
		usuario.GoogleAuth = usuario.gapi.auth2.getAuthInstance();
		usuario.usuario = usuario.GoogleAuth.currentUser.get();

		var token = usuario.gapi.client.getToken();
		//console.log(token);
		uploadVideo.ready(token.access_token);
		usuario.getPlaylist();
	} 
}



function iniciarGAPI(){
	usuarioG = new userGoogle();
	gapi.client.init({
		'apiKey': usuarioG.key,
		'discoveryDocs': [usuarioG.discovery_url],
		'clientId': usuarioG.client_id,
		'scope' : usuarioG.scope
	}).then(function(){
		
		usuarioG.GoogleAuth = gapi.auth2.getAuthInstance();
		usuarioG.usuario = usuarioG.GoogleAuth.currentUser.get();
		usuarioG.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

		$('#btn_test').click(function(){
			console.log(usuarioG);
			console.log(getCookie("session_token"));
		});
		$('#btn_closeSession').click(function(){
			usuario = undefined;
			closeSession("http://13se.hol.es/yt_admin/",gapi,usuarioG);
		});
		$('#lbl_nombreUsuario').append(usuarioG.usuario.w3.ig);
		
		/*var item = createRow("Video 001","20 años","Mañana","https://i.ytimg.com/vi/4iP8kPIG4AA/mqdefault.jpg");
		console.log(item);*/
	}).then(function(response){
		//console.log(response);
	},function(reason){
		//console.log(reason);
	});
}


