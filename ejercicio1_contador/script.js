/* =========================================================
   EJERCICIO BÁSICO: CONTADOR DE CLICS
   Este script cubre solo lo esencial:
   - Seleccionar elementos con getElementById
   - Escuchar eventos con addEventListener('click')
   - Cambiar texto con textContent
   - Cambiar estilos con style.backgroundColor
   ========================================================= */

// 1. SELECCIONAR LOS ELEMENTOS QUE VAMOS A USAR
const contadorEl = document.getElementById('contador');
const box = document.getElementById('box');
const btnSumar = document.getElementById('btn-sumar');
const btnRestar = document.getElementById('btn-restar');
const btnReset = document.getElementById('btn-reset');

// 2. VARIABLE QUE GUARDA EL VALOR ACTUAL DEL CONTADOR
let contador = 0;

// 3. FUNCIÓN QUE ACTUALIZA EL NÚMERO EN PANTALLA Y EL COLOR DE LA CAJA
function actualizarPantalla() {
  // textContent cambia el texto que se ve dentro del elemento
  contadorEl.textContent = contador;

  // Cambiamos el color según si el número es positivo, negativo o cero
  if (contador > 0) {
    box.style.backgroundColor = '#22c55e'; // verde
  } else if (contador < 0) {
    box.style.backgroundColor = '#ef4444'; // rojo
  } else {
    box.style.backgroundColor = '#3b82f6'; // azul (valor inicial)
  }
}

// 4. EVENTO CLICK: sumar 1 al contador
btnSumar.addEventListener('click', function () {
  contador = contador + 1;
  actualizarPantalla();
});

// 5. EVENTO CLICK: restar 1 al contador
btnRestar.addEventListener('click', function () {
  contador = contador - 1;
  actualizarPantalla();
});

// 6. EVENTO CLICK: reiniciar el contador a 0
btnReset.addEventListener('click', function () {
  contador = 0;
  actualizarPantalla();
});
