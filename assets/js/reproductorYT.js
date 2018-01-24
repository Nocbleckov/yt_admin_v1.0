var reproductorYT = function(idLabel,idVideo){
	this.idLabel = idLabel;
	this.idVideo = idVideo;

	if(typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined'){
		this.tag = document.createElement('script');
		this.tag.src =  "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(this.tag,firstScriptTag);
	}
}

reproductorYT.prototype.initReproductor = function(){
	var reproductor = this;

	if(typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined'){
		window.onYouTubeIframeAPIReady = reproductor.onYouTubeIframeAPIReady.bind(this);
	}else{
		reproductor.onYouTubeIframeAPIReady();
	}
}

reproductorYT.prototype.onPlayerReady = function(event){
	event.target.playVideo();
}

reproductorYT.prototype.onPlayerStateChange = function(event){
	//console.log(event);
	if(event.data == 0){
		
	}
}

reproductorYT.prototype.onYouTubeIframeAPIReady = function(){
	var player;
	var reproductor = this;
	//console.log(reproductor);
	player = new YT.Player(reproductor.idLabel,{
		height:'100%',
		width:'auto',
		videoId:reproductor.idVideo,
		events:{
			'onReady':reproductor.onPlayerReady.bind(this),
			'onStateChange':reproductor.onPlayerStateChange.bind(this)
		}
	});
}