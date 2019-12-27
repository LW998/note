var selVal = document.querySelectorAll('#s option');
var inpVal = document.getElementById('val');
var seaSub = document.getElementById('sear');
var p = "";
seaSub.onclick = function () {
    for (var i = 0; i < selVal.length; i++) {
        if (selVal[i].selected) {
            if (selVal[i].value == 1) {
                $.ajax({
                    type: "POST",
                    url: "gname.action",
                    data: {
                        gname: document.getElementById('val').value,
                    },
                    success: function (data) {
                        if (data.length !== null) {
                            console.log(JSON.parse(data));
                            for (var i = 0; i < JSON.parse(data).length; i++) {
                                p += '<li class="tab_list col-sm-4 col-md-2">';
                                p += '<img src="' + JSON.parse(data)[i]["img"] + '" class="img-responsive center-block" title="' + JSON.parse(data)[i]["description"] + '">';
                                p += ' <div class="ctn">';
                                p += '<p><a title="' + JSON.parse(data)[i]["description"] + '" href="#">' + JSON.parse(data)[i]["gname"] + '</a>';
                                p += '<br><b>' + JSON.parse(data)[i]["author"] + '</b><br><i>' + JSON.parse(data)[i]["publi"] + '</i></p>';
                                p += '<p><span>￥</span><span class="prices">' + JSON.parse(data)[i]["price"] + '</span></p>';
                                p += '</div>';
                                p += '<input type="hidden" value="' + JSON.parse(data)[i]["gid"] + '" class="gid"/>';
                                p += '<a class="btn btn-xs btn-info lnr lnr-cart add">添加购物车</a>';
                                p += '</li>';
                                $('#a').html(p);
                            };
                        } else {
                            alert(data);
                        }
                    },
                    error: function (e) {
                        console.log(e.status);
                        console.log(e.responseText);
                        document.write(e.responseText);
                    }
                });
            } else if (selVal[i].value === 2) {
                $.ajax({
                    type: "POST",
                    url: "author.action",
                    data: {
                        gname: document.getElementById('val').value,
                    },
                    success: function (data) {
                        if (data.length !== null) {
                            console.log(data);
                        } else {
                            alert(data);
                        }
                    },
                    error: function (e) {
                        console.log(e.status);
                        console.log(e.responseText);
                        document.write(e.responseText);
                    }
                });
            } else {
                $.ajax({
                    type: "POST",
                    url: "publi.action",
                    data: {
                        gname: document.getElementById('val').value,
                    },
                    success: function (data) {
                        if (data.length !== null) {
                            console.log(data);
                        } else {
                            alert(data);
                        }
                    },
                    error: function (e) {
                        console.log(e.status);
                        console.log(e.responseText);
                        document.write(e.responseText);
                    }
                });
            }
        }
    }
}