$("#principal").live("pageinit", function() {
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
					url: "http://www.anywhere.cl/wsanywhere/services/alertaprecio/save",
					data: { a1 : user, a2 : $("#local").val(), a3 : $("#punto_de_venta").val(), a4 : $("#competidor").val(), a5 : $("#producto").val(), a6 : $("#precio").val() },
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
				});
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
	$("#producto_servicio").chained("#punto_de_venta");
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
