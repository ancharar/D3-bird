// Ожидаем полной загрузки DOM перед выполнением скрипта
document.addEventListener("DOMContentLoaded", function() {
    // Устанавливаем размеры SVG-холста
    const width = 600;
    const height = 600;
    const svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Инициализация UI элементов
    document.getElementById('animation').checked = false; // Сбрасываем чекбокс анимации
    document.getElementById('way_p').style.display = "none"; // Скрываем блок выбора пути
    showAnimation(); // Настраиваем отображение элементов управления в зависимости от состояния анимации

    // Назначение обработчиков событий
    document.getElementById("draw").addEventListener("click", draw); // Кнопка "Нарисовать"
    document.getElementById("clear").addEventListener("click", clear); // Кнопка "Очистить"
    document.getElementById("animation").addEventListener("click", showAnimation); // Чекбокс анимации
    
    // Обработчик для чекбокса "Перемещать вдоль пути"
    document.getElementById("s").addEventListener("change", function() {
        const showPath = this.checked;
        document.getElementById("way_p").style.display = showPath ? "inline" : "none"; // Показываем/скрываем выбор пути
        document.getElementById("coordinates").style.display = showPath ? "none" : "inline"; // Показываем/скрываем координаты

        // document.getElementById("scale-controls").style.display = showPath ? "none" : "inline";
        // document.getElementById("rotation-control").style.display = showPath ? "none" : "inline";
        document.getElementById("var").style.display = showPath ? "none" : "inline";
    });

    // Обработчик для кнопки "Запустить анимацию"
    document.getElementById("an").addEventListener("click", function(){
            const dataForm = document.getElementById("setting");
            runAnimation(dataForm);
    });
})

// Функция рисования смайлика
function draw() {
    const dataForm = document.getElementById("setting"); // Получаем форму с настройками
    const svg = d3.select("svg");

    // Рисуем смайлик и применяем трансформации из формы
    let pict = drawAngryBird(svg)
    pict.attr("transform", `translate(${dataForm.cx_s.value}, ${dataForm.cy_s.value})
                            scale(${dataForm.x_s.value / 2}, ${dataForm.y_s.value / 2}) rotate(${dataForm.corner.value})`);
                                           
}
   
// Функция очистки SVG-холста
function clear() {
    const svg = d3.select("svg");
    svg.selectAll('*').remove(); // Удаляем все элементы с холста
}

// Функция управления отображением элементов управления анимацией
function showAnimation() {
    const checkbox = document.getElementById('animation');
    const animationControls = document.querySelectorAll('#var, #an, #duration-control');
    const rangeEndInputs = document.querySelectorAll('input[id$="_e"]');
    const rangeLabels = document.querySelectorAll('label[for$="_e"]');
    const moveAlongPathCheckbox = document.getElementById('s');

    if (checkbox.checked) {
        // Если анимация включена, показываем соответствующие элементы
        animationControls.forEach(el => el.style.display = 'inline');
        rangeEndInputs.forEach(el => el.style.display = 'inline');
        rangeLabels.forEach(el => el.style.display = 'inline');
        document.getElementById("draw").style.display = 'none';
        document.querySelectorAll('input#s, input#s + label').forEach(el => el.style.display = 'inline');
    } else {
        // Если анимация выключена, скрываем элементы управления анимацией
        animationControls.forEach(el => el.style.display = 'none');
        rangeEndInputs.forEach(el => el.style.display = 'none');
        rangeLabels.forEach(el => el.style.display = 'none');
        document.getElementById("draw").style.display = 'inline';
        document.querySelectorAll('input#s, input#s + label').forEach(el => el.style.display = 'none');
        
        // Сбрасываем и скрываем чекбокс "Перемещать вдоль пути"
        moveAlongPathCheckbox.checked = false;
        document.getElementById("way_p").style.display = "none";
        document.getElementById("coordinates").style.display = "inline";
    }
}

// Функция запуска анимации
let runAnimation = (dataForm) => {
    const svg = d3.select("svg")
    let pict = drawAngryBird(svg);
    const usePath = document.getElementById("s").checked;
    // Получаем значение длительности из поля ввода
    const duration = parseInt(document.getElementById("duration").value) || 6000;

    if (!usePath) {
        // Анимация без пути (прямое перемещение)
        const animation_type = dataForm.var.value;
        let animation_function;

        switch(animation_type) {
            case 'linear': 
                animation_function = d3.easeLinear;
                break;
            case 'elastic':
                animation_function = d3.easeElastic;
                break;
            case 'bounce':
                animation_function = d3.easeBounce;
                break;
        }

        pict.attr("transform",
                `translate(${dataForm.cx_s.value}, ${dataForm.cy_s.value})
                    scale(${dataForm.x_s.value / 2}, ${dataForm.y_s.value / 2}) rotate(${dataForm.corner.value})`)
            .transition(svg)
            .duration(duration) // Используем значение из поля ввода
            .ease(animation_function)
            .attr("transform",
                `translate(${dataForm.cx_e.value}, ${dataForm.cy_e.value})
                    scale(${dataForm.x_e.value / 2}, ${dataForm.y_e.value / 2}) rotate(${parseInt(dataForm.corner.value) + 180})`);
    } else {
        // Анимация с перемещением вдоль пути
        const pathType = document.getElementById("way").value;
        
        let pathData;
        if (pathType === "g") {
            pathData = createPathG();
        } else if (pathType === "circle") {
            pathData = createPathCircle();
        } else {
            pathData = createPathInfinity();
        }

        const line = d3.line()
            .x(d => d.x)
            .y(d => d.y);
            
        const path = svg.append('path')
            .attr('d', line(pathData))
            .attr('stroke', 'none')
            .attr('fill', 'none')
            .attr('class', 'temp-path');

        pict.attr("transform", 
                 `translate(${pathData[0].x}, ${pathData[0].y})
                  scale(${dataForm.x_s.value / 2}, ${dataForm.y_s.value / 2})`)
            .transition()
            .duration(duration) // Используем значение из поля ввода
            .ease(d3.easeLinear)
            .attrTween("transform", translateAlong(path.node(), dataForm));
    }
}
   
// Функция для создания анимации перемещения вдоль пути
function translateAlong(path, dataForm) {
    const length = path.getTotalLength(); // Получаем общую длину пути
    const startScaleX = dataForm.x_s.value / 2;
    const startScaleY = dataForm.y_s.value / 2;
    const endScaleX = dataForm.x_e.value / 2;
    const endScaleY = dataForm.y_e.value / 2;
    const startAngle = parseInt(dataForm.corner.value);
    const endAngle = startAngle + 180;
    
    return function() {
        return function(t) {
            // Получаем текущую точку на пути
            const {x, y} = path.getPointAtLength(t * length);

            const currentScaleX = startScaleX + (endScaleX - startScaleX) * t;
            const currentScaleY = startScaleY + (endScaleY - startScaleY) * t;
            const currentAngle = startAngle + (endAngle - startAngle) * t;
            
            return `translate(${x},${y}) 
                    scale(${currentScaleX}, ${currentScaleY}) 
                    rotate(${currentAngle})`;
        }
    }
}

// // Функция для создания анимации перемещения вдоль пути
// function translateAlong(path, dataForm) {
//     const length = path.getTotalLength(); // Получаем общую длину пути
    
//     return function() {
//         return function(t) {
//             // Получаем текущую точку на пути
//             const {x, y} = path.getPointAtLength(t * length);
//             // Возвращаем только трансформацию перемещения
//             return `translate(${x},${y})`;
//         }
//     }
// }