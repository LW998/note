let matchRender = (function ($) {
    let $userList = $('.userList'),
        $wrapper = $userList.find('ul'),
        $tip = $userList.find('.tip'),
        $headerBox = $('.headerBox'),
        $searchBtn = $headerBox.find('.searchBtn');

    let limit = 10, //每页展示条数
        page = 1, //当前是第几页
        pageNum = 1, //总页数
        total = 0, //总条数
        search = '', //搜索的内容
        isRun = false, //是否正在加载数据
        isEnd = false; //加载到末尾
    //获取数据
    function queryData() {
        axios.get('/getMatchList', {
            params: {
                limit,
                page,
                search,
            }
        }).then(res => {
            pageNum = parseFloat(res.pageNum);
            total = parseFloat(res.total);
            return res;
        }).then(bindHtml)
    }

    //绑定页面
    function bindHtml(res) {
        let {
            code,
            list = []
        } = res;
        if (parseFloat(code) !== 0) {
            //获取数据失败，无数据,非状态码失败
            $wrapper.css('display', 'none');
            $tip.css('display', 'block');
            return;
        }
        //获取数据成功
        $wrapper.css('display', 'block');
        $tip.css('display', 'none');
        let $frg = $(document.createDocumentFragment());
        list.forEach((item, index) => {
            let {
                id,
                name,
                picture,
                sex,
                matchId,
                slogan,
                voteNum,
                isVote
            } = item;
            $frg.append(`<li>
            <a href="detail.html?userId=${id}">
                <img src="${picture}" alt="${name}" class="picture">
                <p class="title">
                    <span>${name}</span>
                    |
                    <span>编号 #${matchId}</span>
                </p>
                <p class="slogan">${slogan}</p>
            </a>
            <div class="vote">
                <span class="voteNum">${voteNum}</span>
                ${parseFloat(isVote)===0?`<a href="javascript:;" class="voteBtn">投他一票</a>`:``};
            </div>
        </li>`)
        });
        $wrapper.append($frg);
        $frg = null;
        isRun = false;
    };

    return {
        init() {
            //展示第一页的内容
            queryData();
            $(window).on('scroll', () => {
                let {
                    clientHeight,
                    scrollTop,
                    scrollHeight,
                } = document.documentElement;
                if ((clientHeight + scrollTop + 20) >= scrollHeight) {
                    //即将到达底部
                    //正在加载中不允许加载新的数据
                    if (isRun) return;
                    //如果已经把所有数据加载完成了也不在继续加载了
                    if (page >= pageNum) {
                        if (isEnd) return;
                        $wrapper.append('<p>没有更多数据了</p>');
                        isEnd = true;
                        return;
                    };
                    isRun = true;
                    page++;
                    queryData();

                }
            });
            $searchBtn.tap(() => {
                if (isRun) return;
                isRun = true;
                search = $searchBtn.prev('input').val().trim();
                page = 1;
                $wrapper.html(``);
                queryData();
            })
        }
    }
})(Zepto);
matchRender.init();