var semana = ["Domingo","Lunes","Martes","Jueves","Viernes","Sábado"];
var mes = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Juliio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

var viewUpdater = function(view,data){
	

	this.title = data.snippet.title;
	this.privacidad = data.status.privacyStatus;
	this.publicacion = this.dateToString(data.snippet.publishedAt);

	this.lbl_tituloVideo = view.tituloVideo;
	this.lbl_privacidad = view.privacidad;
	this.lbl_fechaPublicacion = view.fechaPublicacion;

	this.setData();
}

viewUpdater.prototype.setData = function(){
	var VwUpdater = this;
	this.lbl_tituloVideo.append(VwUpdater.title);
	this.lbl_privacidad.append(VwUpdater.privacidad);
	this.lbl_fechaPublicacion.append(VwUpdater.publicacion);
}

viewUpdater.prototype.updateData = function(data){
	this.title = data.snippet.title;
	this.privacidad = data.status.privacyStatus;
	this.publicacion = this.dateToString(data.snippet.publishedAt);
	this.setData();
}

viewUpdater.prototype.dateToString = function(date){
	var fecha = new Date(date);
	var publicacion = semana[fecha.getDay()] + " " +
	fecha.getDate() + " de " +
	mes[fecha.getMonth()] + " del " +
	fecha.getFullYear();
	return publicacion;
}