function iniciarGAPI(){
	var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';

	gapi.client.init({
		'apiKey': key,
		'discoveryDocs': [discoveryUrl],
		'clientId': CLIENT_ID,
		'scope' : SCOPE
	}).then(function(){
		GoogleAuth = gapi.auth2.getAuthInstance();
		GoogleAuth.isSignedIn.listen(updateSigninStatus);

		//GoogleAuth.isSignedIn.listen(signinCallback);
		/*var user = GoogleAuth.currentUser.get();
		console.log(user);*/

		$("#btn_login").click(function (){
			handleAuthClick();
		});

		/*$("#btn_misVideos").click(function(){
			checkAuth();
		});*/

	}).then(function(response){
		console.log(response);
	},function(reason){
		console.log(reason);
	});
}

function onSignIn(googleUser){

	if(googleUser.Zi.access_token) {
		//var uploadVideo = new UploadVideo();
		var id_token = googleUser.getAuthResponse().id_token;
		//uploadVideo.ready(googleUser.Zi.access_token);
		startSession(id_token,"http://13se.hol.es/yt_admin/dashboard.html");
	}
	
}



function handleAuthClick() {
	if (GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked 'Sign out' button.
      closeSession();
      //gapi.auth.signOut();
      //GoogleAuth.signOut();
  } else {
  	GoogleAuth.signIn().then(onSignIn);
  }
}

function updateSigninStatus(isSignedIn){
	console.log(isSignedIn);
	if(isSignedIn){
		/*var request = gapi.client.youtube.channels.list({
			mine: true,
			part: 'contentDetails'
		});
		request.execute(function(response){
			playlistId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
			requestVideoPlayList(playlistId);
			console.log(playlistId);
		});*/
	}else{
		console.log("Sin logeo");
	}
}


function requestVideoPlayList(playlistId,pageToken){
	var requestOptions = {
		playlistId: playlistId,
		part: 'snippet',
		maxResults: 10
	};
	if (pageToken) {
		requestOptions.pageToken = pageToken;
	}
	var request = gapi.client.youtube.playlistItems.list(requestOptions);
	request.execute(function(response){
		nextPageToken = response.result.nextPageToken;
		var nextVis = nextPageToken ? 'visible' : 'hidden';
		console.log("nextVis",nextVis);
		prevPageToken = response.result.prevPageToken;
		var prevVis = prevPageToken ? 'visible' : 'hidden';
		console.log("prevVis",prevVis);

		var playlistItems = response.result.items;

		if(playlistItems){
			$.each(playlistItems, function(index,item){
				console.log(item);
			});
		}else{
			console.log("SIN VIDEOS");
		}

	});
}