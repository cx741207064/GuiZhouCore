/**
 * Foresee High Speed Json-Path
 */
function FSjpath(){
    this.formData;
    this.kvs;
    this.idxReversePath; // {lastNodeOfPath1: [kv1, kv2, ...], lastNodeOfPath2: [kv3, kv4, ...]}
    this.deep = 0;
    if (typeof FSjpath.prototype._inited == "undefined") {
        FSjpath.prototype.initialize = function(rootJsonObj){
            this.kvs = [];
            this.idxReversePath = {};
            this.formData = rootJsonObj;
            this.initKV(this.formData);
        }
        FSjpath.prototype.query = function(jpath, count){
            var rets = [];
            var paths = this.paths(jpath);
            for (var i = 0; i < paths.length; i++) {
                rets.push(this.valueOf(paths[i]));
            }
            return rets;
        }
        FSjpath.prototype.valueOf = function(path){
            if (path.indexOf("[*]") > 0) {
                //TODO:
            } else if (path.indexOf("[#") > 0) {
                //TODO:
            } else {
                var base = this.formData;
                path.replace(/\[([\w]+)\]/g, function($1, $2){
                    base = base[$2];
                });
                return base;
            }
        }
        /*
         * 
         * 
         * */
        FSjpath.prototype.paths = function(jpath){
            var prefix = (jpath.substr(0, 1) === "$") ? "$" : "";
            var nodepath = this.normalize(jpath);
            var flagAggregation = (nodepath.indexOf("[*]") > 0);
            var flagDynamicParam = (nodepath.indexOf("[#") > 0);
            var flagWildcard = (nodepath.indexOf("[***]") > 0);		//target中是否包含通配符[***]
            var rets = [];
            if (flagAggregation || flagDynamicParam) {
                var idx = [];
                var temp = nodepath;
                temp = temp.replace(/\[([*#\d]+)\]/g, function($1){
                    idx.push($1);
                    return $1;
                });
                temp = temp.replace(/\[[#*]\]/g, "[0]").replace(/\[[#]{2}\]/g, "[99999]");
                rets = this.seekingPaths(temp, prefix);
                for (var i = 0; i < rets.length; i++) {
                    var t = 0;
                    rets[i] = rets[i].replace(/\[([*#\d]+)\]/g, function($1){
                        return idx[t++];
                    });
                }
            } else if (flagWildcard) {
            	/*
            	 * 描述：表单规则target支持通配符[***]，如："target": "$.taxML.formContent.[***]:disabled;", 
            	 * 		 会将数据模型taxML.formContent下所有叶子节点对应的元素置为disabled；
            	 * 修改人： zoufeng@foresee.cn
            	 * 修改日期：2017-03-13
            	 * */
            	temp = nodepath;
                temp = temp.replace(/[.]([a-zA-Z_][\w]*)[.]/g, "\[$1\]").replace(/[$][.]*/, "");	//将.换成[]；之后去掉$.或者$..,eg: $.taxML.formContent.[***] ==> [taxML][formContent].[***]
            	var partPath = temp.substring(0, temp.indexOf("[***]") - 2);	//截取公式中已明确的部分路径partPath,eg:[taxML][formContent].[***]==>[taxML][formContent]
            	/**用partPath在kvs中遍历匹配，如果k对应的路径包含partPath,则把此k的path放入返回数组中*/
            	for (var j = 0; j < this.kvs.length; j ++) {
            		var kv = this.kvs[j];
        			if (kv["k"].indexOf(partPath) != -1) {
        				rets.push(kv["k"]);
            		}
            	}
            } else {
                // Narrow the scan range
                rets = this.seekingPaths(nodepath, prefix);
            }
            return (rets.length > 0) ? rets : false;
        }
        /*
         * 根据nodePath到数据节点中匹配全路径，并返回全路径
         * 
         * */
        FSjpath.prototype.seekingPaths = function(nodepath, prefix){
            var rets = [];
            var ln = this.lastNode(nodepath);
            if (ln !== "*" && ln !== "#") {
                var lstSeeking = this.idxReversePath[ln];
                if (!lstSeeking) {
                    this.initialize(eval('window.FSformData'));
                    lstSeeking = this.idxReversePath[ln];
                }
                if (lstSeeking) {
                    //Seeking one by one
                    var length = lstSeeking.length;
                    var reg = this.toRegular(nodepath);
                    for (var i = 0; i < length; i++) {
                        if (reg.test(lstSeeking[i].k)) {
                            rets.push(prefix + lstSeeking[i].k);
                        }
                    }
                } else {
                    var lnn = this.lastNameNode(nodepath);
                    if (lnn.isArray) {
                        var lstSeeking = this.idxReversePath[lnn.node];
                        if (lstSeeking) {
                            var length = lstSeeking.length;
                            var reg = this.toRegular(lnn.path);
                            for (var i = 0; i < length; i++) {
                                if (reg.test(lstSeeking[i].k)) {
                                    rets.push(prefix + lstSeeking[i].k);
                                }
                            }
                            for (var t = 0; t < lnn.idx.length; t++) {
                                rets = rets[lnn.idx[t]];
                            }
                            rets = [ rets ];
                        }
                    } else {
                        rets = jsonPath(this.formData, prefix+nodepath, { resultType : "PATH" })
                    }
                }
            }
            return rets;
        }
        /**
         * <pre>
         * $..[zbGridlbVO][0][qcwjse] 
         * $..[zzssyyybnsr04_bqjxsemxb][bqjxsemxbGrid][bqjxsemxbGridlbVO][0][bqfse]
         * </pre>
         */
        FSjpath.prototype.lastNode = function(nodepath){
            var pos = nodepath.lastIndexOf("[");
            var node = nodepath.substr(pos + 1);
            return node.substr(0, node.length - 1);
        }
        /**
         * <pre>
         * $..[zbGridlbVO][0][qcwjse] 
         * $..[zzssyyybnsr04_bqjxsemxb][bqjxsemxbGrid][bqjxsemxbGridlbVO][0][bqfse]
         * </pre>
         */
        FSjpath.prototype.lastNameNode = function(nodepath){
            var pos = nodepath.lastIndexOf("[");
            var node = nodepath.substr(pos + 1);
            node = node.substr(0, node.length - 1);
            if (isNaN(node)) {
                return { "node" : node, "isArray" : false, "path" : nodepath, "idx" : [] };
            } else {
                var tmp = this.lastNameNode(nodepath.substr(0, pos));
                return { "node" : tmp.node, "isArray" : true, "path" : tmp.path,
                    "idx" : [ node ].concat(tmp.idx) };
            }
        }
        /**
         * @param nodepath String. Normalized jpath.
         */
        FSjpath.prototype.toRegular = function(nodepath){
            var ret = nodepath;
            ret = ret.replace(/\[99999\]/g, "[0]");
            ret = ret.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
            ret = ret.replace(/\.\./g, ".*").replace(/[$]/, "");
            return new RegExp("^"+ret+"$", "");
        }
        /**
         * <pre>
         * $..nsrjbxx.nsrmc => $..[nsrjbxx][nsrmc]
         * $..zbGridlbVO[0].xxse => $..[zbGridlbVO][0][xxse]
         * $..bqjxsemxbGridlbVO[*].qcye => $..[bqjxsemxbGridlbVO][*][qcye]
         * $..zzsjmssbmxbjsxmGridlbVO[#].qmye => $..[zzsjmssbmxbjsxmGridlbVO][#][qmye]
         * $.qcs..frmx => $[qcs]..[frmx]
         * $.qcs..szhd[0].zspmDm => $[qcs]..[szhd][0][zspmDm]
         * </pre>
         */
        FSjpath.prototype.normalize = function(jpath){
            var subx = [];
            var ret = jpath;
            var log = ret;
            ret = ret.replace(/'?\.'?|\['?/g, ";");
            ret = ret.replace(/;;;|;;/g, ";..;");
            log += " => " + ret;
            ret = ret.replace(/;$|'?\]|'$/g, "");
            ret = ret.replace(/;/g, "][");
            log += " => " + ret;
            ret = ret.replace(/\$]/g, "$") + "]";
            ret = ret.replace(/\[\.\.\]/g, "..");
            log += " => " + ret;
            //console.log(log);
            return ret;
        }
        FSjpath.prototype.initKV = function(obj, prefix, name){
            if ("string" !== typeof prefix) {
                prefix = "";
            }
            if (obj instanceof Array) {
            	/**
            	 * 此处增加一种判断，假如数组的元素为简单类型。即非[{'a':'01'}]格式。
            	 *  不考虑[[1,2,3],[2,3,4]]这种奇葩格式。暂时认为无此格式存在。
            	 *  同时，假如[{}]也认为是空数组。
            	 */
            	var leaf_detect = true; 
                for (var i = 0; i < obj.length; i++) {
                    this.initKV(obj[i], prefix + "[" + i + "]", i);
                    if('object' == typeof obj[i] && obj[i] != {}){
                    	leaf_detect = false;
                    }
                }
                if(leaf_detect){
                	this.addToKV(prefix, obj, name);
                }
            } else if ("function" === typeof obj) {
                // Skip function.
            } else if ("object" == typeof obj) {
            	/**
            	 * 编译阶段新增节点，默认为{}，也增加到节点树中。
            	 */
            	if(obj == {}){
            		this.addToKV(prefix, obj, name);
            	}
                var cnt = 0;
                for ( var n in obj) {
                    cnt++;
                    this.initKV(obj[n], prefix + "[" + n + "]", n);
                }
                if (cnt == 0) {
                    this.addToKV(prefix, obj, name);
                }
            } else {
                this.addToKV(prefix, obj, name);
            }
        }
        FSjpath.prototype.addToKV = function(k, v, n){
            var tmp = { "k" : k, "v" : v };
            this.kvs.push(tmp);
            if (!this.idxReversePath[n]) {
                this.idxReversePath[n] = [];
            };
            this.idxReversePath[n].push(tmp);
        }
        
        /**
         * 增加索引（针对中间节点）
         * @param fullPath 节点全路径
         * */
        FSjpath.prototype.addToKVByFullPath = function(fullPath) {
            //获取叶子节点
            var node = fullPath.substring(fullPath.lastIndexOf(".")+1);

            if(node.match(/\[[0-9]+\]$/)){
                //如果有数组，获取数组下标（如$.hjbhssydjb.dJHbsjcxxcjbVO.zywrwlbsDm1[1]=($..hjbhsdjxxVO.djHbsjcxxcjbVO.zywrwlbsDm).split(',')[1]）
                node = node.match(/\[[0-9]+\]$/)[0].replace(/\[|\]/g,"");
            }

            var nodePath = this.normalize(fullPath);
            nodePath = nodePath.replace("$","");

            var lstSeeking = this.idxReversePath[node];
            if (lstSeeking) {
                for (var i = 0,len=lstSeeking.length; i < len; i++) {
                    //取索引
                    var k = lstSeeking[i].k;
                    if(nodePath === k){
                        //索引中存在，则不加索引
                        return;
                    }
                }
            }

            this.addToKV(nodePath,"",node);
        };
    }
    // For not to do initialization twice.
    FSjpath.prototype._inited == true;
}
