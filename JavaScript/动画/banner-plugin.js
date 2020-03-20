~ function () {
    let emptyFn = function emptyFn() {

    };
    class Banner {
        constructor(options = {}) {
            let {
                ele,
                url,
                isArrow = true,
                isFocus = true,
                isAuto = true,
                defaultIndex = 0,
                interval = 3000,
                speed = 200,
                moveEnd = emptyFn
            } = options;
            ['ele', 'url', 'isArrow', 'isFocus', 'isAuto', 'defaultIndex', 'interval', 'speed', 'moveEnd'].forEach(item => {
                this[item] = eval(item);
            });
            this.Effect = {
                Linear: (t, d, c, b) => t / d * c + b
            };
            this.container = document.querySelector(ele);
            let _con = this.container;
            this.wrapper = _con.querySelector('.wrapper');
            this.focus = _con.querySelector('.focus');
            this.arrowLeft = _con.querySelector('.arrowLeft');
            this.arrowRight = _con.querySelector('.arrowRight');
            this.slideList = null;
            this.focusList = null;
            this.stepIndex = defaultIndex;
            this.autoTimer = null;
            this.utils = this.util();
            this.init();
        }

        init() {
            let {
                isAuto,
                interval,
                defaultIndex,
                wrapper,
                container
            } = this;
            let promise = this.queryData();
            promise.then(() => {
                this.bindHTML();
            }).then(() => {
                if (defaultIndex !== 0 && defaultIndex > 0 && defaultIndex <= this.focusList.length - 1) {
                    this.utils.css(wrapper, 'left', -defaultIndex * container.clientWidth);
                    this.focusList[0].className = '';
                    this.focusList[defaultIndex].className = 'active';
                    this.stepIndex = defaultIndex;
                } else {
                    defaultIndex = defaultIndex % (this.focusList.length - 1);
                    if (defaultIndex !== 0) {
                        this.utils.css(wrapper, 'left', -defaultIndex * container.clientWidth);
                        console.log(this.utils.css(wrapper, 'left'));
                        this.focusList[0].className = '';
                        this.focusList[defaultIndex].className = 'active';
                        this.stepIndex = defaultIndex;
                    }
                }
                if (isAuto) {
                    this.autoTimer = setInterval(() => {
                        this.autoMove();
                    }, interval);
                }
            }).then(() => {
                this.handleController();
            })
        }

        queryData() {
            let {
                url
            } = this;
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest;
                xhr.open('GET', url);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 0) {
                        this.data = JSON.parse(xhr.responseText);
                        resolve();
                    }
                };
                xhr.send(null);
            });
        }
        util() {
            let getCss = (ele, attr) => {
                let val = null,
                    reg = /^-?\d+(\.\d+)?(px|rem|em)?$/;
                if ('getComputedStyle' in window) {
                    val = window.getComputedStyle(ele)[attr];
                    if (reg.test(val)) {
                        val = parseFloat(val);
                    }
                }
                return val;
            }
            let setCss = (ele, attr, value) => {
                if (!isNaN(value)) {
                    if (!/^(opacity|zIndex)$/.test(attr)) {
                        value += 'px';
                    }
                }
                ele['style'][attr] = value;
            }
            let setGroupCss = (ele, options) => {
                for (let attr in options) {
                    if (!options.hasOwnProperty) break;
                    setCss(ele, attr, options[attr]);
                }
            }
            let css = (...arg) => {
                let len = arg.length,
                    fn = getCss;
                if (len >= 3) {
                    fn = setCss;
                }
                if (len === 2 && typeof arg[1] === 'object') {
                    fn = setGroupCss;
                }
                return fn(...arg);
            }
            return {
                css
            };
        };
        animate(ele, target = {}, duration = 1000, callback = Function.prototype) {
            let begin = {},
                change = {},
                time = 0;
            if (typeof duration === 'function') {
                callback = duration;
                duration = 1000;
            }
            for (let attr in target) {
                if (!target.hasOwnProperty(attr)) break;
                begin[attr] = this.utils.css(ele, attr);
                change[attr] = target[attr] - begin[attr];
            }
            clearInterval(ele.animateTimer);
            ele.animateTimer = setInterval(() => {
                time += 17;
                if (time >= duration) {
                    this.utils.css(ele, target);
                    clearInterval(ele.animateTimer);
                    callback.call(ele)
                    return;
                }
                let cur = {};
                for (let attr in target) {
                    if (!target.hasOwnProperty(attr)) break;
                    cur[attr] = this.Effect.Linear(time, duration, change[attr], begin[attr]);
                }
                this.utils.css(ele, cur);
            }, 17)
        }
        bindHTML() {
            let {
                data,
                wrapper,
                focus,
                slideList,
                focusList
            } = this;
            let strSlide = ``,
                strFocus = ``;
            data.forEach((item, index) => {
                let {
                    img,
                    desc
                } = item;
                strSlide += `<div class="slide">
                    <img src="${img}" alt="${desc}">
                </div>`;
                strFocus += `<li class="${index === 0 ? 'active' : ''}"></li>`;
            });
            wrapper.innerHTML = strSlide;
            focus.innerHTML = strFocus;

            this.slideList = wrapper.querySelectorAll('.slide');
            this.focusList = focus.querySelectorAll('li');
            wrapper.appendChild(this.slideList[0].cloneNode(true));
            this.slideList = wrapper.querySelectorAll('.slide');
            this.utils.css(wrapper, 'width', this.slideList.length * this.container.clientWidth);
        };


        autoMove() {
            this.stepIndex++;
            if (this.stepIndex >= this.slideList.length) {
                this.utils.css(this.wrapper, 'left', 0);
                this.stepIndex = 1;
            }
            this.animate(this.wrapper, {
                left: -this.stepIndex * this.container.clientWidth
            }, this.speed);
            this.changeFocus(this.moveEnd);
        };

        changeFocus(callback) {
            let tempIndex = this.stepIndex;
            tempIndex === this.slideList.length - 1 ? tempIndex = 0 : null;
            [...this.focusList].forEach((item, index) => {
                item.className = index === tempIndex ? 'active' : '';
            });
            if (typeof callback !== 'function') return;
            callback(this);
        };


        handleController() {
            let {
                autoTimer,
                arrowLeft,
                arrowRight,
                slideList,
                interval,
                container,
                wrapper,
            } = this;
            container.onmouseenter = () => {
                clearInterval(autoTimer);
                if (this.isArrow) {
                    arrowLeft.style.display = arrowRight.style.display = 'block'
                }
            }
            container.onmouseleave = () => {
                if (this.isArrow) {
                    arrowLeft.style.display = arrowRight.style.display = ''
                }
                autoTimer = setInterval(() => {
                    this.autoMove();
                }, interval);
            }
            let queryIndex = (ele) => {
                    let ary = [],
                        pre = ele.previousElementSibling;
                    while (pre) {
                        ary.unshift(pre);
                        pre = pre.previousElementSibling;
                    }
                    return ary.length;
                },

                queryElement = (eleStr, str) => eleStr.trim().split(/ +/).indexOf(str) >= 0;
            container.onclick = (ev) => {
                let target = ev.target || ev.srcElement,
                    tagName = target.tagName,
                    parNode = target.parentNode;
                if (this.isFocus) {
                    let oldSpeed = this.speed;
                    this.speed = 0;
                    if (tagName === 'LI' && queryElement(parNode.className, 'focus')) {
                        this.stepIndex = queryIndex(target);
                        this.animate(wrapper, {
                            left: -this.stepIndex * container.clientWidth
                        }, this.speed)
                        this.changeFocus(this.moveEnd);
                    }
                    this.speed = oldSpeed;
                }
                if (this.isArrow) {
                    let oldSpeed = this.speed;
                    this.speed = 200;
                    if (tagName === 'A' && queryElement(target.className, 'arrow')) {
                        if (queryElement(target.className, 'arrowLeft')) {
                            this.stepIndex--;
                            if (this.stepIndex < 0) {
                                this.utils.css(wrapper, 'left', -(slideList.length - 1) * container.clientWidth);
                                this.stepIndex = slideList.length - 2;
                            }
                            this.animate(wrapper, {
                                left: -this.stepIndex * container.clientWidth,
                            }, this.speed);
                            this.changeFocus(this.moveEnd);
                        } else {
                            this.autoMove();
                        }
                    }
                    this.speed = oldSpeed;
                }
            }
        }

    }
    window.Banner = Banner;
}();