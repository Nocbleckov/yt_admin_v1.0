var STATUS_POLLING_INTERVAL_MILLIS = 60 * 1000; // One minute.


var UploadVideo = function() {

 this.tags = ['youtube-cors-upload'];

 this.categoryId = 22;

 this.videoId = '';

 this.uploadStartTime = 0;
};


UploadVideo.prototype.ready = function(accessToken) {
  this.accessToken = accessToken;
  this.gapi = gapi;
  this.authenticated = true;
  this.gapi.client.request({
    path: '/youtube/v3/channels',
    params: {
      part: 'snippet',
      mine: true
    },
    callback: function(response) {
      //console.log(response);
    }.bind(this)
  });
  $('#uploadVideo').on("click", this.handleUploadClicked.bind(this));
};


UploadVideo.prototype.uploadFile = function(file,titulo,description,privacyStatus) {
  //console.log(file);
  //console.log($('#privacy-status option:selected').text());
  var metadata = {
    snippet: {
      title: titulo,
      description: description,
      tags: this.tags,
      categoryId: this.categoryId
    },
    status: {
      privacyStatus: privacyStatus
    }
  };
  var uploader = new MediaUploader({
    baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
    file: file,
    token: this.accessToken,
    metadata: metadata,
    params: {
      part: Object.keys(metadata).join(',')
    },
    onError: function(data) {
      var message = data;
      console.log(data);
      try {
        var errorResponse = JSON.parse(data);
        message = errorResponse.error.message;
      } finally {
        alert(message);
      }
    }.bind(this),
    onProgress: function(data) {
      var currentTime = Date.now();
      var bytesUploaded = data.loaded;
      var totalBytes = data.total;
      var bytesPerSecond = bytesUploaded / ((currentTime - this.uploadStartTime) / 1000);
      var estimatedSecondsRemaining = (totalBytes - bytesUploaded) / bytesPerSecond;
      var percentageComplete = (bytesUploaded * 100) / totalBytes;

      $('#progressBar').attr({
        'style':'width:'+percentageComplete+'%;',
        'aria-valuenow':bytesUploaded,
        'aria-valuemin':'0',
        'aria-valuemax':totalBytes
      });

      var porcentaje = Number((percentageComplete).toFixed(1));

      $('#progressBar').html(porcentaje+'%');

      /*$('#upload-progress').attr({
        value: bytesUploaded,
        max: totalBytes
      });*/

      console.log({
        value: bytesUploaded,
        max: totalBytes
      });

      //$('#percent-transferred').text(percentageComplete);
      console.log(percentageComplete);
      //$('#bytes-transferred').text(bytesUploaded);
      console.log(bytesUploaded);
      //$('#total-bytes').text(totalBytes);
      console.log(totalBytes);

      //$('.during-upload').show();
    }.bind(this),
    onComplete: function(data) {
      var uploadResponse = JSON.parse(data);
      //console.log(data);
      //console.log(uploadResponse);
      //$('#video-id').text(this.videoId);
      //$('.post-upload').show();
      this.videoId = uploadResponse.id;
      this.pollForVideoStatus();
      $('#uploadVideo').attr('disabled', false);
      usuarioG.getPlaylist();
    }.bind(this)
  });

  this.uploadStartTime = Date.now();
  uploader.upload();
};

UploadVideo.prototype.handleUploadClicked = function() {
  $('#uploadVideo').attr('disabled', true);

  var uploaderVideo = this;

  var dialog = bootbox.dialog({
    message: "<div class='card'>"+
    "<div class='card-header'>Subir Nuevo Video</div>"+
    "<div class='card-body'>"+
    "<div class='form-group'>"+
    "<label for='tituloVideo'> Titulo del Nuevo Video </label>"+
    "<input type='text' class='form-control' id='tituloVideo'>"+
    "</div>"+
    "<div class='form-group'>"+
    "<labe for='descriptionVideo'> Descipción </label>"+
    "<textarea class='form-control' id='descriptionVideo' rows='2'></textarea>"+
    "</div>"+
    "<div class='form-group'>"+
    "<select id='privacidad' class='custom-select'>"+
    "<option value='' selected>Privacidad del Video</option>"+
    "<option value='public'>Publico</option>"+
    "<option value='private'>Privado</option>"+
    "<option value='unlisted'>Sin listar</option>"+
    "</select>"+
    "</div>"+
    "<div class='form-group'>"+
    "<div class='input-group'>"+
    "<div class='custom-file'>"+
    "<input accept='video/*' type='file' class='' id='miVideo'>"+
    "</div>"+
    "<div class='input-group-append'>"+
    "<button id='subirVideo' type='button' class='btn btn-outline-danger'><i class='fa fa-upload' aria-hidden='true'></i> Subir</button>"
    +"</div>"
    +"</div>"
    +"</div>"
    +"<div class='form-group' id='progressBarHolder'></div>"
    +"</div>"
    +"</div>"
  });
  dialog.init(function(){
    var btn = dialog.find('#subirVideo');
    btn.click(function(){
      var tituloVideo = dialog.find('#tituloVideo').val();
      var descriptionVideo = dialog.find('#descriptionVideo').val();
      var privacidad = dialog.find('#privacidad option:selected').val();
      var file = dialog.find('#miVideo').get(0).files[0];
      //console.log(tituloVideo+"::"+descriptionVideo+"::"+privacidad);
      //console.log(file);
      if(file && privacidad!=''){
        var progressBar = generateProgressBar();
        dialog.find('#progressBarHolder').append(progressBar);
        uploaderVideo.uploadFile(file,tituloVideo,descriptionVideo,privacidad);
      }else{
        alert('Los campos de privacidad y de video son necesarios');
      }
      $('#uploadVideo').attr('disabled', false);
    });
  });

  //this.uploadFile($('#file').get(0).files[0]);

};

UploadVideo.prototype.pollForVideoStatus = function() {
  this.gapi.client.request({
    path: '/youtube/v3/videos',
    params: {
      part: 'status,player',
      id: this.videoId
    },
    callback: function(response) {
      if (response.error) {
        // The status polling failed.
        console.log(response.error.message);
        setTimeout(this.pollForVideoStatus.bind(this), STATUS_POLLING_INTERVAL_MILLIS);
      } else {
        console.log(response);
        var uploadStatus = response.items[0].status.uploadStatus;
        switch (uploadStatus) {
          case 'uploaded':
          //$('#post-upload-status').append('<li>Upload status: ' + uploadStatus + '</li>');
          console.log(uploadStatus);
          setTimeout(this.pollForVideoStatus.bind(this), STATUS_POLLING_INTERVAL_MILLIS);
          break;
          case 'processed':
          //$('#player').append(response.items[0].player.embedHtml);
          //$('#post-upload-status').append('<li>Final status.</li>');
          console.log(response.items[0].player.embedHtml);
          break;
          default:
          //$('#post-upload-status').append('<li>Transcoding failed.</li>');
          console.log("transcoding failed");
          break;
        }
      }
    }.bind(this)
  });
};