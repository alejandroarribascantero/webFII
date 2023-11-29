function obtenerNoticiasGuardadas() {
    const noticiasGuardadas = localStorage.getItem('noticias');
    return noticiasGuardadas ? JSON.parse(noticiasGuardadas) : [];
}


function guardarNoticias() {
    localStorage.setItem('noticias', JSON.stringify(noticias));
}


let noticias = obtenerNoticiasGuardadas();
if (noticias.length === 0) {
    const noticia1 = {
        id: Date.now(),
        titulo: 'Puigdemont amenaza a Sánchez con apoyar al PP en una hipotética moción de censura si no ve "avances suficientes"',
        descripcion: 'El expresidente catalán y líder de Junts, Carles Puigdemont, ha amenazado al presidente del Gobierno, Pedro Sánchez, con que su partido vote en contra de las leyes del Gobierno o incluso apoye al PP en una hipotética moción de censura si no ve "avances suficientes" en lo pactado entre su partido y el PSOE para la investidura. Una posibilidad que ya ha descartado el líder de los populares, Alberto Núñez Feijóo. "Podríamos votar con el PP para derribar el presupuesto o por una resolución sobre Israel, donde nuestra posición en realidad está más alineada" con la del partido que encabeza Alberto Núñez Feijóo, dijo este martes por la noche Puigdemont a Politico durante la ceremonia celebrada por este medio para desvelar su lista de las 28 personalidades más influyentes de Europa en 2024, en la que el catalán figura en segundo lugar entre los nueve disruptores.',
        autor: 'RTVE.es/EFE'
    };

    const noticia2 = {
        id: Date.now() + 1,
        titulo: 'Israel y Hamás negocian incluir hombres adultos en el canje de rehenes por presos',
        descripcion: 'El acuerdo entre Israel y Hamás avanza con los mismos parámetros en los que está prorrogado hasta primera hora del jueves: la milicia islamista palestina entrega mujeres y menores israelíes que capturó en su ataque del 7 de octubre (60, con los de este martes, más otros 21 extranjeros sin contrapartidas) a cambio de la excarcelación del triple de presos palestinos (también mujeres y menores), un alto el fuego y la entrada a Gaza desde Egipto de 200 camiones de ayuda humanitaria. Sin embargo, unos y otros negocian ya en Qatar, el principal mediador',
        autor: 'Antonia Pita (El Pais)'
    };
    // Agregar las noticias al arreglo
    noticias.push(noticia1, noticia2);
}


function agregarNoticia(titulo, descripcion, autor) {
    const noticia = {
        id: Date.now(), // Usando la marca de tiempo como ID único (puedes usar otro método para generar IDs únicos)
        titulo,
        descripcion,
        autor
    };
    noticias.push(noticia);

    // Muestra la noticia en la interfaz
    mostrarNoticiaEnInterfaz(noticia);

    // Guarda las noticias actualizadas en localStorage
    guardarNoticias();
    $('#noticiaForm').fadeOut();
    $('#overlay').fadeOut();    

}


function mostrarNoticiaEnInterfaz(noticia, index) {
    const descripcionCorta = noticia.descripcion.substring(0, 100) + '...';
    const noticiaHTML = `<div class="col-md-4 mb-3">
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">${noticia.titulo}</h5>
            <p class="card-text">${descripcionCorta}</p>
            <a href="#" class="ver-mas" data-id="${noticia.id}">Ver Más</a>
            <button class="btn btn-danger borrar-noticia borrar-noticia-visible" data-id="${noticia.id}">Borrar</button>
        </div>
    </div>
</div>`;

    $('#noticiasRow').append(noticiaHTML);
}

$(document).ready(function () {
    noticias.forEach((noticia, index) => {
        if (index % 3 === 0) {
            $('#noticiasRow').append('<div class="row"></div>');
        }

        mostrarNoticiaEnInterfaz(noticia, index);
    });
// Evento para Ver Más
$(document).on('click', '.ver-mas', function () {
    const id = $(this).data('id');
    const noticia = noticias.find(n => n.id === id);

    // Crear el contenido dinámicamente
    const contenidoDetalleNoticia = `
        <div class="detalle-noticia">
            <button id="btnCerrarDetalleNoticia" class="btn btn-danger">Cerrar</button>
            <h5>Titulo: ${noticia.titulo || ''}</h5>
            <p>Cuerpo: ${noticia.descripcion || ''}</p>
            <p>Autor: ${noticia.autor || ''}</p>
        </div>`;

    // Vaciar y añadir el contenido al detalleNoticiaContainer
    const detalleNoticiaContainer = $('#detalleNoticiaContainer');
    detalleNoticiaContainer.empty().append(contenidoDetalleNoticia);

    // Mostrar el detalleNoticiaContainer y el fondo oscuro
    $('#overlay').fadeIn();

    // Centrar el detalleNoticiaContainer en la pantalla
    detalleNoticiaContainer.fadeIn();

    // Agregar un evento al botón "Cerrar" en el detalleNoticiaContainer
    $('#btnCerrarDetalleNoticia').click(function () {
        // Ocultar el detalleNoticiaContainer y el fondo oscuro
        detalleNoticiaContainer.fadeOut();
        $('#overlay').fadeOut();

        // Desvincular el evento del botón "Cerrar"
        $('#btnCerrarDetalleNoticia').off('click');
    });
});
    // Evento para Borrar
    $(document).on('click', '.borrar-noticia', function () {
        const id = $(this).data('id');
        borrarNoticia(id);
    });

    $('#btnAbrirFormulario').click(function () {
        $('#overlay').fadeIn();
        $('#noticiaForm').fadeIn();
    });

    $('#btnCerrarFormulario, #overlay').click(function () {
        $('#overlay, #noticiaForm').fadeOut();
    });

    
    $('#noticiaForm').submit(function (e) {
        e.preventDefault();

        const titulo = $('#titulo').val();
        const descripcion = $('#descripcion').val();
        const autor = $('#autor').val();

        if (!titulo || !descripcion || !autor) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        agregarNoticia(titulo, descripcion, autor);

        $('#titulo').val('');
        $('#descripcion').val('');
        $('#autor').val('');
    });

    $('#btnCerrarFormulario').click(function () {
        $('#noticiaForm').removeAttr('novalidate');

        $('#noticiaForm').fadeOut();
        $('#overlay').fadeOut();

        $('#titulo').val('');
        $('#descripcion').val('');
        $('#autor').val('');

        setTimeout(function () {
            $('#noticiaForm').attr('novalidate', 'novalidate');
        }, 100);
    });
    
    
});

function mostrarNoticiaDetallada(noticia, index) {
    // Comprobar si la noticia es válida
    if (!noticia) {
        console.error('La noticia no es válida');
        return;
    }

    // Llenar el nuevo formulario con la noticia detallada
    $('#detalleTitulo').val(noticia.titulo || '');
    $('#detalleDescripcion').val(noticia.descripcion || '');
    $('#detalleAutor').val(noticia.autor || '');

    // Mostrar el nuevo formulario y el fondo oscuro
    $('#overlay').fadeIn();
    $('#detalleNoticiaForm').fadeIn();

    // Agregar un evento al botón "Cerrar" en el nuevo formulario
    $('#detalleNoticiaForm #btnCerrarDetalleFormulario').click(function () {
        // Ocultar el nuevo formulario y el fondo oscuro
        $('#detalleNoticiaForm').fadeOut();
        $('#overlay').fadeOut();

        // Desvincular el evento del botón "Cerrar"
        $('#detalleNoticiaForm #btnCerrarDetalleFormulario').off('click');
    });
}

function borrarNoticia(id) {
    // Elimina la noticia del array
    console.log("Borrar noticia ejecutado para la ID:", id);
    noticias = noticias.filter(noticia => noticia.id !== id);
    console.log("Noticias después de borrar:", noticias);
    noticias = noticias.filter(noticia => noticia.id !== id);

    // Actualiza la interfaz con las noticias restantes
    actualizarInterfaz();

    // Guarda las noticias actualizadas en localStorage
    guardarNoticias();

    // Oculta el detalleNoticiaContainer y el fondo oscuro
    $('#detalleNoticiaContainer').fadeOut();
    $('#overlay').fadeOut();

    // Desvincula el evento del botón "Cerrar" en el detalleNoticiaContainer
    $('#btnCerrarDetalleNoticia').off('click');
}

function actualizarInterfaz() {
    // Vacía el contenedor de noticias
    $('#noticiasRow').empty();

    // Muestra las noticias actualizadas
    noticias.forEach((noticia, i) => {
        // Comienza una nueva fila cada tres noticias
        if (i % 3 === 0) {
            $('#noticiasRow').append('<div class="row"></div>');
        }

        mostrarNoticiaEnInterfaz(noticia, i);
    });

    // Oculta el detalleNoticiaContainer si está visible
    $('#detalleNoticiaContainer').fadeOut();
}

