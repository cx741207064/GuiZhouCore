if(!window.dhtmlx)
	window.dhtmlx = {};
//https://github.com/DHTMLX/message
(function(){
	var _dhx_msg_cfg = null;
	function callback(config, result){
			var usercall = config.callback;
			modality(false);
			config.box.parentNode.removeChild(config.box);
			_dhx_msg_cfg = config.box = null;
			if (usercall)
				usercall(result);
	}
	function modal_key(e){
		if (_dhx_msg_cfg){
			e = e||event;
			var code = e.which||event.keyCode;
			if (dhtmlx.message.keyboard){
				if (code == 13 || code == 32)
					callback(_dhx_msg_cfg, true);
				if (code == 27)
					callback(_dhx_msg_cfg, false);
			}
			if (e.preventDefault)
				e.preventDefault();
			return !(e.cancelBubble = true);
		}
	}
	if (document.attachEvent)
		document.attachEvent("onkeydown", modal_key);
	else
		document.addEventListener("keydown", modal_key, true);
		
	function modality(mode){
		if(!modality.cover){
			modality.cover = document.createElement("DIV");
			//necessary for IE only
			modality.cover.onkeydown = modal_key;
			modality.cover.className = "dhx_modal_cover";
			document.body.appendChild(modality.cover);
		}
		var height =  document.body.scrollHeight;
		modality.cover.style.display = mode?"inline-block":"none";
	}

	function button(text, result){
		return "<div class='dhtmlx_popup_button' result='"+result+"' ><div>"+text+"</div></div>";
	}

	function info(text){
		if (!t.area){
			t.area = document.createElement("DIV");
			//t.area.className = "dhtmlx_message_area";
			t.area.className = "dhtmlx_message_area alert-box";
			t.area.style[t.position]="5px";
			document.body.appendChild(t.area);
		}
		t.hide(text.id);
		var message = document.createElement("ul");
		message.innerHTML = "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tr><td class=\"left-icon\"><span class=\"alert-icon\"> </span></td>"
			+ "<td><div class=\"text\">"+ text.text 
			+ (text.stack ? '<div class="triangle-div" onclick="showMsgStack(event,this,\''+t.seed+'\');" onmouseover="this.style.color=\'#6fe0ac\'" onmouseout="this.style.color=\'\'">&#9660;</div>' : '')
			+"</div>"+"</div></td></tr></table>";
		if (text.type==="error") {
			message.className = "colorOrange";
		} else {
			message.className = "colorBlue";
		}
		
		if(text.stack) {
			var s = document.createElement("DIV");
			s.id= 'mstack'+t.seed;
			s.style.display='none';
			s.style.left='50%';
			s.style.top='50%';
			s.style.marginLeft='-300px';
			s.style.marginTop='-200px';
			s.style.width='600px';
			s.style.border='1px solid #6b6666';
			s.style.height='400px';
			s.style.padding='5px';
			s.style.position = 'fixed';
			s.style.borderRadius='5px';
			s.style.background='#f9fbfa';
			s.innerHTML = '<div style="height:400px;width:600px;overflow:scroll;">' 
				+ text.stack
				+ '</div>'
				+ '<span style="background:silver;color:white;border-radius:12px;text-align:center;height:20px;width:20px;font-size: 15px;cursor:pointer;top:-10px;right:-10px;position:absolute;" onclick="javascript:this.parentNode.style.display=\'none\';">X</span>';
			if(window === window.top) {
				document.body.appendChild(s);
			} else {
				window.top.document.body.appendChild(s);
			}
		} 
		message.onclick = function(){
				t.hide(text.id);
				text = null;
			};

		if (t.position == "bottom" && t.area.firstChild)
			t.area.insertBefore(message,t.area.firstChild);
		else {
			t.area.appendChild(message);
        	$(".alert-box").animate({opacity:1,right:10},600);
        }
		if (text.expire > 0) {
			$(".alert-box").animate({opacity:1,right:10},600);
			t.timers[text.id]=window.setTimeout(function(){
				t.hide(text.id);
			}, text.expire);
		}

		t.pull[text.id] = message;
		message = null;

		return text.id;
	}
	function _boxStructure(config, ok, cancel){
		var box = document.createElement("DIV");
		box.className = " dhtmlx_modal_box dhtmlx-"+config.type;
		box.setAttribute("dhxbox", 1);
			
		var inner = '';

		if (config.width)
			box.style.width = config.width;
		if (config.height)
			box.style.height = config.height;
		if (config.title)
			inner+='<div class="dhtmlx_popup_title">'+config.title+'</div>';
		inner+='<div class="dhtmlx_popup_text"><span>'+(config.content?'':config.text)+'</span></div><div  class="dhtmlx_popup_controls">';
		if (ok)
			inner += button(config.ok || "OK", true);
		if (cancel)
			inner += button(config.cancel || "Cancel", false);
		if (config.buttons){
			for (var i=0; i<config.buttons.length; i++)
				inner += button(config.buttons[i],i);
		}
		inner += '</div>';
		box.innerHTML = inner;

		if (config.content){
			var node = config.content;
			if (typeof node == "string") 
				node = document.getElementById(node);
			if (node.style.display == 'none')
				node.style.display = "";
			box.childNodes[config.title?1:0].appendChild(node);
		}

		box.onclick = function(e){
			e = e ||event;
			var source = e.target || e.srcElement;
			if (!source.className) source = source.parentNode;
			if (source.className == "dhtmlx_popup_button"){
				var result = source.getAttribute("result");
				result = (result == "true")||(result == "false"?false:result);
				callback(config, result);
			}
		};
		config.box = box;
		if (ok||cancel)
			_dhx_msg_cfg = config;

		return box;
	}
	function _createBox(config, ok, cancel){
		var box = config.tagName ? config : _boxStructure(config, ok, cancel);
		
		if (!config.hidden)
			modality(true);
		document.body.appendChild(box);
		var x = config.left||Math.abs(Math.floor(((window.innerWidth||document.documentElement.offsetWidth) - box.offsetWidth)/2));
		var y = config.top||Math.abs(Math.floor(((window.innerHeight||document.documentElement.offsetHeight) - box.offsetHeight)/2));
		if (config.position == "top")
			box.style.top = "-3px";
		else
			box.style.top = y+'px';
		box.style.left = x+'px';
		//necessary for IE only
		box.onkeydown = modal_key;

		box.focus();
		if (config.hidden)
			dhtmlx.modalbox.hide(box);

		return box;
	}

	function alertPopup(config){
		return _createBox(config, true, false);
	}
	function confirmPopup(config){
		return _createBox(config, true, true);
	}
	function boxPopup(config){
		return _createBox(config);
	}
	function box_params(text, type, callback){
		if (typeof text != "object"){
			if (typeof type == "function"){
				callback = type;
				type = "";
			}
			text = {text:text, type:type, callback:callback };
		}
		return text;
	}
	function params(text, type, expire, id, stack){
		if (typeof text != "object")
			text = {text:text, type:type, expire:expire, id:id,stack:stack||''};
		text.id = text.id||t.uid();
		text.expire = text.expire||t.expire;
		return text;
	}
	function exct(t){
		if(t) {
			t.seed = (new Date()).valueOf();
			t.uid = function(){return t.seed++;};
			t.expire = 4000;
			t.keyboard = true;
			t.position = "top";
			t.pull = {};
			t.timers = {};

			t.hideAll = function(){
				for (var key in t.pull)
					t.hide(key);
			};
			t.hide = function(id){
				var obj = t.pull[id];
				if (obj && obj.parentNode){
					window.setTimeout(function(){
						obj.parentNode.removeChild(obj);
						obj = null;
					},100);
					obj.className+=" hidden";
					
					if(t.timers[id])
						window.clearTimeout(t.timers[id]);
					delete t.pull[id];
				}
			};
		}
	}
	dhtmlx.alert = function(){
		var text = box_params.apply(this, arguments);
		text.type = text.type || "confirm";
		return alertPopup(text);
	};
	dhtmlx.confirm = function(){
		var text = box_params.apply(this, arguments);
		text.type = text.type || "alert";
		return confirmPopup(text);
	};
	dhtmlx.modalbox = function(){
		var text = box_params.apply(this, arguments);
		text.type = text.type || "alert";
		return boxPopup(text);
	};
	dhtmlx.modalbox.hide = function(node){
		while (node && node.getAttribute && !node.getAttribute("dhxbox"))
			node = node.parentNode;
		if (node){
			node.parentNode.removeChild(node);
			modality(false);
		}
	};
	var t = dhtmlx.message = function(text, type, expire, id){
		text = params.apply(this, arguments);
		text.type = text.type||"info";

		var subtype = text.type.split("-")[0];
		switch (subtype){
			case "alert":
				return alertPopup(text);
			case "confirm":
				return confirmPopup(text);
			case "modalbox":
				return boxPopup(text);
			default:
				return info(text);
			break;
		}
	};

	exct(t);
	var tEx = dhtmlx.messageEx = function(text, stack, type, expire, id){
		text = params(text, type,expire,id,stack);
		text.type = text.type||"info";

		var subtype = text.type.split("-")[0];
		switch (subtype){
			case "alert":
				return alertPopup(text);
			case "confirm":
				return confirmPopup(text);
			case "modalbox":
				return boxPopup(text);
			default:
				return info(text);
			break;
		}
	};

	exct(tEx);
	
})();
//A by C.Q 20170901 显示异常堆栈
function showMsgStack(e, obj, uid) {
	var ev = (e) ? e : ((window.event) ? window.event : null); 
	stopBubble(ev); // 阻止冒泡行为
	var s;
	if(window === window.top) {
		s = document.getElementById("mstack"+uid);
	} else {
		s = window.top.document.getElementById("mstack"+uid);
	}
	if(s) {
		if(s.style.display =='none'){
			s.style.display ='block';
		} else {
			s.style.display ='none';
		}
	}
	
}
//停止冒泡行为
function stopBubble(e) { 
	//如果提供了事件对象，则这是一个非IE浏览器 
	if ( e && e.stopPropagation ) 
	    //因此它支持W3C的stopPropagation()方法 
	    e.stopPropagation(); 
	else 
	    //否则，我们需要使用IE的方式来取消事件冒泡 
	    window.event.cancelBubble = true; 
	}
