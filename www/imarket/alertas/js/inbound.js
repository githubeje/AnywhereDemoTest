eventSrc.addEventListener('message',
		function(e) {
			var mensaje = "";
			var data = JSON.parse(e.data);
			var mensaje = "<br><p><strong>" + data.asunto + "</p></strong>";
			mensaje += "<p>" + data.msg + "</p>";
			if(mensaje != "") {
				$("#index").stop().animate({"opacity": "0.7"}, "high");
				$("#contenido").append(
								"<div class='fondo' id='fnd" + $.trim(data.id) + "' style='z-index:" +  $.trim(data.id) + "' >" + 
									"<div class='texto' id='txt" + $.trim(data.id) + "'  >" + 
										(mensaje) +
									"</div>" + 		
									"<div class='boton' id='btn" + $.trim(data.id) + "'  >" +
										"<a href='#' id='close' data-role='button' data-theme='b' onclick=aclose('" + $.trim(data.id) + "')> " +
											"<img src='images/close.png' >" +
										"</a>" +										
									"</div>" +  
								"</div>");  
				$("#message").show("slow");
			}
		}, false);
eventSrc.addEventListener('open', function(e) { alert("registrando evento") }, false);
eventSrc.addEventListener('error', 
			function(e) {
				if (e.readyState == EventSource.CLOSED) {
					document.getElementById("contenido").innerHTML = "conexion cerrada";
				}
			}, false);				
