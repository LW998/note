let bannerModel = (function () {
    let con = document.querySelector('#container'),
        wrapper = con.querySelector('.wrapper'),
        focus = con.querySelector('.focus'),
        arrowL = con.querySelector('.arrowLeft'),
        arrowR = con.querySelector('.arrowRight'),
        slideList = null,
        focusList = null;
    //轮播图运动的基础参数

    let stepIndex = 0, //=>记录当前展示块的索引
        autoTimer = null, //自动轮播的定时器
        interval = 3000; //轮播的间隔多长时间切换一次

    function autoMove() {
        stepIndex++;
        if (stepIndex >= (slideList.length)) {
            utils.css(wrapper, 'left', 0);
            stepIndex = 1;
        }
        //动画切换
        animate(wrapper, {
            left: -stepIndex * con.clientWidth,
        }, 200); //200是从当前切换到下一张的动画时间
        //每次动画切换完执行焦点切换
        changeFocus();
    };
    //让焦点跟着轮播图切换而切换
    function changeFocus() {
        //stepIndex需要控制轮播图运动，不能随意修改，所有添加temp临时变量
        let temp = stepIndex;
        //当轮播图运动到克隆的图片之后,我们把索引为0的元素有选择样式
        temp === slideList.length - 1 ? temp = 0 : null;
        [...focusList].forEach((item, index) => {
            item.className = index === temp ? 'active' : '';
        })
    }
    //获取数据返回promise方法
    function queryData() {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', 'json/banner.json', true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 0) {
                    let data = JSON.parse(xhr.responseText);
                    resolve(data);
                }
            }
            xhr.send(null);
        });
    }
    //绑定数据
    function banderHtml(data) {
        let strSlide = ``,
            strFocus = ``;
        data.forEach((item, index) => {
            let {
                img = '', desc
            } = item
            strSlide += `<div class="slide"><img src="${img}" alt="${desc}"></div>`;
            strFocus += `<li class="${index===0?'active':''}"></li>`;
        })
        //把第一张轮播图克隆一份放到末尾(第一种方式)
        //strSlide += `<div class="slide"><img src="${data[0].img}" alt="${data[0].desc}"></div>`;

        wrapper.innerHTML = strSlide;
        focus.innerHTML = strFocus;
        slideList = wrapper.querySelectorAll('.slide');
        focusList = focus.querySelectorAll('li');

        // console.log(slideList.length);//=>4
        //把第一张轮播图克隆一份放到末尾(第二种方式)
        wrapper.appendChild(slideList[0].cloneNode(true));
        //由于之前获取的slideList是没有克隆之前的数据，所以需要重新获取一遍
        slideList = wrapper.querySelectorAll('.slide');
        // console.log(slideList.length);//=>5

        //设置wrapper的宽度为slideList.length的长度*图片宽度
        utils.css(wrapper, 'width', slideList.length * con.clientWidth);
    }

    //鼠标划入划出显示影藏左右按钮
    function handleController() {
        //鼠标滑入
        con.onmouseenter = function () {
            clearInterval(autoTimer);
            arrowL.style.display = arrowR.style.display = 'block';
        }
        //鼠标滑出
        con.onmouseleave = function () {
            arrowL.style.display = arrowR.style.display = 'none';
            autoTimer = setInterval(autoMove, interval);
        }
    }

    //点击焦点实现切换
    function handleFocus() {
        [].forEach.call(focusList, (item, index) => {
            item.onclick = function () {
                stepIndex = index;
                animate(wrapper, {
                    left: -stepIndex * con.clientWidth
                }, 200);
                //重新对齐焦点
                changeFocus();
            }
        })
    }
    //给两个按钮绑定点击事件
    function handleArrow() {
        //点击右边的按钮和自动轮播是一样的执行自动轮播方法即可
        arrowR.onclick = autoMove;
        //点击左边按钮
        arrowL.onclick = function () {
            stepIndex--;
            //如果索引减减小于0，说明已经是第一张了，不能再向右运动了，
            //此时我们让wrapper瞬移到最后一张（最后一张和第一张一样），再让其运动到倒数第二张
            if (stepIndex < 0) {
                utils.css(wrapper, 'left', -(slideList.length - 1) * con.clientWidth);
                stepIndex = slideList.length - 2;
            }
            animate(wrapper, {
                left: -stepIndex * con.clientWidth
            }, 200);
            //重新对齐焦点
            changeFocus();
        }
    }
    return {
        init() {
            let promise = queryData();
            promise.then(banderHtml).then(() => {
                //开启定时器自动轮播图片
                autoTimer = setInterval(autoMove, interval);
            }).then(() => {
                //左右按钮和焦点切换
                handleController();
                handleFocus();
                handleArrow();
            });
        }
    }
})();
bannerModel.init();