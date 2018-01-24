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
			var item = generateItem(index,item,function(id){
				//console.log(usuario.misVideos[id]);
				var video = usuario.misVideos[id];
				var idVideo = video.snippet.resourceId.videoId;
				var idLabel = 'playerInDialog'+index;
				var repoductor = new reproductorYT(idLabel,idVideo);
				var dialog = bootbox.dialog({
					//message:"<div id='playerInDialog"+index+"'></div>"
					message:"<div class='card' >"+
					"<div class='videoDiv' id='playerInDialog"+index+"' alt='Card image'></div>"+
					"<div class='card-body'>"+
					"<div class='form-group'>"+
					"<label for='tituloVideo'>Titulo del Video</label>"+
					"<input type='text' class='form-control' id='tituloVideo'>"
					+"</div>"+
					"<div class='form-group'>"+
					"<label for='descripcionVideo'>Descripción</label>"+
					"<textarea class='form-control' id='descripcionVideo' rows='2'></textarea>"
					+"</div>"+
					"<div class='form-inline justify-content-between'>"+
					"<button class='btn btn-outline-danger' id='btn_guardar'>Guardar</button>"+
					"<button class='btn btn-outline-danger' id='btn_editar'>Editar</button></div>"
					+"</div>"
					+"</div>"
				});
				dialog.init(function(){
					repoductor.initReproductor();
					var inTex_titulo = dialog.find('#tituloVideo').val(video.snippet.title);
					var inTex_descripcion = dialog.find('#descripcionVideo').val(video.snippet.description);
					var btn_guardar = dialog.find('#btn_guardar');
					inTex_titulo.attr({disabled:true});
					inTex_descripcion.attr({disabled:true});
					btn_guardar.attr({disabled:true});
					btn_guardar.on('click',updateVideo.bind(this,inTex_titulo,inTex_descripcion,idVideo));
					var btn_editar = dialog.find('#btn_editar');
					btn_editar.on('click',enableEdit.bind(this,inTex_titulo,inTex_descripcion,btn_guardar));
				});

			});
			$('#main_container').append(item);
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


function enableEdit(titulo,descripcion,guardar){
	titulo.attr({disabled:!titulo.attr('disabled')});
	descripcion.attr({disabled:!descripcion.attr('disabled')});
	guardar.attr({disabled:!guardar.attr('disabled')});
}

function updateVideo(titulo,description,idVideo){
	//console.log(item);
	console.log(usuarioG.usuario.Zi.access_token);
	console.log(usuarioG.gapi.client.getToken().access_token);
	var token = usuarioG.gapi.client.getToken().access_token;

	var params = {
		part:'snippet'
	};
	var data = {
		id: idVideo,
		title: titulo.val(),
		description: description.val(),
	};

	var update = new updateData(params,data,token);

	update.updateInfo();
}


