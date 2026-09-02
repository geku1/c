const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");


// =====================================================
// CONFIGURACIÓN
// =====================================================

const PARTICLES = 900;

// Tiempo que tarda en formarse el corazón
const FORMATION_TIME = 180;

// Tamaño base de las partículas
const MIN_SIZE = 1.2;
const MAX_SIZE = 3.0;


// =====================================================
// VARIABLES
// =====================================================

let particles = [];

let width;
let height;

let scale;

let frame = 0;


// =====================================================
// AJUSTAR CANVAS
// =====================================================

function resize() {

    const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
    );

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    // Tamaño del corazón

    scale = Math.min(
        width,
        height
    ) / 38;
}


// =====================================================
// NÚMERO ALEATORIO
// =====================================================

function random(min, max) {

    return Math.random() * (max - min) + min;

}


// =====================================================
// FUNCIÓN DEL CORAZÓN
// =====================================================

function heartPoint(t) {

    /*
        Fórmula matemática del corazón

        X = 16 sin³(t)

        Y =
        13 cos(t)
        - 5 cos(2t)
        - 2 cos(3t)
        - cos(4t)
    */

    const x =
        16 *
        Math.pow(
            Math.sin(t),
            3
        );


    const y =
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t);


    return {
        x: x * scale,
        y: -y * scale
    };
}


// =====================================================
// INTERPOLACIÓN SUAVE
// =====================================================

function easeOutCubic(t) {

    return 1 -
        Math.pow(
            1 - t,
            3
        );
}


// =====================================================
// CREAR PARTÍCULAS
// =====================================================

function createParticles() {

    particles = [];


    for (
        let i = 0;
        i < PARTICLES;
        i++
    ) {

        // =============================================
        // ÁNGULO
        // =============================================

        const t =
            (i / PARTICLES) *
            Math.PI *
            2;


        // =============================================
        // BORDE DEL CORAZÓN
        // =============================================

        const heart =
            heartPoint(t);


        // =============================================
        // HACER EL CORAZÓN MÁS LLENO
        // =============================================

        /*
            Algunas partículas estarán cerca
            del borde y otras hacia el centro.
        */

        const fill =
            Math.sqrt(
                Math.random()
            );


        const targetX =
            heart.x *
            fill;


        const targetY =
            heart.y *
            fill;


        // =============================================
        // POSICIÓN INICIAL
        // =============================================

        const angle =
            random(
                0,
                Math.PI * 2
            );


        const distance =
            random(
                Math.min(width, height) * 0.20,
                Math.min(width, height) * 0.55
            );


        const startX =
            Math.cos(angle) *
            distance;


        const startY =
            Math.sin(angle) *
            distance;


        // =============================================
        // PARTÍCULA
        // =============================================

        particles.push({

            // Posición inicial
            x: startX,
            y: startY,

            // Posición final
            tx: targetX,
            ty: targetY,

            // Tamaño
            size:
                random(
                    MIN_SIZE,
                    MAX_SIZE
                ),

            // Variación
            phase:
                random(
                    0,
                    Math.PI * 2
                ),

            // Velocidad individual
            speed:
                random(
                    0.85,
                    1.15
                )

        });

    }

}


// =====================================================
// DIBUJAR
// =====================================================

function draw() {

    // =============================================
    // FONDO NEGRO
    // =============================================

    ctx.fillStyle = "#000";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    // =============================================
    // CENTRO
    // =============================================

    const centerX =
        width / 2;

    const centerY =
        height / 2 - 30;


    // =============================================
    // PROGRESO
    // =============================================

    const progress =
        Math.min(
            frame / FORMATION_TIME,
            1
        );


    const eased =
        easeOutCubic(
            progress
        );


    // =============================================
    // BRILLO
    // =============================================

    ctx.save();

    ctx.globalCompositeOperation =
        "lighter";


    // =============================================
    // PARTÍCULAS
    // =============================================

    particles.forEach(
        (p, index) => {


            // =========================================
            // POSICIÓN DURANTE LA ANIMACIÓN
            // =========================================

            let x =
                p.x +
                (p.tx - p.x) *
                eased;


            let y =
                p.y +
                (p.ty - p.y) *
                eased;


            // =========================================
            // PULSACIÓN DEL CORAZÓN
            // =========================================

            if (progress >= 1) {

                const pulse =
                    1 +
                    Math.sin(
                        frame * 0.055
                    ) * 0.025;


                x *= pulse;
                y *= pulse;

            }


            // =========================================
            // PEQUEÑO MOVIMIENTO
            // =========================================

            if (progress >= 1) {

                x +=
                    Math.sin(
                        frame * 0.025 +
                        p.phase
                    ) * 0.5;


                y +=
                    Math.cos(
                        frame * 0.025 +
                        p.phase
                    ) * 0.5;

            }


            // =========================================
            // POSICIÓN EN PANTALLA
            // =========================================

            const px =
                centerX + x;


            const py =
                centerY + y;


            // =========================================
            // GLOW
            // =========================================

            ctx.beginPath();

            ctx.fillStyle =
                "rgba(255, 0, 150, 0.13)";


            ctx.arc(
                px,
                py,
                p.size * 3.5,
                0,
                Math.PI * 2
            );


            ctx.fill();


            // =========================================
            // PARTÍCULA
            // =========================================

            ctx.beginPath();


            ctx.fillStyle =
                "#f80404";


            ctx.arc(
                px,
                py,
                p.size,
                0,
                Math.PI * 2
            );


            ctx.fill();


            // =========================================
            // PUNTO CENTRAL MÁS BRILLANTE
            // =========================================

            if (p.size > 2) {

                ctx.beginPath();

                ctx.fillStyle =
                    "#f00a1d";

                ctx.arc(
                    px,
                    py,
                    p.size * 0.35,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }

        }
    );


    ctx.restore();


    // =============================================
    // SIGUIENTE FRAME
    // =============================================

    frame++;


    // =============================================
    // REINICIAR
    // =============================================

    if (frame > 650) {

        frame = 0;

        createParticles();

    }


    // =============================================
    // CONTINUAR
    // =============================================

    requestAnimationFrame(
        draw
    );

}


// =====================================================
// RESIZE
// =====================================================

window.addEventListener(
    "resize",
    () => {

        resize();

        createParticles();

    }
);


// =====================================================
// INICIAR
// =====================================================

resize();

createParticles();

draw();