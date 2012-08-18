// ==UserScript==
// @name           3gokushi_AutoLogin
// @version        0.9.6
// @namespace      http://puyomonolith.blog83.fc2.com/
// @description    一定の間隔で自動的にログインします。ログインの間隔はオプション部分の値をいじって変更できます。オレオレ改造版
// @include        http://*.app0.mixi-platform.com/gadgets/ifr?*&app_id=6598&*
// @include        http://m*.3gokushi.jp/user/first_login.php#m*
// @include        http://m*.3gokushi.jp/false/login_sessionout.php*
// @include        http://mixi.jp/run_appli.pl?id=6598*
// ==/UserScript==

//★★★オプション★★★

//ログインの間隔（秒）
var interval = 60 * 60 * 2 + 60 * 55;	//デフォルトでは２時間５５分

//★★★オプション★★★

//■ここより下はいじらないでください！■

function $(id){return document.getElementById(id);}

if (location.pathname == "/false/login_sessionout.php") {
    var s = location.host.split(".")[0];
    location.href = "http://mixi.jp/run_appli.pl?id=6598&#" + s;
} else 
//http://･･･.app0.mixi-platform.com/…（ドキュメント内にmixiボタンなどを子要素にもつiframe）の処理
if(String(document.location).indexOf("#m") == -1){
	
	//setIntervalで監視。ログイン完了後、完了と同時に生成されたiframeを操作
	iframeWatch = setInterval(function(){
		var iframe = document.getElementsByTagName("iframe")[0];
		
		//ログイン完了後の処理
		if(iframe){
			
			//監視タイマーを解除
			clearInterval(iframeWatch);
			
			//ロードまで画面を非表示に
			iframe.style.display = "none";
			
			//サーバー情報取得
			var server = String(iframe.src).split("//")[1].split(".")[0];
			
			//鯖に参加済みかどうかの判定
			iframe.addEventListener("load", function(){
				if(String(iframe.src).indexOf("#m") == -1 && !navigator.userAgent.match("Chrome")){
					GM_xmlhttpRequest({
						method:	"get", 
						url:	"http://" + server + ".3gokushi.jp/village.php",
						onload:	function(x){
									//レスポンスが城の操作画面の場合
									if(x.responseText.indexOf("id=\"city\"") != -1){
										//DOMで操作できるように子iframeのsrcをダミーに変更
										iframe.src = String(iframe.src).split("?")[0] + "#" + server;
										//ダミー画面が呼び出されるとURLで検出して自動ログイン処理
										
									//レスポンスが「サーバ混雑」「セッションタイムアウト」などの場合
									} else {
										//画面の非表示を解除
										iframe.style.display = "block";
									}
								}
					});
				//Google Chromeの処理
				} else if(String(iframe.src).indexOf("#m") == -1 && navigator.userAgent.match("Chrome")){
					//鯖の参加判定なしでDOMで操作できるように子iframeのsrcをダミーに変更
					iframe.src = String(iframe.src).split("?")[0] + "#" + server;
					//ダミー画面が呼び出されるとURLで検出して自動ログイン処理
				//ダミー画面の読み込み完了後の処理
				} else {
					//画面の非表示を解除
					iframe.style.display = "block";
				}
			}, true);
		}
	}, 500);
	
//iframeで呼び出した「現在サーバが混み合っているため…」ダミー画面の処理
} else if(String(document.location).indexOf("first_login.php#m") != -1){
	
	var body = document.getElementsByTagName("body")[0];
	body.innerHTML = "";
	
	//ログインしたサーバ（m○）
	var server = String(document.location).split("#")[1];
	
	//ログインしたサーバをDOMで操作できるように直接iframeで呼び出す（http://m○.3gokushi.jp/village.php）
	var playGameIframe = document.createElement("iframe");
	playGameIframe.id = "play_game_iframe";
	playGameIframe.src = "http://" + server + ".3gokushi.jp/village.php#ptop";
	playGameIframe.style.border = "none";
	playGameIframe.style.width = "100%";
	playGameIframe.style.height = "4300px";
	playGameIframe.style.overflow = "hidden";
	body.appendChild(playGameIframe);
	
	//自動ログイン中に操作を制限するレイヤを作成
	var hiddenLayer = document.createElement("div");
	hiddenLayer.id = "hidden_layer";
	hiddenLayer.style.backgroundColor = "black";
	hiddenLayer.style.width = "100%";
	hiddenLayer.style.height = "4300px";
	hiddenLayer.style.opacity = "0.5";
	hiddenLayer.style.position = "absolute";
	hiddenLayer.style.top = "0";
	hiddenLayer.style.display = "none";
	hiddenLayer.style.zIndex = "999";
	body.appendChild(hiddenLayer);
	var pleaseWait = document.createElement("p");
	pleaseWait.id = "please_wait";
	pleaseWait.style.textAlign = "center";
	pleaseWait.style.backgroundColor = "white";
	pleaseWait.style.padding = "20px"
	pleaseWait.style.border = "10px solid silver";
	//pleaseWait.style.width = "150px";
	pleaseWait.style.position = "absolute";
	pleaseWait.style.top = "300px";
	pleaseWait.style.left = "267px";
	pleaseWait.style.display = "none";
	pleaseWait.style.zIndex = "1000";
	pleaseWait.innerHTML = "自動ログイン中…<br>（操作できません）<br><br>";
	body.appendChild(pleaseWait);
	
	//再ログインまでの残り時間を表示する要素を作成
	//ラッパー
	var Wrapper = document.createElement("div");
	Wrapper.id = "_wrapper";
	Wrapper.className = "movable";
	Wrapper.style.fontSize = "10px";
	Wrapper.style.color = "white";
	Wrapper.style.position = "absolute";
	Wrapper.style.top = "60px";
	Wrapper.style.left = "650px";
	//ログインボタン
	var loginButton = document.createElement("input");
	loginButton.id = "login_button";
	loginButton.type = "button";
	loginButton.value = "再ログイン";
	loginButton.style.fontSize = "8px";
	loginButton.style.marginRight = "3px";
	loginButton.style.width = "50px";
	loginButton.style.height = "16px";
	Wrapper.appendChild(loginButton);
	
	//ログインボタンにクリック時の挙動を追加
	loginButton.addEventListener("click", function(){
		AutoLogin.login();
	}, true);
	
	//残り時間表示
	var restTime = document.createElement("span");
	restTime.id = "rest_time_disp";
	restTime.className = "movable_controller";
	restTime.innerHTML= "--:--:--";
	restTime.style.backgroundColor = "#222222";
	restTime.style.border = "1px solid red";
	restTime.style.padding = "1px 2px";
	restTime.style.cursor = "move";
	Wrapper.appendChild(restTime);
	
	//表示
	body.appendChild(Wrapper);
	
	var AutoLogin = {
		counter: interval,
		hiddenLayer: $("hidden_layer"),
		pleaseWait: $("please_wait"),
		loginButton: $("login_button"),
		restTimeDisp: $("rest_time_disp"),
		phase: 0,
		loginEnd: false,
		error: false,
		errorTry: 0,
		login: function(){
			clearInterval(timer);
			this.loginButton.disabled = "disabled";
			this.hiddenLayer.style.display = "block";
			this.pleaseWait.style.display = "block";
			
			httpRequest = new XMLHttpRequest();
			httpRequest.open("GET", "http://" + server + ".3gokushi.jp/village.php#ptop", true);
			httpRequest.onreadystatechange = function(){
				if(httpRequest.readyState == 4){
					if(httpRequest.status == 200 && httpRequest.responseText.match(/id=\"city\"/)){
						//各拠点へのリンク格納用
						var lodgment = document.createElement("div");
						
						//正規表現で非同期通信結果から必要な部分だけ抜き出し
						var str = httpRequest.responseText.match(/<div class=\"floatInner\"(.|\n)*?<\/div>/);
						str = String(str).replace(/	/g, "");	//見やすくするためにタブ削除
						str = str.replace(/,$/, "");			//なぜか最後につく「,」削除
						
						//各拠点へのリンクを格納
						lodgment.innerHTML = str;
						var li = lodgment.getElementsByTagName("li");
						
						for(var i = 0; i < li.length; i++){
							if(li[i].className == "on"){
								AutoLogin.lodgmentNum = i;		//上から何番目の拠点を操作しているかを取得
								break;
							}
						}
						pleaseWait.innerHTML += "操作中の拠点情報取得...成功<br>";
						AutoLogin.errorTry = 0;		//エラーカウンタ初期化
						AutoLogin.phase = 1;
						
					//通信エラーの処理
					} else if(httpRequest.status != 200){
						if(AutoLogin.errorTry == 3){
							AutoLogin.errorTry = 0;		//エラーカウンタ初期化
							AutoLogin.phase = 1;
							return;
						}
						pleaseWait.innerHTML += "操作中の拠点情報取得...<span style=\"color:red;\">サーバーエラー</span><br>"
											+"<span style=\"color:red;\">ゲームサーバーに問題が発生</span><br>";
						AutoLogin.errorTry++;
						httpRequest.send();
						
					//拠点以外が表示されたエラー
					} else if(!httpRequest.responseText.match(/id=\"city\"/)){
						pleaseWait.innerHTML += "操作中の拠点情報取得...失敗<br>"
											+ "<span style=\"color:red;\">セッションタイムアウト</span>or<span style=\"color:red;\">メンテ中？</span><br>";
						AutoLogin.errorTry = 0;		//エラーカウンタ初期化
						AutoLogin.phase = 1;
					}
				}
			}
			httpRequest.send();
			
			//再ログイン完了判定に用いる現在のセッションID
			var escSSID = document.cookie.split("SSID=")[1].split(";")[0];
			
			var loginIframe = document.createElement("iframe");
			loginIframe.id = "login_iframe";
			loginIframe.src = "http://mixi.jp/run_appli.pl?id=6598&#" + server;
			loginIframe.border = "0";
			loginIframe.frameborder = "0";
			loginIframe.style.width = "0";
			loginIframe.style.height = "0";
			loginIframe.style.position = "absolute";
			loginIframe.style.top = "-2px";
			loginIframe.style.left = "0";
			loginIframe.style.visibility = "hidden";
			
			phaseTimer1 = setInterval(function(){
				if(AutoLogin.phase == 0){
					return;
				}
				clearInterval(phaseTimer1);
				body.appendChild(loginIframe);
				
			}, 500);
			
			//セッションIDを監視
			loginWatch = setInterval(function(){
				if(escSSID == document.cookie.split("SSID=")[1].split(";")[0]){
					return;
				} else {
					AutoLogin.phase = 2;
					clearInterval(loginWatch);	//セッションIDが変化したらログイン後の処理を実行
				}
				
				//ログイン完了後の処理
				pleaseWait.innerHTML += "再ログイン...成功<br>";
				
				//ログイン用iframeを削除
				body.removeChild(loginIframe);
				
				//操作拠点が城だった場合
				if(!AutoLogin.lodgmentNum){
					AutoLogin.loginEnd = true;	//ログイン完了フラグを立てる
					
				//操作拠点が城以外だった場合
				} else if(AutoLogin.lodgmentNum) {
					//操作拠点を戻すURLを取得
					httpRequest = new XMLHttpRequest();
					httpRequest.open("GET", "http://" + server + ".3gokushi.jp/village.php", true);
					httpRequest.onreadystatechange = function(){
						if(httpRequest.readyState == 4){
							if(httpRequest.status == 200){
								//各拠点へのリンク格納用
								var lodgment = document.createElement("div");
								
								//正規表現で非同期通信結果から必要な部分だけ抜き出し
								var str = httpRequest.responseText.match(/<div class=\"floatInner\"(.|\n)*?<\/div>/);
								str = String(str).replace(/	/g, "");	//見やすくするためにタブ削除
								str = str.replace(/,$/, "");			//なぜか最後につく「,」削除
								
								//各拠点へのリンクを格納
								lodgment.innerHTML = str;
								var li = lodgment.getElementsByTagName("li");
								
								//操作拠点へ戻すリンク取得
								AutoLogin.lodgmentURL = li[AutoLogin.lodgmentNum].getElementsByTagName("a")[0].href;
								
								pleaseWait.innerHTML += "操作中の拠点URL取得...成功<br>";
								
								//操作拠点を戻す
								restore = new XMLHttpRequest();
								restore.open("GET", AutoLogin.lodgmentURL, true);
								restore.onreadystatechange = function(){
									if(restore.readyState == 4){
										if(restore.status == 200){
											pleaseWait.innerHTML += "操作中の拠点の復元...成功<br>";
											AutoLogin.loginEnd = true;
										} else {
											//操作中の拠点の復元エラー
											pleaseWait.innerHTML += "操作中の拠点の復元...失敗<br>";
											AutoLogin.error = true;
											AutoLogin.loginEnd = true;
										}
									}
								}
								restore.send();
							} else {
								//通信エラー★→改良の余地アリ
								pleaseWait.innerHTML += "操作中の拠点URL取得...失敗<br>";
								AutoLogin.error = true;
								AutoLogin.loginEnd = true;
							}
						}
					}
					httpRequest.send();
				}
				
				endTimer = setInterval(function(){
					if(AutoLogin.loginEnd == false){
						return;
					} else {
						clearInterval(endTimer);
					}
					
					loginButton.disabled = "";
					hiddenLayer.style.display = "none";
					pleaseWait.style.display = "none";
					pleaseWait.innerHTML = "自動ログイン中…<br>（操作できません）<br><br>";
					
					//ログイン完了フラグを初期化
					AutoLogin.loginEnd = false;
					
					//カウントダウン開始
					AutoLogin.counter = interval;
					AutoLogin.countDown();
				}, 500);
			}, 500);
			
			//カウントダウン開始
			//AutoLogin.counter = interval;
			//AutoLogin.countDown();
		},
		countDown: function(){
			timer = setInterval(function(){
				AutoLogin.counter--;
				var timeStr = Math.floor(AutoLogin.counter/3600) + ":";
				if(Math.floor((AutoLogin.counter - (Math.floor(AutoLogin.counter/3600))*3600) / 60) < 10){
					timeStr += "0";
				}
				timeStr += Math.floor((AutoLogin.counter - (Math.floor(AutoLogin.counter/3600))*3600) / 60) + ":";
				
				if(AutoLogin.counter%60 < 10){
					timeStr += "0";
				}
				timeStr += AutoLogin.counter%60;
				restTime.innerHTML = timeStr;
				
				if(AutoLogin.counter <= 0){
					AutoLogin.login();
				}
			}, 1000);
		}
	};
	
	AutoLogin.countDown();
    
//自動ログイン用にiframeで呼び出された画面の処理
} else {
	
	//mixiアプリ画面(http://mixi.jp/run_appli.pl?id=6598&#m*)の処理
	if(document.getElementById("app_content_6598")){	//（http://mixi.jp/run_appli.pl?id=6598*で判定だといろいろ不具合が…）
	
		//iframeのsrcを取得
		var iframeURL = document.getElementById("app_content_6598").src;
		
		//サーバ名を語尾につけてiframeのsrcへ飛ぶ
		document.location = iframeURL + "#" + String(document.location).split("#")[1];
		
		return;
	}
	
	//iframeのsrcで飛ばされてきたロード中画面での待機処理、ロード完了後loop()を実行
	var loading = setInterval(function(){
		if(document.getElementById("container")){
			clearTimeout(loading);
			autoLogin();
		}
	}, 500);
	
	//サーバー選択画面の処理
	function autoLogin(){
		
		//見えないボタン作成
		var input = document.createElement("input");
		input.type = "button";
		input.style.position = "absolute";
		input.style.top = "-10px";
		input.style.left = "-10px";
		input.style.visibility = "hidden";
		
		//サーバーへのリンクのonclickには関数がセットされているので、
		//ログインしたいサーバーへのリンクのonclickにセットされた関数をボタンにセット
		var serverList = document.getElementById("serverList").getElementsByTagName("a");
		var loginServer = String(document.location).split("#")[2];
		for(var i = 0; i < serverList.length; i++){
			var serverTitle = serverList[i].title.split("ワールド")[0];
			
			if(serverTitle == loginServer){
				input.setAttribute("onclick", serverList[i].getAttribute("onclick"));
				break;
			}
		}
		
		//見えないボタンを自動クリックで自動ログイン
		var body = document.getElementsByTagName("body")[0];
		body.appendChild(input);
		input.click();
		body.removeChild(input);	//用が済んだボタンを削除
		
	}
}

//*****************************************************************************************************************

/**
 * ================
 * = ElementMover =
 * ================
 *
 * @author : nobuoka
 * @url : http://www.vividcode.info/projects/jsminilib/element_mover.html
 * @version : 1.0.1
 * 
 * == 概要 ==
 * HTML Element をドラッグして移動できるようにする JavaScript ライブラリ.
 * 
 * == 使用方法 ==
 * 1. まず, このスクリプトファイルを HTML 文書内で読み込みます. 
 *    head 要素内 "ではなく" body 要素を閉じる直前に script 要素を置いて読み込んでください. 
 * 2. ドラッグにより移動可能にしたい要素の class 属性に "movable" または "movable_rel" を
 *    追加してください. それだけで, その要素はドラッグにより移動可能になります. 
 *    なお, "movable" の場合 CSS の position プロパティが "absolute" に, "movable_rel" の場合
 *    position プロパティは "relative" になります. 
 * 3. また, 移動可能にしたい要素のどこでもドラッグ可能にするのではなく, ドラッグが有効な部分を
 *    移動可能な要素の一部だけにしたい場合, 移動可能な要素の中に class 属性に "movable_controller" を
 *    追加した要素を入れると, その部分だけがドラッグ有効となります.
 *        例) <div class="movable">
 *              <div class="movable_controller">この部分をドラッグすると移動する</div>
 *              <div>この部分をドラッグしても移動しない</div>
 *            </div>
 * 
 * == 動作確認ブラウザ ==
 * - Firefox 3.6
 * - Opera 10.50
 * - Opera 9.60
 * - Safari 4.0
 * - Internet Explorer 8
 * - Internet Explorer 7
 * - Internet Explorer 6
 */
(function() {
	// 要素の class 属性にクラス名を追加する
	var addClassName = function( elem, className ) {
		if( elem.className ) {
			if( ! elem.className.match( new RegExp("(?:^|[\\x09\\x0A\\x0D\\x20]+)" + className + "(?:$|[\\x09\\x0A\\x0D\\x20]+)") ) ) {
				elem.className = elem.className + " " + className;
			}
		} else {
			elem.className = className;
		}
	};
	// 要素の class 属性からクラス名を削除する
	// 削除したいクラス名が元々なければ何もしない
	var removeClassName = function( elem, className ) {
		if( elem.className ) {
			var classNameList = elem.className.split( /[\x09\x0A\x0D\x20]+/ );
			for( var i = 0; i < classNameList.length; i++ ) {
				if( classNameList[i] === className ) {
					classNameList.splice( i, 1 );
				}
			}
			elem.className = classNameList.join( " " );
		}
	};
	var zIndexInterval = 10;
	var movableElems = [];
	movableElems.showTheMostFront = function( elem ) {
		var index = null;
		for( var i = 0; i < this.length; i++ ) {
			if( this[i][0] === elem ) {
				index = i;
				break;
			}
		}
		if( index !== null ) {
			var tmp = this[index][1];
			for( var i = 0; i < this.length; i++ ) {
				if( index === i ) {
					this[i][1] = 100 + ( this.length - 1 ) * zIndexInterval;
					this[i][0].style.zIndex = String( this[i][1] );
					addClassName( this[i][0], "active" );
				} else if( this[i][1] > tmp ) {
					this[i][1] -= zIndexInterval;
					this[i][0].style.zIndex = String( this[i][1] );
					removeClassName( this[i][0], "active" );
				} else {
					removeClassName( this[i][0], "active" );
				}
			}
		}
	};
	// 指定した要素の子孫で、指定した class 名を持つ要素を取得する
	var getElementsByClassName = function( elem, className ) {
		var resElems = [];
		var elems = elem.getElementsByTagName("*");
		for( var i = 0; i < elems.length; i++ ) {
			var elem = elems.item(i);
			if( elem.className ) {
				var classNameList = elem.className.split( /[\x09\x0A\x0D\x20]+/ );
				for( var j = 0; j < classNameList.length; j++ ) {
					if( classNameList[j] === className ) {
						resElems.push( elem );
						break;
					}
				}
			}
		}
		return resElems;
	};
	// イベントリスナ
	var createMouseDownEventListener = function(e) {
		var elem = e;
		if( elem.addEventListener ) {
			return function(evt) {
				// テキスト選択しないように
				evt.preventDefault();
				if( ! elem._do_moving_ ) {
					elem._do_moving_ = true;
					elem._offset_x_ = elem.offsetLeft;
					elem._offset_y_ = elem.offsetTop;
					elem._page_x_   = evt.pageX;
					elem._page_y_   = evt.pageY;
					elem.style.left = "0px";
					elem.style.top  = "0px";
					elem._offset_x_ = elem._offset_x_ - elem.offsetLeft;
					elem._offset_y_ = elem._offset_y_ - elem.offsetTop;
					elem.style.left = elem._offset_x_ + "px";
					elem.style.top  = elem._offset_y_ + "px";
				}
			};
		} else if( elem.attachEvent ) {
			return function(evt) {
				evt.returnValue = false;
				if( ! elem._do_moving_ ) {
					elem._do_moving_ = true;
					elem._offset_x_ = elem.offsetLeft;
					elem._offset_y_ = elem.offsetTop;
					elem._page_x_   = document.documentElement.scrollLeft + evt.clientX;
					elem._page_y_   = document.documentElement.scrollTop  + evt.clientY;
					elem.style.left = "0px";
					elem.style.top  = "0px";
					elem._offset_x_ = elem._offset_x_ - elem.offsetLeft;
					elem._offset_y_ = elem._offset_y_ - elem.offsetTop;
					elem.style.left = elem._offset_x_ + "px";
					elem.style.top  = elem._offset_y_ + "px";
				}
			};
		} else {
			return function(evt) {
				// do nothing
			};
		}
	};
	var createMouseUpEventListener = function(e) {
		var elem = e;
		return function(evt) {
			elem._do_moving_ = false;
		};
	};
	var createMouseMoveEventListener = function(e) {
		var elem = e;
		if( elem.addEventListener ) {
			return function(evt) {
				if( elem._do_moving_ ) {
					var diffX = evt.pageX - elem._page_x_;
					var diffY = evt.pageY - elem._page_y_;
					//elem.style.left = evt.pageX + elem._offset_x_ - elem._page_x_ + "px";
					//elem.style.top  = evt.pageY + elem._offset_y_ - elem._page_y_ + "px";
					elem.style.left = elem._offset_x_ + diffX + "px";
					elem.style.top  = elem._offset_y_ + diffY + "px";
					//elem.offsetLeft = elem._offset_x_ + diffX;
				}
			};
		} else if( elem.attachEvent ) {
			return function(evt) {
				if( elem._do_moving_ ) {
					evt.returnValue = false;
					var diffX = document.documentElement.scrollLeft + evt.clientX - elem._page_x_;
					var diffY = document.documentElement.scrollTop  + evt.clientY - elem._page_y_;
					elem.style.left = elem._offset_x_ + diffX + "px";
					elem.style.top  = elem._offset_y_ + diffY + "px";
				}
			};
		} else {
			return function(evt) {
				// do nothing
			};
		}
	};
	var createMEMouseDownEventListener = function(e) {
		var elem = e;
		return function(evt) {
			movableElems.showTheMostFront( elem );
		};
	};
	// 指定した要素をドラッグにより移動可能にする
	var makeElementMovable = function( elem, stylePos ) {
		elem.style.position = stylePos;
		var tmp = [elem, 100 + movableElems.length * zIndexInterval];
		movableElems.push( tmp );
		elem.style.zIndex = String( tmp[1] );
		// コントローラー要素を取得
		var controllerElems = getElementsByClassName( elem, "movable_controller" );
		if( controllerElems.length == 0 ) { controllerElems.push( elem ); }
		// イベントリスナを追加していく
		elem._do_moving_ = false;
		if( elem.addEventListener ) {
			for( var i = 0; i < controllerElems.length; i++ ) {
				elem.addEventListener( "mousedown", createMEMouseDownEventListener(elem), false );
				controllerElems[i].addEventListener( "mousedown", createMouseDownEventListener(elem), false );
				document.addEventListener( "mouseup", createMouseUpEventListener(elem), false );
				document.addEventListener( "mousemove", createMouseMoveEventListener(elem), false );
			}
		} else if( elem.attachEvent ) {
			for( var i = 0; i < controllerElems.length; i++ ) {
				elem.attachEvent( "onmousedown", createMEMouseDownEventListener(elem) );
				controllerElems[i].attachEvent( "onmousedown", createMouseDownEventListener(elem) );
				document.attachEvent( "onmouseup", createMouseUpEventListener(elem) );
				document.attachEvent( "onmousemove", createMouseMoveEventListener(elem) );
			}
		}
	};
	var targetElems = null;
	targetElems = getElementsByClassName( document, "movable_rel" );
	for( var i = 0; i < targetElems.length; i++ ) {
		makeElementMovable( targetElems[i], "relative" );
	}
	targetElems = getElementsByClassName( document, "movable" );
	for( var i = 0; i < targetElems.length; i++ ) {
		makeElementMovable( targetElems[i], "absolute" );
	}
})();
