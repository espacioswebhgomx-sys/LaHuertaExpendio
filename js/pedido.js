// ==========================================
// EXPENDIO - PEDIDO.JS
// Sistema de carrito / pedido
// ==========================================


// ==========================================
// VARIABLES
// ==========================================

let carrito = [];

let datosPedidoTemporal = {

    nombre: "",
    telefono: "",
    tipoEntrega: "",
    entrega: "",
    direccion: "",
    ubicacion: "",
    formaPago: "",
    observaciones: ""

};


// ==========================================
// OBTENER TOTAL DEL CARRITO
// ==========================================

function obtenerTotalCarrito() {

    if (!Array.isArray(carrito)) {
        return 0;
    }

    return carrito.reduce(function(total, item) {

        const cantidad =
            Number(item.cantidad) || 0;

        const precio =
            Number(item.precioVenta) || 0;

        return total + (cantidad * precio);

    }, 0);

}


// ==========================================
// INICIAR SISTEMA DE PEDIDO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        crearInterfazPedido();

    }
);


// ==========================================
// CREAR INTERFAZ DEL PEDIDO
// ==========================================

function crearInterfazPedido() {

    const productos =
        document.getElementById("productos");

    if (!productos) {
        return;
    }

    if (
        document.getElementById(
            "carrito-pedido"
        )
    ) {
        return;
    }

    const carritoHTML =
        document.createElement("section");

    carritoHTML.id =
        "carrito-pedido";

    carritoHTML.className =
        "seccion carrito-seccion";


    carritoHTML.innerHTML = `

        <div class="titulo-seccion">

            <h2>🛒 Mi pedido</h2>

            <p>
                Revisa los productos que deseas comprar.
            </p>

        </div>


        <div id="contenido-carrito">

            <div class="carrito-vacio">

                <h3>
                    Tu pedido está vacío
                </h3>

                <p>
                    Selecciona productos para agregarlos
                    a tu pedido.
                </p>

            </div>

        </div>


        <div
            id="resumen-carrito"
            class="resumen-carrito"
            style="display: none;"
        >

            <div class="total-pedido">

                <span>
                    Total:
                </span>

                <strong id="total-pedido">
                    $0.00
                </strong>

            </div>


            <button
                class="boton-principal boton-continuar"
                onclick="continuarPedido()"
            >
                Continuar pedido
            </button>

        </div>

    `;


    productos.insertAdjacentElement(
        "afterend",
        carritoHTML
    );


    actualizarCarrito();

}


// ==========================================
// AGREGAR PRODUCTO
// ==========================================

function agregarAlCarrito(id) {

    const producto =
        productos.find(function(item) {

            return String(item.id) === String(id);

        });


    if (!producto) {

        alert(
            "No se encontró el producto."
        );

        return;
    }


    const existencia =
        Number(producto.cantidad) || 0;


    if (existencia <= 0) {

        alert(
            producto.producto +
            " está agotado."
        );

        return;
    }


    const existente =
        carrito.find(function(item) {

            return String(item.id) === String(id);

        });


    if (existente) {

        if (
            String(producto.unidad).toLowerCase()
            === "pz"
        ) {

            if (
                existente.cantidad + 1 >
                existencia
            ) {

                alert(
                    "No puedes agregar más de " +
                    existencia +
                    " piezas."
                );

                return;
            }

            existente.cantidad += 1;

        } else {

            const nuevaCantidad =
                existente.cantidad + 0.5;


            if (
                nuevaCantidad >
                existencia
            ) {

                alert(
                    "No puedes agregar más de " +
                    existencia +
                    " " +
                    producto.unidad +
                    "."
                );

                return;
            }

            existente.cantidad =
                nuevaCantidad;
        }

    } else {

        carrito.push({

            id: producto.id,

            producto: producto.producto,

            unidad: producto.unidad,

            cantidad:
                String(producto.unidad).toLowerCase()
                === "pz"
                    ? 1
                    : 0.5,

            precioVenta:
                Number(producto.precioVenta) || 0,

            existencia: existencia

        });

    }


    actualizarCarrito();

}


// ==========================================
// CAMBIAR CANTIDAD
// ==========================================

function cambiarCantidad(id, cambio) {

    const item =
        carrito.find(function(producto) {

            return String(producto.id) === String(id);

        });


    if (!item) {
        return;
    }


    let nuevaCantidad =
        item.cantidad + cambio;


    if (nuevaCantidad <= 0) {

        eliminarDelCarrito(id);

        return;
    }


    if (
        nuevaCantidad >
        item.existencia
    ) {

        alert(
            "Solo hay " +
            formatearCantidad(item.existencia) +
            " " +
            item.unidad +
            " disponibles."
        );

        return;
    }


    item.cantidad =
        nuevaCantidad;


    actualizarCarrito();

}


// ==========================================
// CAMBIAR CANTIDAD MANUALMENTE
// ==========================================

function establecerCantidad(id, valor) {

    const item =
        carrito.find(function(producto) {

            return String(producto.id) === String(id);

        });


    if (!item) {
        return;
    }


    let cantidad =
        Number(valor);


    if (isNaN(cantidad)) {

        cantidad =
            item.cantidad;

    }


    if (cantidad <= 0) {

        eliminarDelCarrito(id);

        return;
    }


    if (
        cantidad >
        item.existencia
    ) {

        alert(
            "Solo hay " +
            formatearCantidad(item.existencia) +
            " " +
            item.unidad +
            " disponibles."
        );

        actualizarCarrito();

        return;
    }


    const unidad =
        String(item.unidad).toLowerCase();


    if (unidad === "pz") {

        cantidad =
            Math.floor(cantidad);


        if (cantidad <= 0) {

            eliminarDelCarrito(id);

            return;
        }

    } else {

        cantidad =
            Math.round(
                cantidad * 100
            ) / 100;

    }


    item.cantidad =
        cantidad;


    actualizarCarrito();

}


// ==========================================
// ELIMINAR PRODUCTO
// ==========================================

function eliminarDelCarrito(id) {

    carrito =
        carrito.filter(function(item) {

            return String(item.id) !== String(id);

        });


    actualizarCarrito();

}


// ==========================================
// ACTUALIZAR CARRITO
// ==========================================

function actualizarCarrito() {

    const contenedor =
        document.getElementById(
            "contenido-carrito"
        );


    const resumen =
        document.getElementById(
            "resumen-carrito"
        );


    if (!contenedor) {
        return;
    }


    if (carrito.length === 0) {

        contenedor.innerHTML = `

            <div class="carrito-vacio">

                <h3>
                    Tu pedido está vacío
                </h3>

                <p>
                    Selecciona productos para agregarlos
                    a tu pedido.
                </p>

            </div>

        `;


        if (resumen) {
            resumen.style.display = "none";
        }


        agregarBotonesProductos();

        return;
    }


    let html = "";

    let total = 0;


    carrito.forEach(function(item) {

        const subtotal =
            item.cantidad *
            item.precioVenta;


        total += subtotal;


        const unidad =
            String(item.unidad)
            .toLowerCase();


        const paso =
            unidad === "pz"
                ? 1
                : 0.5;


        const min =
            unidad === "pz"
                ? 1
                : 0.01;


        html += `

            <div class="item-carrito">

                <div class="item-carrito-info">

                    <h3>
                        ${escaparHTML(item.producto)}
                    </h3>

                    <p>
                        $${item.precioVenta.toFixed(2)}
                        / ${escaparHTML(item.unidad)}
                    </p>

                </div>


                <div class="controles-cantidad">

                    <button
                        type="button"
                        onclick="cambiarCantidad(
                            '${item.id}',
                            ${-paso}
                        )"
                    >
                        −
                    </button>


                    <input
                        type="number"
                        value="${item.cantidad}"
                        min="${min}"
                        max="${item.existencia}"
                        step="${paso}"
                        onchange="establecerCantidad(
                            '${item.id}',
                            this.value
                        )"
                    >


                    <button
                        type="button"
                        onclick="cambiarCantidad(
                            '${item.id}',
                            ${paso}
                        )"
                    >
                        +
                    </button>

                </div>


                <div class="item-subtotal">

                    $${subtotal.toFixed(2)}

                </div>


                <button
                    type="button"
                    class="boton-eliminar"
                    onclick="eliminarDelCarrito(
                        '${item.id}'
                    )"
                    title="Eliminar"
                >
                    🗑️
                </button>

            </div>

        `;

    });


    contenedor.innerHTML =
        html;


    if (resumen) {

        resumen.style.display =
            "block";

    }


    const totalElemento =
        document.getElementById(
            "total-pedido"
        );


    if (totalElemento) {

        totalElemento.textContent =
            "$" + total.toFixed(2);

    }


    agregarBotonesProductos();

}


// ==========================================
// AGREGAR BOTONES A LOS PRODUCTOS
// ==========================================

function agregarBotonesProductos() {

    const tarjetas =
        document.querySelectorAll(
            ".producto"
        );


    tarjetas.forEach(function(tarjeta) {

        if (
            tarjeta.querySelector(
                ".boton-agregar"
            )
        ) {
            return;
        }


        const titulo =
            tarjeta.querySelector("h3");


        if (!titulo) {
            return;
        }


        const nombre =
            titulo.textContent.trim();


        const producto =
            productos.find(function(item) {

                return item.producto === nombre;

            });


        if (!producto) {
            return;
        }


        const contenido =
            tarjeta.querySelector(
                ".producto-contenido"
            );


        if (!contenido) {
            return;
        }


        const cantidad =
            Number(producto.cantidad) || 0;


        const boton =
            document.createElement("button");


        boton.type =
            "button";


        boton.className =
            "boton-principal boton-agregar";


        if (cantidad > 0) {

            boton.textContent =
                "🛒 Agregar al pedido";


            boton.onclick =
                function() {

                    agregarAlCarrito(
                        producto.id
                    );

                };

        } else {

            boton.textContent =
                "Agotado";

            boton.disabled =
                true;

        }


        contenido.appendChild(
            boton
        );

    });

}


// ==========================================
// FUNCION CONTINUAR PEDIDO
// ==========================================

function continuarPedido() {

    if (
        !carrito ||
        carrito.length === 0
    ) {

        alert(
            "Agrega al menos un producto a tu pedido."
        );

        return;
    }


    const existente =
        document.getElementById(
            "datos-pedido"
        );


    if (existente) {

        existente.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return;
    }


    const carritoSeccion =
        document.getElementById(
            "carrito-pedido"
        );


    if (!carritoSeccion) {

        alert(
            "No se encontró la sección del pedido."
        );

        return;
    }


    const formulario =
        document.createElement("div");


    formulario.id =
        "datos-pedido";


    formulario.className =
        "datos-pedido";


    formulario.innerHTML = `

        <div class="titulo-seccion">

            <h2>📋 Datos del pedido</h2>

            <p>
                Completa los datos para continuar.
            </p>

        </div>


        <div class="formulario-pedido">

            <div class="campo">

                <label for="nombre-cliente">
                    Nombre
                </label>

                <input
                    type="text"
                    id="nombre-cliente"
                    name="nombre"
                    placeholder="Escribe tu nombre"
                    autocomplete="name"
                >

            </div>


            <div class="campo">

                <label for="telefono-cliente">
                    Teléfono
                </label>

                <input
                    type="tel"
                    id="telefono-cliente"
                    name="telefono"
                    placeholder="Tu número de teléfono"
                    autocomplete="tel"
                >

            </div>


            <div class="campo">

                <label>
                    Tipo de entrega
                </label>

                <div class="opciones">

                    <label>

                        <input
                            type="radio"
                            name="tipo-entrega"
                            value="sucursal"
                            onchange="cambiarTipoEntrega()"
                        >

                        Recoger en sucursal

                    </label>


                    <label>

                        <input
                            type="radio"
                            name="tipo-entrega"
                            value="domicilio"
                            onchange="cambiarTipoEntrega()"
                        >

                        Entrega a domicilio

                    </label>

                </div>

            </div>


            <div
                class="campo"
                id="campo-sucursal"
                style="display:none;"
            >

                <label for="sucursal">
                    Selecciona una sucursal
                </label>

                <select id="sucursal">

                    <option value="">
                        Selecciona una sucursal
                    </option>

                    <option value="Sucursal 1">
                        Sucursal 1
                    </option>

                    <option value="Sucursal 2">
                        Sucursal 2
                    </option>

                </select>

            </div>


            <div
                class="campo"
                id="campo-domicilio"
                style="display:none;"
            >

                <label for="direccion">
                    Dirección de entrega
                </label>

                <textarea
                    id="direccion"
                    placeholder="Escribe tu dirección completa"
                    rows="3"
                ></textarea>


                <button
                    type="button"
                    class="boton-secundario"
                    onclick="compartirUbicacion()"
                >
                    📍 Compartir mi ubicación
                </button>


                <p id="estado-ubicacion"></p>


                <input
                    type="hidden"
                    id="ubicacion"
                    value=""
                >

            </div>


            <div class="campo">

                <label>
                    Forma de pago
                </label>

                <div class="opciones">

                    <label>

                        <input
                            type="radio"
                            name="forma-pago"
                            value="efectivo"
                        >

                        💵 Efectivo

                    </label>


                    <label>

                        <input
                            type="radio"
                            name="forma-pago"
                            value="transferencia"
                        >

                        🏦 Transferencia

                    </label>

                </div>

            </div>


            <div class="campo">

                <label for="observaciones">
                    Observaciones
                </label>

                <textarea
                    id="observaciones"
                    placeholder="Alguna indicación para tu pedido..."
                    rows="3"
                ></textarea>

            </div>


            <div class="confirmacion-total">

                <span>
                    Total del pedido:
                </span>

                <strong id="total-confirmacion">
                    $${obtenerTotalCarrito().toFixed(2)}
                </strong>

            </div>


            <button
                type="button"
                class="boton-principal boton-confirmar"
                onclick="prepararPedido()"
            >
                ✅ Revisar pedido
            </button>

        </div>

    `;


    carritoSeccion.appendChild(
        formulario
    );


    formulario.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ==========================================
// CAMBIAR TIPO DE ENTREGA
// ==========================================

function cambiarTipoEntrega() {

    const tipo =
        document.querySelector(
            'input[name="tipo-entrega"]:checked'
        );


    const campoSucursal =
        document.getElementById(
            "campo-sucursal"
        );


    const campoDomicilio =
        document.getElementById(
            "campo-domicilio"
        );


    if (!tipo) {
        return;
    }


    if (tipo.value === "sucursal") {

        campoSucursal.style.display =
            "block";

        campoDomicilio.style.display =
            "none";

    } else {

        campoSucursal.style.display =
            "none";

        campoDomicilio.style.display =
            "block";

    }

}


// ==========================================
// COMPARTIR UBICACIÓN
// ==========================================

function compartirUbicacion() {

    const estado =
        document.getElementById(
            "estado-ubicacion"
        );


    const campo =
        document.getElementById(
            "ubicacion"
        );


    if (!navigator.geolocation) {

        estado.textContent =
            "Tu navegador no permite compartir ubicación.";

        return;
    }


    estado.textContent =
        "Obteniendo ubicación...";


    navigator.geolocation.getCurrentPosition(

        function(posicion) {

            const lat =
                posicion.coords.latitude;


            const lon =
                posicion.coords.longitude;


            const enlace =
                "https://www.google.com/maps?q=" +
                lat +
                "," +
                lon;


            campo.value =
                enlace;


            estado.textContent =
                "✅ Ubicación obtenida correctamente.";

        },


        function() {

            estado.textContent =
                "No se pudo obtener la ubicación. Puedes escribir tu dirección manualmente.";

        },


        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }

    );

}


// ==========================================
// REVISAR PEDIDO
// ==========================================

function prepararPedido() {

    const campoNombre =
        document.getElementById(
            "nombre-cliente"
        );


    const campoTelefono =
        document.getElementById(
            "telefono-cliente"
        );


    const nombre =
        campoNombre
            ? campoNombre.value.trim()
            : "";


    const telefono =
        campoTelefono
            ? campoTelefono.value.trim()
            : "";


    const tipoEntrega =
        document.querySelector(
            'input[name="tipo-entrega"]:checked'
        );


    const pago =
        document.querySelector(
            'input[name="forma-pago"]:checked'
        );


    if (!nombre) {

        alert(
            "Escribe tu nombre."
        );

        return;
    }


    if (!telefono) {

        alert(
            "Escribe tu número de teléfono."
        );

        return;
    }


    if (!tipoEntrega) {

        alert(
            "Selecciona el tipo de entrega."
        );

        return;
    }


    let entregaTexto = "";


    if (
        tipoEntrega.value ===
        "sucursal"
    ) {

        const sucursal =
            document.getElementById(
                "sucursal"
            );


        if (
            !sucursal ||
            !sucursal.value
        ) {

            alert(
                "Selecciona una sucursal."
            );

            return;
        }


        entregaTexto =
            sucursal.value;

    } else {

        const direccion =
            document.getElementById(
                "direccion"
            );


        if (
            !direccion ||
            !direccion.value.trim()
        ) {

            alert(
                "Escribe la dirección de entrega."
            );

            return;
        }


        entregaTexto =
            direccion.value.trim();

    }


    if (!pago) {

        alert(
            "Selecciona una forma de pago."
        );

        return;
    }


    mostrarResumenFinal();

}


// ==========================================
// MOSTRAR RESUMEN FINAL
// ==========================================

function mostrarResumenFinal() {

    const datosPedido =
        document.getElementById(
            "datos-pedido"
        );


    if (!datosPedido) {

        alert(
            "No se encontró el formulario del pedido."
        );

        return;
    }


    // ==========================================
    // DATOS DEL CLIENTE
    // ==========================================

    const campoNombre =
        document.getElementById(
            "nombre-cliente"
        );


    const campoTelefono =
        document.getElementById(
            "telefono-cliente"
        );


    const nombre =
        campoNombre
            ? campoNombre.value.trim()
            : "";


    const telefono =
        campoTelefono
            ? campoTelefono.value.trim()
            : "";


    // ==========================================
    // TIPO DE ENTREGA
    // ==========================================

    const tipoEntrega =
        document.querySelector(
            'input[name="tipo-entrega"]:checked'
        );


    if (!tipoEntrega) {

        alert(
            "Selecciona el tipo de entrega."
        );

        return;
    }


    // ==========================================
    // FORMA DE PAGO
    // ==========================================

    const pago =
        document.querySelector(
            'input[name="forma-pago"]:checked'
        );


    if (!pago) {

        alert(
            "Selecciona una forma de pago."
        );

        return;
    }


    // ==========================================
    // ENTREGA
    // ==========================================

    let entregaTexto = "";


    if (
        tipoEntrega.value ===
        "sucursal"
    ) {

        const sucursal =
            document.getElementById(
                "sucursal"
            );


        if (
            !sucursal ||
            !sucursal.value
        ) {

            alert(
                "Selecciona una sucursal."
            );

            return;
        }


        entregaTexto =
            sucursal.value;

    } else {

        const direccionCampo =
            document.getElementById(
                "direccion"
            );


        if (
            !direccionCampo ||
            !direccionCampo.value.trim()
        ) {

            alert(
                "Escribe la dirección de entrega."
            );

            return;
        }


        entregaTexto =
            direccionCampo.value.trim();

    }


    // ==========================================
    // DIRECCIÓN
    // ==========================================

    const campoDireccion =
        document.getElementById(
            "direccion"
        );


    const direccion =
        campoDireccion
            ? campoDireccion.value.trim()
            : "";


    // ==========================================
    // UBICACIÓN
    // ==========================================

    const campoUbicacion =
        document.getElementById(
            "ubicacion"
        );


    const ubicacion =
        campoUbicacion
            ? campoUbicacion.value
            : "";


    // ==========================================
    // OBSERVACIONES
    // ==========================================

    const campoObservaciones =
        document.getElementById(
            "observaciones"
        );


    const observaciones =
        campoObservaciones
            ? campoObservaciones.value.trim()
            : "";


    // ==========================================
    // GUARDAR DATOS TEMPORALMENTE
    // ==========================================

    datosPedidoTemporal = {

        nombre:
            nombre,

        telefono:
            telefono,

        tipoEntrega:
            tipoEntrega.value,

        entrega:
            entregaTexto,

        direccion:
            direccion,

        ubicacion:
            ubicacion,

        formaPago:
            pago.value,

        observaciones:
            observaciones

    };


    // ==========================================
    // PRODUCTOS
    // ==========================================

    let productosHTML = "";


    carrito.forEach(function(item) {

        const subtotal =
            Number(item.cantidad) *
            Number(item.precioVenta);


        productosHTML += `

            <div class="resumen-producto">

                <span>

                    ${escaparHTML(item.producto)}

                    ×

                    ${formatearCantidad(
                        item.cantidad
                    )}

                    ${escaparHTML(
                        item.unidad
                    )}

                </span>


                <strong>

                    $${subtotal.toFixed(2)}

                </strong>

            </div>

        `;

    });


    // ==========================================
    // TOTAL
    // ==========================================

    const total =
        obtenerTotalCarrito();


    // ==========================================
    // MOSTRAR RESUMEN
    // ==========================================

    datosPedido.innerHTML = `

        <div class="titulo-seccion">

            <h2>
                ✅ Revisar pedido
            </h2>

            <p>
                Verifica que los datos sean correctos.
            </p>

        </div>


        <div class="resumen-final">

            <h3>
                🛒 Productos
            </h3>

            ${productosHTML}


            <div class="resumen-total">

                <span>
                    Total
                </span>

                <strong>
                    $${total.toFixed(2)}
                </strong>

            </div>


            <h3>
                👤 Datos del cliente
            </h3>


            <p>

                <strong>
                    Nombre:
                </strong>

                ${escaparHTML(nombre)}

            </p>


            <p>

                <strong>
                    Teléfono:
                </strong>

                ${escaparHTML(telefono)}

            </p>


            <h3>
                🚚 Entrega
            </h3>


            <p>

                <strong>
                    Tipo:
                </strong>

                ${
                    tipoEntrega.value === "sucursal"
                        ? "Recoger en sucursal"
                        : "Entrega a domicilio"
                }

            </p>


            <p>

                <strong>

                    ${
                        tipoEntrega.value === "sucursal"
                            ? "Sucursal:"
                            : "Dirección:"
                    }

                </strong>

                ${escaparHTML(entregaTexto)}

            </p>


            ${
                ubicacion
                    ? `
                        <p>

                            <strong>
                                Ubicación:
                            </strong>

                            <a
                                href="${ubicacion}"
                                target="_blank"
                            >
                                📍 Ver ubicación en Google Maps
                            </a>

                        </p>
                    `
                    : ""
            }


            <h3>
                💳 Forma de pago
            </h3>


            <p>

                ${
                    pago.value === "efectivo"
                        ? "💵 Efectivo"
                        : "🏦 Transferencia"
                }

            </p>


            ${
                observaciones
                    ? `
                        <h3>
                            📝 Observaciones
                        </h3>

                        <p>
                            ${escaparHTML(
                                observaciones
                            )}
                        </p>
                    `
                    : ""
            }


            <button
                type="button"
                class="boton-principal boton-confirmar"
                onclick="confirmarPedidoFinal()"
            >
                📱 Confirmar pedido
            </button>


            <button
                type="button"
                class="boton-secundario"
                onclick="editarDatosPedido()"
            >
                ← Modificar datos
            </button>

        </div>

    `;


    datosPedido.scrollIntoView({
        behavior: "smooth"
    });

}


// ==========================================
// MODIFICAR DATOS
// ==========================================

function editarDatosPedido() {

    location.reload();

}


// ==========================================
// CONFIRMAR PEDIDO FINAL
// ==========================================

async function confirmarPedidoFinal() {

    if (
        !carrito ||
        carrito.length === 0
    ) {

        alert(
            "Tu pedido está vacío."
        );

        return;
    }


    // ==========================================
    // RECUPERAR DATOS GUARDADOS
    // ==========================================

    const nombre =
        datosPedidoTemporal.nombre;


    const telefono =
        datosPedidoTemporal.telefono;


    const tipoEntrega =
        datosPedidoTemporal.tipoEntrega;


    const entrega =
        datosPedidoTemporal.entrega;


    // ==========================================
    // CAMBIO IMPORTANTE:
    // RECUPERAR DIRECCIÓN TEMPORAL
    // ==========================================

    const direccion =
        datosPedidoTemporal.direccion;


    const ubicacion =
        datosPedidoTemporal.ubicacion;


    const formaPago =
        datosPedidoTemporal.formaPago;


    const observaciones =
        datosPedidoTemporal.observaciones;


    // ==========================================
    // VALIDACIONES
    // ==========================================

    if (!nombre) {

        alert(
            "Escribe tu nombre."
        );

        return;
    }


    if (!telefono) {

        alert(
            "Escribe tu número de teléfono."
        );

        return;
    }


    if (!tipoEntrega) {

        alert(
            "Selecciona el tipo de entrega."
        );

        return;
    }


    if (!entrega) {

        alert(
            tipoEntrega === "sucursal"
                ? "Selecciona una sucursal."
                : "Escribe la dirección de entrega."
        );

        return;
    }


    if (!formaPago) {

        alert(
            "Selecciona una forma de pago."
        );

        return;
    }


    // ==========================================
    // CREAR PEDIDO
    // ==========================================

    const pedido = {

        cliente:
            nombre,

        telefono:
            telefono,

        tipoEntrega:
            tipoEntrega,

        entrega:
            entrega,

        direccion:
            direccion,

        ubicacion:
            ubicacion,

        formaPago:
            formaPago,

        observaciones:
            observaciones,

        total:
            obtenerTotalCarrito(),

        productos:
            carrito.map(function(item) {

                return {

                    id:
                        item.id,

                    producto:
                        item.producto,

                    cantidad:
                        Number(item.cantidad),

                    unidad:
                        item.unidad,

                    precioVenta:
                        Number(
                            item.precioVenta
                        ),

                    subtotal:
                        Number(
                            item.cantidad
                        ) *
                        Number(
                            item.precioVenta
                        )

                };

            })

    };


    // ==========================================
    // BOTÓN
    // ==========================================

    const boton =
        document.querySelector(
            ".boton-confirmar"
        );


    if (boton) {

        boton.disabled =
            true;

        boton.textContent =
            "⏳ Registrando pedido...";

    }


    // ==========================================
    // ENVIAR A GOOGLE SHEETS
    // ==========================================

    try {

        await enviarPedidoGoogleSheets(
            pedido
        );

    } catch (error) {

        console.error(
            "Error al registrar pedido:",
            error
        );


        alert(
            "No se pudo registrar el pedido.\n\n" +
            "Por favor intenta nuevamente."
        );


        if (boton) {

            boton.disabled =
                false;

            boton.textContent =
                "📱 Confirmar pedido";

        }

    }

}


// ==========================================
// ENVIAR PEDIDO A GOOGLE SHEETS
// ==========================================

function enviarPedidoGoogleSheets(pedido) {

    return new Promise(
        function(resolve, reject) {

            const iframe =
                document.createElement(
                    "iframe"
                );


            iframe.name =
                "iframe-pedido";


            iframe.style.display =
                "none";


            document.body.appendChild(
                iframe
            );


            const formulario =
                document.createElement(
                    "form"
                );


            formulario.method =
                "POST";


            formulario.action =
                API_URL;


            formulario.target =
                "iframe-pedido";


            const campo =
                document.createElement(
                    "input"
                );


            campo.type =
                "hidden";


            campo.name =
                "datos";


            campo.value =
                JSON.stringify(
                    pedido
                );


            formulario.appendChild(
                campo
            );


            document.body.appendChild(
                formulario
            );


            formulario.submit();


            // ==================================
            // ESPERAR AL ENVÍO
            // ==================================

            setTimeout(
                function() {

                    formulario.remove();

                    iframe.remove();

                    mostrarPedidoRegistrado(
                        pedido
                    );

                    resolve();

                },
                2500
            );

        }
    );

}


// ==========================================
// PEDIDO REGISTRADO
// ==========================================

function mostrarPedidoRegistrado(pedido) {

    const total =
        obtenerTotalCarrito();


    const numeroWhatsApp =
        "527712081335";


    let mensaje =
        "Hola, quiero realizar un pedido.%0A%0A";


    mensaje +=
        "*Cliente:* " +
        encodeURIComponent(
            pedido.cliente
        ) +
        "%0A";


    mensaje +=
        "*Teléfono:* " +
        encodeURIComponent(
            pedido.telefono
        ) +
        "%0A%0A";


    mensaje +=
        "*Productos:*%0A";


    pedido.productos.forEach(
        function(item) {

            mensaje +=
                "- " +
                encodeURIComponent(
                    item.producto
                ) +
                " x " +
                item.cantidad +
                " " +
                item.unidad +
                " = $" +
                item.subtotal.toFixed(2) +
                "%0A";

        }
    );


    mensaje +=
        "%0A*Total:* $" +
        total.toFixed(2) +
        "%0A";


    mensaje +=
        "*Entrega:* " +
        encodeURIComponent(
            pedido.entrega
        ) +
        "%0A";


    mensaje +=
        "*Pago:* " +
        encodeURIComponent(
            pedido.formaPago
        ) +
        "%0A";


    if (pedido.ubicacion) {

        mensaje +=
            "*Ubicación:* " +
            encodeURIComponent(
                pedido.ubicacion
            ) +
            "%0A";

    }


    if (pedido.observaciones) {

        mensaje +=
            "*Observaciones:* " +
            encodeURIComponent(
                pedido.observaciones
            ) +
            "%0A";

    }


    const urlWhatsApp =
        "https://wa.me/" +
        numeroWhatsApp +
        "?text=" +
        mensaje;


    const contenedor =
        document.getElementById(
            "datos-pedido"
        );


    if (!contenedor) {

        alert(
            "El pedido fue registrado, pero no se encontró el área de confirmación."
        );

        return;
    }


    contenedor.innerHTML = `

        <div class="resumen-final">

            <h2>
                🎉 ¡Pedido registrado!
            </h2>

            <p>
                Tu pedido fue enviado correctamente.
            </p>


            <div class="confirmacion-total">

                <strong>
                    Total: $${total.toFixed(2)}
                </strong>

            </div>


            <a
                href="${urlWhatsApp}"
                target="_blank"
                class="boton-confirmar"
            >
                💬 Enviar pedido por WhatsApp
            </a>


            <button
                class="boton-secundario"
                onclick="location.reload()"
            >
                🛒 Nuevo pedido
            </button>

        </div>

    `;


// Actualizar inventario de la página
cargarProductos();

// Mantener la vista en "Pedido registrado"
setTimeout(function() {

    const confirmacion =
        document.getElementById("datos-pedido");

    if (confirmacion) {

        confirmacion.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}, 700);

// ==========================================
// NUEVO PEDIDO
// ==========================================

function nuevoPedido() {

    carrito = [];

    datosPedidoTemporal = {

        nombre: "",
        telefono: "",
        tipoEntrega: "",
        entrega: "",
        direccion: "",
        ubicacion: "",
        formaPago: "",
        observaciones: ""

    };


    const datosPedido =
        document.getElementById(
            "datos-pedido"
        );


    if (datosPedido) {

        datosPedido.remove();

    }


    actualizarCarrito();

setTimeout(function() {

    const carritoSeccion =
        document.getElementById("carrito-pedido");

    if (!carritoSeccion) {
        return;
    }

    const posicion =
        carritoSeccion.getBoundingClientRect().top +
        window.pageYOffset -
        80;

    window.scrollTo({
        top: posicion,
        behavior: "smooth"
    });

}, 300);

}

// ==========================================
// IR AL PEDIDO DESDE EL BOTÓN FLOTANTE
// ==========================================

//function irAlPedido() {

//    const carritoSeccion =
//        document.getElementById("carrito-pedido");

//    if (!carritoSeccion) {
//        return;
//    }

 //   const posicion =
 //       carritoSeccion.getBoundingClientRect().top +
 //       window.pageYOffset -
 //       80;

 //   window.scrollTo({
 //       top: posicion,
 //       behavior: "smooth"
 //   });

//  }
}
