var markers = new Array();
var map;
var icons = new Array();
var dist = 0;

$("#filtro").live("pageinit", function() {
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/categoria",{ },loadOne);
	
	$("#buscar").live("click", function() {
		$.mobile.showPageLoadingMsg();
		if (categorias.value == 1 && subcategorias.value == 0){
			$("#descripcion").addClass("required");
		}
		else {
			$("#descripcion").removeClass("required").addClass("");
		}
		if ($("#formulario").validate({
			 errorPlacement: function(error, element) {
				 if ($(element).is("select")) {
					 error.insertAfter($(element).parent());
				 }
				 else {
					 error.insertAfter(element);
				 }
			 }
		}).form() == true) {
			dist = $("#distance").val();
			if (categorias.value == 1 && subcategorias.value == 0 || descripcion.value != ""){
				$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/locales/" + categorias.value + "/" + subcategorias.value + "/" + descripcion.value,{ }, getPuntos);
			}
			else {
				$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/locales/" + categorias.value + "/" + subcategorias.value+ "/'" + descripcion.value + "'",{ }, getPuntos);
			}
		}
		$.mobile.hidePageLoadingMsg();
	});
});

function getPuntos(data) {
    markers = [];
    var x=0;
    $.each(data, function(key, val) {
        markers[x] = new Array(6);
        $.each(val, function(key2, val2) {
            markers[x][0] = val2[0].value;  //id
            markers[x][1] = val2[1].value;  //latitud
            markers[x][2] = val2[2].value;  //longitud
            markers[x][3] = val2[3].value;  //description 
            markers[x][4] = val2[4].value; 	//imagen
            markers[x][5] = val2[5].value; 	//link
        }); 
        x = x + 1;
    });
    if (data == "") {
    	popup("Mensaje", "No hay coincidencias con su busqueda, pruebe busqueda por categorias clasificadas", "#filtro");
    	$.mobile.hidePageLoadingMsg();
    }
    else {
    	$(location).attr("href","#mapa");
    }
}

$("#mapa").live("pageshow", function() {	
	map = null;
    getLocales();
});

function loadOne(data) {
	getCategorias(data);
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/subcategoria",{ },loadTwo);
}

function loadTwo(data) {
	getSubCategorias(data);
	$("#subcategorias").chained("#categorias");
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/distancia/195",{ },getDistancia);
}
      
function getCategorias(data) {
    $.each(data, function(key, val) {
        $.each(val, function(key2, val2) {
        	$("#categorias").append($("<option>", {value : val2[0].value}).text(val2[1].value));
        });
    });        
}

function getSubCategorias(data) {
    $.each(data, function(key, val) {
        $.each(val, function(key2, val2) {
        	$("#subcategorias").append($("<option>", {value : val2[0].value}).addClass(val2[3].value).text(val2[1].value));
        });
    });        
}

function getDistancia(data) {
	$.each(data, function(key, val) {
        $.each(val, function(key2, val2) {
        	$("#distance").append($("<option>", {value : val2[1].value}).text(val2[2].value));       
        });
    });        
}

function getLocales() {
	$("#canvas").gmap("getCurrentPosition", function(position, status) {
		if ( status === "OK" ) {
            latitud = position.coords.latitude;
            longitud = position.coords.longitude;
            var iconBase = "http://maps.google.com/mapfiles/kml/pal5/";
            var enlace = new Array(); 
            var imagen = new Array(); 
            google.maps.visualRefresh = true;
            var mapOptions = {
            		zoom: 13,
            		center: new google.maps.LatLng(latitud,longitud),
            		mapTypeId: google.maps.MapTypeId.ROADMAP,
            };
            map = new google.maps.Map(document.getElementById("canvas"), mapOptions);
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(latitud,longitud),
                map: map,
                title : "Lugar donde se encuentra",
            	icon: iconBase + "icon6.png",
            	shadow: iconBase + "icon6s.png",
            	animation: google.maps.Animation.BOUNCE,
            	draggable: false
            }); 
            var radioSearch = {
            	strokeColor: "#8193FC",
            	strokeOpacity: 0.8,
            	strokeWeight: 2,
            	fillColor: "#8193FC",
            	fillOpacity: 0.35,
            	map: map,
            	center: map.getCenter(),
            	radius: parseInt(dist)
            };
            cityCircle = new google.maps.Circle(radioSearch); 
            var bounds = new google.maps.LatLngBounds();
            var x=0;
            var lat1 = latitud; // lat Posicion Inicial GPS
            var lon1 = longitud; //lon Posicion Inicial GPS
            for (x = 0; x < markers.length; x++) {
            	var pos = new google.maps.LatLng(markers[x][2] , markers[x][1]);
                bounds.extend(pos);
                var lat2 = markers[x][2]; //lat Posicion local
                var lon2 = markers[x][1]; //lon Posicion local
                d = distancia(lat1, lon1, lat2, lon2);
                if (dist >= d) {	
                	var infowindow =  new google.maps.InfoWindow();   
                	imagen[x] = '<img src="' + markers[x][4] + '"' + 'width="250" height="200">';
                	enlace[x] = '<p style="font-family:Bookman Old Style;font-size:12px;"><a href="' + markers[x][5] + '" data-params="id=' + markers[x][0] + '&latitud='+ markers[x][2] + '"  target="_blank">Ver mas Detalles...' + '</a></p>';
                    var pos = new google.maps.LatLng(markers[x][2] , markers[x][1]);
                    bounds.extend(pos);
            		marker = new google.maps.Marker({
                        position: pos,
                        map: map,
                        title : markers[x][3],
                    	icon: "http://maps.google.com/mapfiles/ms/micons/blue-dot.png",
                    	shadow: "http://maps.google.com/mapfiles/ms/micons/msmarker.shadow.png",
                    	draggable: false
                    }); 
            		google.maps.event.addListener(marker, "click", 
            			( 
            				function(marker,x) {
            					return function() {
            						infowindow.setContent('<p style="font-family:Georgia;font-size:12px;color:#CC0000;" align="justify">' + markers[x][3] + '</p><hr><br>'  + imagen[x] + enlace[x]) ;
            						infowindow.open(map, marker);
            					};
            				}
            			)(marker,x));
                }
            }
        }
    });
}


function distancia(lat1, lon1, lat2, lon2) {
	rad = function(x) {return x*Math.PI/180;};
    var R     = 6378.137;
    var dLat  = rad( lat2 - lat1 );
    var dLong = rad( lon2 - lon1 );	
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d.toFixed(4)*1000;
  }

function popup(asunto, msg, url1) {
	$("html").simpledialog2({
		mode: "button",
   		headerText: asunto,
    	headerClose: true,
    	buttonPrompt: msg,
    	buttons : {
    		"OK": {
    			click: function () { 
    				$("#buttonoutput").text("ACEPTAR");
    				if(url1!=""){
    					$(location).attr("href",url1);
    				} 
    				return true;
    			}
	
    		},
    	}
	});
}
