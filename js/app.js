// ==========================================
// EXPENDIO - APP.JS
// Conexión con Google Apps Script
// ==========================================

// URL DE TU GOOGLE APPS SCRIPT
const API_URL = "https://script.google.com/macros/s/AKfycbyJi884UyrspXEgD4qUseu1WTxWBzKTaWgHpYVEvgQ2o9OuX6IybOQYi8Gw-KjJdyyqyg/exec";

// ==========================================
// VARIABLES
// ==========================================

let productos = [];

let slideActual = 0;


// ==========================================
// INICIAR PÁGINA
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    cargarProductos();

    iniciarCarrusel();

    configurarFormularioComentario();

});


// ==========================================
// CARGAR PRODUCTOS
// ==========================================

async function cargarProductos() {

    const contenedor =
        document.getElementById("lista-productos");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = `
        <div class="cargando">
            Cargando productos...
        </div>
    `;

    try {

        const respuesta = await fetch(
            API_URL + "?accion=productos"
        );

        if (!respuesta.ok) {
            throw new Error(
                "No se pudo conectar con el servidor."
            );
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos)) {
            throw new Error(
                "La respuesta del servidor no es válida."
            );
        }

        productos = datos;

        mostrarProductos();

    } catch (error) {

        console.error(
            "Error al cargar productos:",
            error
        );

        contenedor.innerHTML = `
            <div class="cargando">

                <h3>No se pudieron cargar los productos</h3>

                <p>
                    Verifica tu conexión a internet
                    e inténtalo nuevamente.
                </p>

                <button
                    class="boton-principal"
                    onclick="cargarProductos()"
                >
                    Intentar nuevamente
                </button>

            </div>
        `;
    }
}


// ==========================================
// MOSTRAR PRODUCTOS
// ==========================================

function mostrarProductos() {

    const contenedor =
        document.getElementById("lista-productos");

    if (!contenedor) {
        return;
    }

    if (productos.length === 0) {

        contenedor.innerHTML = `
            <div class="cargando">
                No hay productos disponibles.
            </div>
        `;

        return;
    }


    let html = "";


    productos.forEach(function (producto) {

        const precio =
            Number(producto.precioVenta) || 0;

        const cantidad =
            Number(producto.cantidad) || 0;

        const disponible =
            cantidad > 0 &&
            String(producto.estado).toLowerCase()
            !== "agotado";


        const claseEstado =
            disponible
                ? "disponible"
                : "agotado";


        const textoEstado =
            disponible
                ? `Disponible: ${formatearCantidad(cantidad)} ${producto.unidad}`
                : "Agotado";


        html += `

            <article class="producto">

                <div class="producto-imagen">
                    Imagen
                </div>

                <div class="producto-contenido">

                    <h3>
                        ${escaparHTML(producto.producto)}
                    </h3>

                    <div class="producto-precio">
                        $${precio.toFixed(2)}
                    </div>

                    <div class="producto-unidad">
                        Precio por ${escaparHTML(producto.unidad)}
                    </div>

                    <div class="producto-disponibilidad ${claseEstado}">
                        ${textoEstado}
                    </div>

                </div>

            </article>

        `;
    });


    contenedor.innerHTML = html;

    // Crear los botones de agregar al pedido
    if (typeof agregarBotonesProductos === "function") {
        agregarBotonesProductos();
    }
}


// ==========================================
// FORMATEAR CANTIDAD
// ==========================================

function formatearCantidad(cantidad) {

    if (Number.isInteger(cantidad)) {
        return cantidad.toString();
    }

    return cantidad
        .toFixed(2)
        .replace(/\.00$/, "")
        .replace(/(\.\d)0$/, "$1");
}


// ==========================================
// EVITAR HTML NO DESEADO
// ==========================================

function escaparHTML(texto) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// CARRUSEL
// ==========================================

function iniciarCarrusel() {

    mostrarSlide(slideActual);

    setInterval(function () {

        cambiarSlide(1);

    }, 5000);

}


function mostrarSlide(numero) {

    const slides =
        document.querySelectorAll(".slide");

    const indicadores =
        document.querySelectorAll(".indicador");


    if (slides.length === 0) {
        return;
    }


    if (numero >= slides.length) {
        slideActual = 0;

    } else if (numero < 0) {
        slideActual = slides.length - 1;

    } else {
        slideActual = numero;
    }


    slides.forEach(function (slide, indice) {

        slide.classList.toggle(
            "activo",
            indice === slideActual
        );

    });


    indicadores.forEach(function (indicador, indice) {

        indicador.classList.toggle(
            "activo",
            indice === slideActual
        );

    });

}


function cambiarSlide(direccion) {

    mostrarSlide(
        slideActual + direccion
    );

}


// ==========================================
// BOTÓN "HACER PEDIDO"
// ==========================================

function irAlPedido() {

    const productosSeccion =
        document.getElementById("productos");

    if (productosSeccion) {

        productosSeccion.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ==========================================
// FORMULARIO DE COMENTARIOS
// ==========================================

function configurarFormularioComentario() {

    const formulario =
        document.getElementById(
            "formulario-comentario"
        );

    if (!formulario) {
        return;
    }


    formulario.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();

            const nombre =
                document.getElementById(
                    "nombre"
                ).value.trim();

            const comentario =
                document.getElementById(
                    "comentario"
                ).value.trim();


            if (!nombre || !comentario) {

                alert(
                    "Por favor completa tu nombre y comentario."
                );

                return;
            }


            alert(
                "Gracias por tu comentario, " +
                nombre +
                ". Esta sección se conectará al sistema posteriormente."
            );


            formulario.reset();

        }
    );

}
