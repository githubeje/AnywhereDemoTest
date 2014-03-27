$("#principal").live("pageinit", function() {
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p1s/root/without/father/59",{ },getGeografica);
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p1s/root/without/father/80",{ },getDemografica);
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p1s/root/without/father/143",{ },getSocioeconomica);
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/competidores",{ },getCompetidores);
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
				user = "1";
				$.ajax({ 
					type: "POST",
					url: "http://www.anywhere.cl/wsanywhere/services/alertacomprador/save",
					data: { a1 : user, a2 : $("#local").val(), a3 : $("#punto_de_venta").val(), a4 : $("#competidor").val(), a5 :$("#producto").val(), a6 :$("#afluencia").val(), a7 : jsonGeografica(), a8 : jsonDemografica(), a9 : jsonSocioeconomica() , a10 : $("#cantidad").val() },
					crossDomain : true,
	                beforeSend: function() {
	                    $.mobile.showPageLoadingMsg();
	                },					
					success: function(data,status,jqXHR) {
						limpiaForm("formulario");
						popup("Aviso", "Sus datos fueron grabados con exito","../index.html");
					},
	                complete: function(data) {
	                    $.mobile.hidePageLoadingMsg();
	                }
				})
			}
		});	
});

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

function getCompetidores (data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#competidor").append($("<option>", {value : val2[0].value}).text(val2[1].value));
		});
	});			    		
}

function getGeografica(data) {
	html = '<div data-role="collapsible" id="geografica" data-theme="b" data-content-theme="d">';
	html +=	 "<h3>Geográfica</h3>";
	i = 0;
	$.each(data, function(data, val) {
		if(val.a4 == "59") {
			if( i != 0 ) {
				html += "</select>";
				html += "</div>";
			}
			html += '<div data-role="fieldcontain"  id="geografica_'+ val.a1 +'">';
			html += '<label for="'+ val.a1 +'">'+ val.a2 +':</label>';
			html += '<select id="'+ val.a1 +'" name="'+ val.a2 + '" class="required" multiple="multiple" data-native-menu="false">';
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
	html +=	 "<h3>Demográfica</h3>";
	i = 0;
	$.each(data, function(data, val) {
		if(val.a4 == "80") {
			if( i != 0 ) {
				html += "</select>";
				html += "</div>";
			}
			html += '<div data-role="fieldcontain"  id="demografica_'+ val.a1 +'">';
			html += '<label for="'+ val.a1 +'">'+ val.a2 +':</label>';
			html += '<select id="'+ val.a1 +'" name="'+ val.a2 + '" class="required" multiple="multiple" data-native-menu="false">';
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
	html +=	 "<h3>Socioeconómica</h3>";
	i = 0;
	$.each(data, function(data, val) {
		if(val.a4 == "143") {
			if( i != 0 ) {
				html += "</select>";
				html += "</div>";
			}
			html += '<div data-role="fieldcontain"  id="socioeconomica_'+ val.a1 +'">';
			html += '<label for="'+ val.a1 +'">'+ val.a2 +':</label>';
			html += '<select id="'+ val.a1 +'" name="'+ val.a2 + '" class="required" multiple="multiple" data-native-menu="false">';
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
	$("#segmento #socioeconomica").collapsible();
	$("#principal").trigger("create");
}

function jsonGeografica() {
	i = 1;
	cadena = "{ '59' : {";
	$("#geografica div :input").each(function() {
		tag = this.tagName.toLowerCase();
		if (tag == "select") {
			value = "{" + $.map($("option:selected", this), function (el, i) {return "'" + $(el).val() + "':'" + $(el).val() + "'"; }).join(", ") + "}";
		}
		else {
			value = "'" + $(this).val() + "'";
		}
		cadena = cadena + "'" + $(this).attr("id") + "' : "+ value;
		if( (i + 1) <= $("#geografica div :input").length) {
			cadena = cadena + ",";
		}	
		i++;
	});
	cadena = cadena + "}}";
	return cadena;
}

function jsonDemografica() {
	i = 1;
	cadena = "{ '80' : {";
	$("#demografica div :input").each(function() {
		tag = this.tagName.toLowerCase();
		if (tag == "select") {
			value = "{" + $.map($("option:selected", this), function (el, i) {return "'" + $(el).val() + "':'" + $(el).val() + "'"; }).join(", ") + "}";
		}
		else {
			value = "'" + $(this).val() + "'";
		}
		cadena = cadena + "'" + $(this).attr("id") + "' : "+ value;
		if( (i + 1) <= $("#demografica div :input").length) {
			cadena = cadena + ",";
		}	
		i++;
	});
	cadena = cadena + "}}";
	return cadena;
}

function jsonSocioeconomica() {
	i = 1;
	cadena = "{ '143' : {";
	$("#socioeconomica div :input").each(function() {
		tag = this.tagName.toLowerCase();
		if (tag == "select") {
			value = "{" + $.map($("option:selected", this), function (el, i) {return "'" + $(el).val() + "':'" + $(el).val() + "'"; }).join(", ") + "}";
		}
		else {
			value = "'" + $(this).val() + "'";
		}
		cadena = cadena + "'" + $(this).attr("id") + "' : "+ value;
		if( (i + 1) <= $("#socioeconomica div :input").length) {
			cadena = cadena + ",";
		}	
		i++;
	});
	cadena = cadena + "}}";
	return cadena;
}