~ function ($) {
    if (typeof $ === 'undefined') {
        throw new ReferenceError('the current plugin needs to  rely on jQuery');
    }
    let emptyFn = function emptyFn() {
        //空函数没用，只是为了给回调函数赋值默认值
    };
    class Drag {
        constructor(ele, options = {}) {
            if (typeof ele === 'undefined' || ele.nodeType !== 1) {
                throw new ReferenceError('The first parameter is the item that must be passed, and it must be an element object type!')
            }
            let {
                selector = ele
            } = options;
            //dragTarget:通过谁来移动
            //ele:移动谁
            this.ele = ele;
            this.dragTarget = selector;
            if (typeof selector === 'string') {
                //传递了一个选择器进来，我们是想通过操作ele中的某个元素实现拖拽
                $(ele).find(selector).css('cursor', 'move');
                this.dragTarget = $(ele).find(selector)[0];
            }
            this.dragStartPlan = $.Callbacks();
            this.draggingPlan = $.Callbacks();
            this.dragEndPlan = $.Callbacks();
            //开始移动
            //保证执行原型中的this，this都是当前类的实例
            this.dragTarget.addEventListener('mousedown', this.down.bind(this));
        }
        down(ev) {
            this.starX = ev.clientX;
            this.starY = ev.clientY;
            let $ele = $(this.ele);
            this.starL = parseFloat($ele.css('left'));
            this.starT = parseFloat($ele.css('top'));
            this.MOVE = this.move.bind(this);
            this.UP = this.up.bind(this);
            document.addEventListener('mousemove', this.MOVE);
            document.addEventListener('mouseup', this.UP);

            //通知某一个计划表中的方法执行，把当前类的实例传递给计划表中的每一个方法
            this.dragStartPlan.fire(this, ev);
        }
        move(ev) {
            let {
                starX,
                starY,
                starL,
                starT
            } = this;
            let curL = ev.clientX - starX + starL,
                curT = ev.clientY - starY + starT;
            $(this.ele).css({
                top: curT,
                left: curL
            })
            this.curL = curL;
            this.curT = curT;
            this.draggingPlan.fire(this, ev);
        }
        up(ev) {
            document.removeEventListener('mousemove', this.MOVE);
            document.removeEventListener('mouseup', this.UP);
            this.dragEndPlan.fire(this, ev);
        }
    }
    window.Drag = Drag;
}(jQuery);