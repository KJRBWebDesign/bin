var pageObject = {
  
    /* VALUES */
    "toolBarOut": false,
    "playingMusic": false,
    "muted" : false,
    "volume" : 0.5,
    "libDom": document.querySelector("#library_icon"),
    "toolBarDom": document.querySelector("#userbar-wrapper"),
    "mainDom": document.querySelector("#centerstage-wrapper"),
    "audioDom": document.querySelector("#now-playing"),
    "audioPlayDom": document.querySelector("#audio_play"),
    "audioSkipPreviousDom": document.querySelector("#audio_skip_previous"),
    "audioSkipNextDom": document.querySelector("#audio_skip_next"),
    "audioVolumeButtonDom": document.querySelector("#audio_volume"),
    "audioShuffleButtonDom": document.querySelector("#audio_shuffle"),
    "queueObject": {},
    "currentAudio": {},

    "helperFunctions": {
        "generateUniqueID": function() {
            var capitalLetters = "ABCDEFGHIJKLMNOPQRSTUVWQYZ";
            var IDPartOne = Date.now();
            var IDPartTwo = (Math.random() ** Math.random() * Math.random()).toString(36).substring(7);
            let genID = IDPartOne + "x" + capitalLetters[Math.floor(Math.random() * 25)] + IDPartTwo;
        },

        "moveToolbarIn": function() {
            pageObject.toolBarDom.setAttribute("style", "transition:transform 200ms; transform-origin:top; transform:scaleY(0);")
            pageObject.toolBarOut = false;
        },

        "moveToolbarOut": function() {
            pageObject.toolBarDom.setAttribute("style", "transition: transform 500ms; transform-origin: top; transform: scaleY(1);")
            pageObject.toolBarOut = true;
        },

        "changeProgressBarLength": function(currentL, fullL) {
          document.querySelector(".length-progress").setAttribute("style", "width:" + Math.floor(fullL / currentL) + ";background:red;z-index:2;");
          console.log("log");
        },

        "listenForClose" : function() {
          $("#close").on("click", function() {
              pageObject.helperFunctions.moveToolbarIn();
          });
          $(pageObject.mainDom).on("click", function() {
              pageObject.helperFunctions.moveToolbarIn();
          });
        },

        
        "generateNewAudio" : function() {
          $.getJSON("queue.json", function(json) {
            pageObject.queueObject = new pageObject.Constructor.Queue(json, "queue.json")
            pageObject.currentAudio = new pageObject.Constructor.CurrentAudio(pageObject.queueObject.queue, pageObject.queueObject.currentIndex);
            pageObject.currentAudio.changeMusicPlayerMeta();
            pageObject.currentAudio.playMusic();
          });
        },

        "updateApi": function(objectVariable, src) {
            $.getJSON(src, function(api) {
                objectVariable = JSON.parse(JSON.stringify(api));
            });
        }
    },


    "Constructor": {

        "CurrentAudio": function(object, index) {
            this.songTitle = object[index].title;
            this.artist = object[index].artist;
            this.src = object[index].src;
            this.picture = object[index].picture;
            this.dogTag = pageObject.helperFunctions.generateUniqueID();
            this.volume = "0.0";
            this.audioElement = document.createElement("audio");
            this.audioElement.setAttribute("src", this.src)
            this.audioElement.setAttribute("hidden", "true");
            this.audioElement.setAttribute("volume", this.volume);
            this.audioElement.setAttribute("autoplay", "true");
            this.audioElement.setAttribute("id", "now-playing");
            this.audioObject = new Audio(this.audioElement.src);

            /*METHODS*/
            
            this.changeMusicPlayerMeta = function() {
              $("#text-meta").html("<h6>" + this.artist + "</h6>" + "<p>" + this.songTitle + "</p>");
              document.querySelector("#song-pic").setAttribute("src", this.picture);
            },

            this.playMusic = function() {
              pageObject.currentAudio.audioElement.play();
              pageObject.playingMusic = true;
              $(pageObject.audioPlayDom).html("pause")
            },

            this.pauseMusic = function() {
              pageObject.currentAudio.audioElement.pause();
              pageObject.playingMusic = false;
              $(pageObject.audioPlayDom).html("play_arrow");
            }

          },

        "Queue": function(json, api_url) {
            this.queue = json == String || json != Object ? JSON.parse(JSON.stringify(json)) : json;
            this.apiUrl = api_url;
            this.currentIndex = 0;
            this.queueLength = Object.keys(this.queue).length;
            this.dogTag = pageObject.helperFunctions.generateUniqueID();

            this.skipNext = function() {
              pageObject.queueObject.currentIndex++;
              pageObject.currentAudio.audioElement.pause();
              pageObject.currentAudio = new pageObject.Constructor.CurrentAudio(json, this.currentIndex);
              pageObject.currentAudio.changeMusicPlayerMeta();
              $(pageObject.audioPlayDom).html("pause");
            }

            this.skipPrevious = function() {
              pageObject.queueObject.currentIndex--;
              pageObject.currentAudio.audioElement.pause();
              pageObject.currentAudio = new pageObject.Constructor.CurrentAudio(json, this.currentIndex);
              pageObject.currentAudio.changeMusicPlayerMeta();
              $(pageObject.audioPlayDom).html("pause");
            }

            this.playRandomSong = function() {
              pageObject.currentAudio.audioElement.pause();
              let randomIndex = Math.floor(Math.random * Object.keys(json) - 1);
              pageObject.currentAudio = new pageObject.Constructor.CurrentAudio(json, randomIndex);
              pageObject.currentAudio.changeMusicPlayerMeta();
              $(pageObject.audioPlayDom).html("pause");
            }
        }
    }
};


/* TOOLBAR ANIMATION */
$(pageObject.libDom).on("click", function() {

    pageObject.helperFunctions.listenForClose();

    if (pageObject.toolBarOut) {
        pageObject.helperFunctions.moveToolbarIn();
    } 
    
    else if (!pageObject.toolBarOut) {
        pageObject.helperFunctions.moveToolbarOut();
    }

});

/* PLAY AND PAUSE */
$(pageObject.audioPlayDom).on("click", function() {

    if (!pageObject.playingMusic && Object.keys(pageObject.currentAudio).length == 0) {
      pageObject.helperFunctions.generateNewAudio();
    } 
    else if (!pageObject.playingMusic && Object.keys(pageObject.currentAudio).length != 0) {
      pageObject.currentAudio.playMusic();
    } 
    
    else if (pageObject.playingMusic) {
        pageObject.currentAudio.pauseMusic();
    }

});

/* SKIP FORWARD*/
$(pageObject.audioSkipNextDom).on("click", function() {

    if (pageObject.queueObject.currentIndex == Object.keys(pageObject.queueObject.queue).length - 1) {
        pageObject.queueObject.currentIndex = -1;
    }
    
   pageObject.queueObject.skipNext();

})

/* SKIP BACK */
$(pageObject.audioSkipPreviousDom).on("click", function() {

    if (pageObject.queueObject.currentIndex == 0) {
        pageObject.queueObject.currentIndex = Object.keys(pageObject.queueObject.queue).length;
    }

    pageObject.queueObject.skipPrevious();

});


$(pageObject.audioVolumeButtonDom).on("click", function(){  

  if(pageObject.muted) {
    pageObject.currentAudio.audioElement.volume = pageObject.volume;
    pageObject.muted = false;
  }

  else {
    pageObject.currentAudio.audioElement.volume = 0.0;
    pageObject.muted = true;
  }
});
