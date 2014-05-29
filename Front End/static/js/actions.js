//variables for global context
var audios = 0;
var current = 0;
var playlist = new Playlist();


//  Playlist class to handle song list
function Playlist(){

    this.list = new Array();

    this.add = function add(songid){
    	this.list.push(songid);
    }

    this.remove = function remove(songid){

	if(list.length == 0){
		console.log("empty list!");
		return false;
	}
		
	for(var i=0;i<list.length;i++){
		if(list[i] == songid){
			list.splice(i,1);
		}
	}
		
    }

    this.getNext = function getNext(){
	current = current<this.list.length?current:0;
    	return this.list[current++];
    }
    
    this.getPrevious = function getPrevious(){
	current = current>-1?current:0;
    	return this.list[current--];
    }

    this.getList = function getList(){
	return this.list;
    }

    this.empty = function empty(){
	this.list = new Array();
    }
   
}

function setElementCount(type){

    var count = document.getElementById("elementCount").value;
    if(type=="audio"){
	audios = parseInt(count);
     //	alert("count set to "+count);
    }
}

function setPoster(imgPath){
	
	document.getElementById('gallery-player').setAttribute('poster',imgPath);
}

function changeContent(path){

//	alert("changing media to "+path);
	var player = document.getElementById("gallery-player");
	player.src=path;
	player.load();
	player.play();
//	launchAudioGallery(path);

   	track = path.split("/");
    	track = track[track.length-1];
    	document.getElementById('nowplaying').innerHTML="Now playing.. "+track;

}

function changeVideoContent(path){

	var player = videojs("gallery-player");
	player.src(path);
	player.load();
	player.play();

   	track = path.split("/");
    	track = track[track.length-1];
    	document.getElementById('nowplaying').innerHTML="Now playing.. "+track;

}

function changePosterContent(poster, related){

var gallery = document.getElementById("posters");
var thumb = document.getElementById("poster-thumb");

gallery.innerHTML = "";
thumb.innerHTML = "";
//Add first element to gallery:
var element = '<li data-thumb="'+poster.path+'"><img src="'+poster.path+'"></li>';
gallery.innerHTML += element;
thumb.innerHTML += element;

//Add related posters
for(var i=1; i< related.length;i++){
    if(i<15){
	var element = '<li data-thumb="'+related[i].path+'"><img src="'+related[i].path+'"></li>';
	gallery.innerHTML += element;
	thumb.innerHTML += element;
    }
}

  $('#carousel').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    itemWidth: 210,
    itemMargin: 5,
    asNavFor: '#slider'
  });
 
  $('#slider').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    sync: "#carousel"
  });

}

function populateAudioRelated(artist, album, videos, gallery){

	artholder = document.getElementById("artist_songs");	
	albholder = document.getElementById("album_songs");
	r_vids = document.getElementById("related-videos");
	r_posts = document.getElementById("related-posters");
	artholder.innerHTML = "";
	albholder.innerHTML = "";
	r_vids.innerHTML = "";
	r_posts.innerHTML = "";

	for(var i in artist){
		element = '<div class="list-group-item" onclick="playSong('+artist[i].id+')">'+
				artist[i].title+'</div>';
		artholder.innerHTML += element;
//		playlist.add(artist[i].id);
//		console.log(artist[i].title);
	}

	for(var i in album){
		element = '<div class="list-group-item" onclick="playSong('+album[i].id+')">'+
				album[i].title+'</div>';
		albholder.innerHTML += element;
//		console.log(album[i].title);
	}

	for(var i in videos){
		if(i<10){
		element = '<div class="list-group-item" onclick="launchVideo('+videos[i].id+')">'+
				videos[i].title+'</div>';
		r_vids.innerHTML += element;
//		console.log(videos[i].title,element);	
		}
	}

	for(var i in gallery){
		if(i<20){
			element = '<li><img  onclick="launchGallery('+gallery[i].id+')" height="170px" src="'+gallery[i].path+'"></img></li>';
			r_posts.innerHTML += element;
//			console.log(gallery[i].title);
		}
	}

	if(gallery.length == 0){
		r_posts.innerHTML = "No posters for this song :(";
	}
	
	$('.flexslider').flexslider({
	    animation: "slide",
	    animationLoop: false,
	    itemWidth: 210,
	    itemMargin: 5
  	});

	console.log("the list is");
	console.log(playlist.getList());
} 

function populateVideoRelated(videos, audios){

	vidholder = document.getElementById("related-videos");	
	audholder = document.getElementById("related-audio");

	audholder.innerHTML = "";	
	vidholder.innerHTML = "";

	for(var i in videos){
		element = '<div class="list-group-item" onclick="playVideo('+videos[i].id+')">'+
				videos[i].title+'</div>';
		vidholder.innerHTML += element;
//		playlist.add(videos[i].id);
		console.log(videos[i].title);
	}

	for(var i in audios){
		element = '<div class="list-group-item" onclick="launchAudio('+audios[i].id+')">'+
				audios[i].title+'</div>';
		audholder.innerHTML += element;
		console.log(audios[i].title);		
	
	}	

}

function populatePosterRelated(videos, audios){

	vidholder = document.getElementById("related-videos");	
	audholder = document.getElementById("related-audio");

	audholder.innerHTML = "";	
	vidholder.innerHTML = "";

	for(var i in videos){
		element = '<div class="list-group-item" onclick="playVideo('+videos[i].id+')">'+
				videos[i].title+'</div>';
		vidholder.innerHTML += element;
//		playlist.add(videos[i].id);
		console.log(videos[i].title);
	}

	for(var i in audios){
		element = '<div class="list-group-item" onclick="launchAudio('+audios[i].id+')">'+
				audios[i].title+'</div>';
		audholder.innerHTML += element;
		console.log(audios[i].title);		
	
	}	

}

function changeTab(num){
	$("#tab_"+num).click();
}

function playSong(id){
	
	link = "getDetails.php?type=audio&id="+id;
//	playlist.empty();
	playlist.add(id);
	getContents(link, function (result){
		console.log(result);
		var song = result.track;
		var poster = result.poster;
		var artist = result.artist;
		var album = result.album;
		var gallery = result.gallery;	
		var videos = result.videos;

		changeContent(song.path);
		setPoster(poster);
		populateAudioRelated(artist, album, videos, gallery);
		changeTab(2);
	});
}

function playVideo(id){
	changeTab(1);
	link = "getDetails.php?type=video&id="+id;
	playlist.empty();
	getContents(link, function (result){
		console.log(result);
		var video = result.video;
		var related = result.related;
		var album = result.audio;
		
		changeVideoContent(video.path);
		populateVideoRelated(related, album);
		changeTab(2);
	});
}

function showPoster(id){
	
	link = "getDetails.php?type=poster&id="+id;
//	playlist.empty();
	getContents(link, function (result){
		console.log(result);
		var video = result.video;
		var poster = result.poster;
		var audio = result.audio;
		var related = result.related;
		
		changePosterContent(poster,related);
		populatePosterRelated(video, audio);
		changeTab(2);
	});

}

function launchVideo(id){
	redLink = 'video.php?id='+id;
	window.location = redLink;
}

function launchGallery(id){
//	alert("launching "+id);
	redLink = "poster.php?id="+id;
	window.location=redLink;
}

function launchAudio(id){

	redlink = "audio.php?id="+id;
	window.location=redlink;
}

function playnext(){

    playSong(playlist.getNext());

}

function playprev(){

    playSong(playlist.getPrevious());

}

function replaceListener(){

    player = document.getElementById('gallery-player');
    player.removeEventListener('ended', playnext);
    player.addEventListener('ended', playnext);
}

function getContents(url, callback){

	$.ajax({
	  url: url,
	  dataType: "JSON",
	  success: function(data, msg){
		callback(data);
	  },
	  error: function(msg){
		console.log(msg.responseText);	
	  }
	});

}

function post(data, url){

	$.ajax({
	  type: "POST",
	  url: url,
	  data: data,
	  success: success,
	  dataType: dataType
	});
}

