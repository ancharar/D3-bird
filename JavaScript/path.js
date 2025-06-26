/**
 * Создает массив точек, расположенных в форме буквы "Г".
 */
function createPathG() {
    const svg = d3.select("svg"); // Выбираем SVG-элемент
    const width = svg.attr("width"); // Получаем ширину SVG
    const height = svg.attr("height"); // Получаем высоту SVG

    let data = []; // Инициализируем массив для хранения точек
    const padding = 100; // Отступ от краев SVG
    // Начальное положение рисунка (нижний левый угол буквы "Г")
    let posX = padding;
    let posY = height - padding;
    const h = 5; // Шаг изменения координат

    // Первая часть буквы "Г": вертикальная линия (координаты y уменьшаются, x постоянны)
    while (posY > padding) {
        data.push({x: posX, y: posY});
        posY -= h;
    }

    // Вторая часть буквы "Г": горизонтальная линия (координаты y постоянны, x увеличиваются)
    while (posX < width - padding) {
        data.push({x: posX, y: posY});
        posX += h;
    }

    return data; // Возвращаем массив точек
}

/**
 * Создает массив точек, расположенных по окружности.
 */
function createPathCircle() {
    const svg = d3.select("svg"); // Выбираем SVG-элемент
    const width = svg.attr("width"); // Получаем ширину SVG
    const height = svg.attr("height"); // Получаем высоту SVG

    let data = []; // Инициализируем массив для хранения точек
    // Используем параметрическую форму описания окружности:
    // Центр окружности расположен в центре SVG-элемента,
    // радиус равен трети высоты/ширины SVG.
    for (let t = 0; t <= Math.PI * 2; t += 0.1) {
        data.push({
            x: width / 2 + width / 3 * Math.sin(t), // Координата x точки на окружности
            y: height / 2 + height / 3 * Math.cos(t)  // Координата y точки на окружности
        });
    }
    return data; // Возвращаем массив точек
}

/**
 * Создает и отображает путь в SVG-элементе на основе переданного типа.
 */
let drawPath = (typePath) => {
    // Создаем массив точек пути в зависимости от параметра typePath
    const dataPoints = (typePath == 0) ? createPathG() : createPathCircle();
    
    // Создаем генератор линии с использованием D3.js
    const line = d3.line()
        .x((d) => d.x) // Указываем, как получить координату x из данных
        .y((d) => d.y); // Указываем, как получить координату y из данных
        
    // Создаем путь в SVG на основе массива точек
    const path = svg.append('path')
        .attr('d', line(dataPoints)) // Устанавливаем атрибут "d" для пути
        .attr('stroke', 'black')     // Устанавливаем цвет обводки
        .attr('fill', 'none');       // Указываем, что путь не должен быть заполнен

    return path; // Возвращаем созданный путь
};

function createPathInfinity() {
    const svg = d3.select("svg");
    const width = svg.attr("width");
    const height = svg.attr("height");
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;

    let data = [];
    const steps = 200; // Количество точек для плавности
    
    // Параметрическое уравнение лемнискаты (символа бесконечности)
    for (let i = steps; i >= 0; i--) {
        // Нормализованный параметр от 0 до 2π
        const t = (i / steps) * Math.PI * 2 + Math.PI / 2;  // Добавлено +π/2
        
        // Вычисляем координаты точки на лемнискате
        const scale = 1 / Math.sqrt(1 + Math.sin(t) * Math.sin(t));
        const x = centerX + radius * Math.cos(t) * scale;
        const y = centerY - radius * Math.sin(t) * Math.cos(t) * scale;
        
        data.push({ x, y });
    }

    // Добавляем первую точку в конец, чтобы замкнуть путь
    if (data.length > 0) {
        data.push({ x: data[0].x, y: data[0].y });
    }

    return data;
}
