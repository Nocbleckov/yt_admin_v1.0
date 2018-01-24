function setCookie(nombreCookie, valor,exp) {
	var d = new Date();
	if(!exp){
		d.setTime(d.getTime() + (50000*1000));
	}else{
		d.setTime(d.getTime());
	}
	var expires = "expires="+ d.toUTCString();
	document.cookie = nombreCookie + "=" + valor + ";" + expires + ";Path=/";
}

function getCookie(nombreCookie) {
	var name = nombreCookie + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function deleteCookie(nombreCookie){
	var d = new Date();
	d.setTime(d.getTime() + (0));
	var expires = "expires=" + d.toUTCString();
	document.cookie = nombreCookie + "= 0 ;" + expires +";Path=/";
}