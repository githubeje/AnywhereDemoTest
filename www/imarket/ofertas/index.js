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
					$.ajax({ 
						type: "POST",
						url: "http://www.anywhere.cl/wsanywhere/services/oferta/save",
						data: { a1:nombre.value,a2:descripcion.value,a3:fecha_inicio.value,a4:fecha_termino.value,a5:local.value,a6:punto_de_venta.value,"a7":producto.value,
								a8:precio_base.value,a9:nuevo_precio.value,a10:facingImage,a11:estado_gestion},
						crossDomain : true,
		                beforeSend: function() {
		                    $.mobile.showPageLoadingMsg();
		                },						
						success: function(data,status,jqXHR) { 
							limpiaForm("formulario");
							popup("Aviso", "Sus datos fueron grabados con exito","../index.html#procesos_competencia");
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { },
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
