var Action = function (x, y, command) {
    this.startX = x;
    this.startY = y;
    this.lastX = x;
    this.lastY = y;
    this.penColor = pen_color;
    this.penWidth = penWidth;
    
    this.highColor = pen_high_color;
    this.image_src;
    this.image_name;
    this.minX = x;
    this.minY = y;
    this.maxX = x;
    this.maxY = y;
    this.command = command;
    this.points = Array();
    
    //move and resize action property
    this.move = { startX: 0, startY: 0, endX: 0, endY: 0, action:false};

    this.add = function (x, y) {
        this.points.push({ x: x, y: y });
        this.lastX = x;
        this.lastY = y;
        this.includepoint(x, y);

    }
    this.hasSome = function () {
        return !((this.startX == this.lastX) && (this.startY == this.lastY));
    }
    this.includepoint = function (x, y) {
        if (x < this.minX)
            this.minX = x;
        if (y < this.minY)
            this.minY = y;
        if (x > this.maxX)
            this.maxX = x;
        if (y > this.maxY)
            this.maxY = y;
    }
    this.beginPoint = function (x, y) {
        this.move.startX = x;
        this.move.startY = y;
        this.move.action = true;
    }
    this.toPoint = function (x, y,context) {
        var deltaX = x - this.move.startX;
        var deltaY = y - this.move.startY;
        this.move.startX = x;
        this.move.startY = y;
        this.startX = this.startX + deltaX;
        this.startY = this.startY + deltaY;
        this.minX = this.minX + deltaX;
        this.minY = this.minY + deltaY;
        this.maxX = this.maxX + deltaX;
        this.maxY = this.maxY + deltaY;
        this.lastX = this.lastX + deltaX;
        this.lastY = this.lastY + deltaY;

        for (var i = 0; i < this.points.length; i++) {
            var p = this.points[i];
            this.points[i] = { x: p.x + deltaX, y: p.y + deltaY };
        }
        
        this.draw_edit(context);
    }
    this.endPoint = function (x, y) {
        this.move.endX = x;
        this.move.endY = y;
        this.move.action = false;
    }
    this.contains = function (x, y) {
        return (x > this.minX) && (x < this.maxX) && (y > this.minY) && (y < this.maxY);
    }
    this.draw_edit = function (context) {
        this.draw(context);
        context.lineWidth = 1;
        context.strokeStype = "#000";
        context.strokeRect(this.minX - 5, this.minY - 5, 10, 10);
        context.strokeRect(this.maxX - 5, this.maxY - 5, 10, 10);
        context.strokeRect(this.minX - 5, this.maxY - 5, 10, 10);
        context.strokeRect(this.maxX - 5, this.minY - 5, 10, 10);
        context.lineWidth = this.penWidth;
        context.strokeStyle = this.penColor
    }
    this.draw = function (context, callback) {

        context.lineWidth = this.penWidth;
        context.strokeStyle = this.penColor
        context.fillStyle = this.penColor;
        if (this.command == "pen") {
            context.beginPath();
            context.moveTo(this.startX, this.startY);
            for (var i = 0; i < this.points.length; i++) {
                context.lineTo(this.points[i].x, this.points[i].y);
                context.stroke();
            }


        } else if (this.command == "line") {

            context.beginPath();
            context.moveTo(this.startX, this.startY);
            context.lineTo(this.lastX, this.lastY);
            context.stroke();

        } else if (this.command == "highlight") {

            context.strokeStyle = this.highColor;
            context.beginPath();
            context.moveTo(this.startX, this.startY);
            for (var i = 0; i < this.points.length; i++) {
                context.lineTo(this.points[i].x, this.points[i].y);
                context.stroke();
            }

        } else if (this.command == "rect") {

            var tempx = this.startX >= this.lastX ? this.lastX : this.startX;
            var tempy = this.startY >= this.lastY ? this.lastY : this.startY;
            context.strokeRect(tempx, tempy, Math.abs(this.lastX - this.startX), Math.abs(this.lastY - this.startY));
        } else if (this.command == "rect_fill") {
            var tempx = this.startX >= this.lastX ? this.lastX : this.startX;
            var tempy = this.startY >= this.lastY ? this.lastY : this.startY;
            context.fillRect(tempx, tempy, Math.abs(this.lastX - this.startX), Math.abs(this.lastY - this.startY));
        } else if (this.command == "ellipse") {

            var w = (this.lastX - this.startX);
            var h = (this.lastY - this.startY);
            drawEllipse(this.startX, this.startY, w, h, false);

        } else if (this.command == "ellipse_fill") {

            var w = (this.lastX - this.startX);
            var h = (this.lastY - this.startY);
            drawEllipse(this.startX, this.startY, w, h, true);

        } else if (this.command == "eraser") {
            context.fillStyle = canvas_color;
            var tempx = this.startX - wipeSize / 2;
            var tempy = this.startY - wipeSize / 2;
            context.fillRect(tempx, tempy, wipeSize, wipeSize);
            for (var i = 0; i < this.points.length; i++) {
                var tempx = this.points[i].x - wipeSize / 2;
                var tempy = this.points[i].y - wipeSize / 2;
                context.fillRect(tempx, tempy, wipeSize, wipeSize);
            }
            context.fillStyle = pen_color;

        } else if (this.command == "image") {

            var x = this.startX;
            var y = this.startY;
            var w = this.lastX;
            var h = this.lastY;
            var image = document.getElementById(this.image_name);
            context.drawImage(image, 0, 0, image.width, image.height, x, y, w, h);

        }
    }

};
