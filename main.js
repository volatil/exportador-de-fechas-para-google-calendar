const generarICS = function() {
    const arrFechas = [];

    $.each( $("section.fechas > div"), function(){
        const data = {
            nombre: $( this ).attr("data-nombre") ,
            id: $( this ).attr("data-id") ,
            creacion: $( this ).attr("data-creacion") ,
            fechainicio: $( this ).attr("data-fechainicioutc") ,
            fechatermino: $( this ).attr("data-fechaterminoutc") ,
        }
        
        arrFechas.push(`BEGIN:VEVENT
UID:${ data.id }@correotest.com
DTSTAMP:${ data.creacion }
DTSTART:${ data.fechainicio }
DTEND:${ data.fechatermino }
SUMMARY:${ data.nombre }
DESCRIPTION:
LOCATION:
END:VEVENT
`);
    })
    
    $("textarea").val(`BEGIN:VCALENDAR
VERSION:2.0
PRODID:"Primer test"

${ arrFechas.join("\n") }
END:VCALENDAR
`);
};

// #region ADMINISTRADOR
// DUPLICA LA HORA INICIO
$("section.admin div.campo input#fechainicio").on("change", function () {
    let fechainicio = $("section.admin div.campo input#fechainicio").val();
    fechainicio = new Date( fechainicio );
    fechainicio = fechainicio.setHours(fechainicio.getHours() + 1);
    fechainicio = new Date( fechainicio );
    fechainicio = fechainicio.getFullYear() + "-" + String(fechainicio.getMonth() + 1).padStart(2, "0") + "-" + String( fechainicio.getDate() ).padStart(2, "0") + "T" + String( fechainicio.getHours() ).padStart(2, "0") + ":" + String( fechainicio.getMinutes() ).padStart(2, "0");
    $("section.admin div.campo input#fechatermino").val( fechainicio );
});
// CREA LA FECHA
$("section.admin > button").on("click", function () {
    const data = {
        nombre: $("section.admin > .campo > input#nombre").val() ,
        fechainicio: $("section.admin > .campo > input#fechainicio").val() ,
        fechatermino: $("section.admin > .campo > input#fechatermino").val() ,
        fechacreacion: function() {
            const fecha = new Date($("section.admin > .campo > input#fechainicio").val());
            const fechacreacion = fecha.getFullYear() + "" + String(fecha.getMonth() + 1).padStart(2, "0") + "" + String(fecha.getDate()).padStart(2, "0") + "T" + String(fecha.getHours()).padStart(2, "0") + "" + String(fecha.getMinutes()).padStart(2, "0") + "02Z";

            return fechacreacion;
        } ,
        id: function() {
                const fecha = new Date($("section.admin > .campo > input#fechainicio").val());
                const id = fecha.getFullYear() + "" + String(fecha.getMonth() + 1).padStart(2, "0") + "" + String(fecha.getDate()).padStart(2, "0") + "T" + String(fecha.getHours()).padStart(2, "0") + "" + String(fecha.getMinutes()).padStart(2, "0") + "01Z";

                return id;
        } ,
        fechautc: {
            inicio: function() {
                const fecha = new Date( $("section.admin > .campo > input#fechainicio").val() );
                let nuevafecha = fecha.setHours(fecha.getHours() + 4);
                nuevafecha = new Date( nuevafecha );
                // const inicio = fecha.getFullYear() + "" + String( fecha.getMonth()+1 ).padStart(2, "0") + "" + String( fecha.getDate() ).padStart(2, "0") + "T" + String( fecha.getHours() ).padStart(2, "0") + "" + String( fecha.getMinutes() ).padStart(2, "0") + "00Z";
                const inicio = nuevafecha.getFullYear() + "" + String( nuevafecha.getMonth()+1 ).padStart(2, "0") + "" + String( nuevafecha.getDate() ).padStart(2, "0") + "T" + String( nuevafecha.getHours() ).padStart(2, "0") + "" + String( nuevafecha.getMinutes() ).padStart(2, "0") + "00Z";
                
                return inicio
            } ,
            termino: function() {
                const fecha = new Date( $("section.admin > .campo > input#fechatermino").val() );
                let nuevafecha = fecha.setHours(fecha.getHours() + 4);
                nuevafecha = new Date( nuevafecha );
                // const termino = fecha.getFullYear() + "" + String( fecha.getMonth()+1 ).padStart(2, "0") + "" + String( fecha.getDate() ).padStart(2, '0') + "T" + String( fecha.getHours() ).padStart(2, '0') + "" + String( fecha.getMinutes() ).padStart(2, '0') + "00Z";
                const termino = nuevafecha.getFullYear() + "" + String( nuevafecha.getMonth()+1 ).padStart(2, "0") + "" + String( nuevafecha.getDate() ).padStart(2, '0') + "T" + String( nuevafecha.getHours() ).padStart(2, '0') + "" + String( nuevafecha.getMinutes() ).padStart(2, '0') + "00Z";
                
                return termino
            } ,
        },
    }
    
    $("section.fechas").append(`
        <div class="fecha" data-nombre="${data.nombre}" data-id="${ data.id() }" data-creacion="${ data.fechacreacion() }" data-fechainicioutc="${data.fechautc.inicio()}" data-fechaterminoutc="${ data.fechautc.termino() }">
            <p class="nombre">${data.nombre}</p>
            <p class="fechainicio">${data.fechainicio}</p>
            <p class="fechatermino">${data.fechatermino}</p>
            <button class="eliminar">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="m9.4 16.5l2.6-2.6l2.6 2.6l1.4-1.4l-2.6-2.6L16 9.9l-1.4-1.4l-2.6 2.6l-2.6-2.6L8 9.9l2.6 2.6L8 15.1zM7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21z" />
                </svg>
            </button>
        </div>
    `);
    
    generarICS();
});

// #region FECHAS
$("body").on("click", "button.eliminar", function () {
    $( this ).parent().remove();
    generarICS();
});

// #region DESCARGAR
function downloadICS() {
    // Obtener el contenido del textarea
    const icsContent = document.getElementById("icsContent").value;
    
    // Crear un blob con el contenido del .ics
    const blob = new Blob([icsContent], { type: "text/calendar" });
    
    // Crear una URL para el blob
    const url = URL.createObjectURL(blob);
    
    // Crear un elemento de anclaje (link) para la descarga
    const a = document.createElement("a");
    a.href = url;
    a.download = "eventos.ics"; // Nombre del archivo
    
    // Simular un clic en el enlace para iniciar la descarga
    a.click();
    
    // Liberar la URL del blob
    URL.revokeObjectURL(url);
}