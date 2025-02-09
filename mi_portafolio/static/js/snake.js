const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

// Tamaño de cada celda en el juego
const scale = 20;  
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let food;
let gameStarted = false;
let gameInterval;
const startButton = document.getElementById("startButton");
const musicButton = document.getElementById("musicButton");
const bgMusic = document.getElementById("bgMusic");

// Al hacer click en "Comenzar", inicia el juego
startButton.addEventListener("click", startGame);

// Función para pausar/reanudar la música
function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play();
        musicButton.textContent = "Pause Music";  // Cambiar texto a "Pausar Música"
    } else {
        bgMusic.pause();
        musicButton.textContent = "Resume Music";  // Cambiar texto a "Reanudar Música"
    }
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        snake = new Snake();
        food = new Food();
        startButton.style.display = "none";  // Ocultamos el botón "Comenzar" al iniciar el juego
        gameInterval = setInterval(gameLoop, 100);  // Intervalo para controlar la velocidad (100ms)
    }
}

// Snake Constructor
function Snake() {
    this.body = [{x: 5, y: 5}];
    this.direction = "right";  // Dirección inicial
    this.changeDirection = function(event) {
        // Cambia la dirección con las teclas (arriba, abajo, izquierda, derecha)
        if (event.keyCode === 37 && this.direction !== "right") {
            this.direction = "left";
        } else if (event.keyCode === 38 && this.direction !== "down") {
            this.direction = "up";
        } else if (event.keyCode === 39 && this.direction !== "left") {
            this.direction = "right";
        } else if (event.keyCode === 40 && this.direction !== "up") {
            this.direction = "down";
        }
    };
    this.update = function() {
        const head = {x: this.body[0].x, y: this.body[0].y};

        // Actualiza la posición de la cabeza según la dirección
        if (this.direction === "left") head.x -= 1;
        if (this.direction === "up") head.y -= 1;
        if (this.direction === "right") head.x += 1;
        if (this.direction === "down") head.y += 1;

        this.body.unshift(head);  // Agrega la cabeza
        this.body.pop();  // Elimina el último segmento (cola)
    };
    this.draw = function() {
        // Dibuja la serpiente en el canvas
        this.body.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? "blue" : "green"; // La cabeza es azul
            ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
        });
    };
    this.eat = function(food) {
        const head = this.body[0];
        if (head.x === food.x && head.y === food.y) {
            this.body.push({});  // Añade un nuevo segmento a la serpiente
            return true;
        }
        return false;
    };
    this.collide = function() {
        const head = this.body[0];

        // Colisión con los límites del canvas
        if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows) {
            return true;
        }

        // Colisión con su propio cuerpo
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === head.x && this.body[i].y === head.y) {
                return true;
            }
        }

        return false;
    };
}

// Food Constructor
function Food() {
    this.x = 0;
    this.y = 0;
    this.randomize = function() {
        this.x = Math.floor(Math.random() * columns);
        this.y = Math.floor(Math.random() * rows);
    };
    this.draw = function() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
    };
}

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpiar el canvas
    snake.update();
    snake.draw();
    food.draw();

    if (snake.eat(food)) {
        food.randomize();
    }

    if (snake.collide()) {
        gameOver();
    }
}

function gameOver() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("YOU LOSE", canvas.width / 4, canvas.height / 2);
    gameStarted = false;
    
    // Asegurarnos de que el botón "Reiniciar" se muestre correctamente en su posición
    startButton.style.display = "block";  // Mostrar el botón
    startButton.textContent = "TRY AGAIN";  // Cambiar el texto a "Reiniciar"
    
    clearInterval(gameInterval);
    gameInterval = null;
}

// Evento para manejar las teclas y evitar el desplazamiento de la página
document.addEventListener("keydown", function(event) {
    const arrowKeys = [37, 38, 39, 40]; // Código de las teclas de flecha

    if (arrowKeys.includes(event.keyCode)) {
        event.preventDefault();
    }

    if (gameStarted) {
        snake.changeDirection(event);
    }
});

document.getElementById("translate-btn").addEventListener("click", function() {
    var paragraphs = document.querySelectorAll("#about-text");

    // Texto en español y en inglés
    var spanishTexts = [
        "Soy desarrollador de software con experiencia en programación en lenguajes como Java, Python y JavaScript, estoy familiarizado trabajando con frameworks como Flask y Django. A lo largo de mi carrera, he trabajado en el diseño y desarrollo de soluciones eficientes, adaptadas a las necesidades del cliente. Actualmente, desempeño un rol administrativo en el que gestiono procesos y documentación del mercado exterior, utilizando herramientas como Excel y SAP para optimizar flujos de trabajo.",
        "Mi objetivo es seguir ampliando mis competencias en desarrollo web y back-end, especialmente en áreas como arquitecturas escalables, bases de datos y optimización de rendimiento. Estoy apasionado por contribuir a proyectos innovadores que generen un impacto real, combinando mi experiencia técnica con mi capacidad para gestionar proyectos de manera eficiente.",
        "Siempre estoy abierto a nuevos desafíos y oportunidades de colaboración. Si tienes un proyecto interesante o deseas hablar sobre cómo puedo ayudarte a llevar tus ideas a la realidad, no dudes en contactarme."
    ];

    var englishTexts = [
        "I am a software developer with experience in programming languages like Java, Python, and JavaScript. I am familiar with frameworks like Flask and Django. Throughout my career, I have worked on designing and developing efficient solutions tailored to customer needs. Currently, I perform an administrative role where I manage processes and documentation for international markets, using tools like Excel and SAP to optimize workflows.",
        "My goal is to continue expanding my skills in web and back-end development, particularly in areas like scalable architectures, databases, and performance optimization. I am passionate about contributing to innovative projects that create a real impact, combining my technical experience with my ability to manage projects efficiently.",
        "I am always open to new challenges and collaboration opportunities. If you have an interesting project or would like to talk about how I can help bring your ideas to life, feel free to contact me."
    ];

    // Alternar el contenido de los párrafos y el texto del botón
    var currentText = paragraphs[0].textContent; // Obtener el texto actual del primer párrafo

    if (currentText === spanishTexts[0]) {
        // Cambiar a inglés
        paragraphs.forEach((p, index) => {
            p.textContent = englishTexts[index];
        });
        this.textContent = "Español"; // Cambiar el texto del botón a "Español"
    } else {
        // Cambiar a español
        paragraphs.forEach((p, index) => {
            p.textContent = spanishTexts[index];
        });
        this.textContent = "Translate"; // Cambiar el texto del botón a "Translate"
    }
});

window.addEventListener("load", function () {
    setTimeout(function () {
        document.getElementById("welcome-screen").style.display = "none";
    }, 3000); // Ocultar después de 3 segundos
});