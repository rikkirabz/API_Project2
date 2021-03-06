window.onload = function() {

  var searchBox           = document.getElementById('search-box');
  var searchBoxDiv        = document.getElementById('search-box-div');
  var searchBtn           = document.getElementById('search-glass');
  var backgrounds         = document.getElementById('backgrounds');
  var results             = document.getElementById("results");
  var body                = document.getElementById("body");
  var right               = document.getElementById("right");
  var home                = document.getElementById("home");
  var favsPlace           = document.getElementById("favs-place");
  var favsImage           = document.getElementById("favs-image");
  var favsPlaceClear      = document.getElementById("favs-place-clear");
  var favsImageClear      = document.getElementById("favs-image-clear");
  var nameContainer       = document.getElementById("results-name");
  var tempContainer       = document.getElementById("results-temp");
  var flexMain            = document.getElementById("flex-main");

  var highestLikes = 0;
  var highestLikesUrl = "";
  var highestFavs = 0;
  var highestFavsUrl = "";
  var url = 'http://localhost:3000';
  var locatName;

  function hide(){
    results.style.display = "none";
    results.innerHTML = "";
    nameContainer.innerHTML = "";
    tempContainer.innerHTML = "";
    flexMain.innerHTML = "";
    backgrounds.style.display = "none";
  }

  function show(){
    results.style.display = "flex";
    backgrounds.style.display = "flex";
  }
  hide();

  home.addEventListener("click", function(ev){
    ev.preventDefault();
    location.reload();
  })

  favsImage.addEventListener("click", function(ev){
    console.log("favsImage was pressed");
    ev.preventDefault();
    $.ajax({
      url: url + '/images/favorites',
      method: 'GET',
      dataType: 'json'
    }).done(function(response) {
      console.log( "response:", response );
      display(response);
    }); // end ajax
  })

  favsPlace.addEventListener("click", function(ev){
    console.log("favsPlace was pressed");
    ev.preventDefault();
    $.ajax({
      url: url + '/places/favorites',
      method: 'GET',
      dataType: 'json'
    }).done(function(response) {
      console.log( "response:", response );
      display(response);
    }); // end ajax
  })

  favsImageClear.addEventListener("click", function(ev){
    ev.preventDefault();
    var permission = prompt("Are you sure you want to clear your favorite images? Y/N");
    if(permission.toLowerCase() == "y"){
      $.ajax({
        url: url + '/images/favorites',
        method: 'DELETE',
        dataType: 'json'
      }).done(function(response) {
        console.log( "response:", response );
        display(response);
      }); // end ajax
    }
  })

  favsPlaceClear.addEventListener("click", function(ev){
    ev.preventDefault();
    var permission = prompt("Are you sure you want to clear your favorite images? Y/N");
    if(permission.toLowerCase() == "y"){
      $.ajax({
        url: url + '/places/favorites',
        method: 'DELETE',
        dataType: 'json'
      }).done(function(response) {
        console.log( "response:", response );
        display(response);
      }); // end ajax
    }
  })

  searchBtn.addEventListener('click', function(ev) {
    hide();
    show();
    ev.preventDefault();
    backgrounds.innerHTML = "";
    results.innerHTML = "";

    var placeSearch = searchBox.value;

    var data = {
      queryString: placeSearch
    };

    $.ajax({
      url: url + '/places/search',
      method: 'POST',
      data: data,
      dataType: 'json'
    }).done(function(response) {
      console.log( "response:", response );
      display(response);
    }); // end ajax

    $.ajax({
      url: url + '/images/search',
      method: 'POST',
      data: data,
      dataType: 'json'
    }).done(function(response) {
      console.log( "response:", response );
      determineBackground(response);
    }); // end ajax
  }); // end search btn

  function determineBackground(response){
    var resHits = response.hits;
    var resHitsLen = resHits.length;
    highestLikes = 0;
    highestFavs = 0;
    if(response.totalHits < 1){
      backgrounds.innerHTML = "SORRY THERE ARE NO IMAGES WITH THAT CRITERIA, TRY AGAIN..."
    }
    else{
      for(var i = 0; i < resHitsLen; i++){
        if(resHits[i].likes > highestLikes){
          highestLikes = resHits[i].likes;
          highestLikesUrl = resHits[i].webformatURL;
        }
        if(resHits[i].favorites > highestFavs){
          highestFavs = resHits[i].favorites;
          highestFavsUrl = resHits[i].webformatURL;
        }

        set_background(highestLikesUrl);

        var imgContainer = document.createElement('div');
        imgContainer.id="img-containerID"
        backgrounds.appendChild(imgContainer)

        var img = document.createElement('img');
        var pic = resHits[i].webformatURL;
        img.src = pic;
        img.id = "img-id";

        var button = document.createElement("button");
        button.id = "makeBack";
        button.className = "glyphicon glyphicon-plus"
        button.innerText = "make back"

        var add = document.createElement("button");
        add.id = "add";
        add.className="glyphicon glyphicon-heart";
        add.innerText = "Favorite"

        imgContainer.appendChild(img);
        imgContainer.appendChild(button);
        imgContainer.appendChild(add);

        button.addEventListener("click", function(){
          console.log("BACKGROUND BUTTON WAS PRESSED");
          var parent = $(this).parent();
          var childImg = parent[0].children[0].src;
          set_background(childImg);
        }) //button listener

        add.addEventListener("click", function(){
          var parent = $(this).parent();

          var dataImg = parent[0].children[0].currentSrc;

          var data= {
            imgURL: dataImg
          }

          $.ajax({
            url: url + '/images/favorites',
            method: 'POST',
            data: data,
            dataType: 'json'
          }).done(function(response) {
            console.log( "response: from adding to favorites", response );
          }); // end ajax
        }); // end add btn
      } //end for loop
    }//end else
  } //end funx

  function set_background(childImg){
    var reg = "linear-gradient(to top, rgba(186, 186, 186, 0.47), rgba(86, 86, 86, 0.7)), ";
    var moz = "-moz-linear-gradient(to top, rgba(186, 186, 186, 0.47), rgba(86, 86, 86, 0.7)), ";
    var webkit = "-webkit-linear-gradient(to top, rgba(186, 186, 186, 0.47), rgba(86, 86, 86, 0.7)), ";
    var ms = "-ms-linear-gradient(to top, rgba(186, 186, 186, 0.47), rgba(86, 86, 86, 0.7)), ";
    var second = "url("+childImg+")"
    right.style.background=reg + second;
    right.style.background=moz + second;
    right.style.background=webkit + second;
    right.style.background=ms + second;
    right.style.backgroundSize="cover, cover";
    right.style.backgroundPosition = "center";
    right.style.backgroundRepeat = "no-repeat";
    right.style.backgroundAttachment = "fixed"
  }

  function display(response){
    hide();
    show();

    for(var key in response){
      switch (key) {
        case "main":
          var main = document.createElement('div');
          main.innerHTML = "<b>Main:</b>";
          main.id="mainid";
          results.appendChild(main);
          var outerIndex = response[key];
            for(var inner in outerIndex){
              switch (inner) {
                case "temp":
                  main.innerHTML+="Temperature is: " + outerIndex[inner] + "˚<br>";
                  var temp = document.createElement("div");
                  temp.id = "tempid";
                  temp.innerHTML=outerIndex[inner] + "˚";
                  tempContainer.appendChild(temp);
                  flexMain.appendChild(tempContainer);
                  results.appendChild(flexMain);
                  break;
                case "temp_max":
                  main.innerHTML+="Max Temperature: " + outerIndex[inner] + "˚<br>";
                  break;
                case "temp_min":
                  main.innerHTML+="Min Temperature: " + outerIndex[inner] + "˚<br>";
                  break;
                case "humidity":
                  main.innerHTML+="Humidity: " + outerIndex[inner] + "˚<br>";
                  break;
                default:
                  break;
              } //end switch
            } //end for
          break;

        case "name":
          var name = document.createElement('div');
          name.id="nameid";
          nameContainer.appendChild(name);
          flexMain.appendChild(nameContainer);
          results.appendChild(flexMain);
          name.innerHTML +=response[key];
          var add = document.createElement("button");
          add.id = "add";
          add.className="glyphicon glyphicon-heart";
          add.innerText = "Favorite"
          flexMain.appendChild(add);

          add.addEventListener("click", function(){
            var parent = $(this).parent();
            locatName = parent[0].children[1].children[0].childNodes[0].data;

            var dataPlace = {
              name: locatName
            }

            $.ajax({
              url: url + '/places/favorites',
              method: 'POST',
              data: dataPlace,
              dataType: 'json'
            }).done(function(response) {
              console.log( "response: from adding to favorites places", response );
            }); // end ajax
          }); // end add btn
          break;

        case "weather":
          var weather = document.createElement('div');
          weather.innerHTML = "<br>"+"<b>"+ "Description" + ":</b><br>";
          results.appendChild(weather);
          weather.id="weatherid";
          var outerIndex = response[key];
          var innerIndex = outerIndex[0];
            for(var inner in innerIndex){
              switch (inner) {
                case "description":
                    weather.innerHTML+=innerIndex[inner] + "<br>";
                  break;
                default:
                  break;
              } //end switch
            } //end for
          break; //end case weather
        default:
          break;
      } //end switch
    } //end for in loop
  } //end function
}; // end window onload fxn
