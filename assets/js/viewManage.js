var itemViewUpdate = function(video,index){
	var callback = this.callback;
	var View = this;

	this.index = index;
	this.video = video;
	this.idVideo = video.snippet.resourceId.videoId;
	

	this.itemCreated = new generateItem(index,video,callback.bind(this));
	this.item = this.itemCreated.itemCreated;
	
	this.dataView = new viewUpdater({
		tituloVideo: View.itemCreated.titleVideo,
		privacidad: View.itemCreated.colStatus,
		fechaPublicacion: View.itemCreated.colPublicacion
	},video);
}

itemViewUpdate.prototype.callback = function(){
	var View = this;
	console.log(View.video);
	//this.idVideo = View.video.snippet.resourceId.videoId;
	var idLabel = 'playerInDialog'+View.index;
	this.reproductor = new reproductorYT(idLabel,View.idVideo);
	this.dialog = bootbox.dialog({
		message:"<div class='card' >"+
		"<div class='videoDiv' id='playerInDialog"+View.index+"' alt='Card image'></div>"+
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
	this.dialog.init(View.dialogCallback.bind(this));
}

itemViewUpdate.prototype.dialogCallback = function(){
	var View = this;
	this.reproductor.initReproductor();


	var inTex_titulo = View.dialog.find('#tituloVideo').val(View.video.snippet.title);
	var inTex_descripcion = View.dialog.find('#descripcionVideo').val(View.video.snippet.description);
	var btn_guardar = View.dialog.find('#btn_guardar');
	var btn_editar = View.dialog.find('#btn_editar');
	View.enableEdit(inTex_titulo,inTex_descripcion,btn_guardar);



	btn_editar.on('click',View.enableEdit.bind(this,inTex_titulo,inTex_descripcion,btn_guardar));
	btn_guardar.on('click',View.updateVideo.bind(this,inTex_titulo,inTex_descripcion,View.idVideo));
}


itemViewUpdate.prototype.enableEdit = function (titulo,descripcion,guardar){
	titulo.attr({disabled:!titulo.attr('disabled')});
	descripcion.attr({disabled: !descripcion.attr('disabled')});
	guardar.attr({disabled: !guardar.attr('disabled')});
}

itemViewUpdate.prototype.updateVideo = function(titulo,description,idVideo){
	var View = this;
	var token = usuarioG.gapi.client.getToken().access_token;
	var params = {
		part:'snippet,status'
	};
	var data = {
		access_token: token,
		id: idVideo,
		title: titulo.val(),
		description: description.val()
	}
	 var update = new updateData(params,data,function(response){
	 	console.log(response);
	 	if( response.error){
	 		alert("Error: "+response.error.code);
	 	}else{
	 		//View.video.snippet = response.snippet;
	 		//View.idVideo = response.id;
	 		View.idVideo = response.id;
	 		View.video = response;
	 		View.dataView.updateData(View.video);
	 		View.dialog.modal('hide');
	 		setTimeout(function(){
	 			alert('Exito al cambiar la información');
	 		},400); 
	 	}
	 });
	 update.updateInfo();
}




