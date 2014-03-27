$("#principal").live("pageinit", function() {
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/productosipos",{ },getProductos);
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/parametros/250",{ },getCausas);
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/parametros/241",{ },getAreas);
});

$("#save").live("click", function(e) {
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
		 var idUsuario = "13176947";
		 fecha = moment().format("YYYYMMDD");
		 hora = moment().format("HHmmss");
		 $.ajax({ 
			type: "POST",
			url: "http://www.anywhere.cl/wsanywhere/services/alertaquiebrestock/save/",
			data: { a1:idUsuario,a2:producto.value,a3:stock.value,a4:fecha,a5:hora,
					a6:facingImage,a7:posLatitud,a8:posLongitud,a9:$("#direccion").val()
			},
			crossDomain : true,
			success: function(data,status,jqXHR) { 
				popup("Mensaje", "Se ha enviado la alerta","index.html")
				limpiaForm('#formulario');
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				popup("Mensaje", "Ocurrio un error al enviar la alerta","index.html")
				limpiaForm("#formulario");	
			 },
			complete: function(data) { }	
		})
	}
});

$("#photo").live("click",function() {
	capturePhotoEdit(Camera.PictureSourceType.CAMERA)
})

function getProductos(data){
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#producto").append($("<option>", {value : val2[0].value}).text(val2[1].value));
		});
	});
}

function getCausas(data){
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#causa").append($("<option>", {value : val2[0].value}).text(val2[1].value));
		});
	});
}

function getAreas(data){
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#area").append($("<option>", {value : val2[0].value}).text(val2[1].value));
		});
	});
}