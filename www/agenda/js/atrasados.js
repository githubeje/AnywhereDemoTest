$("#principal").live("pageinit",function(e) {
	rut = getParameterByName("rut");
});

$("#diaria").live("click",function(e) {
	tipo = "diaria";
	rut = getParameterByName("rut");
	if(tipo!=null || rut!=null) {
		eventosPorRut(tipo,rut);
	}
});

$("#semanal").live("click",function(e) {
	tipo = "semanal";
	rut = getParameterByName("rut");
	if(tipo!=null || rut!=null) {
		eventosPorRut(tipo,rut);
	}
});

$("#mensual").live("click",function(e) {
	tipo = "mensual";
	rut = getParameterByName("rut");
	if(tipo!=null || rut!=null) {
		eventosPorRut(tipo,rut);
	}
});

function eventosPorRut(tipo,rut) {
	$("#lista").empty();
	$.ajax({ 
		type: "GET",
		dataType:"json",
		url: "http://www.anywhere.cl/agenda/personal/atrasadas",
		data: { rutPer : rut },
		crossDomain : true,
		beforeSend: function() {
			$.mobile.showPageLoadingMsg();
		},		
		success: function(data,status,jqXHR) {
			cargaEventos(tipo,data);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
			alert(textStatus + "," + errorThrown);
		},
		complete: function(data) {
			$.mobile.hidePageLoadingMsg();
		}	
	})
}

function cargaEventos(tipo,data) {
	var dayNames = new Array("Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado");
	var monthNames = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
	var valor = 0;
	$.each(data, function(key, val) {
		dategroup = val.start.toString().split("-");
		dategroup[2] = dategroup[2].substring(0,2);
		fechainicio = new Date(dategroup[0],dategroup[1],dategroup[2]);
		var agendaid = "";
		if(tipo=="diaria") {
			$("#stitle").text("Agenda Comercial - Eventos Diarios");
			agendaid = dategroup[0] + dategroup[1] + dategroup[2];
			periodo = dayNames[fechainicio.getDay()] + " " + fechainicio.getDate() + " de " + monthNames[fechainicio.getMonth()] + " del " + fechainicio.getFullYear();
		}
		else if(tipo=="semanal") {
			$("#stitle").text("Agenda Comercial - Eventos Semanales");
			week = getWeekNumber(Date(dategroup[0],dategroup[1],dategroup[2]));
			agendaid = week[0] + week[1];
			periodo = "Semana " + week[1] + ", año " +  week[0];
		}
		else {
			$("#stitle").text("Agenda Comercial - Eventos Mensuales");
			agendaid = dategroup[0] + dategroup[1];
			periodo = "Año " +  dategroup[0] + ", mes " + monthNames[fechainicio.getMonth()]; 
		}

		if($("#lista_" + agendaid).length == 0) {
			$("#lista").append("<li id='" + "lista_" + agendaid + "'>" + periodo + "<span class='ui-li-count' id='" + "span_" + agendaid + "'>0</span></li>");	
		}

		valor = parseInt(   $("#span_" + agendaid).html()   ) + 1;
		$("#span_" + agendaid).html(valor);
		$("#lista").append("<li><a href='detalle.html?idaccion=" + val.id + "&origen=2&rut=" + rut + "' rel='external' data-ajax='false'>Evento: " + val.title + ",  Cuando: " + val.start + "</a></li>");
		$("#lista").listview("refresh");
		valor = parseInt(   $("#span_" + agendaid).html()   ) + 1;
	});
}

function evento(id) {
	$.ajax({ 
		type: "GET",
		dataType:"json",
		contentType: "application/json; charset=UTF-8" ,
		url: "http://www.anywhere.cl/agenda/accion/id",
		data: { idAccion : id },
		crossDomain : true,
		beforeSend: function() {
			$.mobile.showPageLoadingMsg();
		},			
		success: function(data,status,jqXHR) {
			detalleEvento("results",data.results);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { },
		complete: function(data) {
			$.mobile.hidePageLoadingMsg();
		}
	})	
}

function detalleEvento(key,data) {
	$("#clienteid").val(data.cliente.idCliente);
	$("#nombrecliente").val(data.cliente.nombre);
	$("#rut").val(data.cliente.rut + "-" + data.cliente.dv);
	$("#correo").val(data.cliente.correo);
	$("#celular").val(data.cliente.celular);
	$("#estado").val(data.estadoaccion.estadoAccion);
	$("#tipo").val(data.tipoaccion.tipoAccion);
	$("#lugar").val(data.lugar);
	$("#observaciones").val(data.obsAccion);
	$("#fecha").val(data.fechaInicio);
	$("#prioridad").val(data.prioridad);
}


/* ------------------------------------------------------------------------------------------- */
/* --------------------------------Generales-------------------------------------------------- */
/* ------------------------------------------------------------------------------------------- */
function pad(val,len) {
	var s=val.toString();
	while (s.length<len) {s="0"+s;}
	return s;
}

function getParameterByName(name) {
    var match = RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

function getWeekNumber(date) {
    d = new Date(date);
    d.setHours(0,0,0);
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    var yearStart = new Date(d.getFullYear(),0,1);
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
    console.log(d.getFullYear() + "," + weekNo);
    return [d.getFullYear(), weekNo];
}