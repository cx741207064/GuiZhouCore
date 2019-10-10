
$(document).ready(function () {
    setInterval(memcachcheck, 60000)
    memcachcheck();
   
})
function memcachcheck() {

    $.getJSON("/Memcache/Check", { id: Math.random() }, function (date) {
        //debugger;
        if (date.code == 1) {
            //alert('正常');
            return false;
        }
        else {

            alert(date.message);
            top.window.opener = null;
            top.window.open('', '_self');
            top.window.close();
            return false;

        }

    })



    //    return dd;
}



