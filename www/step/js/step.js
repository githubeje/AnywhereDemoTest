var index_li = 0;
var selected_li_values = [];
var idProcedure = null;
var idStep = null;
var mode = null;
var idAssesment = null; 
	
$("#principal").live("pageinit",function() {
	$("#forevaluation").hide();
	idProcedure = getParameterByName("idprocedure");
	$("#backpage").attr("href",getParameterByName("back"));
	mode = getParameterByName("mode");
	ka = 3;
	if(mode=="2") {
		$("#forevaluation").show();
		fi = moment("01/01/2012","DD/MM/YYYYY").format("YYYY-DD-MM");
		ft = moment("31/12/2013","DD/MM/YYYYY").format("YYYY-DD-MM");
		$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/ejecutivosporka/" + fi + "/" + ft + "/" + ka,{},getEjecutivos);
	}
	$.ajax({ 
		type: "GET",
		dataType:"json",
		url: "http://www.anywhere.cl/wsanywhere/services/p2s/querys/pasosporprocedimiento/" + idProcedure,
		data: {  },
		crossDomain : true,
		success: function(data,status,jqXHR) { 
			cargaPasosProcedimiento(data,idProcedure);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			info("Mensaje", "Ocurri&oacute un error al realizar la busqueda","visualizacion.html#principal")
			limpiaForm("#formulario1");
		},
		complete: function(data) {}
	})
	
	$("#previous").live("click",function() {
		$.ajax({
			type: "GET",
			dataType:"json",
			url: "http://www.anywhere.cl/wsanywhere/services/p2s/querys/eventosporpasoporprocedimiento/" + idProcedure + "/" + selected_li_values[index_li],
			crossDomain : true,
			success: function(data,status,jqXHR) {
				$("#" + selected_li_values[index_li]).attr("style","");
				index_li--;
				if(index_li < 0) {
					index_li = $("#lista li").size()-1;
				}
				$("#" + selected_li_values[index_li]).attr("style","");
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
			},
			complete: function(data) {}
		})			
	});

	$("#next").live("click",function() {
		$.ajax({
			type: "GET",
			dataType:"json",
			url: "http://www.anywhere.cl/wsanywhere/services/p2s/querys/eventosporpasoporprocedimiento/" + idProcedure + "/" + selected_li_values[index_li],
			crossDomain : true,
			success: function(data,status,jqXHR) {
				if(data.length>1) {
					var evento = "";
					var opciones = "<ul data-role='listview' data-inset=true>";
					$.each(data, function(key, val) {
						$.each(val, function(key2, val2) {
							if(evento == "") {
								evento = val2[2].value;
							}
							opciones += "<li><a href='#' id='option' data-params='{\"id\":\"" + val2[4].value + "\",\"flow\":\"next\"}' rel='close'>Paso " + val2[4].value + " : " + val2[5].value +"</a></li>";
						});
					});
					opciones += "</ul>";
					$('<div>').simpledialog2({
						mode: 'blank',
						headerText: evento,
						headerClose: true,
						dialogAllow: true,
						dialogForce: true,
						blankContent : opciones
					})
				}
				else {
					$("#" + selected_li_values[index_li]).attr("style","");
					stepposting = null;
					$.each(data, function(key, val) {
						$.each(val, function(key2, val2) {
							stepposting = val2[4].value;
						});
					});
					index_li = selected_li_values.indexOf(stepposting);
					if(index_li > $("#lista li").size()-1 || stepposting == null) {
						index_li = 0;
						stepposting = selected_li_values[index_li];
					}
					$("#" + stepposting).attr("style","background: #22C4AA;color: #FFFFFF");
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
			},
			complete: function(data) {}
		})		
	});
	
	$("#option").live("click",function() {
		$("#" + selected_li_values[index_li]).attr("style","");
		index_li = selected_li_values.indexOf($(this).data("params").id); 
		$("#" + selected_li_values[index_li]).attr("style","background: #22C4AA;color: #FFFFFF");		
	})
});

function cargaPasosProcedimiento(data,idProcedure) {
	i=0;
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			styleli = "";
			if(val2[3].value==val2[0].value) {
				styleli = "style='background: #22C4AA;color: #FFFFFF'";
				index_li = i;
			}
			selected_li_values[i] = val2[3].value;
			i++;
			$("#lista").append("<li " + styleli+ " id=" + val2[3].value + "><a href='#' data-params='{\"idstep\":\"" + val2[3].value + "\"}' title='" + val2[5].value +"'>Paso " + i + " : "+ val2[4].value + "</a></li>");
			$("#lista").listview("refresh");
		});
	});
	$.ajax({ 
		type: "GET",
		dataType:"json",
		url: "http://www.anywhere.cl/wsanywhere/services/p2s/querys/procedimiento/" + idProcedure,
		crossDomain : true,
		success: function(data,status,jqXHR) {
			$.each(data, function(key, val) {
				$.each(val, function(key2, val2) {
					if(mode==1) {  //mode : 1, visualizacion
						$("#title").attr("title","Visualizacion de Pasos : " + val2[1].value);
						$("#title").html("Visualizacion de Pasos : " + val2[1].value);
					}
					else {  //mode : 2, evaluacion
						$("#title").attr("title","Evaluacion de Pasos : " + val2[1].value);
						$("#title").html("Evaluacion de Pasos : " + val2[1].value);
					}					
				});
			});
		}
	})
}

$("#lista li a").live("click",function() {
	if(mode==1) {  //mode : 1, visualizacion
		idStep =  $(this).data("params").idstep;
		$(location).attr("href","#tareasxpaso");
	}
	else {  //mode : 2, evaluacion
		idStep =  $(this).data("params").idstep;
		$(location).attr("href","#evaluacionxpaso");

	}	
})

$("#tareasxpaso").live("pageshow", function() {
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/tareasporpaso/" + idProcedure + "/" + idStep,{},getTareas);
});

$("#evaluacionxpaso").live("pageshow", function() {
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/preguntasporpaso/" + idStep,{},getQuestion);
});

$("#evaluarpaso").live("click",function() {
	if ($("#formulario2").validate({
		errorPlacement: function(error, element) {
			if ($(element).is("select")) {
				error.insertAfter($(element).parent());
			}
			else {
				error.insertAfter(element);
			}
		}
	}).form() == true) {
		ka = 3;
		var selection = new Array();
		var valueSelection = new Array();
		tipo = $("#tipo").val().trim();
		if(tipo == "1" || tipo == "3") {
			selection.push($("#question input:radio:checked").val().trim());
			if(tipo=="3") {
				valueSelection.push($("#s_" + $("#question input:radio:checked").attr("id") +  " option:selected").val());
			}
		}
		else if(tipo == "2" || tipo == "4") {
            $("#question input[type=checkbox]").each(
            	function() {
            		if( $(this).attr("checked")) {
            			selection.push($(this).val().trim());
        				if(tipo=="4") {
        					valueSelection.push($("#s_" + $(this).attr("id") + " option:selected").val());
        				}                			
            		}
            	}
            );
		}
		$.ajax({ 
			type: "POST",
			url: "http://www.anywhere.cl/wsanywhere/services/evaluacionstep/save",
			data: {  a1:idProcedure, a2:idStep, a3:$("#idquestion").val().trim(), a4:ka, a5:$("#colaborador").val(), 
					 a6:tipo, "a7[]":selection, "a8[]":valueSelection, a9:idAssesment
			},
			crossDomain : true,
			success: function(data,status,jqXHR) {
				info("Mensaje", "Se ha guardado el registro","#principal")
				idAssesment = data.id_assesment;
				limpiaForm("#formulario2");
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				info("Mensaje","Ocurri&oacute; un error al guardar el registro","#principal")
				limpiaForm("#formulario2");
				idAssesment = null;
			},
			complete: function(data) {
				idStep = null;
			}
		});
	}
})

function getQuestion(data) {
	$("#question").empty();
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#question").append("<label><strong>" + val2[1].value + "</strong></label>");
			$("#question").append("<input type='hidden' name='idquestion' id='idquestion' value='" + val2[0].value.trim() + " '/>")
			$("#question").append("<input type='hidden' name='tipo' id='tipo' value='" + val2[2].value.trim() + " '/>")
			if(val2[2].value == "1") {   //radio
				$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/itemsporpreguntasporpaso/" + val2[3].value,{},getItemRadio);				
			}
			else if(val2[2].value == "2") {  //checkbox
				$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/itemsporpreguntasporpaso/" + val2[3].value,{},getItemCheckbox);				
			}
			else if(val2[2].value == "3") {   //radio select
				$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/itemsporpreguntasporpaso/" + val2[3].value,{},getItemRadioSelect);				
			}
			else if(val2[2].value == "4") {  //checkbox select
				$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/itemsporpreguntasporpaso/" + val2[3].value,{},getItemCheckboxSelect);				
			}
		});
	});		
}

function getTareas(data) {
	var contenido = "";
	$("#listatareas").empty();
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			contenido = contenido + "<li>" + val2[2].value + "</li>";			
		});
	});
	$("#listatareas").append(contenido);
	$("#listatareas").listview("refresh");			
}

function getItemRadio(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#question").append("<div data-role='fieldconstain'>");
			$("#question").append("   <input type = 'radio' name = 'escala' id = '" + val2[0].value.trim() + "' value = '" + val2[2].value.trim() + " '/>    ")
			$("#question").append("   <label for = 'escala'>" + val2[1].value + "</label>    ")
			$("#question").append("</div>");	
		});
	});
}

function getItemRadioSelect(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#question").append("<div data-role='fieldconstain'>");
			$("#question").append("   <input type = 'radio' name = 'escala' id = '" + val2[0].value.trim() + "' value = '" + val2[0].value.trim() + "' />    ")
			$("#question").append("   <label for = 'escala'>" + val2[1].value.trim() + "</label>    ")
			var elementSelect = "<select name='s" + "_" + val2[0].value.trim() + "' id='s" + "_" + val2[0].value.trim() + "' disabled>";
			$.each($.parseJSON(val2[2].value),function(key,val) {
				elementSelect += "<option value=" + val + ">" + key +"</option>";			
			});
			elementSelect += "</select>";
			$("#question").append(elementSelect);
			$("#question").append("</div>");	
		});
	});
}

$("#question input[type=radio]").live("click",function() {
	$("#question select").prop("disabled", true);
	$("#s_" + $(this).attr("id")).prop("disabled", false);
});

$("#question input[type=checkbox]").live("click",function() {
	if( $(this).is(":checked") ) {
		$("#s_" + $(this).attr("id")).prop("disabled", false);
	}
	else {
		$("#s_" + $(this).attr("id")).prop("disabled", true);
	}
});

function getItemCheckbox(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#question").append("<div data-role='fieldconstain'>");
			$("#question").append("   <input type = 'checkbox' name = 'escala' id = '" + val2[0].value.trim() + "' value = '" + val2[2].value.trim() + " '/>    ")
			$("#question").append("   <label for = 'escala'>" + val2[1].value.trim() + "</label>    ")
			$("#question").append("</div>");	
		});
	});
}

function getItemCheckboxSelect(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#question").append("<div data-role='fieldconstain'>");
			$("#question").append("   <input type = 'checkbox' name = 'escala' id = '" + val2[0].value.trim() + "' value = '" + val2[0].value.trim() + " '/>    ")
			$("#question").append("   <label for = 'escala'>" + val2[1].value + "</label>    ")
			var elementSelect = "<select name='s" + "_" + val2[0].value.trim() + "' id='s" + "_" + val2[0].value.trim() + "' disabled>";
			$.each($.parseJSON(val2[2].value),function(key,val) {
				elementSelect += "<option value=" + val + ">" + key +"</option>";			
			});
			elementSelect += "</select>";
			$("#question").append(elementSelect);
			$("#question").append("</div>");	
		});
	});
}

function getEjecutivos(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#colaborador").append($("<option>", {value : val2[4].value}).text(val2[5].value));
		});
	});	
}

function getParameterByName(name) {
    var match = RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}