var map = null;
var facingImage = "";
var posLatitud = null;
var posLongitud = null;
var pictureSource; 
var destinationType;

idForm = "";
idUsuario = "13176947";

$("#principal").live("pageinit", function(e) {
	
	
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
		pictureSource = navigator.camera.PictureSourceType;
		destinationType = navigator.camera.DestinationType;
	}
	
	capturePhotoEdit = function(source) {
		navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
			quality : 40,
			destinationType : destinationType.DATA_URL,
			sourceType : source,
			EncodingType : 1
		});
	}
	
	onFail = function(message) {
		alert("Failed because: " + message);
	}
	
	onPhotoDataSuccess = function(imageData) {
		var capturefacing = document.getElementById("capturefacing");
		capturefacing.style.display = "block";
		capturefacing.src = "data:image/jpeg;base64," + imageData;
		facingImage = imageData;
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	}	
	
	function onSuccess(position) {
		posLatitud = position.coords.latitude;
		posLongitud = position.coords.longitude;
	}
	
	function onError(error) {
		alert("Intente realizar nuevamente esta operación.  Si el problema persiste, busque un sitio con mejor recepción");
	}

	idForm = getParameterByName("idform");
	title = "Formulario " + getParameterByName("title");
	description = "Formulario " + getParameterByName("description");
	html = "";
	$.ajax({ 
		type: "GET",
		dataType:"json",
		url: "http://192.168.4.218:8080/wsanywhere/services/p2s/querys/camposformulario/" + idForm + "/" + idForm,
		crossDomain : true,
		success: function(data,status,jqXHR) {
			$("#title").attr("title",description);
			$("#title").html(title);
			section = "";
			sectionAnterior = "";
			i=0;
			$.each(data,function(key,val) {
				i++;
				section = val.h[2].value;
				if(sectionAnterior=="" && i==1) {
					sectionAnterior = section;
					html = html + "<fieldset style='padding:10px;margin-left:10px;border: 0px solid #000000;'><legend><strong>" + section + "</strong></legend>";
				}
				else if(sectionAnterior!="" && sectionAnterior!=section) {
					html = html + "</fieldset><fieldset style='padding:10px;margin-left:10px;border: 0px solid #000000;'><legend><strong>" + section + "</strong></legend>";
				}
				
				if(val.h[5].value=="1") {		//text
					html = html + 
						"<div data-role='fieldcontain'>" +
							"<label for=" + val.h[0].value + ">" + val.h[4].value + "</label>" + 
							"<input type='text' id=" + val.h[0].value + " name=" + val.h[0].value + " maxlength=" + val.h[6].value + ">" + 
						"</div>";
				}
				else if(val.h[5].value=="2") {	//Combo
					if(val.h[10].value!=null) {
						html = html + 
							   "<div data-role='fieldcontain'>" + "<label for=" + val.h[0].value + ">" + val.h[4].value + "</label>" + "<select id=" + val.h[0].value + " name=" + val.h[0].value + ">";
						str = JSON.parse(  val.h[10].value.replace(/\'/g, '"')  );
						$.each(str,function(key2,val2) {
							html = html + "<option value='" + val2.label + "'>" + val2.value + "</option>";
						});
						html = html + "</select></div>";
					}
				}
				else if(val.h[5].value=="3") {	//Checkbox 
					if(val.h[10].value!=null) {
						html = html + "<div data-role='fieldcontain'>" + "<label for=" + val.h[0].value + ">" + val.h[4].value + "</label>";
						str = JSON.parse(  val.h[10].value.replace(/\'/g, '"')  );
						$.each(str,function(key2,val2) {
							html = html + 
								   "<div data-role='fieldcontain'>" + 
								   	"<input type='checkbox' id='" + val.h[0].value + "' name='" + val.h[0].value + "' value=' " + val2.value+ "'>" + "<label for='" + val.h[11].value + "'>" + val2.value + "</label>" + 
								   "</div>";
						});
						html = html +"</div>";
					}
				}
				
				else if(val.h[5].value=="4") {	//Radio   
					if(val.h[10].value!=null) {
						html = html + "<div data-role='fieldcontain'>" + "<label for=" + val.h[0].value + ">" + val.h[4].value + "</label><br>";
						str = JSON.parse(  val.h[10].value.replace(/\'/g, '"')  );
						$.each(str,function(key2,val2) {
							html = html + 
								   "<div data-role='fieldcontain'>" +
								   	"<input type='radio' id='" + val.h[0].value + "' name='" + val.h[0].value + "' value=' " + val2.value+ "'>" + "<label for='" + val.h[11].value + "'>" + val2.value + "</label>" + 
								   "</div>";
						});
						html = html + "</div>";
					}
				}
				
						
				else if(val.h[5].value=="5") {		//text
				html = html + 
					"<div data-role='fieldcontain' id=" + val.h[0].value + " name=" + val.h[0].value + " maxlength=" + val.h[6].value + "> " +
					" <div data-role='navbar'> " + 
					" <label for=" + val.h[0].value + ">" + val.h[4].value + "</label>" +
						" <ul> " +
							" <li><a href='#' onclick='capturePhotoEdit(Camera.PictureSourceType.CAMERA);' rel='external' data-role='button' >Tomar Imagen</a></li> " +
							" <li><a href='#fotografia' rel='external' data-role='button' >Imagen</a></li> " +
						" </ul> " +
					" </div> " + 
					"</div>";
				}
				
				sectionAnterior = section;
				
			});
			if(data.length==i) {
				html = html + "</fieldset>";
			}
			$("#content #elements").html(html);		
		},
		beforeSend: function() {
		    e.preventDefault();
		    e.stopPropagation();					
		    $.mobile.loading("show");
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { },
		complete: function(data) { }				
	});	
});

function getParameterByName(name) {
    var match = RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

$("#save").live("click",function(e) {
	var frm = $(document.f);
	var data = JSON.stringify(frm.serializeArray());
	$.ajax({
		type : "POST",
		dataType : "json",
		crossdomain : true,
		url : "http://192.168.4.218:8080/wsanywhere/services/formulario/save",
		data : { a1:idForm, a2:idUsuario, a3:data, a4 : facingImage},
		beforeSend: function() {
		    e.preventDefault();
		    e.stopPropagation();					
		    $.mobile.loading("show");
		},
		success : function(data) {
			if(data) {
				$(location).attr("href","index.html");
			}
			else {
				alert("Sus datos no fueron grabados, favor intente nuevamente");
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) { }
	});
});

