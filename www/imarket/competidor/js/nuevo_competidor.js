$("#principal").live("pageinit", function() {
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/establecimientos",{},loadOne);
	
	$("#save").click(
		function() {
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
				var estado_gestion = 205;
				direccion = calle.value + " " + numero.value + ", " + comuna.value + ", " + region.value + ", " + pais.value;
				geocoder = new google.maps.Geocoder();
				geocoder.geocode( { "address": direccion}, 
					function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							latitud = results[0].geometry.location.lat();
							longitud = results[0].geometry.location.lng();
							save(nombre.value,descripcion.value,local.value,punto_de_venta.value,producto.value,representante_legal.value,giro.value,direccion,latitud,longitud,estado_gestion);
						}
						else {
							$("html").simpledialog2({
								mode: "button",
						   		headerText: "Precaucion",
						    	headerClose: true,
						    	buttonPrompt: "La direccion que Ud. ha indicado no se puede encontrar. Desea Guardar de todas maneras?",
						    	buttons : {
						    		"OK": {
						    			click: function () { 
											save(nombre.value,descripcion.value,local.value,punto_de_venta.value,producto.value,representante_legal.value,giro.value,direccion,"0","0",estado_gestion);
											limpiaForm("formulario");
											$(location).attr("href","index.html");
						    			}
							    	},
									"Cancel": {
										click: function () { 
											$(location).attr("href","#principal");
										},
										icon: "delete",
										theme: "c"
									}
							    }
							});								
						}
					}
				);
			}
	});		
});

function save(nombre,descripcion,local,punto_de_venta,producto,representante_legal,giro,direccion,latitud,longitud,estado_gestion) {
	$.ajax({ 
		type: "POST",
		url: "http://www.anywhere.cl/wsanywhere/services/competitor/save",
		data: { a1:nombre,a2:descripcion,a3:local,a4:punto_de_venta,a5:producto,a6:representante_legal,a7:giro,a8:direccion,a9:latitud,a10:longitud,a11:estado_gestion},
		crossDomain : true,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg();
        },							
		success: function(data,status,jqXHR) {
			limpiaForm("formulario");
			popup("Aviso", "Sus datos fueron grabados con exito","index.html");								
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { },
        complete: function(data) {
            $.mobile.hidePageLoadingMsg();
        }
	});
}

function loadOne(data) {
	getLocal(data);
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/puntoventas",{},loadTwo);	
}

function loadTwo(data) {
	getPtoVenta(data);
	$("#punto_de_venta").chained("#local");
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/productos",{},loadTree);
}

function loadTree(data) {
	getProductos(data);
	$("#producto").chained("#punto_de_venta");
}

function getLocal(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#local").append($("<option>", {value : val2[0].value}).text(val2[1].value));
		});
	});			    		
}

function getPtoVenta(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#punto_de_venta").append($("<option>", {value : val2[0].value}).addClass( val2[5].value).text(val2[1].value));
		});
	});			    		
}

function getProductos(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#producto").append($("<option>", {value : val2[0].value}).addClass( val2[3].value).text(val2[1].value));
		});
	});
}

$("#mapa").live("pageshow", function() {
	direccion = calle.value + ' ' + numero.value + ', ' + comuna.value + ', ' + region.value + ', ' + pais.value;
	map = null;
	principal = "#principal";
	drawMap("canvas",direccion,principal);
});	

$("#loaddirection").live("click",function(e) {
	$(location).attr("href","#principal");
});
