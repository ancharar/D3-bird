function drawAngryBird(svg) {
    let bird = svg.append("g")
        .attr("transform", "translate(0, 0)");

    // Тело (красный круг)
    bird.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 40)
        .style("fill", "red")
        .style("stroke", "darkred")
        .style("stroke-width", 2);

    // Живот (белый эллипс)
    bird.append("ellipse")
        .attr("cx", 0)
        .attr("cy", 10)
        .attr("rx", 25)
        .attr("ry", 20)
        .style("fill", "white")
        .style("stroke", "lightgray")
        .style("stroke-width", 1);

    // Левый глаз (белый круг)
    bird.append("circle")
        .attr("cx", -15)
        .attr("cy", -15)
        .attr("r", 12)
        .style("fill", "white")
        .style("stroke", "gray")
        .style("stroke-width", 1);

    // Правый глаз (белый круг)
    bird.append("circle")
        .attr("cx", 15)
        .attr("cy", -15)
        .attr("r", 10)
        .style("fill", "white")
        .style("stroke", "gray")
        .style("stroke-width", 1);

    // Левый зрачок (черный круг)
    bird.append("circle")
        .attr("cx", -15)
        .attr("cy", -15)
        .attr("r", 5)
        .style("fill", "black");

    // Правый зрачок (черный круг)
    bird.append("circle")
        .attr("cx", 15)
        .attr("cy", -15)
        .attr("r", 4)
        .style("fill", "black");

    // Левый бровь (толстая линия)
    bird.append("line")
        .attr("x1", -25)
        .attr("y1", -25)
        .attr("x2", -5)
        .attr("y2", -20)
        .style("stroke", "black")
        .style("stroke-width", 3);

    // Правый бровь (толстая линия)
    bird.append("line")
        .attr("x1", 5)
        .attr("y1", -20)
        .attr("x2", 25)
        .attr("y2", -25)
        .style("stroke", "black")
        .style("stroke-width", 3);

    // Клюв (желтый треугольник)
    bird.append("path")
        .attr("d", "M0,5 L-15,15 L15,15 Z")
        .style("fill", "orange")
        .style("stroke", "darkorange")
        .style("stroke-width", 1);

    // Хвост (три треугольника)
    bird.append("path")
        .attr("d", "M-40,0 L-60,-15 L-50,0 Z")
        .style("fill", "red")
        .style("stroke", "darkred");

    bird.append("path")
        .attr("d", "M-40,0 L-60,0 L-50,10 Z")
        .style("fill", "red")
        .style("stroke", "darkred");

    bird.append("path")
        .attr("d", "M-40,0 L-60,15 L-50,0 Z")
        .style("fill", "red")
        .style("stroke", "darkred");

    return bird;
}