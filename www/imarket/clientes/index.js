$("#principal").live("pageinit", function() {
		$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/productos",{ },getProductos);
		$.getJSON("http://www.anywhere.cl/wsanywhere/services/p1s/root/without/father/59",{ },getGeografica);
		$.getJSON("http://www.anywhere.cl/wsanywhere/services/p1s/root/without/father/80",{ },getDemografica);
		$.getJSON("http://www.anywhere.cl/wsanywhere/services/p1s/root/without/father/143",{ },getSocioeconomica);
		
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
					var i=0;
					var asocioeconomica = new Array();
					$("#socioeconomica select ").each(function(index) {
						asocioeconomica[i++] = this.name + "|" + this.value;
					});	
					
					i=0;
					var ageografica = new Array();
					$("#geografica select ").each(function(index) {
						ageografica[i++] = this.name + "|" + this.value;
					});	
					
					i=0;
					var ademografica = new Array();
					$("#demografica select ").each(function(index) {
						ademografica[i++] = this.name + "|" + this.value;
					});	
					
					i=0;
					var aProducto = new Array();
					$("#producto_servicio input ").each(function(index) {
						aProducto[i++] = this.value;
					});	
					geocoder = new google.maps.Geocoder();
					geocoder.geocode( { "address": direccion}, 
						function(results, status) {
							if (status == google.maps.GeocoderStatus.OK) {
								latitud = results[0].geometry.location.lat();
								longitud = results[0].geometry.location.lng();
								save(nombre.value,identificacion.value,correo.value,telefono.value,$("input:radio[name=tipo]:checked").val(),     
										 latitud,longitud,direccion,aProducto,asocioeconomica,ageografica,ademografica,estado_gestion);
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
							    				save(nombre.value,identificacion.value,correo.value,telefono.value,$("input:radio[name=tipo]:checked").val(),     
														 latitud,longitud,direccion,aProducto,asocioeconomica,ageografica,ademografica,estado_gestion);
							    				$(location).attr("href","../index.html#procesos_competencia");
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

function save(nombre,identificacion,correo,telefono,tipo,latitud,longitud,direccion,aProducto,asocioeconomica,ageografica,ademografica,estado_gestion) {
	$.ajax({ 
		type: "POST",
		url: "http://www.anywhere.cl/wsanywhere/services/cliente/save",
		data: { a1:nombre,a2:identificacion,a3:correo,a4:telefono,a5:tipo,     
			a6:latitud,a7:longitud,a8:direccion,"a9[]":aProducto,
			"a10[]":asocioeconomica,"a11[]":ageografica,"a12[]":ademografica,a13:estado_gestion
		},
		crossDomain : true,
		beforeSend: function() {
			$.mobile.showPageLoadingMsg();
		},   									
		success: function(data,status,jqXHR) {
			limpiaForm("formulario");
			$("html").simpledialog2({
				mode: "button",
		   		headerText: "Aviso",
		    	headerClose: true,
		    	buttonPrompt: "Sus datos fueron grabados con exito",
		    	buttons : {
		    		"OK": {
		    			click: function () { 
		    				$(location).attr("href","../index.html#procesos_competencia");
		    			}
			    	}
			    }
			});				
		},	
		error: function(XMLHttpRequest, textStatus, errorThrown) { console.log("--->error"); },
        complete: function(data) {
            $.mobile.hidePageLoadingMsg();
        }								
	});
}

function getProductos (data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			html = "";
			html += '<input type="checkbox" name="producto" id="producto_'+ val2[0].value +'" class="custom" value="'+ val2[0].value +'" />';
			html += '<label for="producto_'+ val2[0].value +'">'+ val2[1].value +'</label>';
			$("#producto_servicio fieldset").append(html);
			$("#producto_" + val2[0].value).checkboxradio();
		});
	});		
	$("#principal").trigger("create");	    		
}

function getGeografica(data) {
	html = '<div data-role="collapsible" id="geografica" data-theme="b" data-content-theme="d">';
	html +=	 "<h3>Geogr&aacute;fica</h3>";
	i = 0;
	$.each(data, function(data, val) {
		if(val.a4 == "59") {
			if( i != 0 ) {
				html += "</select>";
				html += "</div>";
			}
			html += '<div data-role="fieldcontain"  id="geografica_'+ val.a1 +'">';
			html += '<label for="'+ val.a2 +'">'+ val.a2 +':</label>';
			html += '<select id="'+ val.a2 +'" name="'+ val.a1 + '" class="required">';
			html += '<option value="" selected>Elegir '+ val.a2 + '</option>';
		}
		else {
			html += '<option value="'+ val.a1 +'">'+ val.a2 + '</option>';
		}
		i++;
	});
	html += "</select>";
	html += "</div>";
	
	$("#segmento").append(html);
	$("#segmento #geografica").collapsible();
	$("#principal").trigger("create");
}

function getDemografica(data) {
	html = '<div data-role="collapsible" id="demografica" data-theme="b" data-content-theme="d">';
	html +=	 "<h3>Demogr&aacute;fica</h3>";
	i = 0;
	$.each(data, function(data, val) {
		if(val.a4 == "80") {
			if( i != 0 ) {
				html += "</select>";
				html += "</div>";
			}
			html += '<div data-role="fieldcontain"  id="demografica_'+ val.a1 +'">';
			html += '<label for="'+ val.a2 +'">'+ val.a2 +':</label>';
			html += '<select id="'+ val.a2 +'" name="'+ val.a1 + '" class="required">';
			html += '<option value="" selected>Elegir '+ val.a2 + '</option>';
		}
		else {
			html += '<option value="'+ val.a1 +'"  >'+ val.a2 + '</option>';
		}
		i++;
	});
	html += "</select>";
	html += "</div>";
	
	$("#segmento").append(html);
	$("#segmento #demografica").collapsible();
	$("#principal").trigger("create");
}

function getSocioeconomica(data) {
	html = '<div data-role="collapsible" id="socioeconomica" data-theme="b" data-content-theme="d">';
	html +=	 "<h3>SocioEconomica</h3>";
	i = 0;
	$.each(data, function(data, val) {
		if(val.a4 == "143") {
			if( i != 0 ) {
				html += "</select>";
				html += "</div>";
			}
			html += '<div data-role="fieldcontain"  id="socioeconomica'+ val.a1 +'">';
			html += '<label for="'+ val.a2 +'">'+ val.a2 +':</label>';
			html += '<select id="'+ val.a2 +'" name="'+ val.a1 + '" class="required">';
			html += '<option value="" selected>Elegir '+ val.a2 + '</option>';
		}
		else {
			html += '<option value="'+ val.a1 +'"  >'+ val.a2 + '</option>';
		}
		i++;
	});
	html += "</select>";
	html += "</div>";
	$("#segmento").append(html);
	$("#segmento #socioeconomica").collapsible();
	$("#principal").trigger("create");
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

	