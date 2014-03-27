$("#principal").live("pageinit", function() {
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p1s/root/without/father/124",{ },getDCC);
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/competidores",{ }, getCompetidores);
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
					url: "http://www.anywhere.cl/wsanywhere/services/alertadcc/save",
					data: { a1: user, a2 : $("#local").val(), a3 : $("#punto_de_venta").val(), a4 : $("#competidor").val(), a5 : jsonDCC() },
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

function getCompetidores (data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#competidor").append($("<option>", {value : val2[0].value}).text(val2[1].value));
		});
	});			    		
}

function getDCC(data) {
	html = "";
	i = 0;
	$.each(data, function(data, val) {
		if(val.a4 == "124") {
			if( i != 0 ) {
				html += "</select>";
				html += "</div>";
			}
			html += "<div data-role='fieldcontain'>";
			html += '<label for="'+ val.a1 +'">'+ val.a2 +':</label>';
			if(val.a7 != "0") {
				html += '<select id="'+ val.a1 +'" name="'+ val.a2 + '" multiple="multiple" data-native-menu="false">';
			}
			else {
				html += '<input type="text" name="'+ val.a2 +'" id="'+ val.a1 +'" value="" />';
			}
		}
		else {
			html += '<option value="'+ val.a1 +'">'+ val.a2 + '</option>';
		}
		i++;
	});
	html += "</select>";
	html += "</div>";
	
	alert(html);
	
	$("#contenido").append(html);
	$("#principal").trigger("create");
}


function jsonDCC() {
	i = 1;
	cadena = "{ '124' : {";
	$("#contenido div :input").each(function() {
		tag = this.tagName.toLowerCase();
		if( i > 3) {
			if (tag == "select") {
				value = "{" + $.map($("option:selected", this), function (el, i) { return "'" + $(el).val() + "':'" + $(el).val() + "'"; }).join(", ") + "}";
			}
			else {
				value = "'" + $(this).val() + "'";
			}
			cadena = cadena + "'" + $(this).attr("id") + "' : "+ value;
			if( (i + 1) <= $("#contenido div :input").length) {
				cadena = cadena + ",";
			}	
		}
		i++;
		
	});
	cadena = cadena + "}}";
	return cadena;
}