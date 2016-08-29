$(document).ready(function() {

  // See: http://docs.jquery.com/Tutorials:Introducing_$(document).ready()

$(document).foundation();

var MYMODULE = (function(){

  var MYMODULE = {}

  var SONG_SUBMIT_VALUES = ["title", "artist", "url"];
  var SONGS_NODE = $('.songs')

  var createSongObject = function(){
    var songObject = {};
    SONG_SUBMIT_VALUES.forEach(function(string){
      songObject[string] = document.getElementById(string).value
    });
    return songObject
  }

  var createSongNode = function(songObject){
    $songNode = $('.song-template')
      .first()
      .clone()
      .removeClass('.song-template')
      .addClass('.song');

    $songNode.attr("data-song-id", songObject.id);
    $songNode.find("h2").text(songObject.title);
    $songNode.find("h3").text(songObject.artist);
    $songNode.find("a").attr("src", songObject.url);
    $songNode.show();

    SONGS_NODE.append($songNode)
  }

  var refreshSongs = function(collection){
    SONGS_NODE.fadeOut(1000, function(){
      SONGS_NODE.empty();
      collection.forEach(function(value){
        SONGS_NODE.append(createSongNode(value));
      });
      SONGS_NODE.fadeIn(1000);
    });
  }

  var populateEditForm = function(songObject){
    document.getElementById("edit-song-id").value = songObject.id;
    document.getElementById("edit-title").value = songObject.title;
    document.getElementById("edit-artist").value = songObject.artist;
    document.getElementById("edit-url").value = songObject.url;
  }

  var message = function(string){
    $('.status-message').text(string);
  };

  var getSearchTerm = function(){
    return document.getElementById('search-term').value;
  }

  MYMODULE.createSongObject = createSongObject;
  MYMODULE.createSongNode = createSongNode;
  MYMODULE.refreshSongs = refreshSongs;
  MYMODULE.populateEditForm = populateEditForm;
  MYMODULE.message = message;
  MYMODULE.getSearchTerm = getSearchTerm;

  return MYMODULE

})();

  $('#submit-song').on("click", function(){
    $.post({
      url: '/api/songs',
      dataType: 'json',
      data: {
        song: MYMODULE.createSongObject()
      },
      success: function(data){
        MYMODULE.message('Successfully added a song!');
        MYMODULE.createSongNode(MYMODULE.createSongObject());
      },
      error: function(){
        MYMODULE.message('There was an error in adding your song.')
      }
    });
  });

  $('.songs').on("click", ".delete-song", function(){
    $.ajax({
      url: '/api/songs',
      method: 'DELETE',
      data: {
        id: $(this).parent().data("songId")
      },
      success: MYMODULE.message.bind(null, "Successfully deleted your song!"),
      error: MYMODULE.message.bind(null, "There was an error in deleting your song!")
    });
    $(this).parent().hide();
  });

  $('.songs').on("click", ".edit-song", function(){
    $.ajax({
      url: '/api/song',
      method: 'GET',
      data: {
        id: $(this).parent().data("songId")
      },
      success: function(data){
        MYMODULE.populateEditForm(data);
      }
    })
  });

  $('.update-song').on('click', function(){
    $.ajax({
      url: '/api/song',
      method: 'PUT',
      data: {
        id: document.getElementById("edit-song-id").value,
        song: {
          title: document.getElementById("edit-title").value,
          artist: document.getElementById("edit-artist").value,
          url: document.getElementById("edit-url").value
        }
      },
      success: function(data){
        MYMODULE.refreshSongs(data);
      }
    })
  });

  $('#search-song').on("click", function(){
    $.get({
      url: '/api/search',
      data: {
        search_term: MYMODULE.getSearchTerm()
      },
      success: function(data){ MYMODULE.refreshSongs(data) },
      error: MYMODULE.message.bind(null, "There was an error in searching for your song")
    });
  });

});
