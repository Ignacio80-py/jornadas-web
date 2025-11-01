// Elementos de usuario
const usuarios = [
    { check: 'check-nano', img: 'nano-img' },
    { check: 'check-merce', img: 'merce-img' },
    { check: 'check-sergio', img: 'sergio-img' },
    { check: 'check-lara', img: 'lara-img' },
    { check: 'check-marcos', img: 'marcos-img' },
];

usuarios.forEach(({ check, img }) => {
    document.getElementById(check).addEventListener('change', function () {
        document.getElementById(img).hidden = !this.checked;
    });
});

// Imagen aleatoria
const aleatorioImg = document.getElementById('aleatorio-img');
const aleatorioCheck = document.getElementById('check-aleatorio');
const imagenesRutas = [
    'img/nano-mini.png',
    'img/merce-mini.png',
    'img/sergio-mini.png',
    'img/lara-mini.png',
    'img/marcos-mini.png',
];
let aleatorioInterval = null;
const duracionAleatorio = 3000; // milisegundos total
const intervaloAleatorio = 100; // como el after(100) en tk

// --- GANADOR MODAL & FUEGOS ARTIFICIALES ---
const modalGanador = document.getElementById('ganador-modal');
function mostrarGanador(imgSrc, alt) {
    modalGanador.innerHTML =
        `<img src="${imgSrc}" alt="${alt}" class="ganador-img">
         <div class="ganador-texto">¡TÚ PAGAS!</div>`;
    modalGanador.style.display = 'flex';
    crearFuegosArtificiales();
}
// Al hacer click, ocultar el modal y limpiar efectos
modalGanador.onclick = function(){
    modalGanador.style.display = 'none';
    modalGanador.innerHTML = '';
}

function crearFuegosArtificiales() {
    const audio = new Audio('audio/risas.mp3');
    audio.play();
    // Lanza varios fuegos artificiales en posiciones aleatorias del modal
    for(let i=0;i<13;i++){
        const fw = document.createElement('div');
        fw.className = 'firework';
        const size = 15 + Math.random()*23;
        fw.style.width = fw.style.height = size+'px';
        fw.style.background = `radial-gradient(circle at 65% 30%, ${randColor()}, white 50%, transparent 80%)`;
        fw.style.left = (Math.random()*80+10)+'%';
        fw.style.top = (Math.random()*55+10)+'%';
        fw.style.opacity = 0.85+0.15*Math.random();
        modalGanador.appendChild(fw);
        setTimeout(()=>{fw.style.transition='transform 1.1s, opacity 1.09s';fw.style.transform='scale(4) rotate('+(360*Math.random())+'deg)';fw.style.opacity='0';},40+120*i);
        setTimeout(()=>fw.remove(), 1400+120*i);
    }
}
function randColor() {
    // Colores brillantes tipo fuegos artificiales
    const colores = ['#ffeb3b', '#ff5454', '#4eeeeb', '#bb72ff', '#fff6e0', '#ff42ae', '#6bff44'];
    return colores[Math.floor(Math.random()*colores.length)];
}

aleatorioCheck.addEventListener('change', function () {
    if(this.checked){
        let tiempoRestante = duracionAleatorio;
        aleatorioImg.hidden = false;
        let ganadorFinal = 0;
        function mostrar(){
            if(!aleatorioCheck.checked){
                aleatorioImg.hidden = true;
                aleatorioImg.src = '';
                return;
            }
            const idx = Math.floor(Math.random() * imagenesRutas.length);
            ganadorFinal = idx;
            aleatorioImg.src = imagenesRutas[idx];
            tiempoRestante -= intervaloAleatorio;
            if(tiempoRestante > 0){
                aleatorioInterval = setTimeout(mostrar, intervaloAleatorio);
            } else {
                aleatorioCheck.checked = false;
                aleatorioImg.hidden = true;
                // Mostrar modal y fuegos artificiales aquí:
                mostrarGanador(imagenesRutas[4], aleatorioImg.alt || 'Ganador');
            }
        }
        mostrar();
    } else {
        if(aleatorioInterval) clearTimeout(aleatorioInterval);
        aleatorioImg.hidden = true;
        aleatorioImg.src = '';
    }
});

// Entrada y cálculo
const input = document.getElementById('cantidad-input');
const boton = document.getElementById('calcular-btn');
const resultadoDiv = document.getElementById('resultado');
const borrarBtn = document.getElementById('borrar-btn');

// Para borrar texto al hacer click (como bind("<Button-1>",...))
input.addEventListener('click', () => {
    input.value = '';
});

function esNumero(valor){
    return !isNaN(parseFloat(valor)) && isFinite(valor);
}

boton.addEventListener('click', () => {
    const valor = input.value.trim();
    // Contar checkboxes marcados
    const marcados = usuarios.filter(u => document.getElementById(u.check).checked).length;
    if(!esNumero(valor)){
        resultadoDiv.style.background = 'orangered';
        resultadoDiv.textContent = 'INGRESA UN NUMERO COÑO.';
        return;
    }
    if(marcados === 0){
        resultadoDiv.style.background = 'orangered';
        resultadoDiv.textContent = 'Marca al menos una persona.';
        return;
    }
    const cantidad = parseFloat(valor);
    const aPagar = cantidad / marcados;
    resultadoDiv.style.background = 'orangered';
    resultadoDiv.innerHTML = `Total a pagar:<br><b>${aPagar.toFixed(2)}</b>`;
});

borrarBtn.addEventListener('click', () => {
    input.value = '';
    resultadoDiv.textContent = '';
});
