/**
 * 
 */


//税局作废同步
function sjzftb(ysqxxid) {
	$.ajax({
		type : "post",
		url : "/sbzs-cjpt-web/sjzftb/main.do",
		data : {
			"ysqxxid" : ysqxxid
		},
		success : function(data) {

			layer.alert(data, {	skin : {	icon : 6	},
				closeBtn : 0
			});
		},
		error : function() {
			layer.alert('局方作废状态同步到本地失败', {	skin : {	icon : 6	},
				closeBtn : 0
			});
		},
		complete : function() {

		}
	});
} 