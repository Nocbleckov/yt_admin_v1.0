var updateData = function(params,data,callback){
	this.gapi = gapi;
	this.path = "/youtube/v3/videos";
	this.method = "PUT";
	this.access_token = data.access_token;

	this.tags = ['youtube-video','api','test'];
	this.categoryId = 22;
	this.params = params;

	this.body = {
		id: data.id,
		snippet:{
			title: data.title,
			description: data.description,
			tags: this.tags,
			categoryId: this.categoryId
		},
		status:{
			privacyStatus: 'public'
		}
	}

	this.callback = callback;
}

updateData.prototype.updateInfo = function(){
	var updateRequest = this;

	this.gapi.client.request({
		path: updateRequest.path,
		method: updateRequest.method,
		params: updateRequest.params,
		headers: {
			'Authorization':'Bearer '+updateRequest.access_token
		},
		body: updateRequest.body,
		callback: updateRequest.callback.bind(this)
	});
}