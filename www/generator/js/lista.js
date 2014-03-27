$("#principal").live("pageinit", function(e) {
	$.ajax({ 
		type: "GET",
		dataType:"json",
		url: "http://192.168.4.218:8080/wsanywhere/services/p2s/querys/listadoformulario",
		crossDomain : true,
		success: function(data,status,jqXHR) {
			$("#lista").empty();
			$.each(data, function(key, val) {
				html = "<li id='" + val.h[0].value + "'><a href='formulario.html?idform=" + val.h[0].value + "&title="+ val.h[1].value + "&description="+ val.h[2].value + "' rel='external' data-ajax='false'>" + val.h[1].value + "</a></li>";
				$("#lista").append(html);
			});				
			$("#lista").listview().listview("refresh");
		},
		beforeSend: function() {
		    e.preventDefault();
		    e.stopPropagation();					
		    $.mobile.loading("show");
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			popup("Mensaje", "Aplicación no disponible en estos instantes, vuelta a intentarlo mas tarde","index.html")
		},
		complete: function(data) { }				
	});	
});
