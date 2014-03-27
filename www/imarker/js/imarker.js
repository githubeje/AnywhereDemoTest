var map = null;
var facingImage = "";
var posLatitud = null;
var posLongitud = null;
var pictureSource; 
var destinationType;

$("#principal").live("pageinit", function() {
	$.getJSON("http://192.168.4.218:8080/wsanywhere/services/p2s/querys/categoria",{ }, loadOne);
	$.getJSON("http://192.168.4.218:8080/wsanywhere/services/p2s/querys/estadisticamuestreo",{ }, getEstadisticasCaptura);
	
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
		pictureSource = navigator.camera.PictureSourceType;
		destinationType = navigator.camera.DestinationType;
	}

	capturePhotoEdit = function(source) {
		navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
			quality : 40,
			destinationType : destinationType.DATA_URL,
			sourceType : source,
			EncodingType : 1
		});
	}

	onFail = function(message) {
		alert("Failed because: " + message);
	}

	onPhotoDataSuccess = function(imageData) {
		var capturefacing = document.getElementById("capturefacing");
		capturefacing.style.display = "block";
		capturefacing.src = "data:image/jpeg;base64," + imageData;
		facingImage = imageData;
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	}	
	
	function onSuccess(position) {
		posLatitud = position.coords.latitude;
		posLongitud = position.coords.longitude;
	}

	function onError(error) {
		alert("Intente realizar nuevamente esta operación.  Si el problema persiste, busque un sitio con mejor recepción");
	}	

	$("#close").click(
		function() {
			navigator.app.exitApp()
		}
	);

	$("#grabar").click(
		function() {
			var success = false;
			$.ajax({
				cache: false,
				type: "POST",
				url: "http://192.168.4.218:8080/wsanywhere/services/upload/capturepoint",
				data: { a1 : facingImage, a2 : posLatitud, a3 : posLongitud, a4 : categoria.value, a5 : subcategoria.value, a6 : descripcion.value, a7:link.value  },
				crossDomain : true,
				beforeSend: function() {
					$.mobile.loading("show");
				},
				success: function(data,status,jqXHR) {
					$.ajax({
						cache: false,
						type: "GET",
						url: "http://192.168.4.218:8080/wsanywhere/services/p2s/querys/estadisticamuestreo",
						crossDomain : true,
						success: function(data,status,jqXHR) {
							getEstadisticasCaptura(data);
						},
						error: function(jqXHR, textStatus, errorThrown) {
							  alert(textStatus + "," + errorThrown);
						}
					})					
					facingImage = "";
					document.getElementById("capturefacing").src = "";
					posLatitud = null;
					posLongitud = null;
					$.mobile.loading("hide");
					popup("Mensaje", "Punto marcado con &eacute;xito","index.html");				
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					popup("Mensaje", "Aplicación no disponible en estos instantes, vuelta a intentarlo mas tarde","index.html")
				}
			})
	});
});

$("#mapa").live("pageshow", function() {
	$("#map").gmap("getCurrentPosition", function(position, status) {
		if ( status === "OK" ) {
			posLatitud = position.coords.latitude;
			posLongitud = position.coords.longitude;
            var mapOptions = {
            	zoom: 13,
                center: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
            };
            map = new google.maps.Map(document.getElementById("map"), mapOptions);
            var bounds = new google.maps.LatLngBounds();
            var x=0;
            markers = new google.maps.Marker({
            	position: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
            	title: "Punto marcado",
            	map: map,
            	draggable: false
            });
		}
	});
});

function loadOne(data) {
	getCategorias(data);
	$.getJSON("http://192.168.4.218:8080/wsanywhere/services/p2s/querys/subcategoria",{ }, loadTwo);
}

function loadTwo(data) {
	getSubCategorias(data);
	$("#subcategoria").chained("#categoria");
}

function getCategorias(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#categoria").append($("<option>", {value : val2[0].value}).text(val2[1].value));
		});
	});			    		
}

function getSubCategorias(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#subcategoria").append($("<option>", {value : val2[0].value}).addClass( val2[3].value).text(val2[1].value));
		});
	});			    		
}

function getEstadisticasCaptura(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#diaria").val(val2[0].value);
			$("#total").val(val2[1].value);
		});
	});
}
