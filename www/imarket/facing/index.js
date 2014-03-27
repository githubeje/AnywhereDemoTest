$("#principal").live("pageinit", function() {
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/productos",{ }, getProductos);
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/puntoventas",{ }, getPtoDeVtas);
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/competidores",{ }, getCompetidores);
	getFechaActual();
		
	$("#save").click(
		function() {
			var direccion = document.getElementById("direccion_fisica").value;
			var user = "1";
			$.ajax({ 
				type: "POST",
				url: "http://www.anywhere.cl/wsanywhere/services/upload/facing",
				data: { a1 : facingImage, 
						a2 : user, 
						a3 : "Nada por el momento", 
						a4 : producto.value, 
						a5 : pto_de_vta.value, 
						a6 : posLatitud, 
						a7 : posLongitud, 
						a8 : direccion
				},
				crossDomain : true,
				success: function(data,status,jqXHR) {
					popup("Mensaje", "Su foto fue guardada con &eacute;xito","../index.html");					
				},
				beforeSend: function() {
					$.mobile.showPageLoadingMsg();
				},				
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					popup("Mensaje", "Ocurrio un error al grabar la visita : " + errorThrown,"../index.html");
				},
				complete: function(data) {
					$.mobile.hidePageLoadingMsg();
				}
		})			
	});			
});
	
function getProductos (data){
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#producto").append($("<option>", {value : val2[0].value}).text(val2[1].value));
		});
	});			    		
}

function getPtoDeVtas (data){
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#pto_de_vta").append($("<option>", {value : val2[0].value}).text(val2[1].value));
		});
	});			    		
}

function getCompetidores (data){
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#competidor").append($("<option>", {value : val2[0].value}).text(val2[1].value));
		});
	});			    		
}

function getFechaActual(){
	f = new Date();
	$("#fecha").val(f.getFullYear() + "/" + (f.getMonth() +1) + "/" + f.getDate());
}
