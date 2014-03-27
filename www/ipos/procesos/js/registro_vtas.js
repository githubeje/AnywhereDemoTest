var idproducto = [];
var producto = [];
var categoria = [];
var idcategoria = [];
var cantidad = [];
var precioventa = [];
var descuento = [];
var preciounitario = [];

$("#principal").live('pageinit', function() {
	var aIndex = new Array();
	var pag = 0;
	
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/categoriaproducto",{},loadOne);
	
	function loadOne(data) {
		getCategoriaProducto(data);
		$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/productosvigentes",{},loadTwo);
	}
	
	function loadTwo(data) {
		getProductosVigentes(data);
		$("#producto").chained("#categoria");
	}
	
	$("#grabar").live("click",function() {
		if (idproducto.length == 0 || idproducto.length == null ) {
			popup('Mensaje', 'Solo se graban productos que han sido agregados',"#principal");
		}
		else{
			var estado_gestion = 205;
			$.ajax({ 
				type: "POST",
				url: "http://www.anywhere.cl/wsanywhere/services/registroventa/save",
				data: { "a1[]":idproducto,"a2[]":cantidad,"a3[]":preciounitario,"a4[]":precioventa,"a5[]":descuento,a6:"1", a6:estado_gestion },
				crossDomain : true,
				success: function(data,status,jqXHR) {
					popup('Mensaje', 'Se ha grabado el producto correctamente',"index.html");
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					popup('Mensaje', 'Error inesperado',"index.html")
				}	
			})
		}
	});	
});

function getCategoriaProducto(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$('#categoria').append($('<option>', {value : val2[0].value}).text(val2[1].value));
		});
	});	
}

function getProductosVigentes(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$('#producto').append($('<option>', {value : val2[0].value}).addClass(val2[4].value).text(val2[1].value));
		});
	});		
}

$('#principal').live('pageshow', function() {
	if(idproducto!=null && idproducto.length>0) {
		$('#count').show();
	}
	else {
		$('#count').hide();
	}
});

$('#agregar_producto').live('click', function() {
	if ($('#formulario').validate({
		errorPlacement: function(error, element) {
			if ($(element).is('select')) {
				error.insertAfter($(element).parent());
			}
			else {
				error.insertAfter(element);
			}
		}
	}).form() == true) {
		idproducto.push($('#producto').val());
		producto.push($("#producto option[value='" + $('#producto').val() + "']").text());
		categoria.push($("#categoria option[value='" + $('#categoria').val() + "']").text());
		idcategoria.push($("#categoria").val());
		cantidad.push($('#cantidad').val());
		precioventa.push($('#precioventa').val());
		descuento.push($('#descuento').val());
		preciounitario.push($('#preciounitario').val());


		popup('Mensaje', 'Se agregado el producto al pedido',"#principal");
		limpiaForm('#formulario');
		if(idproducto!=null && idproducto.length>0) {
			number = '<span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">' 
					 + idproducto.length + 
					 '</span><span class="ui-icon ui-icon-page ui-icon-shadow">&nbsp;</span></span>';
			$('#count').html(number);
			$('#count').show();
		}
	}
});

$('#registro_venta').live('pageshow',function() {
	columna1 =  '<div class="ui-block-a" style="background-color:#CCCCCC;font-weight:bold;text-align:left">Categoria</div>';
	columna2 =  '<div class="ui-block-b" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Producto</div>';
	columna3 =  '<div class="ui-block-c" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Cantidad</div>';
	columna4 =  '<div class="ui-block-d" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Total</div>';
	columna5 =  '<div class="ui-block-e" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Eliminar</div>';
	contenido = "";
	for(x=0;x<idproducto.length;x++) {
		contenido = contenido + '<div class="ui-block-a" style="background-color:#EEEEEE;text-align:left">' + categoria[x] + '</div>';
		contenido = contenido + '<div class="ui-block-b" style="background-color:#EEEEEE;text-align:center">' + producto[x] + '</div>'; 
		contenido = contenido + '<div class="ui-block-c" style="background-color:#EEEEEE;text-align:center">' + cantidad[x] + '</div>';		
		contenido = contenido + '<div class="ui-block-d" style="background-color:#EEEEEE;text-align:center">' + precioventa[x] + '</div>';		
		contenido = contenido + '<div class="ui-block-e" style="background-color:#EEEEEE;text-align:center"><a href="#" id="rowdelete">X</a></div>';	
	}
	$('div.ui-grid-d').html(columna1 + columna2 + columna3 + columna4 + columna5 + contenido);

	$("#rowdelete").click(function(event) {
		$(this).closest("tr").remove();
		return false;
	 });
});

