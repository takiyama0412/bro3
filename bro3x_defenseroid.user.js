// ==UserScript==
// @name           bro3x DefenseRoid
// @namespace      bro3x
// @include        http://*.3gokushi.jp/facility/unit_status.php*
// ==/UserScript==

// Element入手のファンクション Beyondより拝借 //////////////////
var d = document;
var $ = function(id) { return d.getElementById(id); };
var $x = function(xp,dc) { return d.evaluate(xp, dc||d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; };
var $a = function(xp,dc) { var r = d.evaluate(xp, dc||d, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); var a=[]; for(var i=0; i<r.snapshotLength; i++){ a.push(r.snapshotItem(i)); } return a; };
var $e = function(dc,e,f) { if (!dc) return; dc.addEventListener(e, f, false); };
var isNarrow = location.host.match(/^[m|y]\d+\./i) ? true : false;

//var obj = $x("//table[@summary=\"待機中の兵士\"]");

//var lnk = d.createElement("a");
//lnk.href = "javascript:void(0)";
//lnk.innerHTML ="(^-^)";
//obj.parentNode.appendChild(lnk);

//$e(lnk, "click", function() {

// 現在日時入手 ///////////////////////////////////////////////
	var time_obj = $x("//span[@id=\"server_time\"]");
	var now_time = time_obj.innerHTML;
	
// 現在拠点の情報入手 /////////////////////////////////////////
	var obj_base = $x("//div[@class=\"sideBoxInner basename\"]//li[@class=\"on\"]/span");
	var base_name = obj_base.innerHTML;
	var base_xy = obj_base.title.match(/\(.*?\)$/);
	//alert (base_name);
	//alert (base_xy);
// 格納データ名の設 ///////////////////////////////////////////
	var store_name = "bro3x.DefenseRoid:"+location.hostname+base_xy;
	//alert (store_name);


// 敵襲の現在状況確認 /////////////////////////////////////////
	var trs = $a("//div[@id=\"enemy\"]/table[@summary=\"敵襲\"]/tbody/tr");
	var trs2 = $a("//div[@id=\"all\"]/table[@summary=\"敵襲\"]/tbody/tr");
	//var trs = $a("//div[@id=\"sortie\"]/table[@summary=\"出撃中の兵士\"]/tbody/tr");
	//var trs2 = $a("//div[@id=\"all\"]/table[@summary=\"出撃中の兵士\"]/tbody/tr");
	var all_num = Math.floor((trs.length -1)/3);
	//alert(trs.length);
	var enemy = [];
	var reach_time = [];
	var find_time =[];
	var enemy_xy = [];
	var comp = [];
	var diff = [];
	var speed_b3 = [];
	var speed_b5 = [];
	var speed_b6 = [];
	var speed_b7 = [];
	var speed_b8 = [];
	var speed_b10 = [];
	var speed_b12 = [];
	var speed_b15 = [];
	var speed_m = [];
	var enemy_point = [];
	var base_point = [];
	var destance = [] ;
	var speed = [];
	

	//alert("i="+all_num);
	
	for(var i=0 ; i<all_num ; i++) {
		var idtd = $x("descendant::td[1]",trs[i*3+1]);
		enemy[i] = idtd.innerHTML.replace(/\n/g,"").replace(/<a.*?>/g,"").replace(/<\/a>/g,"")
		enemy_xy[i] =enemy[i].match(/\(.*?\)$/);
			//alert(enemy[i]+"||"+enemy_xy[i]);
		var idtd2 = $x("descendant::td[1]",trs[i*3+2]);
		reach_time[i] = idtd2.innerHTML.replace(/\n/g,"").replace(/<div>.*?<\/dev>/g,"").replace(/\&.*/,"");
			//alert(reach_time[i]);
		comp[i] = reach_time[i] + enemy[i];
	}

// 記録ストレージからデータの取り出し /////////////////////////
	// localStorageに保存されたデータを取得
	var nativeJSON = localStorage.getItem(store_name);
	enemy_s = new Array();
	reach_time_s = new Array();
	find_time_s = new Array();
	comp_s = new Array();
	//alert("ストレージデータ^-^"+nativeJSON);
	// JSONデータ→JavaScriptオブジェクトに変換
	if(nativeJSON != null){
		var object = JSON.parse(nativeJSON);
		// オブジェクトからデータ取得
		for(var i_s=0; i_s < object.items.length; i_s++) {
			enemy_s[i_s] = object.items[i_s].enemy;
			reach_time_s[i_s] = object.items[i_s].reach_time;
			find_time_s[i_s] = object.items[i_s].find_time;
			comp_s[i_s] = reach_time_s[i_s] + enemy_s[i_s];
		}
	}

// データのマッチング & 保存用オブジェクトに値セット ////////////
	var new_object = {};
	new_object.items = new Array();
	for (var val in comp){
		var point = comp_s.indexOf(comp[val]);
		if(point !=-1){
			find_time[val] = find_time_s[point];
			comp_s[point] = "";
		}else{
			find_time[val] = now_time;
		}
		new_object.items[val] = {};
		new_object.items[val].enemy = enemy[val];
		new_object.items[val].enemy_xy = enemy_xy[val];
		new_object.items[val].base_xy = base_xy;
		new_object.items[val].reach_time = reach_time[val];
		new_object.items[val].find_time = find_time[val];
	}

// 発見から到着までの時時間差を求める & 距離と速度を求める & 補正値を求める/////////
	for(var val in comp){
		data_r = reach_time[val].split(" ");
		day_r = data_r[0].split("-");
		time_r = data_r[1].split(":");
		var ms_r = new Date(day_r[0], day_r[1], day_r[2], time_r[0], time_r[1], time_r[2]);

		data_f = find_time[val].split(" ");
		day_f = data_f[0].split("-");
		time_f = data_f[1].split(":");
		var ms_f = new Date(day_f[0], day_f[1], day_f[2], time_f[0], time_f[1], time_f[2]);

		var diff_ms =(ms_r.getTime()-ms_f.getTime());
		//alert(diff_ms);
		diff[val] = Math.floor( diff_ms/(1000*60*60) ) + ":" + Math.floor( diff_ms/(1000*60) )%60 + ":" + Math.floor( diff_ms/1000 )%60;
		//alert(diff[val]);
		enemy_point = new String(enemy_xy[val]).replace(/\(/g,"").replace(/\)/g,"").split(",");
		base_point = new String(base_xy).replace(/\(/g,"").replace(/\)/g,"").split(",");
		var dest = Math.sqrt(Math.pow((enemy_point[0]-base_point[0]),2)+Math.pow((enemy_point[1]-base_point[1]),2));
		destance[val] = Math.floor(dest * 100)/100;
		var spd = dest/(diff_ms/(3600*1000));
		speed[val] = Math.floor(spd*100)/100;
		//alert ("dest:"+destance[val]+" speed:"+ speed[val]);
		
		speed_b3[val] = Math.floor(((spd/3)-1)*1000)/10;
		speed_b5[val] = Math.floor(((spd/5)-1)*1000)/10;
		speed_b6[val] = Math.floor(((spd/6)-1)*1000)/10;
		speed_b7[val] = Math.floor(((spd/7)-1)*1000)/10;
		speed_b8[val] = Math.floor(((spd/8)-1)*1000)/10;
		speed_b10[val] = Math.floor(((spd/10)-1)*1000)/10;
		speed_b12[val] = Math.floor(((spd/12)-1)*1000)/10;
		speed_b15[val] = Math.floor(((spd/15)-1)*1000)/10;
		
		var b_spds = [3,5,6,7,8,10,12,15];
		speed_m[val] = new Array(10);;
		for(var p in b_spds){
			b_spd = b_spds[p];
			speed_m[val][b_spd] = "";
			if((spd > b_spd )&&(spd < b_spd*(1+0.5+0.02*dest))){
				for (i=0; i<=20; i++){
					for(j=1; j <= 10; j++){
						sp=b_spd*(1+0.05*j+0.001*i*dest);
						if(Math.abs(spd - sp) < 0.1){speed_m[val][b_spd] += "("+j+","+i+")";}
						if((sp > spd)&&(j=1)){i=21;}
						if(sp > spd){j=11;}
					}
				}
			}
			if(speed_m[val][b_spd] == ""){speed_m[val][b_spd]="該当なし";}
		}
		
	}

// テーブルへの情報ＩＮ ///////////////////////////////////////
	// 表示
	for(var i=0 ; i<all_num ; i++) {
		var idtd2 = $x("descendant::td[1]",trs[i*3+2]);
		var idtd2d = $x("descendant::td[2]",trs[i*3+2]);
		var idtd3 = $x("descendant::td[1]",trs2[i*3+2]);
		var idtd3d = $x("descendant::td[2]",trs2[i*3+2]);
		var win_html = "<TABLE border=1 bgcolor=#ffffff><TBODY> <TR bgcolor=#E7D77B><TD>兵種[速]</TD><TD >補正</TD><TD >（訓練,遠征）パターン</TD></TR> <TR><TD >衝車[3]</TD><TD align=right>"+speed_b3[val]+"%</TD><TD >"+speed_m[val][3]+"</TD></TR> <TR><TD >剣or投[6]</TD><TD align=right>"+speed_b6[val]+"%</TD><TD >"+speed_m[val][6]+"</TD></TR> <TR><TD >槍兵[7]</TD><TD align=right>"+speed_b7[val]+"%</TD><TD >"+speed_m[val][7]+"</TD></TR> <TR><TD >弓兵[5]</TD><TD align=right>"+speed_b5[val]+"%</TD><TD >"+speed_m[val][5]+"</TD></TR> <TR><TD >騎兵[12]</TD><TD align=right>"+speed_b12[val]+"%</TD><TD >"+speed_m[val][12]+"</TD></TR> <TR><TD >矛槍[10]</TD><TD align=right>"+speed_b10[val]+"%</TD><TD >"+speed_m[val][10]+"</TD></TR> <TR><TD >弩兵[8]</TD><TD align=right>"+speed_b8[val]+"%</TD><TD >"+speed_m[val][8]+"</TD></TR> <TR><TD >近衛[15]</TD><TD align=right>"+speed_b15[val]+"%</TD><TD >"+speed_m[val][15]+"</TD></TR>  </TBODY></TABLE>";
		idtd2.innerHTML += "<dev><br><font color =\"880088\">発見"+find_time[val]+"　推定移動時間"+diff[i]+"</font></dev>";
		idtd2d.innerHTML +="<dev><br><span onmousemove=\"disp_popup('myCursor',event,'"+win_html+"')\" onmouseout=\"del_popup('myCursor',event)\"><font color =\"880088\">距離"+destance[i]+"　推定速度"+speed[i]+"</font></span></dev>";
		idtd3.innerHTML += "<dev><br><font color =\"880088\">発見"+find_time[val]+"　推定移動時間"+diff[i]+"</font></dev>";
		idtd3d.innerHTML +="<dev><br><span onmousemove=\"disp_popup('myCursor',event,'"+win_html+"')\" onmouseout=\"del_popup('myCursor',event)\"><font color =\"880088\">距離"+destance[i]+"　推定速度"+speed[i]+"</font></span></dev>";

	}
	// 兵種推測情報表示用窓 ///////////////////////////////
	
// ストレージへの書き込み /////////////////////////////////////
	// JavaScriptオブジェクト→JSONデータに変換
	var nativeJSON = JSON.stringify(new_object);
	//alert("保存用データ"+nativeJSON);
	// ローカルストレージへ保存
	localStorage.setItem(store_name, nativeJSON);
	
// タイトル修正 ////////////////////////////////////////////////
	document.title += "　【ディフェンスロイドご奉仕中】"; 

// １０秒毎の敵襲変化のチェック＆リロード//////////////////////
	function WatchNewEnemy(){
	
	
	}

// ３０秒後のリロード ////////////////////////////////

	//setTimeout(function(){location.reload();},30000);
	
	
	
////////////////////////////////////////////////////////////////////
// 画面機能スクリプト群 ////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

// 速度から兵種を推測する窓表示機能 //////////////////////////////////////

var ele = document.createElement("div");
ele.id = "myCursor";
ele.style = "display: none; position:absolute; z-index:1;";
ele.innerHTML = "";
document.body.appendChild(ele);
//idtd3d.innerHTML +="<div id='myCursor' style='display: none; position:absolute; z-index:1;'>  <TABLE border=0 bgcolor=#cccc00 cellpadding=0><TBODY> <TR><TD>兵種[速]</TD><TD >補正</TD><TD >（訓練,遠征）パターン</TD></TR> <TR><TD >衝車[3]</TD><TD >+x%</TD><TD >(3,8)</TD></TR> <TR><TD >剣or投[6]</TD><TD >+x%</TD><TD >(2,8)</TD></TR> <TR><TD >槍兵[7]</TD><TD >+x%</TD><TD >なし</TD></TR> <TR><TD >弓兵[5]</TD><TD >+x%</TD><TD >なし</TD></TR> <TR><TD >騎兵[12]</TD><TD >+x%</TD><TD >なし</TD></TR> <TR><TD >矛槍[10]</TD><TD >+x%</TD><TD >なし</TD></TR> <TR><TD >弩兵[8]</TD><TD >+x%</TD><TD >なし</TD></TR> <TR><TD >近衛[15]</TD><TD >+x%</TD><TD >なし</TD></TR>  </TBODY></TABLE> </div>";


var ele = document.createElement("script");
ele.type = "text/javascript";

document.body.appendChild(ele);
ele.innerHTML = "	function disp_popup(id,evt,html) {	  var obj_cursor = document.getElementById(id);	  obj_cursor.innerHTML = html;	  obj_cursor.style.position = 'absolute';	  obj_cursor.cursor = 'pointer';	  obj_cursor.style.display = 'block';	  obj_cursor.style.left = getMouseX(evt);	  obj_cursor.style.top = getMouseY(evt);	} 	  	function del_popup(id) {	  image = document.getElementById(id).style.display = 'none';	}		function getMouseX(evt) {	  if (document.all) {	    return (document.body.scrollLeft != 0 ? document.body.scrollLeft : document.documentElement.scrollLeft) + event.clientX + 20 + 'px';	  }	  else {	    return evt.pageX + 20 + 'px';	  }	}		function getMouseY(evt) {	  if (document.all) {	    return (document.body.scrollTop != 0 ? document.body.scrollTop : document.documentElement.scrollTop) + event.clientY + 'px';	  }	  else {	    return evt.pageY + 'px';	  }	}";

	
//});



