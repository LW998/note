 let box = document.getElementById('box');
 let detail = document.getElementById('detail');

 box.onclick = function () {
     let n = detail.style.display;
     if (n === 'none') {
         detail.style.display = 'block';
         box.style.borderBottomColor = "#fff"
     } else {
         detail.style.display = 'none';
         box.style.borderBottomColor = "lightcoral"
     }

 }