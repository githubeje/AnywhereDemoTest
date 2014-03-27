$("#nuevo").live("pageinit", function() {
	$.getJSON("http://www.anywhere.cl/agenda/admin/list?mngr=Tipoaccion",{},loadOne);
});

$("#nuevo").live("pageshow", function() {
    $("input[data-type='search']").keyup(function() {
        if ($(this).val() === "") {
            $("#clientelist li").addClass("ui-screen-hidden");
        }
        else {
            $("#clientelist li").removeClass("ui-screen-hidden");
        }
        $(this).trigger("change");
    });
});
	
$("#clientelist li").live("click", function() {
	$("input[data-type='search']").val($(this).text());
	$("#cliente").val($(this).val());
	$("#clientelist li").addClass("ui-screen-hidden");
});

function loadOne(data) {
	getTipoAccion(data.results);
	$.getJSON("http://www.anywhere.cl/agenda/admin/list?mngr=Estadoaccion",{},loadTwo);
}

function loadTwo(data) {
	getEstados(data.results);
	$.getJSON("http://www.anywhere.cl/agenda/file/json?name=hora.json",{},loadThree);
}

function loadThree(data) {
	getHoraComienzo(data.results);
	$.getJSON("http://www.anywhere.cl/agenda/personal/cliente?rutPer=" + personal.value,{},getClientes);
}

$("#guardar").live("click", function(e) {
	if ($("#formulario1").validate({
		ignore: "#searchdiv *",
		errorPlacement: function(error, element) {
			if ($(element).is("select")) {
				error.insertAfter($(element).parent());
			}
			else {
				error.insertAfter(element);
			}
		}
	}).form() == true) {
		var sessionId = sessionStorage.getItem("11111111");
		var fec1 = fec2 = "";
		if($("#fechaInicio").val() != "") {
			fec1 = moment($("#fechaInicio").val(), "DD/MM/YYYYY").format("YYYY-MM-DD hh:mm:ss");
		}
		if($("#fechaTermino").val() != "") {
			fec2 = moment($("#fechaTermino").val(), "DD/MM/YYYYY").format("YYYY-MM-DD hh:mm:ss");
		}
		$.ajax({ 
			type: "POST",
			dataType:"json",
			url: "http://www.anywhere.cl/agenda/accion/save",
			data: {
			    personal:personal.value,
			    cliente:cliente.value,
			    tipoaccion:tipoaccion.value,
			    fechaInicio:fec1,
			    horaInicio:horaInicio.value,
			    estadoaccion:estadoaccion.value,
			    lugar:lugar.value,
			    prioridad:prioridad.value,
			    obsAccion:obsAccion.value,
			    fechaTermino:fec2,
			    mngrsessionid : sessionId
			},
			crossDomain : true,
			beforeSend: function() {
				$.mobile.showPageLoadingMsg();
			},			
			success: function(data,status,jqXHR) {
				$(location).attr("href","index.html");
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				alert(textStatus + "," + errorThrown);
			},
			complete: function(data) {
				$.mobile.hidePageLoadingMsg();
			}
		})
	}
});

function getTipoAccion(data) {
	$.each(data, function(key, val) {
		$("#tipoaccion").append($("<option>", {value : val.idTaccion}).text(val.tipoAccion));		
	});	
}

function getHoraComienzo(data) {
	$.each(data, function(key, val) {
		$("#horaInicio").append($("<option>", {value : val.hora}).text(val.hora));		
	});	
}

function getEstados(data) {
	$.each(data, function(key, val) {
		$("#estadoaccion").append($("<option>", {value : val.idEaccion}).text(val.estadoAccion));		
	});	
}

function getClientes(data) {
	var items = [];
	$.each(data.results, function (key, val) {
		items.push("<li value='" + val.idCliente + "'>" + val.nombre + "</li>");
	});  
	$("#clientelist").html(items.join(""));
    $("#clientelist li").addClass("ui-screen-hidden");
	$("#clientelist").listview("refresh");
}


$("#lugar").live("click", function() {
	$(location).attr("href","#mapa");
});			

$("#mapa").live("pageshow", function() {
	map = null;
	drawMap("canvas");
});

$("#loaddirection").live("click",function(e) {
    var me = $(this);
    $("#lugar").val( me.data("params").param1  );
});