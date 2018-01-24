
var semana = ["Domingo","Lunes","Martes","Jueves","Viernes","Sábado"];
var mes = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Juliio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function generateItem(id,item,callback){
	var snippet = item.snippet;

	var nombreVideo = snippet.title;
	var status = item.status.privacyStatus;

	var fecha =  new Date(snippet.publishedAt);
	var publicacion = semana[fecha.getDay()]+" "
	+fecha.getDate()+" de "
	+mes[fecha.getMonth()]+" del "
	+fecha.getFullYear();

	var src = snippet.thumbnails.medium.url;

	return createRow(id,nombreVideo,status,publicacion,src,callback);
}

function createRow(id,nombreVideo,status,publicacion,src,callback){
	var row = $("<div id='rowVideo'>");
	row.attr({
		'class':'row row-list',
		'data-id':id
	});

	var img = createImg(id,src);
	var infoVideo = createInfoVideo(id,nombreVideo,status,publicacion,callback);

	row.append(img);
	row.append(infoVideo);

	return row;
}

function createImg(id,src){
	
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

function createInfoVideo(id,nombreVideo,status,publicacion,callback){
	var col = $("<div id='colInfo"+id+"'>");
	col.attr({class:'col-sm-9 col-md-9 col-lg-9'});

	var card = $("<div id='cardInfo"+id+"'>");
	card.attr({class:'card'});

	var cardBody = $("<div id='cardBody"+id+"'>");
	cardBody.attr({class:'card-body'});

	var titleVideo = $("<div id='titleVideo"+id+"'>");
	titleVideo.attr({class:"card-title h4"});
	titleVideo.append("Nombre del Video: "+nombreVideo);

	var cardContent = $("<div id='cardContent"+id+"'>");
	cardContent.attr({class:'card-text'});

	var row = $("<div id='rowInfo"+id+"'>");
	row.attr({class:'row'});

	var colDuracion = $("<div id='colDuracion"+id+"'>");
	colDuracion.attr({class:'col-sm-4 col-mg-4 col-lg-4'});
	colDuracion.append("Status: "+status);

	var colPublicacion = $("<div id='colPublicacion"+id+"'>");
	colPublicacion.attr({class:'col-sm-8 col-mg-8 col-lg-8'});
	colPublicacion.append("Fecha de publicación: "+publicacion);

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

	cardBody.append(titleVideo);
	cardBody.append(cardContent);

	cardContent.append(row);
	row.append(colDuracion);
	row.append(colPublicacion);

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