index_li = 0;
selected_li_values = [];

$("#principal").live("pageinit",function(e) {
	$.ajax({ 
		type: "GET",
		dataType:"json",
		url: "http://www.anywhere.cl/wsanywhere/services/p2s/querys/listadoprocedimientos",
		data: {  },
		crossDomain : true,
		beforeSend: function() {
		    e.preventDefault();
		    e.stopPropagation();					
			$.mobile.loading("show");
		},            	
		success: function(data,status,jqXHR) { 
			cargaProcedimiento(data);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			popup("Mensaje", "Ocurri&oacute un error al realizar la busqueda","visualizacion.html#principal")
			limpiaForm("#formulario1");
		},
		complete: function(data) {}
	})
	
	$("#previous").live("click",function() {
		$("#" + selected_li_values[index_li]).attr("style","");
		index_li--;
		if(index_li < 0) {
			index_li = $("#lista li").size()-1;
		}
		$("#" + selected_li_values[index_li]).attr("style","background: #22C4AA;color: #FFFFFF");	
	});

	$("#next").live("click",function() {
		$("#" + selected_li_values[index_li]).attr("style","");
		index_li++;
		if(index_li > $("#lista li").size()-1) {
			index_li = 0;
		}
		$("#" + selected_li_values[index_li]).attr("style","background: #22C4AA;color: #FFFFFF");
	});	
});

function cargaProcedimiento(data) {
	i=0;
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			styleli = "";
			if(i==0) {
				styleli = "";
				index_li = i;
			}
			selected_li_values[i] = val2[0].value;
			var param = "data-params='{\"param1\":\"step.html\" , \"param2\":\"evaluacion.html\" , \"param3\":\"2\" , \"param4\":\" " + val2[0].value + "\"}'"
			$("#lista").append("<li " + styleli+ " id=" + val2[0].value + "><a href='#' rel='external' data-ajax='false' " + param + " >" + val2[1].value + "</a></li>");
			$("#lista").listview("refresh");
			i++;
		});
	});
}

$("li a").live("click", function() {
	var me = $(this);
    var html = $.trim(me.data("params").param1);
    var back = $.trim(me.data("params").param2);
    var mode = $.trim(me.data("params").param3);
    var procedure = $.trim(me.data("params").param4);
	var url = html + "?back=" + back + "&mode=" + mode + "&idprocedure=" + procedure 
	$(location).attr("href",url);
});