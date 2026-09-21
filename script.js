
const canvas = document.getElementById('flowerCanvas');
const ctx = canvas.getContext('2d');

let width, height;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();


// ==========================================
// PALETA DE FLORES AMARILLAS
// ==========================================

const flowerPalette = [
    { petal: '#FFD700', center: '#B8860B' }, // Amarillo dorado
    { petal: '#FFC107', center: '#8B5A00' }, // Amarillo intenso
    { petal: '#FFEB3B', center: '#C77700' }, // Amarillo brillante
    { petal: '#F9C74F', center: '#9A5B00' }, // Amarillo cálido
    { petal: '#FFE066', center: '#A65F00' }, // Amarillo suave
    { petal: '#FFCA28', center: '#8D5700' }, // Amarillo naranja
    { petal: '#FFD54F', center: '#A66A00' }  // Amarillo claro
];


// ==========================================
// PARTÍCULAS DE LUZ / POLEN
// ==========================================

const pollenParticles = [];

for (let i = 0; i < 90; i++) {
    pollenParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2.2 + 0.5,
        vy: -(Math.random() * 0.35 + 0.1),
        vx: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.7 + 0.3
    });
}


// ==========================================
// GENERACIÓN DE LAS FLORES
// ==========================================

const flowers = [];

const totalFlowers = Math.floor(window.innerWidth / 26);

for (let i = 0; i < totalFlowers; i++) {

    const startX =
        (width / totalFlowers) * i +
        (Math.random() * 18 - 9);

    const targetHeight =
        Math.random() * (height * 0.48) +
        (height * 0.22);

    const curve =
        (Math.random() - 0.5) * 70;

    const color =
        flowerPalette[
            Math.floor(Math.random() * flowerPalette.length)
        ];

    flowers.push({
        x: startX,
        startY: height,

        currentHeight: 0,

        targetHeight: targetHeight,

        curve: curve,

        speed: Math.random() * 2.2 + 1.4,

        bloomProgress: 0,

        petalCount:
            Math.floor(Math.random() * 4) + 6,

        flowerSize:
            Math.random() * 13 + 12,

        color: color,

        delay:
            Math.random() * 45
    });
}


// ==========================================
// DIBUJAR TALLO Y HOJAS
// ==========================================

function drawStem(flower) {

    const progress =
        flower.currentHeight /
        flower.targetHeight;

    const currentY =
        height - flower.currentHeight;

    const controlX =
        flower.x +
        flower.curve * progress;

    const controlY =
        height -
        (flower.currentHeight / 2);


    // Tallo

    ctx.beginPath();

    ctx.moveTo(
        flower.x,
        height
    );

    ctx.quadraticCurveTo(
        controlX,
        controlY,
        flower.x +
        (flower.curve * progress),
        currentY
    );

    ctx.strokeStyle = '#2d6a4f';

    ctx.lineWidth = 3;

    ctx.stroke();


    // ======================================
    // HOJAS
    // ======================================

    if (progress > 0.35) {

        const leafY =
            height -
            (flower.targetHeight * 0.35);

        const leafX =
            flower.x +
            (flower.curve * 0.35);


        ctx.save();

        ctx.fillStyle = '#40916c';

        ctx.beginPath();

        ctx.ellipse(
            leafX + 7,
            leafY,
            9,
            3.5,
            Math.PI / 4,
            0,
            Math.PI * 2
        );

        ctx.ellipse(
            leafX - 7,
            leafY + 8,
            9,
            3.5,
            -Math.PI / 4,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }


    return {
        x:
            flower.x +
            (flower.curve * progress),

        y: currentY
    };
}


// ==========================================
// DIBUJAR FLOR AMARILLA
// ==========================================

function drawFlowerHead(x, y, flower) {

    const size =
        flower.flowerSize *
        flower.bloomProgress;

    if (size <= 0) return;


    ctx.save();

    ctx.translate(x, y);


    // ======================================
    // PÉTALOS AMARILLOS
    // ======================================

    ctx.fillStyle =
        flower.color.petal;

    const angleStep =
        (Math.PI * 2) /
        flower.petalCount;


    for (
        let i = 0;
        i < flower.petalCount;
        i++
    ) {

        const angle =
            i * angleStep;

        ctx.save();

        ctx.rotate(angle);

        ctx.beginPath();

        ctx.ellipse(
            0,
            size * 0.85,
            size * 0.48,
            size * 0.88,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }


    // ======================================
    // CENTRO DE LA FLOR
    // ======================================

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        size * 0.4,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        flower.color.center;

    ctx.fill();


    // Pequeños puntos en el centro
    // para darle apariencia de girasol

    const dots = 12;

    for (let i = 0; i < dots; i++) {

        const angle =
            (Math.PI * 2 / dots) * i;

        const radius =
            size * 0.25;

        const dotX =
            Math.cos(angle) * radius;

        const dotY =
            Math.sin(angle) * radius;

        ctx.beginPath();

        ctx.arc(
            dotX,
            dotY,
            size * 0.035,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            '#6B3E00';

        ctx.fill();
    }


    ctx.restore();
}


// ==========================================
// ANIMACIÓN
// ==========================================

let frameCount = 0;


function animate() {

    // Fondo oscuro

    ctx.fillStyle =
        'rgba(11, 12, 16, 0.28)';

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    frameCount++;


    // ======================================
    // PARTÍCULAS AMARILLAS
    // ======================================

    for (let p of pollenParticles) {

        p.y += p.vy;
        p.x += p.vx;


        if (p.y < 0) {
            p.y = height;
        }

        if (p.x < 0) {
            p.x = width;
        }

        if (p.x > width) {
            p.x = 0;
        }


        // CORREGIDO:
        // Antes faltaban las comillas en rgba()

        ctx.fillStyle =
            `rgba(255, 220, 80, ${p.alpha})`;


        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    // ======================================
    // CRECIMIENTO DE LAS FLORES
    // ======================================

    for (let flower of flowers) {

        if (
            frameCount <
            flower.delay
        ) {
            continue;
        }


        // Crecimiento del tallo

        if (
            flower.currentHeight <
            flower.targetHeight
        ) {

            flower.currentHeight +=
                flower.speed;

        }

        // Apertura de la flor

        else if (
            flower.bloomProgress < 1
        ) {

            flower.bloomProgress +=
                0.025;
        }


        // Dibujar tallo

        const tipPosition =
            drawStem(flower);


        // Dibujar flor

        if (
            flower.bloomProgress > 0
        ) {

            drawFlowerHead(
                tipPosition.x,
                tipPosition.y,
                flower
            );
        }
    }


    requestAnimationFrame(animate);
}


// ==========================================
// INICIAR ANIMACIÓN
// ==========================================

animate();
