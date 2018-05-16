$(function () {
    function snakeMap(row, wh) {
        this.rowNum = row;
        this.wh = wh;
        this.init = function () {
            $('.container').css('width', this.rowNum * this.wh + 'px');
            $('.container').css('height', this.rowNum * this.wh + 'px');
            $('.snake.head').css({'height': this.wh + 'px', 'width': this.wh + 'px'});
            for (var i = 0; i < this.rowNum + 1; i++) {
                $('<div class="linex"></div>').appendTo('.linexbox');
                $('<div class="liney"></div>').appendTo('.lineybox');
            }

            $('.linex').each(function (index, value) {
                $(value).css('top', index * wh + 'px');
            });
            $('.liney').each(function (index, value) {
                $(value).css('left', index * wh + 'px');
            });

        }
    }

    function Food() {
        this.make = function () {
            var x = Math.floor(Math.random() * map.rowNum) * map.wh;
            var y = Math.floor(Math.random() * map.rowNum) * map.wh;
            $('<div class="food"></div>').appendTo('.container');
            $('.food').css({
                'width': map.wh + 'px',
                'height': map.wh + 'px',
                'left': x + 'px',
                'bottom': y + 'px'
            });
        }
    }


    function Snake() {
        this.dir = 'right';
        this.body = [];
        this.move = function () {
            var that = this;
            var oldleft = parseInt($('.head').css('left'));
            var oldtop = parseInt($('.head').css('top'));
            var maxleft = parseInt($('.container').css('width'));
            var maxtop = parseInt($('.container').css('height'));
            if (this.dir == 'left') {
                $('.head').css('left', (oldleft - map.wh) + 'px');
            } else if (this.dir == 'right') {
                $('.head').css('left', (oldleft + map.wh) + 'px');
            } else if (this.dir == 'up') {
                $('.head').css('top', (oldtop - map.wh) + 'px');
            } else if (this.dir == 'down') {
                $('.head').css('top', (oldtop + map.wh) + 'px');
            }
            var newleft = parseInt($('.head').css('left'));
            var newtop = parseInt($('.head').css('top'));
            var foodleft = parseInt($('.food').css('left'));
            var foodtop = parseInt($('.food').css('top'));
            if (newleft < 0 || newleft > maxleft - map.wh || newtop < 0 || newtop > maxtop - map.wh) {
                alert('失败！撞墙了！');
                clearInterval(timer);
                resrart()
            }
            if (newleft == foodleft && newtop == foodtop) {
                this.eat();
            }
            var pos = [{
                left: oldleft,
                top: oldtop
            }];
            $.each(this.body, function (index, value) {
                var itop = parseInt($(this).css('top'));
                var ileft = parseInt($(this).css('left'));
                if (itop == oldtop && ileft == oldleft) {
                    alert('失败！咬到自己了！');
                    clearInterval(timer);
                    resrart()
                }
                pos.push({
                    left: ileft,
                    top: itop
                });
                $(this).css('left', pos[index].left + 'px');
                $(this).css('top', pos[index].top + 'px');
            });
        };
        this.eat = function () {
            this.body.push($('.food'));
            $('.food').removeClass('food').addClass('snake body');
            food.make();
        };
        this.setDir = function (keyCode) {
            var olddir = this.dir;
            if (keyCode == 37) { //左
                if (olddir != 'left' && olddir != 'right') {
                    this.dir = 'left'
                } else {
                    return;
                }
            } else if (keyCode == 38) { //上
                if (olddir != 'up' && olddir != 'down') {
                    this.dir = 'up'
                } else {
                    return;
                }
            } else if (keyCode == 39) { //右
                if (olddir != 'left' && olddir != 'right') {
                    this.dir = 'right'
                } else {
                    return;
                }
            } else if (keyCode == 40) { //下
                if (olddir != 'up' && olddir != 'down') {
                    this.dir = 'down'
                } else {
                    return;
                }
            }
        };
    }


    $(window).keydown(function (e) {
        var keyCode = e.keyCode;
        snake.setDir(keyCode);
    });
    var row = 20;
    var wh = 20;
    var map;
    var food;
    var snake;
    var timer;
    var speed = Number($('#speed').val());
    var state = 1;
    console.log(speed);
    map = new snakeMap(row, wh);
    map.init();
    food = new Food();
    food.make();
    snake = new Snake();
    timer = setInterval(function () {
        snake.move();
    }, speed);
    $('.start').click(function () {
        if (state == 0) {
            timer = setInterval(function () {
                snake.move();
            }, speed);
            state = 1;
        }
    });
    $('.pause').click(function () {
        if (state == 1) {
            clearInterval(timer);
            state = 0;
        }
    });
    function resrart() {
        $('.linex').remove();
        $('.liney').remove();
        $('.snake.body').remove();
        $('.snake.head').css({'top': 0,'left':0})
        map = new snakeMap(row, wh);
        map.init();
        food = new Food();
        food.make();
        snake = new Snake();
        state = 1;
        clearInterval(timer);
        timer = setInterval(function () {
            snake.move();
        }, speed);
    }
    $('.restart').click(function () {
        resrart();
    });
    $('#speed').change(function () {

        speed = Number($('#speed').val());
        if (state == 1) {
            clearInterval(timer);
            timer = setInterval(function () {
                snake.move();
            }, speed);
        }

        $(this).blur();
    });



})
