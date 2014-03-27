$("#login").live( "pageinit", function() {
	$.validator.addMethod("rutValidate", function(value, element) {  
        return this.optional(element) || /^0*(\d{1,3}(\.?\d{3})*)\-?([\dkK])$/i.test(value); 
	}, "Rut invalido: Ingresa un rut válido.");
	
	$("#formLogin").bind("submit", function (e) {
		if ($("#formLogin").validate({
			rules : {
				rutPer : {
					 required: true,
					 rutValidate : true
				}
			},
			errorPlacement: function(error, element) {
				error.insertAfter(element);
			}
		}).form() == true) {
			rut = $("#rutPer").val();
			clave = $("#clave").val();  
			$.ajax({ 
				type: "POST",
				dataType:"json",
				url: "http://www.anywhere.cl/anywhere/Login/access",
				data: { rutPer : rut, clave : clave },
				crossDomain : true,
				success: function(data,status,jqXHR) {
					var tmp = "";
			        if (data!=null) {
						$.each(data,function(key,val) {
							if(key != "success") {
								sessionStorage.setItem(key,val);
								tmp = key;
							}
						});
						$(location).attr("href","menu.html");
			        }
			        else {
			        	popup("Mensaje", "Usuario o clave invalido","index.html")
			        }
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
		}
	});
});

