let bannerModel = function () {
    let con = document.getElementById('container'),
        wrapper = con.querySelector('.wrapper'),
        focus = con.querySelector('.focus'),
        arrowL = con.querySelector('.arrowLeft'),
        arrowR = con.querySelector('.arrowRight'),
        slideList = null,
        focusList = null;
    let step = 0,
        interval = 1000,
        animateTimer = null;

    function queryData() {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('get', 'json/banner.json', true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 0) {
                    let data = JSON.parse(xhr.responseText);
                    resolve(data);
                }
            }
            xhr.send(null);
        })
    }

    function autoMove() {
        step++;
        if (step > slideList.length - 1) {
            utils.css(wrapper, 'left', 0);
            step = 1;
        }
        animate(wrapper, {
            left: -step * con.clientWidth,
        }, 200);
        changeFocus();
    }

    function changeFocus() {
        let temp = step;
        temp === slideList.length - 1 ? temp = 0 : null;
        [...focusList].forEach((item, index) => {
            focusList[index].className = index === temp ? 'active' : '';
        })
    }

    function banderData(data) {
        let slideStr = ``,
            focusStr = ``;
        data.forEach((item, index) => {
            let {
                img,
                desc
            } = item;
            slideStr += `<div class="slide"><img src="${img}" alt="${desc}"></div>`;
            focusStr += `<li class="${index===0?'active':''}"></li>`;
        })
        slideStr += `<div class="slide"><img src="${data[0].img}" alt="${data[0].desc}"></div>`

        wrapper.innerHTML = slideStr;
        focus.innerHTML = focusStr;

        slideList = con.querySelectorAll('.slide');
        focusList = con.querySelectorAll('li')
        utils.css(wrapper, 'width', slideList.length * con.clientWidth);
    }

    function handleController() {
        con.onmouseenter = () => {
            arrowL.style.display = arrowR.style.display = 'block'
            clearInterval(animateTimer);
        }
        con.onmouseleave = () => {
            arrowL.style.display = arrowR.style.display = ''
            animateTimer = setInterval(autoMove, interval);
        }
        let queryIndex = function (ele) {
                let ary = [],
                    pre = ele.previousElementSibling;
                while (pre) {
                    ary.unshift(pre);
                    pre = pre.previousElementSibling;
                }
                return ary.length;
            },

            queryElement = function (eleStr, str) {
                return eleStr.trim().split(/ +/).indexOf(str) >= 0;
            };
        con.onclick = function (ev) {
            let target = ev.target || ev.srcElement,
                tagName = target.tagName,
                parNode = target.parentNode;
            if (tagName === 'LI' && queryElement(parNode.className, 'focus')) {

                step = queryIndex(target);
                animate(wrapper, {
                    left: -step * con.clientWidth
                }, 200)
                changeFocus();
            }
            if (tagName === 'A' && queryElement(target.className, 'arrow')) {
                if (queryElement(target.className, 'arrowLeft')) {
                    step--;
                    if (step < 0) {
                        utils.css(wrapper, 'left', -(slideList.length - 1) * con.clientWidth);
                        step = slideList.length - 2;
                    }
                    animate(wrapper, {
                        left: -step * con.clientWidth,
                    }, 200);
                    changeFocus();
                } else {
                    autoMove();
                }
            }
        }
    }

    return {
        init() {
            let promise = queryData();
            promise.then(banderData).then(() => {
                animateTimer = setInterval(autoMove, interval);
            }).then(() => {
                handleController();
            })

        }
    }
}();
bannerModel.init();

// handleFocus() {
//     [].forEach.call(this.focusList, (item, index) => {
//         item.onclick = () => {
//             this.stepIndex = index;
//             this.animate(this.wrapper, {
//                 left: -this.stepIndex * this.container.clientWidth
//             }, this.speed);
//             //重新对齐焦点
//             this.changeFocus(this.moveEnd);
//         }
//     })
// }
// handleArrow() {
//     let {
//         wrapper,
//         arrowLeft,
//         arrowRight,
//         slideList,
//         container,
//     } = this;
//     //点击右边的按钮和自动轮播是一样的执行自动轮播方法即可
//     arrowRight.onclick = () => {
//         this.autoMove();
//     };
//     //点击左边按钮
//     arrowLeft.onclick = () => {
//         this.stepIndex--;
//         if (this.stepIndex < 0) {
//             this.utils.css(wrapper, 'left', -(slideList.length - 1) * container.clientWidth);
//             this.stepIndex = slideList.length - 2;
//         }
//         console.log(1111111111, this.stepIndex)
//         this.animate(wrapper, {
//             left: -this.stepIndex * container.clientWidth
//         }, this.speed);
//         //重新对齐焦点
//         this.changeFocus(this.moveEnd);
//     }
// }