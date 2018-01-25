
var generateItem = function(id,item,callback){

	var snippet = item.snippet;
	//var nombreVideo = snippet.title;
	//var status = item.status.privacyStatus;
	//var fecha =  new Date(snippet.publishedAt);
	/*var publicacion = semana[fecha.getDay()]+" "
	+fecha.getDate()+" de "
	+mes[fecha.getMonth()]+" del "
	+fecha.getFullYear();*/

	var src = snippet.thumbnails.medium.url;

	this.itemCreated = this.createRow(id,src,callback);


}



generateItem.prototype.createRow = function(id,src,callback){
	var row = $("<div id='rowVideo'>");
	row.attr({
		'class':'row row-list',
		'data-id':id
	});

	var img = this.createImg(id,src);
	var infoVideo = this.createInfoVideo(id,callback);

	row.append(img);
	row.append(infoVideo);

	return row;
}

generateItem.prototype.createImg = function(id,src){
	
	var col = $("<div id='colImg"+id+"'>");
	col.attr({class:'col-sm-3 col-md-3 col-lg-3'});

	var img = $("<img id='imgVideo'>");
	img.attr({
		class:'img-fluid img-thumbnails img-item',
		src: src
	});

	col.append(img);

	return col;
}

generateItem.prototype.createInfoVideo = function(id,callback){

	var col = $("<div id='colInfo"+id+"'>");
	col.attr({class:'col-sm-9 col-md-9 col-lg-9'});

	var card = $("<div id='cardInfo"+id+"'>");
	card.attr({class:'card'});

	var cardBody = $("<div id='cardBody"+id+"'>");
	cardBody.attr({class:'card-body'});

	this.titleVideo = $("<div id='titleVideo"+id+"'>");
	this.titleVideo.attr({class:"card-title h4"});
	//this.titleVideo.append("Nombre del Video: "+nombreVideo);

	var cardContent = $("<div id='cardContent"+id+"'>");
	cardContent.attr({class:'card-text'});

	var row = $("<div id='rowInfo"+id+"'>");
	row.attr({class:'row'});

	this.colStatus = $("<div id='colStatus"+id+"'>");
	this.colStatus.attr({class:'col-sm-5 col-mg-5 col-lg-5'});
	//this.colStatus.append("Status: "+status);

	this.colPublicacion = $("<div id='colPublicacion"+id+"'>");
	this.colPublicacion.attr({class:'col-sm-7 col-mg-7 col-lg-7'});
	//this.colPublicacion.append("Fecha de publicación: "+publicacion);

	var footer = $("<div id='footer"+id+"'>");
	footer.attr({class:'card-footer bg-transparent'});

	var btnInfo = $("<button id='btnInfo"+id+"'>");
	btnInfo.attr({class:'btn btn-outline-dark'});
	btnInfo.append("Editar Info");
	btnInfo.on('click',callback.bind(this,id));



	col.append(card);
	card.append(cardBody);
	card.append(footer);

	footer.append(btnInfo);

	cardBody.append(this.titleVideo);
	cardBody.append(cardContent);

	cardContent.append(row);
	row.append(this.colStatus);
	row.append(this.colPublicacion);

	return col;
}


function generateProgressBar(){

	var progressBar = $("<div>");
	progressBar.attr({
		class:'progress',
		style:'height: 12px;'
	});

	var bar = $("<div id='progressBar'>");
	bar.attr({
		'class':'progress-bar bg-danger',
		'role':'progressbar',
		'style':'width:0%;',
		'aria-valuenow':'0',
		'aria-valuemin':'0',
		'aria-valuemax':'100'
	});

	progressBar.append(bar);
	return progressBar;
}