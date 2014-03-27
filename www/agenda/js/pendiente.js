$("#pendiente").live( "pageinit",function(event) {
	var aIndex = new Array();
	var pag = 0;
	var sessionId = sessionStorage.getItem("11111111")
	now = moment(new Date());
	now = now.format("YYYY-MM-DD HH:mm:ss");
	$.ajax({ 
		type: "GET",
		dataType:"json",
		url: "http://www.anywhere.cl/agenda/accion/pendiente",
		data: { mngrsessionid : sessionId, fechaInicio : now},
		crossDomain : true,
		beforeSend: function() {
			$.mobile.showPageLoadingMsg();
		},	
		success: function(data,status,jqXHR) {
			getCargaEventosPendientes(data.results);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
			alert(textStatus + "," + errorThrown);
		},
		complete: function(data) {
			$.mobile.hidePageLoadingMsg();
		}
	})	
	

	$("#next").live("click",function(e) {
		pag = pag + 1;
		if(pag >= aIndex.length) {
			pag = 0;
			alert("El listado de acciones pendientes se reiniciara desde el principio");
		}
		$("#idAccion").val(aIndex[pag][0]);
		$("#tipoAccion").val(aIndex[pag][1]);
		$("#nombre").val(aIndex[pag][2]);
		$("#fechaInicio").val(aIndex[pag][3]);
		$("#horaInicio").val(aIndex[pag][4]);
		$("#celular").val(aIndex[pag][5]);
		$("#correo").val(aIndex[pag][6]);	
	});

	$("#previous").live("click",function(e) {
		pag = pag - 1;
		if(pag < 0 ) {
			pag = aIndex.length - 1;
			alert("El listado de acciones pendiente se reiniciara desde el final");
		}
		$("#idAccion").val(aIndex[pag][0]);
		$("#tipoAccion").val(aIndex[pag][1]);
		$("#nombre").val(aIndex[pag][2]);
		$("#fechaInicio").val(aIndex[pag][3]);
		$("#horaInicio").val(aIndex[pag][4]);
		$("#celular").val(aIndex[pag][5]);
		$("#correo").val(aIndex[pag][6]);	
	});

	$("#detailsView").live("click", function(e) {
		location.href="detalle.html?idaccion=" + $("#idAccion").val();
	});
	
	$("#deleteAction").live("click",function(e) {
		var sessionId = sessionStorage.getItem("11111111")
		$.ajax({ 
			type: "GET",
			dataType:"json",
			url: "http://www.anywhere.cl/agenda/admin/delete?mngr=Accion",
			data: { mngrsessionid : sessionId, id : aIndex[pag][0] },
			crossDomain : true,
			beforeSend: function() {
				$.mobile.showPageLoadingMsg();
			},	
			success: function(data,status,jqXHR) {
				getCargaEventosPendientes(data.results);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				alert(textStatus + "," + errorThrown);
			},
			complete: function(data) {
				$.mobile.hidePageLoadingMsg();
			}
		})	
	});
	
	function getCargaEventosPendientes(data) {
		var i=0;
		$.each(data, function(key, val) {
			aIndex[i] = new Array();  
			aIndex[i][0] =  val.idAccion
			aIndex[i][1] =  val.tipoaccion.tipoAccion
			aIndex[i][2] =  val.cliente.nombre
			aIndex[i][3] =  val.fechaInicio
			aIndex[i][4] =  val.horaInicio
			aIndex[i][5] =  val.cliente.celular
			aIndex[i][6] =  val.cliente.correo
			i++;
		});
		
		$("#idAccion").val(aIndex[0][0]);
		$("#tipoAccion").val(aIndex[0][1]);
		$("#nombre").val(aIndex[0][2]);
		$("#fechaInicio").val(aIndex[0][3]);
		$("#horaInicio").val(aIndex[0][4]);
		$("#celular").val(aIndex[0][5]);
		$("#correo").val(aIndex[0][6]);
	}
});