// ==UserScript==
// @name           bro3_fullauto_troop
// @namespace      3gokushi-autotroop
// @description    ブラウザ三国志自動出兵
// @include        http://*.3gokushi.jp/*
// @include        http://mixi.jp/run_appli.pl?id=6598
// @include        http://*.mixi-platform.com/*
// @author         原作者hatt,編集者romer,etc...
// @version        1.0.0.0
// ==/UserScript==
//
// FireFox / Google Chrome対応です。
// ver1.00.0.0 2011.06.17

//////////////////////////////////////////////////bro3_fullauto_troopの開始
var g_deck_count = 0;		//デッキにセットしている武将数
var troopflag = 0;			//出兵実行フラグ(0:出兵しない/1:出兵する)
////////////////////////////////////////////////////////////////////////////
var AUTO_EXEC_FLAG = 0;				//出兵機能起動したか(都市タブに入ったら1回実行する)	120524

var OPT_CHK_USED_SEND_TROOPS = 0; 	//出兵機能を使用するかどうか。
var OPT_ACE_SET_ID       = "";	  	//idでのace設定
var OPT_ACE_SET_NAME     = "";	  	//名前でのace設定
var OPT_CHK_NUMBER       = 0;	  	//出兵する最低討伐(ﾁｪｯｸﾎﾞｯｸｽ)
var OPT_NUMBER           = 100;	  	//出兵する最低討伐

var OPT_CHK_OUT_DECK    = 1;  		//デッキから外す最低討伐(ﾁｪｯｸﾎﾞｯｸｽ)	120528
var OPT_OUT_DECK        = 100;		//デッキから外す最低討伐			120528

var OPT_CHK_USED_ALL_SKILL   = 0; 	//スキルを使う？ 全て使用
var OPT_CHK_USED_SELECT_SKILL= 1; 	//スキルを使う？ 選んで使用
var OPT_SELECT_SKILL     = "";	  	//スキルを使う？ 選んで使用 スキルの種類

var OPT_AGENCY           = 0;	  	//出兵元 ・・・本拠地が０です

var OPT_ATTACK_1	     = 100;	  	//出兵先1 攻撃力
var OPT_TROOPER_1        = "1,1"; 	//出兵先1 騎兵
var OPT_BOW_1　　　      = "2,1"; 	//出兵先1 弓兵
var OPT_SPEAR_1          = "3,1"; 	//出兵先1 槍兵
var OPT_FOOT_1           = "4,1"; 	//出兵先1 歩兵

var OPT_ATTACK_2	     = 200;  	//出兵先2 攻撃力
var OPT_TROOPER_2        = "1,2"; 	//出兵先2 騎兵
var OPT_BOW_2　　　      = "2,2"; 	//出兵先2 弓兵
var OPT_SPEAR_2          = "3,2"; 	//出兵先2 槍兵
var OPT_FOOT_2           = "4,2"; 	//出兵先2 歩兵

var OPT_ATTACK_3	     = 300;  	//出兵先3 攻撃力
var OPT_TROOPER_3        = "1,3"; 	//出兵先3 騎兵
var OPT_BOW_3　　　      = "2,3"; 	//出兵先3 弓兵
var OPT_SPEAR_3          = "3,3"; 	//出兵先3 槍兵
var OPT_FOOT_3           = "4,3"; 	//出兵先3 歩兵

var OPT_DECK_NUM         = 2; 		//参照するデッキのページ数、2くらいで十分かと、
//var OPT_AGENCY_2         = 0; 		//出兵元はここで設定。0は本拠地となる。0が本拠地です。

var OPT_CHK_USED_BOOTCAMP = 0;		//ブートキャンプ機能を使用するかどうか
var OPT_GENERAL_NUM      = 2; 		//デッキにセットするBC対象武将をn匹までに制限する。
//120528var OPT_USED_PLACE   = "0,0"; 		//ブートキャンプで使用する場所

var OPT_CAMP_ALL_SKILL   = 0; 		//スキルを使う？ 全て使用
var OPT_CAMP_SELECT_SKILL= 1; 		//スキルを使う？ 選んで使用
var OPT_C_SELECT_SKILL   = "";		//スキルを使う？ 選んで使用 スキルの種類

var OPT_CHK_GAUGE         = 1;   	//出兵する討伐ゲージ(ﾁｪｯｸﾎﾞｯｸｽ)
var OPT_SUBJUGATION_GAUGE = 100;	//出兵する討伐ゲージ

var OPT_CHK_OUT_DECK_BC   = 1;  	//デッキから外す最低討伐(ﾁｪｯｸﾎﾞｯｸｽ)
var OPT_OUT_DECK_BC       = 0;		//デッキから外す最低討伐

var OPT_ORIGIN            = 0;	  	//出兵元
var OPT_POINT             = "0,0";	//出兵先

var OPT_CARD_ID           = "";		//ブートキャンプさせるカードID
var OPT_CARD_NAME         = "";		//ブートキャンプさせるカード名称

//随行兵隊設定
var OPT_SWORD             = 0;		//剣兵
var OPT_SPEARMAN          = 0;		//槍兵
var OPT_BOWSOL            = 0;		//弓兵
var OPT_TROOPER           = 0;		//騎兵
var OPT_ARMS_SPEARMAN     = 0;		//矛槍兵
var OPT_CROSSBOW          = 0;		//弩兵
var OPT_GUARDS            = 0;		//近衛騎兵
var OPT_CHK_SEND_TROOPS   = 0;		//上記設定値以上も、可能な限り出兵する。（車、斥侯除く）

///////////////////////////////////////////////////////////////////////////////////////


//var VERSION = "0.09";           //バージョン情報
var HOST_23 = location.hostname;	//アクセスURLホスト

// 自動出兵する鯖(ここに記載のない鯖は処理されない)
//var execTroopServers = ["m41","m3x"];
//var execTroopServers = ["m1"];

//出兵兵士の有効数取得
var troopId = [
    "infantry_count",		/*剣兵		*/
    "spear_count",			/*槍兵		*/
    "archer_count",			/*弓兵		*/
    "cavalry_count",		/*騎兵		*/
    "halbert_count",		/*矛槍兵	*/
    "crossbow_count",		/*弩兵		*/
    "cavalry_guards_count",	/*近衛騎兵	*/
    "scout_count",			/*斥候		*/
    "cavalry_scout_count",	/*斥候騎兵	*/
    "ram_count",			/*衝車		*/
    "catapult_count"		/*投石機	*/
];
var troopCount = [
    0,			/*剣兵		*/
    0,			/*槍兵		*/
    0,			/*弓兵		*/
    0,			/*騎兵		*/
    0,			/*矛槍兵	*/
    0,			/*弩兵		*/
    0,			/*近衛騎兵	*/
    0,			/*斥候		*/
    0,			/*斥候騎兵	*/
    0,			/*衝車		*/
    0			/*投石機	*/
];
var loadSkillInfoEnd = 0;
var skill_cardid = [
    ""
];
var skillID = [
    ""
];
var skillName = [
    ""
];

// 出兵元拠点、討伐ゲージ値
var troopVillageInfo = [
            ["m39",0,100],
        ];
var troopVillageInfoBC = [
            ["m39",0,100],
        ];

//スキル種類
var skillKind = [
            [""],
        ];
var skillKindBC = [
            [""],
        ];

// 出兵先アドレス
var troopAddr = [
            ["m1",        // 鯖名(攻撃力に変更)
                -288, -322, // 剣兵武将出兵先
                -288, -322, // 弓兵武将出兵先
                -288, -322, // 槍兵武将出兵先
                -288, -322  // 騎兵武将出兵先
            ],
            ["m1",        // 鯖名(攻撃力に変更)
                , , // 剣兵武将出兵先
                , , // 弓兵武将出兵先
                , , // 槍兵武将出兵先
                ,   // 騎兵武将出兵先
            ],
            ["m1",        // 鯖名(攻撃力に変更)
                -288, -322, // 剣兵武将出兵先
                -288, -322, // 弓兵武将出兵先
                -288, -322, // 槍兵武将出兵先
                -288, -322  // 騎兵武将出兵先
            ]
        ];

var troopAddrBC = [
            ["m1",        	// 鯖名(攻撃力に変更)
                -288, -322  // 騎兵武将出兵先
            ]
        ];

// デッキから外さない武将リスト
// (武将名またはカードid)
/* unDeckCardは、使用しないので削除
var unDeckCard = [
            ["m1","周瑜","張魯","夏侯惇","牛輔","黄祖","曹休"]
];
*/

//ブートキャンプさせるカード名称・ID
var bcCard = [
            ["m1","周瑜","張魯","夏侯惇","牛輔","黄祖","曹休"]
];

// 出兵しない武将リスト　Ace設定として使用
// (武将名またはカードid)
var unTroopCard = [
            ["m1","伊籍"]
//            ["m1","伊籍","張遼","孫堅","曹操","兀突骨","程普"]
];

// (武将名指定[レアリティ込は不可])
var unTroopCardName = [
//          ["m1","劉備","張遼","孫堅","曹操","兀突骨","程普"],
            ["m1","周瑜"]
];
var d_23 = document;
var $_23 = function(id) { return d_23.getElementById(id); };
var $x_23 = function(xp,dc) { return d_23.evaluate(xp, dc||d_23, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; };
var $a_23 = function(xp,dc) { var r = d_23.evaluate(xp, dc||d_23, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); var a=[]; for(var i=0; i<r.snapshotLength; i++){ a.push(r.snapshotItem(i)); } return a; };
var $e_23 = function(dc,e,f) { if (!dc) return; dc.addEventListener(e, f, false); };
var $v_23 = function(key) { return d_23.evaluate(key, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); };
var isNarrow_23 = location.host.match(/^[m|y]\d+\./i) ? true : false;
var svname_23 = location.hostname.substr(0,location.hostname.indexOf("."));

//////////////////////////////////////////////////bro3_fullauto_troopの終了

( function(){
//120620 if(document.getElementById("beyond_basepanel") ) return ;

var VERSION_NAME_23 = "ブラウザ三国志　自動出兵 Ver1.0";


//出兵機能＝武将単騎での出兵
//ブートキャンプ＝武将と、指定数又は、指定数以上の兵隊での出兵です

///////////////////////////////////////////////
//Chrome用GM_関数
// @copyright      2009, James Campos
// @license        cc-by-3.0; http://creativecommons.org/licenses/by/3.0/
if ((typeof GM_getValue == 'undefined') || (GM_getValue('a', 'b') == undefined)) {
    GM_addStyle = function(css) {
        var style = document.createElement('style');
        style.textContent = css;
        document.getElementsByTagName('head')[0].appendChild(style);
    };

    GM_deleteValue = function(name) {
        localStorage.removeItem(name);
    };

    GM_getValue = function(name, defaultValue) {
        var value = localStorage.getItem(name);
        if (!value)
            return defaultValue;
        var type = value[0];
        value = value.substring(1);
        switch (type) {
            case 'b':
                return value == 'true';
            case 'n':
                return Number(value);
            default:
                return value;
        }
    };

    GM_log = function(message) {
        if (window.opera) {
            opera.postError(message);
            return;
        }
        console.log(message);
    };

     GM_registerMenuCommand = function(name, funk) {
    //todo
    };

    GM_setValue = function(name, value) {
        value = (typeof value)[0] + value;
        localStorage.setItem(name, value);
    };
}

var g_MD;
var g_MX;
var g_MY;

if( !initPanelAt() ) return;
loadOptionsAt();	//保存ﾃﾞｰﾀ読込
disp_OptionsAt();	//自動出兵オプション設定画面のリンク設定
autoTroop();		// 拠点画面なら自動出兵処理実行

//////////////////////
//オプション処理
//////////////////////
function disp_OptionsAt()	//自動出兵オプション設定画面のリンク設定
{
    if( location.pathname != "/facility/castle_send_troop.php" ) {	//出兵
   		return ;
    }
/*Beyondと同じ場所の場合
    if( !location.pathname.match(/^(\/user\/|\/bbs\/personal_)/) ) return;

    if( location.pathname.match(/ranking\.php/) ) return;
*/
    var ul = $_23("statMenu");
    if( !ul ) return;

    var cl = d_23.createElement("a");
    cl.href = "javascript:void(0);";
    cl.innerHTML = "自動出兵";					//メニュー表示の名称
    $e_23(cl, "click", function() {openOptionsAt();});

    var li = d_23.createElement("li");
    li.appendChild(cl);
    li.className = "last";
    ul.appendChild(li);

    var lst = $x_23("//li[@class=\"last\"]");
    if( lst ) {
        lst.className = "";
    }

}

function openOptionsAt() {
    deleteOptionsHtmlAt();
    addOptionsHtmlAt();
}

function deleteOptionsHtmlAt() {
    var elem = $_23("beyond_OptionsWindow_at");
    if (!elem ) return;
    $_23("beyond_floatpanel_at").removeChild(elem);
}

//保存ﾃﾞｰﾀ読込
function loadOptionsAt()
{
    OPT_CHK_USED_SEND_TROOPS = cloadDataAt( "OPT_CHK_USED_SEND_TROOPS", OPT_CHK_USED_SEND_TROOPS ); 	//出兵機能を使用するかどうか。
	//FA_log("load OPT_CHK_USED_SEND_TROOPS="+OPT_CHK_USED_SEND_TROOPS);
    OPT_ACE_SET_ID = cloadDataAt( "OPT_ACE_SET_ID", OPT_ACE_SET_ID );									//idでのace設定
    OPT_ACE_SET_NAME = cloadDataAt( "OPT_ACE_SET_NAME", OPT_ACE_SET_NAME );     	  					//名前でのace設定
    OPT_CHK_NUMBER = cloadDataAt( "OPT_CHK_NUMBER", OPT_CHK_NUMBER );									//出兵する最低討伐(ﾁｪｯｸﾎﾞｯｸｽ)
    OPT_NUMBER = cloadDataAt( "OPT_NUMBER", OPT_NUMBER );												//出兵する最低討伐

    OPT_CHK_OUT_DECK = cloadDataAt( "OPT_CHK_OUT_DECK", OPT_CHK_OUT_DECK );     						//デッキから外す最低討伐(ﾁｪｯｸﾎﾞｯｸｽ) 120528
    OPT_OUT_DECK = cloadDataAt( "OPT_OUT_DECK", OPT_OUT_DECK );         								//デッキから外す最低討伐			120528

    OPT_CHK_USED_ALL_SKILL = cloadDataAt( "OPT_CHK_USED_ALL_SKILL", OPT_CHK_USED_ALL_SKILL ); 			//スキルを使う？ 全て使用
    OPT_CHK_USED_SELECT_SKILL = cloadDataAt( "OPT_CHK_USED_SELECT_SKILL", OPT_CHK_USED_SELECT_SKILL );	//スキルを使う？ 選んで使用
    OPT_SELECT_SKILL = cloadDataAt( "OPT_SELECT_SKILL", OPT_SELECT_SKILL );								//スキルを使う？ 選んで使用 スキルの種類
    OPT_AGENCY = cloadDataAt( "OPT_AGENCY", OPT_AGENCY );												//出兵元 ・・・本拠地が０です

    OPT_ATTACK_1 = cloadDataAt( "OPT_ATTACK_1", OPT_ATTACK_1 );		//出兵先1 攻撃力
    OPT_TROOPER_1 = cloadDataAt( "OPT_TROOPER_1", OPT_TROOPER_1 );	//出兵先1 騎兵
    OPT_BOW_1 = cloadDataAt( "OPT_BOW_1", OPT_BOW_1 );　　			//出兵先1 弓兵
    OPT_SPEAR_1 = cloadDataAt( "OPT_SPEAR_1", OPT_SPEAR_1 );  		//出兵先1 槍兵
    OPT_FOOT_1 = cloadDataAt( "OPT_FOOT_1", OPT_FOOT_1 );   		//出兵先1 歩兵

    OPT_ATTACK_2 = cloadDataAt( "OPT_ATTACK_2", OPT_ATTACK_2 );		//出兵先2 攻撃力
    OPT_TROOPER_2 = cloadDataAt( "OPT_TROOPER_2", OPT_TROOPER_2 );	//出兵先2 騎兵
    OPT_BOW_2 = cloadDataAt( "OPT_BOW_2", OPT_BOW_2 );　　			//出兵先2 弓兵
    OPT_SPEAR_2 = cloadDataAt( "OPT_SPEAR_2", OPT_SPEAR_2 );  		//出兵先2 槍兵
    OPT_FOOT_2 = cloadDataAt( "OPT_FOOT_2", OPT_FOOT_2 );   		//出兵先2 歩兵

    OPT_ATTACK_3 = cloadDataAt( "OPT_ATTACK_3", OPT_ATTACK_3 );		//出兵先3 攻撃力
    OPT_TROOPER_3 = cloadDataAt( "OPT_TROOPER_3", OPT_TROOPER_3 );	//出兵先3 騎兵
    OPT_BOW_3 = cloadDataAt( "OPT_BOW_3", OPT_BOW_3 );　　			//出兵先3 弓兵
    OPT_SPEAR_3 = cloadDataAt( "OPT_SPEAR_3", OPT_SPEAR_3 );  		//出兵先3 槍兵
    OPT_FOOT_3 = cloadDataAt( "OPT_FOOT_3", OPT_FOOT_3 );   		//出兵先3 歩兵

    OPT_DECK_NUM = cloadDataAt( "OPT_DECK_NUM", OPT_DECK_NUM );   							//参照するデッキのページ数、2くらいで十分かと、
//    OPT_AGENCY_2 = cloadDataAt( "OPT_AGENCY_2", OPT_AGENCY_2 );   							//出兵元はここで設定。0は本拠地となる。0が本拠地です。
    OPT_CHK_USED_BOOTCAMP = cloadDataAt( "OPT_CHK_USED_BOOTCAMP", OPT_CHK_USED_BOOTCAMP );	//ブートキャンプ機能を使用するかどうか
    OPT_GENERAL_NUM = cloadDataAt( "OPT_GENERAL_NUM", OPT_GENERAL_NUM );  					//デッキにセットするBC対象武将をn匹までに制限する。
//120528    OPT_USED_PLACE = cloadDataAt( "OPT_USED_PLACE", OPT_USED_PLACE );   					//ブートキャンプで使用する場所
    OPT_CAMP_ALL_SKILL = cloadDataAt( "OPT_CAMP_ALL_SKILL", OPT_CAMP_ALL_SKILL );   		//スキルを使う？ 全て使用
    OPT_CAMP_SELECT_SKILL = cloadDataAt( "OPT_CAMP_SELECT_SKILL", OPT_CAMP_SELECT_SKILL );	//スキルを使う？ 選んで使用
    OPT_C_SELECT_SKILL = cloadDataAt( "OPT_C_SELECT_SKILL", OPT_C_SELECT_SKILL );   		//スキルを使う？ 選んで使用 スキルの種類
    OPT_CHK_GAUGE = cloadDataAt( "OPT_CHK_GAUGE", OPT_CHK_GAUGE );        					//出兵する討伐ゲージ(ﾁｪｯｸﾎﾞｯｸｽ)
    OPT_SUBJUGATION_GAUGE = cloadDataAt( "OPT_SUBJUGATION_GAUGE", OPT_SUBJUGATION_GAUGE );	//出兵する討伐ゲージ
    OPT_CHK_OUT_DECK_BC = cloadDataAt( "OPT_CHK_OUT_DECK_BC", OPT_CHK_OUT_DECK_BC );     			//デッキから外す最低討伐(ﾁｪｯｸﾎﾞｯｸｽ)
    OPT_OUT_DECK_BC = cloadDataAt( "OPT_OUT_DECK_BC", OPT_OUT_DECK_BC );         					//デッキから外す最低討伐
    OPT_ORIGIN = cloadDataAt( "OPT_ORIGIN", OPT_ORIGIN );           						//出兵元
    OPT_POINT = cloadDataAt( "OPT_POINT", OPT_POINT );            							//出兵先
    OPT_CARD_ID = cloadDataAt( "OPT_CARD_ID", OPT_CARD_ID );								//ブートキャンプさせるカードID
    OPT_CARD_NAME = cloadDataAt( "OPT_CARD_NAME", OPT_CARD_NAME );							//ブートキャンプさせるカード名称

//随行兵隊設定
    OPT_SWORD = cloadDataAt( "OPT_SWORD", OPT_SWORD );            							//剣兵
    OPT_SPEARMAN = cloadDataAt( "OPT_SPEARMAN", OPT_SPEARMAN );         					//槍兵
    OPT_BOWSOL = cloadDataAt( "OPT_BOWSOL", OPT_BOWSOL );           						//弓兵
    OPT_TROOPER = cloadDataAt( "OPT_TROOPER", OPT_TROOPER );          						//騎兵
    OPT_ARMS_SPEARMAN = cloadDataAt( "OPT_ARMS_SPEARMAN", OPT_ARMS_SPEARMAN );    			//矛槍兵
    OPT_CROSSBOW = cloadDataAt( "OPT_CROSSBOW", OPT_CROSSBOW );         					//弩兵
    OPT_GUARDS = cloadDataAt( "OPT_GUARDS", OPT_GUARDS );           						//近衛騎兵
    OPT_CHK_SEND_TROOPS = cloadDataAt( "OPT_CHK_SEND_TROOPS", OPT_CHK_SEND_TROOPS );  		//上記設定値以上も、可能な限り出兵する。（車、斥侯除く）

}

//ﾃﾞｰﾀ保存
function saveOptionsAt()
{
    OPT_CHK_USED_SEND_TROOPS = cgetCheckBoxValue("OPT_CHK_USED_SEND_TROOPS");
//FA_log("cgetChck OPT_CHK_USED_SEND_TROOPS="+OPT_CHK_USED_SEND_TROOPS);
    csaveDataAt( "OPT_CHK_USED_SEND_TROOPS", OPT_CHK_USED_SEND_TROOPS );					//出兵機能を使用するかどうか。

    OPT_ACE_SET_ID = cgetTextBoxValueAt("OPT_ACE_SET_ID");
    csaveDataAt( "OPT_ACE_SET_ID", OPT_ACE_SET_ID );										//idでのace設定

    OPT_ACE_SET_NAME = cgetTextBoxValueAt("OPT_ACE_SET_NAME");
    csaveDataAt( "OPT_ACE_SET_NAME", OPT_ACE_SET_NAME );									//名前でのace設定

    OPT_CHK_NUMBER = cgetCheckBoxValue("OPT_CHK_NUMBER");
    csaveDataAt( "OPT_CHK_NUMBER", OPT_CHK_NUMBER );										//出兵する最低討伐(ﾁｪｯｸﾎﾞｯｸｽ)

    OPT_NUMBER = cgetTextBoxValueAt("OPT_NUMBER");
    csaveDataAt( "OPT_NUMBER", OPT_NUMBER );												//出兵する最低討伐

    OPT_CHK_USED_ALL_SKILL = cgetCheckBoxValue("OPT_CHK_USED_ALL_SKILL");
    csaveDataAt( "OPT_CHK_USED_ALL_SKILL", OPT_CHK_USED_ALL_SKILL );						//スキルを使う？ 全て使用

    OPT_CHK_USED_SELECT_SKILL = cgetCheckBoxValue("OPT_CHK_USED_SELECT_SKILL");
    csaveDataAt( "OPT_CHK_USED_SELECT_SKILL", OPT_CHK_USED_SELECT_SKILL );					//スキルを使う？ 選んで使用

    OPT_SELECT_SKILL = cgetTextBoxValueAt("OPT_SELECT_SKILL");
    csaveDataAt( "OPT_SELECT_SKILL", OPT_SELECT_SKILL );									//スキルを使う？ 選んで使用 スキルの種類

    OPT_AGENCY = cgetTextBoxValueAt("OPT_AGENCY");
    csaveDataAt( "OPT_AGENCY", OPT_AGENCY );           	  									//出兵元 ・・・本拠地が０です

    OPT_ATTACK_1 = cgetTextBoxValueAt("OPT_ATTACK_1");
    csaveDataAt( "OPT_ATTACK_1", OPT_ATTACK_1 );     	  									//出兵先1 攻撃力

    OPT_TROOPER_1 = cgetTextBoxValueAt("OPT_TROOPER_1");
    csaveDataAt( "OPT_TROOPER_1", OPT_TROOPER_1 );        									//出兵先1 騎兵

    OPT_BOW_1 = cgetTextBoxValueAt("OPT_BOW_1");
    csaveDataAt( "OPT_BOW_1", OPT_BOW_1 );　　　      										//出兵先1 弓兵

    OPT_SPEAR_1 = cgetTextBoxValueAt("OPT_SPEAR_1");
    csaveDataAt( "OPT_SPEAR_1", OPT_SPEAR_1 );          									//出兵先1 槍兵

    OPT_FOOT_1 = cgetTextBoxValueAt("OPT_FOOT_1");
    csaveDataAt( "OPT_FOOT_1", OPT_FOOT_1 );           										//出兵先1 歩兵

    OPT_ATTACK_2 = cgetTextBoxValueAt("OPT_ATTACK_2");
    csaveDataAt( "OPT_ATTACK_2", OPT_ATTACK_2 );	     									//出兵先2 攻撃力

    OPT_TROOPER_2 = cgetTextBoxValueAt("OPT_TROOPER_2");
    csaveDataAt( "OPT_TROOPER_2", OPT_TROOPER_2 );        									//出兵先2 騎兵

    OPT_BOW_2 = cgetTextBoxValueAt("OPT_BOW_2");
    csaveDataAt( "OPT_BOW_2", OPT_BOW_2 );　　　      										//出兵先2 弓兵

    OPT_SPEAR_2 = cgetTextBoxValueAt("OPT_SPEAR_2");
    csaveDataAt( "OPT_SPEAR_2", OPT_SPEAR_2 );          									//出兵先2 槍兵

    OPT_FOOT_2 = cgetTextBoxValueAt("OPT_FOOT_2");
    csaveDataAt( "OPT_FOOT_2", OPT_FOOT_2 );           										//出兵先2 歩兵

    OPT_ATTACK_3 = cgetTextBoxValueAt("OPT_ATTACK_3");
    csaveDataAt( "OPT_ATTACK_3", OPT_ATTACK_3 );	     									//出兵先3 攻撃力

    OPT_TROOPER_3 = cgetTextBoxValueAt("OPT_TROOPER_3");
    csaveDataAt( "OPT_TROOPER_3", OPT_TROOPER_3 );        									//出兵先3 騎兵

    OPT_BOW_3 = cgetTextBoxValueAt("OPT_BOW_3");
    csaveDataAt( "OPT_BOW_3", OPT_BOW_3 );　　　      										//出兵先3 弓兵

    OPT_SPEAR_3 = cgetTextBoxValueAt("OPT_SPEAR_3");
    csaveDataAt( "OPT_SPEAR_3", OPT_SPEAR_3 );          									//出兵先3 槍兵

    OPT_FOOT_3 = cgetTextBoxValueAt("OPT_FOOT_3");
    csaveDataAt( "OPT_FOOT_3", OPT_FOOT_3 );           										//出兵先3 歩兵

    OPT_DECK_NUM = cgetTextBoxValueAt("OPT_DECK_NUM");
    csaveDataAt( "OPT_DECK_NUM", OPT_DECK_NUM );         									//参照するデッキのページ数、2くらいで十分かと、

//    OPT_AGENCY_2 = cgetTextBoxValueAt("OPT_AGENCY_2");
//    csaveDataAt( "OPT_AGENCY_2", OPT_AGENCY_2 );         									//出兵元はここで設定。0は本拠地となる。0が本拠地です。

    OPT_CHK_USED_BOOTCAMP = cgetCheckBoxValue("OPT_CHK_USED_BOOTCAMP");
    csaveDataAt( "OPT_CHK_USED_BOOTCAMP", OPT_CHK_USED_BOOTCAMP );							//ブートキャンプ機能を使用するかどうか

    OPT_GENERAL_NUM = cgetTextBoxValueAt("OPT_GENERAL_NUM");
    csaveDataAt( "OPT_GENERAL_NUM", OPT_GENERAL_NUM );										//デッキにセットするBC対象武将をn匹までに制限する。

//120528    OPT_USED_PLACE = cgetTextBoxValueAt("OPT_USED_PLACE");
//120528    csaveDataAt( "OPT_USED_PLACE", OPT_USED_PLACE );								//ブートキャンプで使用する場所

    OPT_CAMP_ALL_SKILL = cgetCheckBoxValue("OPT_CAMP_ALL_SKILL");
    csaveDataAt( "OPT_CAMP_ALL_SKILL", OPT_CAMP_ALL_SKILL );								//スキルを使う？ 全て使用

    OPT_CAMP_SELECT_SKILL = cgetCheckBoxValue("OPT_CAMP_SELECT_SKILL");
    csaveDataAt( "OPT_CAMP_SELECT_SKILL", OPT_CAMP_SELECT_SKILL );							//スキルを使う？ 選んで使用

    OPT_C_SELECT_SKILL = cgetTextBoxValueAt("OPT_C_SELECT_SKILL");
    csaveDataAt( "OPT_C_SELECT_SKILL", OPT_C_SELECT_SKILL );								//スキルを使う？ 選んで使用 スキルの種類

    OPT_CHK_GAUGE = cgetCheckBoxValue("OPT_CHK_GAUGE");
    csaveDataAt( "OPT_CHK_GAUGE", OPT_CHK_GAUGE );											//出兵する討伐ゲージ(ﾁｪｯｸﾎﾞｯｸｽ)

    OPT_SUBJUGATION_GAUGE = cgetTextBoxValueAt("OPT_SUBJUGATION_GAUGE");
    csaveDataAt( "OPT_SUBJUGATION_GAUGE", OPT_SUBJUGATION_GAUGE );							//出兵する討伐ゲージ

    OPT_CHK_OUT_DECK = cgetCheckBoxValue("OPT_CHK_OUT_DECK");
    csaveDataAt( "OPT_CHK_OUT_DECK", OPT_CHK_OUT_DECK );									//デッキから外す最低討伐(ﾁｪｯｸﾎﾞｯｸｽ)

    OPT_CHK_OUT_DECK_BC = cgetCheckBoxValue("OPT_CHK_OUT_DECK_BC");
    csaveDataAt( "OPT_CHK_OUT_DECK_BC", OPT_CHK_OUT_DECK_BC );								//デッキから外す最低討伐(ﾁｪｯｸﾎﾞｯｸｽ)

    OPT_OUT_DECK = cgetTextBoxValueAt("OPT_OUT_DECK");										//120528
    csaveDataAt( "OPT_OUT_DECK", OPT_OUT_DECK );											//デッキから外す最低討伐120528

    OPT_OUT_DECK_BC = cgetTextBoxValueAt("OPT_OUT_DECK_BC");
    csaveDataAt( "OPT_OUT_DECK_BC", OPT_OUT_DECK_BC );										//デッキから外す最低討伐

    OPT_ORIGIN = cgetTextBoxValueAt("OPT_ORIGIN");
    csaveDataAt( "OPT_ORIGIN", OPT_ORIGIN );												//出兵元

    OPT_POINT = cgetTextBoxValueAt("OPT_POINT");
    csaveDataAt( "OPT_POINT", OPT_POINT );													//出兵先

    OPT_CARD_ID = cgetTextBoxValueAt("OPT_CARD_ID");
    csaveDataAt( "OPT_CARD_ID", OPT_CARD_ID );												//ブートキャンプさせるカードID

    OPT_CARD_NAME = cgetTextBoxValueAt("OPT_CARD_NAME");
    csaveDataAt( "OPT_CARD_NAME", OPT_CARD_NAME );											//ブートキャンプさせるカード名称

//随行兵隊設定
    OPT_SWORD = cgetTextBoxValueAt("OPT_SWORD");
    csaveDataAt( "OPT_SWORD", OPT_SWORD );													//剣兵

    OPT_SPEARMAN = cgetTextBoxValueAt("OPT_SPEARMAN");
    csaveDataAt( "OPT_SPEARMAN", OPT_SPEARMAN );											//槍兵

    OPT_BOWSOL = cgetTextBoxValueAt("OPT_BOWSOL");
    csaveDataAt( "OPT_BOWSOL", OPT_BOWSOL );												//弓兵

    OPT_TROOPER = cgetTextBoxValueAt("OPT_TROOPER");
    csaveDataAt( "OPT_TROOPER", OPT_TROOPER );												//騎兵

    OPT_ARMS_SPEARMAN = cgetTextBoxValueAt("OPT_ARMS_SPEARMAN");
    csaveDataAt( "OPT_ARMS_SPEARMAN", OPT_ARMS_SPEARMAN );									//矛槍兵

    OPT_CROSSBOW = cgetTextBoxValueAt("OPT_CROSSBOW");
    csaveDataAt( "OPT_CROSSBOW", OPT_CROSSBOW );											//弩兵

    OPT_GUARDS = cgetTextBoxValueAt("OPT_GUARDS");
    csaveDataAt( "OPT_GUARDS", OPT_GUARDS );												//近衛騎兵

    OPT_CHK_SEND_TROOPS = cgetCheckBoxValue("OPT_CHK_SEND_TROOPS");
    csaveDataAt( "OPT_CHK_SEND_TROOPS", OPT_CHK_SEND_TROOPS );								//上記設定値以上も、可能な限り出兵する。（車、斥侯除く）

    alert("設定を保存しました");
}

//////////////////////
//ベースパネル初期化
//////////////////////
function initPanelAt()
{
    var panelBox = $_23("sidebar");
    if (isNarrow_23) {
        var panelBoxWrapper = $x_23('id("wrapper")');

        if (!panelBoxWrapper) return false;

        panelBox = d_23.createElement("div");
        panelBox.id = "sidebar";
        //panelBox.style.width = "auto";
        panelBox.style.cssFloat = "left";
        panelBox.style.marginTop = "10px";

        panelBoxWrapper.appendChild(panelBox);
    }

    if( !panelBox ) return false;


    var basepanel = d_23.createElement("div");
    basepanel.id = "beyond_basepanel";

    var fixpanel = d_23.createElement("div");
    fixpanel.id = "beyond_fixpanel";
    var floatpanel = d_23.createElement("div");
    floatpanel.id = "beyond_floatpanel_at";
    var tmppanel = d_23.createElement("div");
    tmppanel.id = "beyond_tmp";
    tmppanel.style.display = "none";

    basepanel.appendChild(fixpanel);
    basepanel.appendChild(floatpanel);
    basepanel.appendChild(tmppanel);

    panelBox.appendChild(basepanel);

    return true;
}

function addOptionsHtmlAt() {

    var oc = d_23.createElement("div");
    oc.id = "beyond_OptionsWindow_at";
    oc.style.position = "absolute";
    oc.style.backgroundColor = "#999";
    oc.style.backgroundColor = "#c6c7c6";
    oc.style.border = "outset 2px #ccc";
//    oc.style.fontSize = "12px";
    oc.style.fontSize = "9.5px";
    oc.style.padding = "15px";
    oc.style.zIndex = 1000000;

    var x = cloadDataAt("config_window_x_at", 10);
    var y = cloadDataAt("config_window_y_at", 80);

    if(x < 0) x = 0;
    if(y < 0) y = 0;
    oc.style.left = x + "px";
    oc.style.top = y + "px";

    oc.style.left = "0px";
    oc.style.top = "0px";

    $e_23(oc, "mousedown", function(event){
                if( event.target != $_23("beyond_OptionsWindow_at")) {return false;}
                g_MD="beyond_OptionsWindow_at";
                g_MX=event.pageX-parseInt(this.style.left,10);
                g_MY=event.pageY-parseInt(this.style.top,10);
                event.preventDefault();});

    $e_23(d_23, "mousemove", function(event){
                if(g_MD != "beyond_OptionsWindow_at") return true;
                var oc = $_23("beyond_OptionsWindow_at");
                if( !oc ) return true;
                var x = event.pageX - g_MX;
                var y = event.pageY - g_MY;
                oc.style.left = x + "px";
                oc.style.top = y + "px";
                csaveDataAt("config_window_x_at", x);
                csaveDataAt("config_window_y_at", y);
                });

    $e_23(d_23, "mouseup", function(event){g_MD="";});

    var tx = d_23.createElement("div");

    var ah = d_23.createElement("a");
    ah.href = "http://www45.atwiki.jp/hasekun/pages/67.html";
    tx.title = ah.href;
    ah.target = "_blank";
    ah.appendChild(d_23.createTextNode(VERSION_NAME_23));
    tx.appendChild(ah);
    tx.style.padding = "4px";
    tx.style.fontSize = "10px";
    tx.style.color = "steelblue";
    oc.appendChild(tx);

    $_23("beyond_floatpanel_at").appendChild(oc);

//ﾒﾆｭｰ設定開始_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

	var tbl = d_23.createElement("table");
    tbl.style.border ="0px";
//	tbl.setAttribute('border','1');	//faraway罫線120528
    
	var tbody = d_23.createElement('tbody');
	tbl.appendChild(tbody);

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

	var tr = d_23.createElement('tr');
  	tbody.appendChild(tr);  

    var td1 = d_23.createElement("td");
    //td1.style.padding = "15px";
//	td1.style.fontSize = "9px";//faraway
    //td1.style.verticalAlign = "top";

    var td2 = d_23.createElement("td");
    //td2.style.padding = "15px";
    //td2.style.verticalAlign = "top";

    var td3 = d_23.createElement("td");
    //td3.style.padding = "15px";
    //td3.style.verticalAlign = "top";

    var td4 = d_23.createElement("td");
    //td4.style.padding = "15px";
    //td4.style.verticalAlign = "top";

    var td5 = d_23.createElement("td");
    //td5.style.padding = "15px";
    //td5.style.verticalAlign = "top";

    var td6 = d_23.createElement("td");
    //td6.style.padding = "15px";
    //td6.style.verticalAlign = "top";

    var td7 = d_23.createElement("td");
    //td7.style.padding = "15px";
    //td7.style.verticalAlign = "top";

    var td8 = d_23.createElement("td");
    //td8.style.padding = "15px";
    //td8.style.verticalAlign = "top";

    var td9 = d_23.createElement("td");
    //td9.style.padding = "15px";
    //td9.style.verticalAlign = "top";

    var td10 = d_23.createElement("td");
    //td10.style.padding = "15px";
    //td10.style.verticalAlign = "top";

//======================================================================================================
	td1.innerHTML = "出兵機能設定部分";
	td1.setAttribute('colSpan','9');
	td1.width="410";//400//346;//410

	td2.innerHTML = "ブートキャンプ設定";
	td2.setAttribute('colSpan','7');
	td2.width="346";//346;//222;//"500";

    tr.appendChild(td1);
    tr.appendChild(td2);

//======================================================================================================
  	var tr1 = d_23.createElement('tr');
  	tbody.appendChild(tr1);  

    var td11 = d_23.createElement("td");
    var td21 = d_23.createElement("td");

	td11.innerHTML = "表示方法を、「HP:降」「討伐:降」「攻撃:降」「15枚表示」";
	td11.setAttribute('colSpan','9');
    ccreateCheckBox(td21, "OPT_CHK_USED_BOOTCAMP", OPT_CHK_USED_BOOTCAMP, "ブートキャンプ機能を使用するかどうか。","",0);
	td21.setAttribute('colSpan','7');

    tr1.appendChild(td11);
    tr1.appendChild(td21);

//======================================================================================================
  	var tr2 = d_23.createElement('tr');
  	tbody.appendChild(tr2);  

    var td12 = d_23.createElement("td");
    var td22 = d_23.createElement("td");

    ccreateCheckBox(td12, "OPT_CHK_USED_SEND_TROOPS", OPT_CHK_USED_SEND_TROOPS, "出兵機能を使用するかどうか。","",0);
	td12.setAttribute('colSpan','9');
	td22.innerHTML = "デッキにセットするBC対象武将をn匹までに制限する。<BR>（待機中のみに摘要；1だと出兵1、待機1）";
	td22.setAttribute('colSpan','7');

    tr2.appendChild(td12);
    tr2.appendChild(td22);

//======================================================================================================
  	var tr3 = d_23.createElement('tr');
  	tbody.appendChild(tr3);  

    var td13 = d_23.createElement("td");
    var td23 = d_23.createElement("td");
    var td33 = d_23.createElement("td");
    var td43 = d_23.createElement("td");

	td13.innerHTML = "Aceの設定方法";
	td13.setAttribute('colSpan','9');
	td23.innerHTML = "0だと無制限にセット。";
	td23.setAttribute('colSpan','2');
	//td23.width=170;
    ccreateTextBox(td33, "OPT_GENERAL_NUM", OPT_GENERAL_NUM, "( ","",1,0);
	td33.width=36;
	td43.innerHTML = ")";
	//td43.width=8;

    tr3.appendChild(td13);
    tr3.appendChild(td23);
    tr3.appendChild(td33);
    tr3.appendChild(td43);

//======================================================================================================
  	var tr4 = d_23.createElement('tr');
  	tbody.appendChild(tr4);  

    var td14 = d_23.createElement("td");
    var td24 = d_23.createElement("td");
    var td34 = d_23.createElement("td");
    var td44 = d_23.createElement("td");
    var td54 = d_23.createElement("td");
    var td64 = d_23.createElement("td");
    var td74 = d_23.createElement("td");

	td14.innerHTML = "idでのace設定     =  ";
	td14.setAttribute('colSpan','4');
	ccreateTextBox(td24, "OPT_ACE_SET_ID", OPT_ACE_SET_ID, "( ","",30,0);
	td24.setAttribute('colSpan','3');
	td34.innerHTML = ")";
	td44.innerHTML = "";
//120528	td54.innerHTML = "ブートキャンプで使用する場所";
//120528	td54.setAttribute('colSpan','3');
//120528	ccreateTextBox(td64, "OPT_USED_PLACE", OPT_USED_PLACE, "( ","",5,0);
//120528	td74.innerHTML = ")";

    tr4.appendChild(td14);
    tr4.appendChild(td24);
    tr4.appendChild(td34);
    tr4.appendChild(td44);
    tr4.appendChild(td54);
    tr4.appendChild(td64);
    tr4.appendChild(td74);

//======================================================================================================
  	var tr5 = d_23.createElement('tr');
  	tbody.appendChild(tr5);  

    var td15 = d_23.createElement("td");
    var td25 = d_23.createElement("td");
    var td35 = d_23.createElement("td");
    var td45 = d_23.createElement("td");
    var td55 = d_23.createElement("td");
    var td65 = d_23.createElement("td");

	td15.innerHTML = "名前でのace設定     =  ";
	td15.setAttribute('colSpan','4');
	ccreateTextBox(td25, "OPT_ACE_SET_NAME", OPT_ACE_SET_NAME, "( ","",30,0);
	td25.setAttribute('colSpan','3');
	td35.innerHTML = ")";
	td45.innerHTML = "";

//	td55.innerHTML = "スキルを使う？";
	//td55.setAttribute('colSpan','3');
//    ccreateCheckBox(td65, "OPT_CAMP_ALL_SKILL", OPT_CAMP_ALL_SKILL, "全て使用","",0);
//	td65.setAttribute('colSpan','2');

    tr5.appendChild(td15);
    tr5.appendChild(td25);
    tr5.appendChild(td35);
    tr5.appendChild(td45);
    tr5.appendChild(td55);
    tr5.appendChild(td65);

//======================================================================================================
  	var tr5 = d_23.createElement('tr');
  	tbody.appendChild(tr5);  

    var td15 = d_23.createElement("td");
    var td25 = d_23.createElement("td");
    var td35 = d_23.createElement("td");
    var td45 = d_23.createElement("td");
    var td55 = d_23.createElement("td");
    var td65 = d_23.createElement("td");
    var td75 = d_23.createElement("td");
    var td85 = d_23.createElement("td");
    var td95 = d_23.createElement("td");
    var td105 = d_23.createElement("td");

	ccreateCheckBox(td15, "OPT_CHK_NUMBER", OPT_CHK_NUMBER, "出兵する最低討伐     =  ","",0);
	td15.setAttribute('colSpan','5');
	ccreateTextBox(td25, "OPT_NUMBER", OPT_NUMBER, "(  ","",5,0);
	td35.innerHTML = ")";
	td45.innerHTML = "";
	td55.innerHTML = "";
	//td65.innerHTML = "";
	//td75.innerHTML = "";
	ccreateCheckBox(td75, "OPT_CHK_GAUGE", OPT_CHK_GAUGE, "出兵する討伐ゲージ　　=","",0);
	td75.setAttribute('colSpan','3');
	ccreateTextBox(td85, "OPT_SUBJUGATION_GAUGE", OPT_SUBJUGATION_GAUGE, "( ","",5,0);
	td85.width=56;
	td95.innerHTML = ")";

	//td75.setAttribute('colSpan','2');
//    ccreateCheckBox(td85, "OPT_CAMP_SELECT_SKILL", OPT_CAMP_SELECT_SKILL, "選んで使用","",1);
//	td85.setAttribute('colSpan','2');
//	ccreateTextBox(td95, "OPT_C_SELECT_SKILL", OPT_C_SELECT_SKILL, "( ","",20,0);
//	td95.setAttribute('colSpan','3');
//	td105.innerHTML = ")";

    tr5.appendChild(td15);
    tr5.appendChild(td25);
    tr5.appendChild(td35);
    tr5.appendChild(td45);
    tr5.appendChild(td55);
    //tr5.appendChild(td65);
    tr5.appendChild(td75);
    tr5.appendChild(td85);
    tr5.appendChild(td95);
    //tr5.appendChild(td105);

//======================================================================================================
//======================================================================================================120530 start
  	var tr5 = d_23.createElement('tr');
  	tbody.appendChild(tr5);  

    var td15 = d_23.createElement("td");
    var td25 = d_23.createElement("td");
    var td35 = d_23.createElement("td");
    var td45 = d_23.createElement("td");
    var td55 = d_23.createElement("td");
    var td65 = d_23.createElement("td");
    var td75 = d_23.createElement("td");
    var td85 = d_23.createElement("td");
    var td95 = d_23.createElement("td");
    var td105 = d_23.createElement("td");

	ccreateCheckBox(td15, "OPT_CHK_OUT_DECK", OPT_CHK_OUT_DECK, "デッキから外す最低討伐　　=","",0);	//120528 start
	td15.setAttribute('colSpan','5');
	ccreateTextBox(td25, "OPT_OUT_DECK", OPT_OUT_DECK, "( ","",5,0);
	td35.innerHTML = ")";																				//120528 end
	td45.innerHTML = "";
	td55.innerHTML = "";
	ccreateCheckBox(td65, "OPT_CHK_OUT_DECK_BC", OPT_CHK_OUT_DECK_BC, "デッキから外す最低討伐　　=","",0);
	td65.setAttribute('colSpan','3');
	ccreateTextBox(td75, "OPT_OUT_DECK_BC", OPT_OUT_DECK_BC, "( ","",5,0);
	td85.innerHTML = ")";

//	td65.innerHTML = "";
//	td75.innerHTML = "";
//	td85.innerHTML = "";
	td95.innerHTML = "";
	td105.innerHTML = "";

    tr5.appendChild(td15);
    tr5.appendChild(td25);
    tr5.appendChild(td35);
    tr5.appendChild(td45);
    tr5.appendChild(td55);
    tr5.appendChild(td65);
    tr5.appendChild(td75);
    tr5.appendChild(td85);
    //tr5.appendChild(td95);
    //tr5.appendChild(td105);

//======================================================================================================120530 end
//======================================================================================================
  	var tr5 = d_23.createElement('tr');
  	tbody.appendChild(tr5);  

    var td15 = d_23.createElement("td");
    var td25 = d_23.createElement("td");
    var td35 = d_23.createElement("td");
    var td45 = d_23.createElement("td");
    var td55 = d_23.createElement("td");
    var td65 = d_23.createElement("td");
    var td75 = d_23.createElement("td");
    var td85 = d_23.createElement("td");
    var td95 = d_23.createElement("td");

	td15.innerHTML = "スキルを使う？";
	td15.setAttribute('colSpan','4');
	ccreateCheckBox(td25, "OPT_CHK_USED_ALL_SKILL", OPT_CHK_USED_ALL_SKILL, "全て使用","",0);
	td35.innerHTML = "";
	td45.innerHTML = "";
	td55.innerHTML = "";
	td65.innerHTML = "";
	td75.innerHTML = "スキルを使う？";
//	td75.setAttribute('colSpan','2');
	td75.width=120-30;
    ccreateCheckBox(td85, "OPT_CAMP_ALL_SKILL", OPT_CAMP_ALL_SKILL, "全て使用","",0);
	td85.setAttribute('colSpan','2');
	//td85.width=100;


	//ccreateCheckBox(td75, "OPT_CHK_GAUGE", OPT_CHK_GAUGE, "出兵する討伐ゲージ　　=","",0);
	//td75.setAttribute('colSpan','3');
	//ccreateTextBox(td85, "OPT_SUBJUGATION_GAUGE", OPT_SUBJUGATION_GAUGE, "( ","",5,0);
	//td95.innerHTML = ")";

    tr5.appendChild(td15);
    tr5.appendChild(td25);
    tr5.appendChild(td35);
    tr5.appendChild(td45);
    tr5.appendChild(td55);
    tr5.appendChild(td65);
    tr5.appendChild(td75);
    tr5.appendChild(td85);
    //tr5.appendChild(td95);

//======================================================================================================
  	var tr5 = d_23.createElement('tr');
  	tbody.appendChild(tr5);  

    var td15 = d_23.createElement("td");
    var td25 = d_23.createElement("td");
    var td35 = d_23.createElement("td");
    var td45 = d_23.createElement("td");
    var td55 = d_23.createElement("td");
    var td65 = d_23.createElement("td");
    var td75 = d_23.createElement("td");
    var td85 = d_23.createElement("td");
    var td95 = d_23.createElement("td");

	td15.innerHTML = "";
	td15.setAttribute('colSpan','4');
	ccreateCheckBox(td25, "OPT_CHK_USED_SELECT_SKILL", OPT_CHK_USED_SELECT_SKILL, "選んで使用","",0);
	td25.setAttribute('colSpan','2');
	ccreateTextBox(td35, "OPT_SELECT_SKILL", OPT_SELECT_SKILL, "( ","",18,0);
	td35.setAttribute('colSpan','2');
	td45.innerHTML = ")";
	td55.innerHTML = "";
	//td65.innerHTML = "";
    ccreateCheckBox(td75, "OPT_CAMP_SELECT_SKILL", OPT_CAMP_SELECT_SKILL, "選んで使用","",1);
	td75.setAttribute('colSpan','2');
	//td75.width=80;
	ccreateTextBox(td85, "OPT_C_SELECT_SKILL", OPT_C_SELECT_SKILL, "( ","",18,0);
	td85.setAttribute('colSpan','2');
	//td85.width=180;
	td95.innerHTML = ")";
//120530	ccreateCheckBox(td65, "OPT_CHK_OUT_DECK_BC", OPT_CHK_OUT_DECK_BC, "デッキから外す最低討伐　　=","",0);
//120530	td65.setAttribute('colSpan','3');
//120530	ccreateTextBox(td75, "OPT_OUT_DECK_BC", OPT_OUT_DECK_BC, "( ","",5,0);
//120530	td85.innerHTML = ")";

    tr5.appendChild(td15);
    tr5.appendChild(td25);
    tr5.appendChild(td35);
    tr5.appendChild(td45);
    tr5.appendChild(td55);
    //tr5.appendChild(td65);
    tr5.appendChild(td75);
    tr5.appendChild(td85);
    tr5.appendChild(td95);

//======================================================================================================
  	var tr5 = d_23.createElement('tr');
  	tbody.appendChild(tr5);  

    var td15 = d_23.createElement("td");
    var td25 = d_23.createElement("td");
    var td35 = d_23.createElement("td");
    var td45 = d_23.createElement("td");
    var td55 = d_23.createElement("td");
    var td65 = d_23.createElement("td");
    var td75 = d_23.createElement("td");
    var td85 = d_23.createElement("td");

	td15.innerHTML = "出兵元     =  ";
	td15.setAttribute('colSpan','4');
	ccreateTextBox(td25, "OPT_AGENCY", OPT_AGENCY, "( ","",5,0);
	td35.innerHTML = ")・・・本拠地が０です";
	td35.setAttribute('colSpan','2');
	td45.innerHTML = "";
	td55.innerHTML = "";
	//td65.innerHTML = "";
	td65.innerHTML = "　出兵元　=　";
	//td65.setAttribute('colSpan','2');
	ccreateTextBox(td75, "OPT_ORIGIN", OPT_ORIGIN, "(","",5,0);
	//td75.setAttribute('colSpan','2');
	td75.width=56;
	td85.innerHTML = ")";

    tr5.appendChild(td15);
    tr5.appendChild(td25);
    tr5.appendChild(td35);
    tr5.appendChild(td45);
    tr5.appendChild(td55);
    tr5.appendChild(td65);
    tr5.appendChild(td75);
    tr5.appendChild(td85);

//======================================================================================================
  	var tr5 = d_23.createElement('tr');
  	tbody.appendChild(tr5);  

    var td15 = d_23.createElement("td");
    var td25 = d_23.createElement("td");
    var td35 = d_23.createElement("td");
    var td45 = d_23.createElement("td");
    var td55 = d_23.createElement("td");
    var td65 = d_23.createElement("td");
    var td75 = d_23.createElement("td");
    var td85 = d_23.createElement("td");
    var td95 = d_23.createElement("td");
    var td105 = d_23.createElement("td");

	td15.innerHTML = "";
	td15.setAttribute('colSpan','3');
	td25.innerHTML = "　　攻撃力";
	td35.innerHTML = "　　騎兵";
	td45.innerHTML = "　　弓兵";
	td55.innerHTML = "　　槍兵";
	td65.innerHTML = "　　歩兵";
	td75.innerHTML = "";
	td85.innerHTML = "　出兵先　=　";
	//td85.setAttribute('colSpan','2');
	ccreateTextBox(td95, "OPT_POINT", OPT_POINT, "(","",5,0);
	//td95.setAttribute('colSpan','2');
	td105.innerHTML = ")";

    tr5.appendChild(td15);
    tr5.appendChild(td25);
    tr5.appendChild(td35);
    tr5.appendChild(td45);
    tr5.appendChild(td55);
    tr5.appendChild(td65);
    tr5.appendChild(td75);
    tr5.appendChild(td85);
    tr5.appendChild(td95);
    tr5.appendChild(td105);

//======================================================================================================
  	var tr5 = d_23.createElement('tr');
  	tbody.appendChild(tr5);  

    var td15 = d_23.createElement("td");
    var td25 = d_23.createElement("td");
    var td35 = d_23.createElement("td");
    var td45 = d_23.createElement("td");
    var td55 = d_23.createElement("td");
    var td65 = d_23.createElement("td");
    var td75 = d_23.createElement("td");
    var td85 = d_23.createElement("td");
    var td95 = d_23.createElement("td");
    var td105 = d_23.createElement("td");

	td15.innerHTML = "出兵先1     =  ";
	td15.setAttribute('colSpan','3');
	td15.width=70;
	ccreateTextBox(td25, "OPT_ATTACK_1", OPT_ATTACK_1, "( ","",5,0);
	ccreateTextBox(td35, "OPT_TROOPER_1", OPT_TROOPER_1, ")( ","",5,0);
	ccreateTextBox(td45, "OPT_BOW_1", OPT_BOW_1, ")( ","",5,0);
	ccreateTextBox(td55, "OPT_SPEAR_1", OPT_SPEAR_1, ")( ","",5,0);
	ccreateTextBox(td65, "OPT_FOOT_1", OPT_FOOT_1, ")( ","",5,0);

	td75.innerHTML = ")";
	td85.innerHTML = "　ブートキャンプさせるカードID　 = ";
	td85.setAttribute('colSpan','3');
	td85.width=160;
	ccreateTextBox(td95, "OPT_CARD_ID", OPT_CARD_ID, "( ","",18,0);
	td95.setAttribute('colSpan','2');
	//td95.width=200;
	td105.innerHTML = ")";

    tr5.appendChild(td15);
    tr5.appendChild(td25);
    tr5.appendChild(td35);
    tr5.appendChild(td45);
    tr5.appendChild(td55);
    tr5.appendChild(td65);
    tr5.appendChild(td75);
    tr5.appendChild(td85);
    tr5.appendChild(td95);
    tr5.appendChild(td105);

//======================================================================================================
  	var tr5 = d_23.createElement('tr');
  	tbody.appendChild(tr5);  

    var td15 = d_23.createElement("td");
    var td25 = d_23.createElement("td");
    var td35 = d_23.createElement("td");
    var td45 = d_23.createElement("td");
    var td55 = d_23.createElement("td");
    var td65 = d_23.createElement("td");
    var td75 = d_23.createElement("td");
    var td85 = d_23.createElement("td");
    var td95 = d_23.createElement("td");
    var td105 = d_23.createElement("td");

	td15.innerHTML = "出兵先2    =  ";
	td15.setAttribute('colSpan','3');
	ccreateTextBox(td25, "OPT_ATTACK_2", OPT_ATTACK_2, "( ","",5,0);
	ccreateTextBox(td35, "OPT_TROOPER_2", OPT_TROOPER_2, ")( ","",5,0);
	ccreateTextBox(td45, "OPT_BOW_2", OPT_BOW_2, ")( ","",5,0);
	ccreateTextBox(td55, "OPT_SPEAR_2", OPT_SPEAR_2, ")( ","",5,0);
	ccreateTextBox(td65, "OPT_FOOT_2", OPT_FOOT_2, ")( ","",5,0);
	td75.innerHTML = ")";
	td85.innerHTML = "　ブートキャンプさせるカード名称 = ";
	td85.setAttribute('colSpan','3');
	ccreateTextBox(td95, "OPT_CARD_NAME", OPT_CARD_NAME, "( ","",18,0);
	td95.setAttribute('colSpan','2');
	td105.innerHTML = ")";

    tr5.appendChild(td15);
    tr5.appendChild(td25);
    tr5.appendChild(td35);
    tr5.appendChild(td45);
    tr5.appendChild(td55);
    tr5.appendChild(td65);
    tr5.appendChild(td75);
    tr5.appendChild(td85);
    tr5.appendChild(td95);
    tr5.appendChild(td105);

//======================================================================================================
  	var tr5 = d_23.createElement('tr');
  	tbody.appendChild(tr5);  

    var td15 = d_23.createElement("td");
    var td25 = d_23.createElement("td");
    var td35 = d_23.createElement("td");
    var td45 = d_23.createElement("td");
    var td55 = d_23.createElement("td");
    var td65 = d_23.createElement("td");
    var td75 = d_23.createElement("td");
    var td85 = d_23.createElement("td");

	td15.innerHTML = "出兵先3    =  ";
	td15.setAttribute('colSpan','3');
	ccreateTextBox(td25, "OPT_ATTACK_3", OPT_ATTACK_3, "( ","",5,0);
	ccreateTextBox(td35, "OPT_TROOPER_3", OPT_TROOPER_3, ")( ","",5,0);
	ccreateTextBox(td45, "OPT_BOW_3", OPT_BOW_3, ")( ","",5,0);
	ccreateTextBox(td55, "OPT_SPEAR_3", OPT_SPEAR_3, ")( ","",5,0);
	ccreateTextBox(td65, "OPT_FOOT_3", OPT_FOOT_3, ")( ","",5,0);
	td75.innerHTML = ")";
	td85.innerHTML = "　随行兵隊設定";
	td85.setAttribute('colSpan','3');

    tr5.appendChild(td15);
    tr5.appendChild(td25);
    tr5.appendChild(td35);
    tr5.appendChild(td45);
    tr5.appendChild(td55);
    tr5.appendChild(td65);
    tr5.appendChild(td75);
    tr5.appendChild(td85);

//======================================================================================================
/*罫線
var link = document.createElement('link');
with(link){
href=file;
type='text/css';
rel='stylesheet';

}
var head = document.getElementsByTagName('head');
head.item(0).appendChild(link);
*/

  	var tr5 = d_23.createElement('tr');
  	tbody.appendChild(tr5);  

    var td15 = d_23.createElement("td");
    var td25 = d_23.createElement("td");
    var td35 = d_23.createElement("td");
    var td45 = d_23.createElement("td");
    var td55 = d_23.createElement("td");
    var td65 = d_23.createElement("td");
    var td75 = d_23.createElement("td");

	td15.innerHTML = "参照するデッキのページ数、2くらいで十分かと、";
	td15.setAttribute('colSpan','5');
	ccreateTextBox(td25, "OPT_DECK_NUM", OPT_DECK_NUM, "( ","",5,0);
	td35.innerHTML = ")";
	td35.setAttribute('colSpan','3');
	//td45.innerHTML = "";
	td55.innerHTML = "　剣兵 =　";
	ccreateTextBox(td65, "OPT_SWORD", OPT_SWORD, "(","",5,0);
	//td65.setAttribute('colSpan','2');
	//td65.width = 60;	//11列 (□
	td75.innerHTML = ")";

    tr5.appendChild(td15);
    tr5.appendChild(td25);
    tr5.appendChild(td35);
    //tr5.appendChild(td45);
    tr5.appendChild(td55);
    tr5.appendChild(td65);
    tr5.appendChild(td75);

//======================================================================================================
  	var tr5 = d_23.createElement('tr');
  	tbody.appendChild(tr5);  

    var td15 = d_23.createElement("td");
    var td25 = d_23.createElement("td");
    var td35 = d_23.createElement("td");
    var td45 = d_23.createElement("td");
    var td55 = d_23.createElement("td");
    var td65 = d_23.createElement("td");

//	td15.innerHTML = "出兵元はここで設定。0は本拠地となる。0が本拠地です。";
	td15.innerHTML = "";
	td15.setAttribute('colSpan','7');
//	ccreateTextBox(td25, "OPT_AGENCY_2", OPT_AGENCY_2, "( ","",5,0);
//	td35.innerHTML = ")";
	td35.innerHTML = "";
	//td45.innerHTML = "";
	td45.innerHTML = "　槍兵 =　";
	//td45.setAttribute('colSpan','2');
	ccreateTextBox(td55, "OPT_SPEARMAN", OPT_SPEARMAN, "(","",5,0);
	td65.innerHTML = ")";

    tr5.appendChild(td15);
    tr5.appendChild(td25);
    tr5.appendChild(td35);
    tr5.appendChild(td45);
    tr5.appendChild(td55);
    tr5.appendChild(td65);

//======================================================================================================
  	var tr5 = d_23.createElement('tr');
  	tbody.appendChild(tr5);  

    var td15 = d_23.createElement("td");
    var td25 = d_23.createElement("td");
    var td35 = d_23.createElement("td");
    var td45 = d_23.createElement("td");
    var td55 = d_23.createElement("td");
    var td65 = d_23.createElement("td");
    var td75 = d_23.createElement("td");
    var td85 = d_23.createElement("td");
    var td95 = d_23.createElement("td");
    var td105 = d_23.createElement("td");
    var td115 = d_23.createElement("td");
    var td125 = d_23.createElement("td");

	td15.innerHTML = "";
	td25.innerHTML = "";
	td35.innerHTML = "";
	td45.innerHTML = "";
	td55.innerHTML = "";
	td65.innerHTML = "";
	td75.innerHTML = "";
	td85.innerHTML = "";
	td95.innerHTML = "";
	td105.innerHTML = "　弓兵 =　";
	//td105.setAttribute('colSpan','2');
	ccreateTextBox(td115, "OPT_BOWSOL", OPT_BOWSOL, "(","",5,0);
	td125.innerHTML = ")";

//左側領域
	td15.width = 16+2;	//1列
	td25.width = 16;	//2列
	td35.width = 16;	//3列
	td45.width = 59+1;	//4列 攻撃力
	td55.width = 59+1;	//5列 騎兵
	td65.width = 59+1;	//6列 弓兵
	td75.width = 59+1;	//7列 槍兵
	td85.width = 59+1;	//8列 歩兵
	td95.width = 1;	//9列 )
//右側領域
	td105.width = 60;	//10列 弓兵 or ブートキャンプさせるカードID　 = 
	//td115.width = 50;	//11列 (□
	//td125.width = 50;	//12列 )

	//td135.width = 46;	//13列 (□
	//td145.width = 46;	//14列 )
	//td155.width = 20;
	//td165.width = 20;
	//td175.width = 10;
	//td185.width = 1;
	//td195.width = 1;
	//td205.width = 0;

    tr5.appendChild(td15);
    tr5.appendChild(td25);
    tr5.appendChild(td35);
    tr5.appendChild(td45);
    tr5.appendChild(td55);
    tr5.appendChild(td65);
    tr5.appendChild(td75);
    tr5.appendChild(td85);
    tr5.appendChild(td95);
    tr5.appendChild(td105);
    tr5.appendChild(td115);
    tr5.appendChild(td125);


//======================================================================================================
  	var tr5 = d_23.createElement('tr');
  	tbody.appendChild(tr5);  

    var td15 = d_23.createElement("td");
    var td25 = d_23.createElement("td");
    var td35 = d_23.createElement("td");
    var td45 = d_23.createElement("td");
    var td55 = d_23.createElement("td");
    var td65 = d_23.createElement("td");
    var td75 = d_23.createElement("td");
    var td85 = d_23.createElement("td");
    var td95 = d_23.createElement("td");
    var td105 = d_23.createElement("td");
    var td115 = d_23.createElement("td");
    var td125 = d_23.createElement("td");

	td15.innerHTML = "";
	td25.innerHTML = "";
	td35.innerHTML = "";
	td45.innerHTML = "";
	td55.innerHTML = "";
	td65.innerHTML = "";
	td75.innerHTML = "";
	td85.innerHTML = "";
	td95.innerHTML = "";
	td105.innerHTML = "　騎兵 =　";
	//td105.setAttribute('colSpan','2');
	ccreateTextBox(td115, "OPT_TROOPER", OPT_TROOPER, "(","",5,0);
	td125.innerHTML = ")";

    tr5.appendChild(td15);
    tr5.appendChild(td25);
    tr5.appendChild(td35);
    tr5.appendChild(td45);
    tr5.appendChild(td55);
    tr5.appendChild(td65);
    tr5.appendChild(td75);
    tr5.appendChild(td85);
    tr5.appendChild(td95);
    tr5.appendChild(td105);
    tr5.appendChild(td115);
    tr5.appendChild(td125);

//======================================================================================================
  	var tr5 = d_23.createElement('tr');
  	tbody.appendChild(tr5);  

    var td15 = d_23.createElement("td");
    var td25 = d_23.createElement("td");
    var td35 = d_23.createElement("td");
    var td45 = d_23.createElement("td");
    var td55 = d_23.createElement("td");
    var td65 = d_23.createElement("td");
    var td75 = d_23.createElement("td");

	td15.innerHTML = "出兵元・・・本拠地が０です";
	td15.setAttribute('colSpan','6');
	td25.innerHTML = "";
	td35.innerHTML = "";
	td45.innerHTML = "";
	td55.innerHTML = "　矛槍兵 =　";
	//td55.setAttribute('colSpan','2');
	ccreateTextBox(td65, "OPT_ARMS_SPEARMAN", OPT_ARMS_SPEARMAN, "(","",5,0);
	td75.innerHTML = ")";

    tr5.appendChild(td15);
    tr5.appendChild(td25);
    tr5.appendChild(td35);
    tr5.appendChild(td45);
    tr5.appendChild(td55);
    tr5.appendChild(td65);
    tr5.appendChild(td75);

//======================================================================================================
  	var tr5 = d_23.createElement('tr');
  	tbody.appendChild(tr5);  

    var td15 = d_23.createElement("td");
    var td25 = d_23.createElement("td");
    var td35 = d_23.createElement("td");
    var td45 = d_23.createElement("td");

	td15.innerHTML = "参照するデッキのページ数、所有カード以上に設定しないようにご注意";
	td15.setAttribute('colSpan','9');
	td25.innerHTML = "　弩兵 =　";
	//td25.setAttribute('colSpan','2');
	ccreateTextBox(td35, "OPT_CROSSBOW", OPT_CROSSBOW, "(","",5,0);
	td45.innerHTML = ")";

    tr5.appendChild(td15);
    tr5.appendChild(td25);
    tr5.appendChild(td35);
    tr5.appendChild(td45);

//======================================================================================================
  	var tr5 = d_23.createElement('tr');
  	tbody.appendChild(tr5);  

    var td15 = d_23.createElement("td");
    var td25 = d_23.createElement("td");
    var td35 = d_23.createElement("td");
    var td45 = d_23.createElement("td");

	td15.innerHTML = "上記設定値以上も、可能な限り出兵する。剣兵作りすぎに注意弱くなります";
	td15.setAttribute('colSpan','9');
	td25.innerHTML = "　近衛騎兵 =";
	//td25.width =70;
	//td25.setAttribute('colSpan','2');
	ccreateTextBox(td35, "OPT_GUARDS", OPT_GUARDS, "(","",5,0);
	td45.innerHTML = ")";

    tr5.appendChild(td15);
    tr5.appendChild(td25);
    tr5.appendChild(td35);
    tr5.appendChild(td45);

//======================================================================================================
  	var tr5 = d_23.createElement('tr');
  	tbody.appendChild(tr5);  

    var td15 = d_23.createElement("td");
    var td25 = d_23.createElement("td");
    var td35 = d_23.createElement("td");
    var td45 = d_23.createElement("td");
    var td55 = d_23.createElement("td");
    var td65 = d_23.createElement("td");
    var td75 = d_23.createElement("td");
    var td85 = d_23.createElement("td");
    var td95 = d_23.createElement("td");
    var td105 = d_23.createElement("td");

	td15.innerHTML = "";
	td25.innerHTML = "";
	td35.innerHTML = "";
	td45.innerHTML = "";
	td55.innerHTML = "";
	td65.innerHTML = "";
	td75.innerHTML = "";
	td85.innerHTML = "";
	td95.innerHTML = "";
    ccreateCheckBox(td105, "OPT_CHK_SEND_TROOPS", OPT_CHK_SEND_TROOPS, "上記設定値以上も、可能な限り出兵する。（車、斥侯除く）","",0);
	td105.setAttribute('colSpan','7');

    tr5.appendChild(td15);
    tr5.appendChild(td25);
    tr5.appendChild(td35);
    tr5.appendChild(td45);
    tr5.appendChild(td55);
    tr5.appendChild(td65);
    tr5.appendChild(td75);
    tr5.appendChild(td85);
    tr5.appendChild(td95);
    tr5.appendChild(td105);

//======================================================================================================


    oc.appendChild(tbl);

    ccreateButton(oc, "保存", "設定内容を保存します", function() {saveOptionsAt();});
    ccreateButton(oc, "閉じる", "設定内容を保存せず閉じます", function() {deleteOptionsHtmlAt();});

	oc.appendChild(table);


}

function ccreateCheckBox(container, id, def, text, title, left )
{
    left += 2;
    var dv = d_23.createElement("div");
    dv.style.padding = "2px";
    dv.style.paddingLeft= left + "px";
    dv.title = title;
    var cb = d_23.createElement("input");
    cb.type = "checkbox";
    cb.id = id;
    cb.value = 1;
    if( def ) cb.checked = true;

    var lb = d_23.createElement("label");
    lb.htmlFor = id;

    var tx = d_23.createTextNode(text);
    lb.appendChild( tx );

    dv.appendChild(cb);
    dv.appendChild(lb);
    container.appendChild(dv);
    return cb;
}

function ccreateTextBox(container, id, def, text, title, size, left )
{
    left += 2;
    var dv = d_23.createElement("div");
    dv.style.padding = "2px";
    dv.style.paddingLeft= left + "px";
    dv.title = title;
    var tb = d_23.createElement("input");
    tb.type = "text";
    tb.id = id;
    tb.value = def;
    tb.size = size;

    var tx = d_23.createTextNode(text);
    tx.title = title;

    dv.appendChild(tx);
    dv.appendChild(tb);
    container.appendChild(dv);
    return tb;
}

function ccreateButton(container, text, title, func)
{
    var btn = d_23.createElement("input");
    btn.style.padding = "1px";
    btn.type = "button";
    btn.value = text;
    btn.title = title;
    container.appendChild(d_23.createTextNode(" "));
    container.appendChild(btn);
    container.appendChild(d_23.createTextNode(" "));
    $e_23(btn, "click", func);
    return btn;
}

function csaveDataAt(key, value, local, ev)
{
    //if( local ) 
	key = location.hostname + key;
    if( ev ) {
        if (window.opera || typeof JSON != 'object') {
            value = toJSON(value);
        }
        else {
            value = JSON.stringify( value );
        }
    }
    GM_setValue(key, value );
}

function cloadDataAt(key, value, local, ev)
{
    //if( local ) 
	key = location.hostname + key;
//FA_log("local="+local + "key="+key);
    var ret = GM_getValue(key, value);
    return ev ? eval('ret='+ret) : ret;
}

function cgetTextBoxValueAt(id)
{
    var c = $_23(id);
    if( !c ) return "";
    return c.value;
}

function cgetCheckBoxValue(id)
{
    var c = $_23(id);
    if( !c ) return 0;
    if( !c.checked ) return 0;
    return 1;
}

}) ();

///////////////////////////////////////////////////////////////////////////////////////
// ==UserScript==
// @nnnname         bro3_fullauto_troop
// @nnnnamespace    http://homepage3.nifty.com/Craford/
// @nnndescription  ブラウザ三国志 全自動出兵スクリプト
// @nnninclude      http://*.3gokushi.jp/village.php*
// @nnnversion      0.09
// ==/UserScript==

// 2011.05.05 create Craford とりあえず出撃中でなければ、都市画面から勝手に出兵させてみる
// 2011.05.17 update Craford デッキから使える武将一覧をとる
// 2011.06.11 update Craford 複数鯖、出兵しないカード処理を追加
// 2011.06.18 update Craford デッキから外さない武将リストを作成
// 2011.11.27 update Craford 武将のセットされている拠点をチェックするようにした
// 2012.03.25 update Craford 武将兵科ごとに出兵座標を変えられるようにした。
// 2012.03.25 update Craford 鯖別に出兵拠点、討伐ゲージを指定できるようにした
// 2012.04.01 update Craford デッキから落とさないがうまくいかない問題を修正、指定方法変更

//グローバル変数

// メイン
//(function(){
    // 拠点画面なら実行
//    if (location.pathname == "/village.php") {
        //
//        autoTroop();
//    }
//})();


function cloadDataAt2(key, value, local, ev)
{
    //if( local ) 
	key = location.hostname + key;
//FA_log("local="+local + "key="+key);
    var ret = GM_getValue(key, value);
    return ev ? eval('ret='+ret) : ret;
}
function csaveDataAt2(key, value, local, ev)
{
    //if( local ) 
	key = location.hostname + key;
    if( ev ) {
        if (window.opera || typeof JSON != 'object') {
            value = toJSON(value);
        }
        else {
            value = JSON.stringify( value );
        }
    }
    GM_setValue(key, value );
}
function autoTroop()
{
   	AUTO_EXEC_FLAG = cloadDataAt2( "AUTO_EXEC_FLAG", AUTO_EXEC_FLAG ); 	//出兵機能を起動したかどうか。120524
	// 拠点画面なら実行
	if (location.pathname == "/village.php") {
		//FA_log("autoTroop(village) AUTO_EXEC_FLAG="+AUTO_EXEC_FLAG);
		if(AUTO_EXEC_FLAG == 0){

			if(OPT_CHK_USED_SEND_TROOPS == 0){	//出兵機能を使用しない(0)場合、未処理とする
				if (OPT_CHK_USED_BOOTCAMP == 0){	//ブートキャンプ機能を使用しない
					return;
				}
			}

			autoTroop0();
			AUTO_EXEC_FLAG = 1;
		}

	}
	else{
		//FA_log("autoTroop() AUTO_EXEC_FLAG="+AUTO_EXEC_FLAG);
		AUTO_EXEC_FLAG = 0;
	}
    csaveDataAt2( "AUTO_EXEC_FLAG", AUTO_EXEC_FLAG );					//出兵機能を使用するかどうか。

}

function loopWait( timeWait )
{
    var timeStart = new Date().getTime();
    var timeNow = new Date().getTime();
    while( timeNow < (timeStart + timeWait ) )
    {
        timeNow = new Date().getTime();
	  	if(loadSkillInfoEnd == 1){
		   return;
		}
  	}
    return;
}
// 建築チェック
function autoTroop0() {
// faraway サーバー単位で動作させるので、サーバーチェックはしない
    // サーバーチェック
//    var exec = false;
//	var svname_23 = location.hostname.substr(0,location.hostname.indexOf("."));	//現在使用中の鯖名取得　faraway
//	for(var j = 0; j < execTroopServers.length; j++ ){
//       if( execTroopServers[j] == svname_23 ){
//            exec = true;
//            break;
//        }
//    }
//    if( exec == false ){
//        return;
//    }


    //----------------//
    // コンテナの取得 //
    //----------------//
    var container;
    var container = $v_23('//*[@id="container"]');
    if (container.snapshotLength != 0) {
        container = container.snapshotItem(0);
    }
    else{
        return;
    }

    //--------------------------//
    // 他ページ取得情報の設定域 //
    //--------------------------//
    var linksDiv2 = document.createElement("html");
    linksDiv2.id = "hiddenData_autoTroop";
    linksDiv2.style.display = "none";
    container.appendChild(linksDiv2);

	dataset();			//設定画面のデータを各変数に格納する	faraway

//	FA_log("1738:skillName.length="+skillName.length);
//	for(var ii = 0; ii < skillName.length; ii++ ){	//指定されたｽｷﾙの種類
//		FA_log("1740:skillName="+skillName[ii]);
//	}
    //--------------------//
    // デッキページの取得 //
    //--------------------//
	if(OPT_CHK_USED_SEND_TROOPS == 1)			//出兵機能を使用するかどうか
	{
		//	複数ページ情報取得にする
		//    OPT_DECK_NUM;   		//参照するデッキのページ数、2くらいで十分かと、
		for(var i = 1; i <= OPT_DECK_NUM; i++){
			troopflag = 0;
		    loadDeck(i);	//デッキ設定（出兵しない）
		}
		loadSkillInfo();	//ｽｷﾙと兵士数取得
	    loadDeck(1);		//出兵機能
	}
	if(OPT_CHK_USED_BOOTCAMP == 1)				//ブートキャンプ機能を使用するかどうか
	{
		for(var i = 1; i <= OPT_DECK_NUM; i++){
			troopflag = 0;
		    loadDeckBC(i);	//ブートキャンプ（デッキ設定）
		}
		loadSkillInfo();	//ｽｷﾙと兵士数取得

		for(var i = 1; i <= OPT_DECK_NUM; i++){//ﾀｲﾏ-として使用
			troopflag = 0;
		    loadDeckBC(i);	//ブートキャンプ（デッキ設定）
		}
	    loadDeckBC(1);		//ブートキャンプ（出兵）
	}

    return;
}


////////////////////////////////////////////////////////////////////////
//   設定画面で設定した値をプログラムで使用しているテーブルに格納する //
////////////////////////////////////////////////////////////////////////
function dataset()
{

	//出兵機能設定部分
	if(OPT_CHK_USED_SEND_TROOPS == 1)			//出兵機能を使用するかどうか
	{
		//Aceの設定方法(自動出兵しない)
		// 出兵しない武将リスト
		// (武将名またはカードid)

		//名前でのace設定
		myData = OPT_ACE_SET_NAME.split(",");
		unTroopCard[0] = location.hostname.substr(0,location.hostname.indexOf("."));				//faraway "m1";
		var j = 0;
	    for(j = 0; j < myData.length; j++ ){
			unTroopCard[j+1] = myData[j];
		}

		//idでのace設定
		myData = OPT_ACE_SET_ID.split(",");
	    for(var i = 0; i < myData.length; i++ ){
			unTroopCard[j+i+1] = myData[i];
		}

		// 出兵元拠点、討伐ゲージ値
		troopVillageInfo[0][0] = location.hostname.substr(0,location.hostname.indexOf("."));	//"m1"サーバー名

		//出兵する最低討伐
		if(OPT_CHK_NUMBER == 0){					//出兵する最低討伐(ﾁｪｯｸﾎﾞｯｸｽ)
			troopVillageInfo[0][2] = 0;				//出兵する最低討伐値を0に設定する
		}
		else{
			troopVillageInfo[0][2] = OPT_NUMBER;	//出兵する最低討伐
		}

		//デッキから外す最低討伐
		//OPT_CHK_OUT_DECK

		//スキルを使う？
		if(OPT_CHK_USED_ALL_SKILL == 1) 		//スキルを使う？ 全て使用
		{
			skillKind[0] = "";
		}
		else{
			if(OPT_CHK_USED_SELECT_SKILL == 1)	//スキルを使う？ 選んで使用
			{
				//OPT_SELECT_SKILL;				//スキルを使う？ 選んで使用 スキルの種類
				myData = OPT_SELECT_SKILL.split(",");	//スキルの種類
			    for(var i = 0; i < myData.length; i++ ){
					skillKind[i] = myData[i];
				}
			}
		}

		//出兵元
		troopVillageInfo[0][1] = OPT_AGENCY;	//出兵元 ・・・本拠地が０です
		//troopVillageInfo[0][1] = OPT_AGENCY_2;		//出兵元 ・・・本拠地が０です

		//出兵先1,2,3
		//騎兵、槍兵、弓兵、歩兵
		//troopAddr[0][0] = location.hostname.substr(0,location.hostname.indexOf("."));	//faraway "m1";
		troopAddr[0][0] = OPT_ATTACK_1;		//攻撃力を設定
		myData = OPT_FOOT_1.split(",");		//出兵先1 剣兵武将出兵先 -----画面の歩兵を設定(修正)
		troopAddr[0][1] = myData[0];
		troopAddr[0][2] = myData[1];

		myData = OPT_BOW_1.split(",");		//出兵先1 弓兵武将出兵先
		troopAddr[0][3] = myData[0];
		troopAddr[0][4] = myData[1];
		myData = OPT_SPEAR_1.split(",");	//出兵先1 槍兵武将出兵先
		troopAddr[0][5] = myData[0];
		troopAddr[0][6] = myData[1];
		myData = OPT_TROOPER_1.split(",");	//出兵先1 騎兵武将出兵先
		troopAddr[0][7] = myData[0];
		troopAddr[0][8] = myData[1];

		//troopAddr[1][0] = location.hostname.substr(0,location.hostname.indexOf("."));	//faraway "m1";
		troopAddr[1][0] = OPT_ATTACK_2;		//攻撃力を設定

		myData = OPT_FOOT_2.split(",");		//出兵先2 剣兵武将出兵先 -----画面の歩兵を設定(修正)
		troopAddr[1][1] = myData[0];
		troopAddr[1][2] = myData[1];

		myData = OPT_BOW_2.split(",");		//出兵先2 弓兵武将出兵先
		troopAddr[1][3] = myData[0];
		troopAddr[1][4] = myData[1];
		myData = OPT_SPEAR_2.split(",");	//出兵先2 槍兵武将出兵先
		troopAddr[1][5] = myData[0];
		troopAddr[1][6] = myData[1];
		myData = OPT_TROOPER_2.split(",");	//出兵先2 騎兵武将出兵先
		troopAddr[1][7] = myData[0];
		troopAddr[1][8] = myData[1];

		//troopAddr[2][0] = location.hostname.substr(0,location.hostname.indexOf("."));	//faraway "m1";
		troopAddr[2][0] = OPT_ATTACK_3;		//攻撃力を設定
		myData = OPT_FOOT_3.split(",");		//出兵先3 剣兵武将出兵先 -----画面の歩兵を設定(修正)
		troopAddr[2][1] = myData[0];
		troopAddr[2][2] = myData[1];
		myData = OPT_BOW_3.split(",");		//出兵先3 弓兵武将出兵先
		troopAddr[2][3] = myData[0];
		troopAddr[2][4] = myData[1];
		myData = OPT_SPEAR_3.split(",");	//出兵先3 槍兵武将出兵先
		troopAddr[2][5] = myData[0];
		troopAddr[2][6] = myData[1];
		myData = OPT_TROOPER_3.split(",");	//出兵先3 騎兵武将出兵先
		troopAddr[2][7] = myData[0];
		troopAddr[2][8] = myData[1];

		//参照するデッキのページ数、2くらいで十分かと、	
		//    OPT_DECK_NUM;
	}	//出兵機能を使用する場合データ設定する

	//ブートキャンプ設定
	//ブートキャンプ機能を使用するかどうか
	if(OPT_CHK_USED_BOOTCAMP == 1)					//ブートキャンプ機能を使用するかどうか
	{

		troopVillageInfoBC[0][0] = location.hostname.substr(0,location.hostname.indexOf("."));	//"m1"サーバー名

		//出兵する討伐ゲージ
		if(OPT_CHK_GAUGE == 0){						//出兵する討伐ゲージ(ﾁｪｯｸﾎﾞｯｸｽ)
			troopVillageInfoBC[0][2] = 0;				//出兵する最低討伐値を0に設定する
		}
		else{
			troopVillageInfoBC[0][2] = OPT_SUBJUGATION_GAUGE;	//出兵する討伐ゲージ
		}

		//デッキから外す最低討伐
		//OPT_CHK_OUT_DECK_BC

		//スキルを使う？
		if(OPT_CAMP_ALL_SKILL == 1) 		//スキルを使う？ 全て使用
		{
			skillKindBC[0] = "";
		}
		else{
			if(OPT_CAMP_SELECT_SKILL == 1)	//スキルを使う？ 選んで使用
			{
				//OPT_C_SELECT_SKILL;				//スキルを使う？ 選んで使用 スキルの種類
				myData = OPT_C_SELECT_SKILL.split(",");	//スキルの種類
			    for(var i = 0; i < myData.length; i++ ){
					skillKindBC[i] = myData[i];
				}
			}
		}

		//出兵元
		troopVillageInfoBC[0][1] = OPT_ORIGIN;		//出兵元 ・・・本拠地が０です

		//出兵先
		troopAddrBC[0][0] = 0;			//攻撃力を設定
		myData = OPT_POINT.split(",");	//出兵先
		troopAddrBC[0][1] = myData[0];	//X座標
		troopAddrBC[0][2] = myData[1];	//Y座標

		//ブートキャンプさせるカードID　 = 
		//ブートキャンプさせるカード名称 =
		// (武将名またはカードid)
		myData = OPT_CARD_NAME.split(",");	//ブートキャンプさせるカード名称
		bcCard[0] = location.hostname.substr(0,location.hostname.indexOf("."));				//faraway "m1";
    	for(var j = 0; j < myData.length; j++ ){
//FA_log("1myData[j]="+myData[j]+" j="+j);
			bcCard[j+1] = myData[j];
//FA_log("bcCard[j+1]="+bcCard[j]);
		}
		//idでのカード設定
		myData = OPT_CARD_ID.split(",");
		for(var i = 0; i < myData.length; i++ ){
//FA_log("2myData[j]="+myData[j]+" j="+j);
			bcCard[j+i+1] = myData[i];
		}

		//随行兵隊設定
		//    OPT_SWORD;         			//剣兵
		//    OPT_SPEARMAN;      			//槍兵
		//    OPT_BOWSOL;        			//弓兵
		//    OPT_TROOPER;       			//騎兵
		//    OPT_ARMS_SPEARMAN; 			//矛槍兵
		//    OPT_CROSSBOW;      			//弩兵
		//    OPT_GUARDS;        			//近衛騎兵

		//上記設定値以上も、可能な限り出兵する。（車、斥侯除く）
		//    OPT_CHK_SEND_TROOPS;  		//上記設定値以上も、可能な限り出兵する。（車、斥侯除く）

	}	//ブートキャンプ機能を使用するときのみデータ設定する

}
///////////////////////////////////////////////////////////////////faraway end
//----------------------//
// ページのローディング //
//----------------------//
function loadDeck(page) {

    var para = "?p="+page+"#file-1";
    var url = "http://" + location.hostname + "/card/deck.php"+para;

FA_log("1986:url="+url);
    var opt = {
        method: 'GET',
        url: url,
        onload: function(res) {
            getDeckList(res);
        }
    }
    GM_xmlhttpRequest(opt);
}

function getCookie_23(key) {						//faraway
　var cookieString = document.cookie;			// Cookieから値を取得する
　var cookieKeyArray = cookieString.split(";");	// 要素ごとに ";" で区切られているので、";" で切り出しを行う

　for (var i=0; i<cookieKeyArray.length; i++) {	// 要素分ループを行う
　　var targetCookie = cookieKeyArray[i];
　　targetCookie = targetCookie.replace(/^\s+|\s+$/g, "");// 前後のスペースをカットする
　　var valueIndex = targetCookie.indexOf("=");
	//FA_log(targetCookie.substring(0, valueIndex));
　　if (targetCookie.substring(0, valueIndex) == key) {
　　　return unescape(targetCookie.slice(valueIndex + 1));// キーが引数と一致した場合、値を返す
　　}
　}
　return "";
}
//--------------------//
// デッキ武将一覧取得 //
//--------------------//
function getDeckList(res) {
    //--------------------//
    // 取得データのセット //
    //--------------------//
    var hidden = $v_23('//*[@id="hiddenData_autoTroop"]');
    hidden.snapshotItem(0).innerHTML = res.responseText;
//alert(res.responseText);	//120523

    var d_name = new Array();
    var d_gage = new Array();
    var d_type = new Array();
    var d_cardid = new Array();
    var w_name = new Array();
    var w_gage = new Array();
    var w_cardid = new Array();
    var i;
    var villageNo = -1;
    var putDownGage = -1;

//FA_log("1986");

//1.1
    // 処理対象拠点番号、出兵討伐ゲージ値
    for(var j = 0; j < troopVillageInfo.length; j++ ){
        if( troopVillageInfo[j][0] == svname_23 ){			//指定サーバ時
            villageNo = troopVillageInfo[j][1];			//出兵元 ・・・本拠地が０です
            putDownGage = troopVillageInfo[j][2]		//出兵する最低討伐
            break;
        }
    }
    if( villageNo == -1 || putDownGage == -1 ){
        return;
    }

//1.2
    // カレント拠点が指定拠点でなければ何もしない
    var data = document.evaluate('//*[@id="lodgment"]//li',
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if( data == undefined || data == null ){
        return;
    }
    if( data.snapshotItem(villageNo).getAttribute("class") != "on" ){
        return;
    }

//1.3
    //--------------------//
    // 拠点名リストを作る //
    //--------------------//
	//window.alert("25.自動出兵:"+res.responseText);	//faraway
    var villageName = data.snapshotItem(villageNo).firstChild.getAttribute("title").match(/^(.*) /)[1];

//1.4
    // データ保持変数初期化
    for( var i = 0; i < 20; i++ ){
        d_name[i] = "";
        d_gage[i] = "";
        d_cardid[i] = "";
        d_type[i] = "";
        w_name[i] = "";
        w_gage[i] = "";
        w_cardid[i] = "";
    }

//1.5
    //------------------------------------------------------------------------//
    // カード画面から、デッキにいて内政セットされていない武将情報を手に入れる //
    //------------------------------------------------------------------------//
    var text;
    var dt;
    var list;
    var list2;
    var type;
//    var killName;

    // データ
    var data = document.evaluate('//*[@id="hiddenData_autoTroop"]//div[@id="cardListDeck"]//div[@class="cardColmn"]',
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    dt = 0;
    for( var i = 0; i < data.snapshotLength; i++ ){
        text = data.snapshotItem(i).innerHTML;
        if( (text.indexOf("内政セット済") == -1) && (text.match(villageName) != undefined) ){
            // カード番号
            list = text.match(/operationExecution\('([^']+)', (\d+), 'unset'\)/);
            if( list == undefined || list == null ){
                continue;
            }

	        //Ace設定で設定した武将は出兵しない
			//FA_log("2042:Ace unTroopCard.length="+unTroopCard.length+" list[1]="+list[1]);
        	var continueflag = false;
			for(var j = 0; j < unTroopCard.length; j++ ){
            	//if( unTroopCard[j][0] == svname_23 ){
            		if(    (unTroopCard[j] == list[2])
                        || (unTroopCard[j]== list[1]) ){
						continueflag = true;
	                	break;

	                }
    	        //}
        	}
			if(continueflag == true)	continue;

            // 武将属性
            type = text.match(/soltype.* alt="(.*)" title=.*/);
            if( type == undefined || type == null ){
                continue;
            }
////////////////////////////////////////////////////////
// <span class="skillName1 ">攻:弓兵の進撃LV2</span>
///////////////////////////////////////////////////////
            // スキル名称取得
            skillName = text.match(/<span class=\"skillName\d \">(\S+)<\/span>/);
            if( skillName == undefined || skillName == null ){
                //continue;
            }

            // 討伐ゲージ
            list2 = text.match(/<div class=\"para\">(\d+)<\/div>/);
			//FA_log("2093:list2="+list2);
            if( list2 == undefined || list2 == null ){
                continue;
            }

            // 武将名
            d_name[dt] = list[1];

            // 武将属性
            d_type[dt] = type[1];

            // カード番号
            d_cardid[dt] = list[2];

            // 討伐ゲージ
            d_gage[dt] = list2[1];

            dt = dt + 1;
        }
    }

//1.6
    //----------------------------------------------------------------//
    // カード画面から、デッキにセットされていない武将情報を手に入れる //
    //----------------------------------------------------------------//
    var wt;

    // データ
    var data = document.evaluate('//*[@id="hiddenData_autoTroop"]//div[@class="cardStatusDetail label-setting-mode"]',
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if(data == undefined || data == null || data.snapshotLength == 0){
        data = document.evaluate('//*[@id="hiddenData_autoTroop"]//div[@id="cardFileList"]/div[@class="cardColmn"]',
            document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    }
    wt = 0;
    for( var i = 0; i < data.snapshotLength; i++ ){
        text = data.snapshotItem(i).innerHTML;

        // カード番号
        list = text.match(/operationExecution\('([^']+)', (\d+), 'set'\)/);
        if( list == undefined || list == null ){
            continue;
        }

        // 討伐ゲージ
        var pos;
        pos = text.indexOf("討伐");
        if( pos > 0 ){
            list2 = text.substr(pos+14).match(/[ ]*<td>(\d+)<\/td>/);
            if( list2 == undefined || list2 == null ){
                pos = text.indexOf("para");
                list2 = text.substr(pos+5).match(/>(\d+)<\/div>/);
                if( list2 == undefined || list2 == null ){
                    continue;
                }
            }
        }

        var skip = false;

        // デッキにセットしないカードIDか？（Ace設定で設定した武将は出兵しない為デッキにセットしない）
		//FA_log("2108:Ace unTroopCard.length="+unTroopCard.length);
        for(var j = 0; j < unTroopCard.length; j++ ){
                    if(    (unTroopCard[j] == list[2])
                        || (unTroopCard[j]== list[1]) ){
                        skip = true;
                    }
            //if( unTroopCard[j][0] == svname_23 ){
//                for(var k = 1; k < unTroopCard[j].length; k++){		//k=0は鯖名のため、k=1から
//                    if(    (unTroopCard[j][k] == list[2])
//                        || (unTroopCard[j][k] == list[1]) ){
//                        skip = true;
//                    }
//                }
            //}
        }
        if( skip == false ){			//Aceで設定した武将以外有効にする
            // 武将名
            w_name[wt] = list[1];

            // カード番号
            w_cardid[wt] = list[2];

            // 討伐ゲージ
            w_gage[wt] = list2[1];

            wt = wt + 1;
        }
    }

//1.9 デッキにセットする(出兵処理の前に変更)
    //----------------------------------//
    // デッキにセットできるやつがいる！ //
    //----------------------------------//
	var strSSID = getCookie_23("SSID");	//faraway ﾃﾞｯｷｾｯﾄのﾊﾟﾗﾒｰﾀに使用

    //if( wt > 0 && troop == false){
    if( wt > 0 ){
        // 拠点ID
        var data = document.evaluate('//*[@id="hiddenData_autoTroop"]//select[contains(@id,"selected_village_")]/option',
            document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var village_id = data.snapshotItem(villageNo).getAttribute("value");

        for( i = 0; i < wt; i++ ){
//FA_log("w_gage[i]="+w_gage[i]+" putDownGage="+putDownGage);
            if( parseInt(w_gage[i]) >= parseInt(putDownGage) ){
                //--------------------------------------------//
                // 討伐ゲージ設定値以上ならデッキにセットする //
                //--------------------------------------------//
                var unit_assign_card_id = w_cardid[i];

                var param = "http://" + HOST_23 + "/card/deck.php";
                var data =   "btn_change_flg="
                       + "&mode=set"
                       + "&p=1"
                       + "&target_card=" + unit_assign_card_id
                       + "&ssid="+ strSSID
                       + "&sort_order[]=0"
                       + "&sort_order_type[]=0"
                       + "&show_deck_card_count=1"
                       + "&selected_village[" + unit_assign_card_id + "]=" + village_id
                       + "";

                var opt2 = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    url: param,
                    data: data,
                    onload: function(res) {
                        location.href = location.pathname;
                    }
                }
//FA_log("data="+data);
                GM_xmlhttpRequest(opt2);
                //faraway120524break;
            }
        }
    }

if(troopflag == 0)
{
	troopflag = 1;
	return;
}
troopflag = 0;

FA_log("2136 dt="+dt+" wt="+wt);
//1.7 出兵処理
    //------------------------//
    // 出兵できるやつがいる！ //
    //------------------------//
    //var troop = false;
    //var skip = false;
    if( dt > 0 ){  // 1人はデッキに残す
        // 出兵座標取得
        var x = new Array();
        var y = new Array();
        var check = false;

//        if( check == true ){
            //for( i = 0; i < dt; i++ ){
			//	FA_log("2873：d_name[i] ="+d_name[i] +" d_gage[i]=" + d_gage[i] +" putDownGage="+putDownGage);	//faraway
			//}
            for( i = 0; i < dt; i++ ){
//				FA_log("2154：d_name[i] ="+d_name[i] +" d_gage[i]=" + d_gage[i] +" putDownGage="+putDownGage);	//faraway
                if( parseInt(d_gage[i]) >= parseInt(putDownGage) ){

					//出兵先を攻撃力に合わせて設定する
			        for(var j = 2; j >= 0; j-- ){		//出兵先3→出兵先2→出兵先1の順

//						FA_log("2160：troopAddr[j][0] ="+troopAddr[j][0] + " d_gage[i]="+d_gage[i]+" troopAddr[j][7]="+troopAddr[j][7]);	//faraway

            			if( parseInt(troopAddr[j][0]) <= parseInt(d_gage[i]) ){		//攻撃力で出兵先を変更する	faraway

//							FA_log("2164:troopAddr[j][0] <= d_gage[i]"+d_gage[i]);
			                x["歩兵"] = parseInt(troopAddr[j][1]);
            			    y["歩兵"] = parseInt(troopAddr[j][2]);

			                x["弓兵"] = parseInt(troopAddr[j][3]);
            			    y["弓兵"] = parseInt(troopAddr[j][4]);

			                x["槍兵"] = parseInt(troopAddr[j][5]);
            			    y["槍兵"] = parseInt(troopAddr[j][6]);

			                x["騎兵"] = parseInt(troopAddr[j][7]);
            			    y["騎兵"] = parseInt(troopAddr[j][8]);
//							FA_log("2164：troopAddr[j][0] ="+troopAddr[j][0]);	//faraway
//							FA_log("2165：x[騎兵] ="+x["騎兵"]);	//faraway
			                check = true;
            			    break;
			            }
			        }
//				FA_log("2170：d_type[i] ="+d_type[i]);	//faraway

                    //------------------------------//
                    // 討伐ゲージ指定値以上なら出兵 //
                    //------------------------------//
                    var village_name = "";
                    var unit_assign_card_id = d_cardid[i];
                    var card_id = 212;
                    var radio_move_type = 302;	//殲滅戦
                    var bandit_type = 1;        
                    var param = "http://" + HOST_23 + "/facility/castle_send_troop.php";
                    var data = "btn_send=出兵"
                           + "&village_x_value=" + x[d_type[i]]
                           + "&village_y_value=" + y[d_type[i]]
                           + "&village_name=" + village_name
                           + "&card_id=" + card_id
                           + "&unit_assign_card_id=" + unit_assign_card_id
                           + "&radio_move_type=" + radio_move_type
                           + "&show_beat_bandit_flg=" + bandit_type;

					//スキルを使う？	120612
//				FA_log("2296：data="+data);	//faraway
//				FA_log("2297:skillName.length="+skillName.length);
//			    	for(var ii = 0; ii < skillName.length; ii++ ){	//指定されたｽｷﾙの種類
//						FA_log("2299:skillName="+skillName[ii]);
//					}
//				FA_log("2301：data="+data);	//faraway

					var skill = "";
					//スキルを使う？
					if(OPT_CHK_USED_ALL_SKILL == 1) 		//スキルを使う？ 全て使用
					{
//						FA_log("2307:skill_cardid.length="+skill_cardid.length);
				    	for(var jj = 0; jj < skill_cardid.length; jj++ ){			//指定されたｽｷﾙの種類
							FA_log("2309:skill_cardid["+jj+"]="+skill_cardid[jj]+" unit_assign_card_id="+unit_assign_card_id);
							if(skill_cardid[jj] == unit_assign_card_id){			//ｽｷﾙ名称
								skill = "&use_skill_id%5B"+d_cardid[i]+"%5D="+skillID[jj];	//at0020";
//								FA_log("2312:出兵----------- skillID="+skillID);
								data = data + skill;
								break;
							}
						}
					}
					else{
						if(OPT_CHK_USED_SELECT_SKILL == 1)	//スキルを使う？ 選んで使用
						{
							FA_log("2320：スキル　選んで使用 skillKind[0]="+skillKind[0]);	//faraway
							var ii;
					    	for(ii = 0; ii < skill_cardid.length; ii++ ){		//指定されたｽｷﾙの種類
								if(skillKind[ii] == "") break;

								var strwork = skillKind[ii];
//								FA_log("strwork="+strwork);
								if(skill_cardid[ii] == unit_assign_card_id){		//ｶｰﾄﾞIDが一致
							    	for(var jj = 0; jj < skillName.length; jj++ ){	//指定されたｽｷﾙの種類
//										FA_log("2329:skillName=["+jj+"]="+skillName[jj]);
										var skillNameWork = skillName[jj];
								        if(strwork.indexOf(skillNameWork) != -1){	//ｽｷﾙ名称に指定ｽｷﾙ文字列が含まれる場合
											skill = "&use_skill_id%5B"+d_cardid[i]+"%5D="+skillID[jj];	//at0020";
											data = data + skill;
										}
									}
//									FA_log("2330：break;");	//faraway
									break;
								}
							}
						}
					}

					FA_log("2338:出兵----------- data="+data);
                    var opt2 = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        url: param,
                        data: data,
                        onload: function(res) {
                            location.href = location.pathname;
                        }
                    }
                    GM_xmlhttpRequest(opt2);

                    //faraway120524break;
                }

//1.8
				if( OPT_CHK_OUT_DECK == 1)     		//デッキから外す最低討伐(ﾁｪｯｸﾎﾞｯｸｽ)
				{
	                if( d_gage[i] <= OPT_OUT_DECK )	//デッキから外す最低討伐
					{
						//デッキから外す処理
                        var unit_assign_card_id = d_cardid[i];
                        var param = "http://" + HOST_23 + "/card/deck.php";
                        var data =   "btn_change_flg="
                               + "&mode=unset"
                               + "&p=1"
                               + "&target_card=" + unit_assign_card_id;
                        var opt2 = {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            url: param,
                            data: data,
                            onload: function(res) {
                                location.href = location.pathname;
                            }
                        }
                        GM_xmlhttpRequest(opt2);
					}
				}
            }
            //if( skip == false ){
                //120524troop = true;
            //}
//        }
    }

}
///////////////////////////////////////////////////////////////////
//  ブートキャンプ設定                                           //
///////////////////////////////////////////////////////////////////
function loadDeckBC(page) {

    var para = "?p="+page+"#file-1";
    var url = "http://" + location.hostname + "/card/deck.php"+para;
    var opt = {
        method: 'GET',
        url: url,
        onload: function(res) {
            getDeckListBC(res);
        }
    }
    GM_xmlhttpRequest(opt);
}
//--------------------//
// デッキ武将一覧取得 //
//--------------------//
function getDeckListBC(res) {
    //--------------------//
    // 取得データのセット //
    //--------------------//
    var hidden = $v_23('//*[@id="hiddenData_autoTroop"]');
    hidden.snapshotItem(0).innerHTML = res.responseText;

    var d_name = new Array();
    var d_gage = new Array();
    var d_type = new Array();
    var d_cardid = new Array();
    var w_name = new Array();
    var w_gage = new Array();
    var w_cardid = new Array();
    var i;
    var villageNo = -1;
    var putDownGage = -1;
	var deck_count = 0;			//デッキにセットしている武将数

FA_log("2334:getDeckListBC troopVillageInfoBC.length="+troopVillageInfoBC.length);
//2.1
    // 処理対象拠点番号、出兵討伐ゲージ値
    for(var j = 0; j < troopVillageInfoBC.length; j++ ){
        if( troopVillageInfoBC[j][0] == svname_23 ){		//指定サーバ時
            villageNo = troopVillageInfoBC[j][1];		//出兵元 ・・・本拠地が０です
            putDownGage = troopVillageInfoBC[j][2]		//出兵する最低討伐
            break;
        }
    }
//FA_log("villageNo = "+villageNo+" putDownGage = "+putDownGage);
    if( villageNo == -1 || putDownGage == -1 ){
        return;
    }

//2.2
    // カレント拠点が指定拠点でなければ何もしない
    var data = document.evaluate('//*[@id="lodgment"]//li',
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if( data == undefined || data == null ){
        return;
    }
    if( data.snapshotItem(villageNo).getAttribute("class") != "on" ){
        return;
    }

//2.3
    //--------------------//
    // 拠点名リストを作る //
    //--------------------//
    var villageName = data.snapshotItem(villageNo).firstChild.getAttribute("title").match(/^(.*) /)[1];

//2.4
    // データ保持変数初期化
    for( var i = 0; i < 20; i++ ){
        d_name[i] = "";
        d_gage[i] = "";
        d_cardid[i] = "";
        d_type[i] = "";
        w_name[i] = "";
        w_gage[i] = "";
        w_cardid[i] = "";
    }

//2.5 デッキにセットされている武将情報取得
    //------------------------------------------------------------------------//
    // カード画面から、デッキにいて内政セットされていない武将情報を手に入れる //
    //------------------------------------------------------------------------//
    var text;
    var dt;
    var list;
    var list2;
    var type;

    // データ
    var data = document.evaluate('//*[@id="hiddenData_autoTroop"]//div[@id="cardListDeck"]//div[@class="cardColmn"]',
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    dt = 0;
    for( var i = 0; i < data.snapshotLength; i++ ){
        text = data.snapshotItem(i).innerHTML;
        if( (text.indexOf("内政セット済") == -1) && (text.match(villageName) != undefined) ){
            // カード番号
            list = text.match(/operationExecution\('([^']+)', (\d+), 'unset'\)/);
            if( list == undefined || list == null ){
                continue;
            }

            // 武将属性
            type = text.match(/soltype.* alt="(.*)" title=.*/);
            if( type == undefined || type == null ){
                continue;
            }

////////////////////////////////////////////////////////
// <span class="skillName1 ">攻:弓兵の進撃LV2</span>
///////////////////////////////////////////////////////
            // スキル名称
            //skillName = text.match(/<span class=\"skillName\">(\d+)<\/span>/);
            //skillName = text.match(/<span class=\"skillName\d \">(\D+\d+)<\/span>/);
            skillName = text.match(/<span class=\"skillName\d \">(\S+)<\/span>/);
			//FA_log("2483:skillName[1]="+skillName[1]);
            if( skillName == undefined || skillName == null ){
                //continue;
            }

            // 討伐ゲージ
            list2 = text.match(/<div class=\"para\">(\d+)<\/div>/);
            if( list2 == undefined || list2 == null ){
                continue;
            }

            // 武将名
            d_name[dt] = list[1];

            // 武将属性
            d_type[dt] = type[1];

            // カード番号
            d_cardid[dt] = list[2];

            // 討伐ゲージ
            d_gage[dt] = list2[1];

            dt = dt + 1;

			deck_count++;			//デッキにセットしている武将数
        }
    }

//2.6 デッキにセットされていない武将情報取得(デッキにセットするカードのみ対象とする)
    //----------------------------------------------------------------//
    // カード画面から、デッキにセットされていない武将情報を手に入れる //
    //----------------------------------------------------------------//
    var wt;

    // データ
    var data = document.evaluate('//*[@id="hiddenData_autoTroop"]//div[@class="cardStatusDetail label-setting-mode"]',
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if(data == undefined || data == null || data.snapshotLength == 0){
        data = document.evaluate('//*[@id="hiddenData_autoTroop"]//div[@id="cardFileList"]/div[@class="cardColmn"]',
            document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    }
    wt = 0;
    for( var i = 0; i < data.snapshotLength; i++ ){
        text = data.snapshotItem(i).innerHTML;

        // カード番号
        list = text.match(/operationExecution\('([^']+)', (\d+), 'set'\)/);
        if( list == undefined || list == null ){
            continue;
        }

        // 討伐ゲージ
        var pos;
        pos = text.indexOf("討伐");
        if( pos > 0 ){
            list2 = text.substr(pos+14).match(/[ ]*<td>(\d+)<\/td>/);
            if( list2 == undefined || list2 == null ){
                pos = text.indexOf("para");
                list2 = text.substr(pos+5).match(/>(\d+)<\/div>/);
                if( list2 == undefined || list2 == null ){
                    continue;
                }
            }
        }

        var skip = true;
        // デッキにセットするカードIDか？（ブートキャンプさせる武将を出兵させる為デッキにセットする）
        for(var j = 0; j < bcCard.length; j++ ){
        	if(    (bcCard[j] == list[2])
                    || (bcCard[j] == list[1]) ){
            	skip = false;
				FA_log("【2641】:カードID bcCard[j]="+bcCard[j]+" カードID list[2]="+list[2]);
				break;	//120628
            }
        }


        if( skip == false ){			//ブートキャンプさせる武将のみ有効にする
            // 武将名
            w_name[wt] = list[1];

            // カード番号
            w_cardid[wt] = list[2];

            // 討伐ゲージ
            w_gage[wt] = list2[1];

            wt = wt + 1;
        }
    }

FA_log("【2661】:2.9 wt="+wt);
//2.9 デッキにセットする(出兵処理の前に変更)
    //----------------------------------//
    // デッキにセットできるやつがいる！ //
    //----------------------------------//
	var strSSID = getCookie_23("SSID");	//ﾃﾞｯｷｾｯﾄのﾊﾟﾗﾒｰﾀに使用

    //if( wt > 0 && troop == false){
FA_log("2.9 wt="+wt);
    if( wt > 0 ){	//デッキにセットされていない武将がいる場合
        // 拠点ID
        var data = document.evaluate('//*[@id="hiddenData_autoTroop"]//select[contains(@id,"selected_village_")]/option',
            document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var village_id = data.snapshotItem(villageNo).getAttribute("value");

        for( i = 0; i < wt; i++ ){
            if( parseInt(w_gage[i]) >= parseInt(putDownGage) ){
                //--------------------------------------------//
                // 討伐ゲージ指定値以上ならデッキにセットする //
                //--------------------------------------------//
                var unit_assign_card_id = w_cardid[i];

                var param = "http://" + HOST_23 + "/card/deck.php";
                var data =   "btn_change_flg="
                       + "&mode=set"
                       + "&p=1"
                       + "&target_card=" + unit_assign_card_id
                       + "&ssid="+ strSSID
                       + "&sort_order[]=0"
                       + "&sort_order_type[]=0"
                       + "&show_deck_card_count=1"
                       + "&selected_village[" + unit_assign_card_id + "]=" + village_id
                       + "";

                var opt2 = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    url: param,
                    data: data,
                    onload: function(res) {
                        location.href = location.pathname;
                    }
                }
                GM_xmlhttpRequest(opt2);
                //faraway120524break;

				deck_count++;			//デッキにセットしている武将数
				FA_log("2.9 deck_count="+deck_count);
				//デッキにセットするBC対象武将をn匹までに制限する。
				//（待機中のみに摘要；1だと出兵1、待機1）
				if( OPT_GENERAL_NUM > 0){				//0だと無制限にセット。
					if(deck_count >= OPT_GENERAL_NUM){	//設定数になったらセットしない
						break;
					}
				}

            }
        }
    }

	if(troopflag == 0)
	{
		FA_log("2721:deck_count="+deck_count);
		troopflag = 1;
		return;
	}
	troopflag = 0;
//2.7 出兵処理
    //------------------------//
    // 出兵できるやつがいる！ //
    //------------------------//
    var troop = false;
    //var skip = false;
    if( dt > 0 ){  // 1人はデッキに残す
        // 出兵座標取得
        var x = new Array();
        var y = new Array();
        var check = false;

		//troopAddrBC 出兵先を設定
        var j = 0;
       	x["歩兵"] = parseInt(troopAddrBC[j][1]);
        y["歩兵"] = parseInt(troopAddrBC[j][2]);

        x["弓兵"] = parseInt(troopAddrBC[j][1]);
        y["弓兵"] = parseInt(troopAddrBC[j][2]);

        x["槍兵"] = parseInt(troopAddrBC[j][1]);
        y["槍兵"] = parseInt(troopAddrBC[j][2]);

        x["騎兵"] = parseInt(troopAddrBC[j][1]);
        y["騎兵"] = parseInt(troopAddrBC[j][2]);
        check = true;

//		if( check == true ){
            for( i = 0; i < dt; i++ ){
				FA_log("2716：d_name[i] ="+d_name[i] +" d_gage[i]=" + d_gage[i] +" putDownGage="+putDownGage);	//faraway
                if( parseInt(d_gage[i]) >= parseInt(putDownGage) ){
                    //------------------------------//
                    // 討伐ゲージ指定値以上なら出兵 //
                    //------------------------------//
                    var village_name = "";
                    var unit_assign_card_id = d_cardid[i];
                    var card_id = 212;
                    var radio_move_type = 302;	//殲滅戦
                    var bandit_type = 1;        
                    var param = "http://" + HOST_23 + "/facility/castle_send_troop.php";
                    var data = "btn_send=出兵"
                           + "&village_x_value=" + x[d_type[i]]
                           + "&village_y_value=" + y[d_type[i]]
                           + "&village_name=" + village_name
                           + "&card_id=" + card_id
                           + "&unit_assign_card_id=" + unit_assign_card_id
                           + "&radio_move_type=" + radio_move_type
                           + "&show_beat_bandit_flg=" + bandit_type;
					//スキルを使う？	120612
					var skill = "";
			    	for(var ii = 0; ii < skillKindBC.length; ii++ ){
						if(skillKindBC[ii] == "") break;
						if(skillKindBC[ii] == "xxx"){	//ｽｷﾙ名称
							skill = "use_skill_id%5B"+d_cardid[i]+"%5D=at0020";
							break;
						}
					}
					data = data + skill;

					var	infantry_count       = 0;	/*剣兵		*/
					var	spear_count          = 0;  	/*槍兵		*/
					var	archer_count         = 0;  	/*弓兵		*/
					var	cavalry_count        = 0;  	/*騎兵		*/
					var	halbert_count        = 0;  	/*矛槍兵	*/
					var	crossbow_count       = 0;  	/*弩兵		*/
					var	cavalry_guards_count = 0;  	/*近衛騎兵	*/

					var	scout_count          = 0;  	/*斥候		*/
					var	cavalry_scout_count  = 0;  	/*斥候騎兵	*/
					var	ram_count            = 0;	/*衝車		*/
					var	catapult_count       = 0;	/*投石機	*/

					//随行兵の数設定
					//scout_count          = parseInt(troopCount[7]);    /*斥候		*/
					//cavalry_scout_count  = parseInt(troopCount[8]);    /*斥候騎兵	*/
					//ram_count            = parseInt(troopCount[9]);    /*衝車		*/
					//catapult_count       = parseInt(troopCount[10]);   /*投石機	*/

					if(OPT_CHK_SEND_TROOPS == 1){	//上記設定値以上も、可能な限り出兵する。（車、斥侯除く）
						infantry_count       = parseInt(troopCount[0]);	/*剣兵		*/
						if (infantry_count.toString() == "NaN"){
							infantry_count = 0;
						}
						spear_count          = parseInt(troopCount[1]);    /*槍兵		*/
						if (spear_count.toString() == "NaN"){
							spear_count = 0;
						}
						archer_count         = parseInt(troopCount[2]);    /*弓兵		*/
						if (archer_count.toString() == "NaN"){
							archer_count = 0;
						}
						cavalry_count        = parseInt(troopCount[3]);    /*騎兵		*/
						if (cavalry_count.toString() == "NaN"){
							cavalry_count = 0;
						}
						halbert_count        = parseInt(troopCount[4]);    /*矛槍兵	*/
						if (halbert_count.toString() == "NaN"){
							halbert_count = 0;
						}
						crossbow_count       = parseInt(troopCount[5]);    /*弩兵		*/
						if (crossbow_count.toString() == "NaN"){
							crossbow_count = 0;
						}
						cavalry_guards_count = parseInt(troopCount[6]);    /*近衛騎兵	*/
						if (cavalry_guards_count.toString() == "NaN"){
							cavalry_guards_count = 0;
						}
					}
					else{
						//剣兵
						if(parseInt(OPT_SWORD) <= parseInt(troopCount[0])){
							infantry_count = parseInt(OPT_SWORD);
						}
						else{
							infantry_count = parseInt(troopCount[0]);
						}
						if (infantry_count.toString() == "NaN"){
							infantry_count = 0;
						}
						//槍兵
						if(parseInt(OPT_SPEARMAN) <= parseInt(troopCount[1])){
							spear_count = parseInt(OPT_SPEARMAN);
						}
						else{
							spear_count = parseInt(troopCount[1]);
						}
						if (spear_count.toString() == "NaN"){
							spear_count = 0;
						}
						//弓兵
						if(parseInt(OPT_BOWSOL) <= parseInt(troopCount[2])){
							archer_count = parseInt(OPT_BOWSOL);
						}
						else{
							archer_count = parseInt(troopCount[2]);
						}
						if (archer_count.toString() == "NaN"){
							archer_count = 0;
						}
						//騎兵
						if(parseInt(OPT_TROOPER) <= parseInt(troopCount[3])){
							cavalry_count = parseInt(OPT_TROOPER);
						}
						else{
							cavalry_count = parseInt(troopCount[3]);
						}
						if (cavalry_count.toString() == "NaN"){
							cavalry_count = 0;
						}
						//矛槍兵
						if(parseInt(OPT_ARMS_SPEARMAN) <= parseInt(troopCount[4])){
							halbert_count = parseInt(OPT_ARMS_SPEARMAN);
						}
						else{
							halbert_count = parseInt(troopCount[4]);
						}
						if (halbert_count.toString() == "NaN"){
							halbert_count = 0;
						}
						//弩兵
						if(parseInt(OPT_CROSSBOW) <= parseInt(troopCount[5])){
							crossbow_count = parseInt(OPT_CROSSBOW);
						}
						else{
							crossbow_count = parseInt(troopCount[5]);
						}
						if (crossbow_count.toString() == "NaN"){
							crossbow_count = 0;
						}
						//近衛騎兵
						if(parseInt(OPT_GUARDS) <= parseInt(troopCount[6])){
							cavalry_guards_count = parseInt(OPT_GUARDS);
						}
						else{
							cavalry_guards_count = parseInt(troopCount[6]);
						}
						if (cavalry_guards_count.toString() == "NaN"){
							cavalry_guards_count = 0;
						}
					}

					var count = "";
					count = count + "&infantry_count="+infantry_count;			   /*剣兵		*/
					count = count + "&spear_count="+spear_count;                   /*槍兵		*/
					count = count + "&archer_count="+archer_count;                 /*弓兵		*/
					count = count + "&cavalry_count="+cavalry_count;               /*騎兵		*/
					count = count + "&halbert_count="+halbert_count;               /*矛槍兵		*/
					count = count + "&crossbow_count="+crossbow_count;             /*弩兵		*/
					count = count + "&cavalry_guards_count="+cavalry_guards_count; /*近衛騎兵	*/

//					count = count + "&scout_count="+scout_count;                   /*斥候		*/
//					count = count + "&cavalry_scout_count="+cavalry_scout_count;   /*斥候騎兵	*/
//					count = count + "&ram_count="+ram_count;	                   /*衝車		*/
//					count = count + "&catapult_count="+catapult_count;             /*投石機		*/
					data = data + count;
					FA_log("2833:data="+data+" count="+count);

                    var opt2 = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        url: param,
                        data: data,
                        onload: function(res) {
                            location.href = location.pathname;
                        }
                    }
                    GM_xmlhttpRequest(opt2);

                    //faraway120524break;
                }

//2.8 デッキから外す
				if( OPT_CHK_OUT_DECK_BC == 1)     		//デッキから外す最低討伐(ﾁｪｯｸﾎﾞｯｸｽ)
				{
	                if( d_gage[i] <= OPT_OUT_DECK_BC )	//デッキから外す最低討伐
					{
						//デッキから外す処理
                        var unit_assign_card_id = d_cardid[i];
                        var param = "http://" + HOST_23 + "/card/deck.php";
                        var data =   "btn_change_flg="
                               + "&mode=unset"
                               + "&p=1"
                               + "&target_card=" + unit_assign_card_id;
                        var opt2 = {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            url: param,
                            data: data,
                            onload: function(res) {
                                location.href = location.pathname;
                            }
                        }
                        GM_xmlhttpRequest(opt2);
						deck_count--;			//デッキにセットしている武将数
					}
				}
            }
            //if( skip == false ){
                //120524troop = true;
            //}
//        }
    }

}

//------------------------------//
// 出兵画面ページのローディング //
//------------------------------//
function loadSkillInfo() {
    var url = "http://" + location.hostname + "/facility/castle_send_troop.php#ptop";
    var opt = {
        method: 'GET',
        url: url,
        onload: function(res) {
            getSkillList(res);
        }
    }
    GM_xmlhttpRequest(opt);
	FA_log("2991:loadSkillInfo() end");

	//loopWait(1000);
/*
	var i = 0;
	while(1)
    {
	  	if(loadSkillInfoEnd == 1){
		   break;
		}
		i++;
		FA_log("2935:loadSkillInfo() loadSkillInfoEnd="+loadSkillInfoEnd+" i="+i);
  	}
*/

}
//----------------------//
// スキルパラメータ取得 //
//----------------------//
function getSkillList(res) {
	loadSkillInfoEnd = 0;
    //--------------------//
    // 取得データのセット //
    //--------------------//
    var hidden = $v_23('//*[@id="hiddenData_autoTroop"]');
    //var hidden = $v_23('//*[@id="hiddenData_skill"]');
//	FA_log("2783:getSkillList");
    hidden.snapshotItem(0).innerHTML = res.responseText;
	//alert("2785:res.responseText="+res.responseText);
    //------------------------------------------------------------------------//
    // カード画面から、デッキにいて内政セットされていない武将情報を手に入れる //
    //------------------------------------------------------------------------//
    var text;
    // データ
    var data = document.evaluate('//*[@id="hiddenData_autoTroop"]',
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
FA_log("3027:data.snapshotLength="+data.snapshotLength);

    for( var i = 0; i < data.snapshotLength; i++ ){
        text = data.snapshotItem(i).innerHTML;
	    // スキル名称
        // 対象の文字列を取得する
		var startIndex = 1;
		var endIndex = 0;
	    for(var j = 0;;j++){
//    	    startIndex = text.indexOf("use_skill_id["+unit_assign_card_id+"]",startIndex);
    	    startIndex = text.indexOf("use_skill_id",startIndex);

//			FA_log("2817:startIndex="+startIndex);
			if(startIndex == -1) break;
//			FA_log("2819:startIndex="+startIndex);

        	endIndex = text.indexOf("</td>",startIndex);
	        // 切り出しを行う
    	    workstr = text.substring(startIndex, endIndex);
			//use_skill_id[250923]" value="at0010" type="radio"><a href="#TB_inline?height=340&amp;width=500&amp;inlineId=cardWindow_250923" class="thickbox">槍兵の進撃LV1</a><span class="fs77">[使用可能]</span>

    	    startIndex2 = workstr.indexOf("use_skill_id[");
    	    endIndex2   = workstr.indexOf("]",startIndex2);
    	    skill_cardid[j] = workstr.substring(startIndex2+13, endIndex2);
			FA_log("3051:skill_cardid[j]="+skill_cardid[j]);
    	    startIndex2 = workstr.indexOf("at");
    	    endIndex2   = workstr.indexOf("\" type=",startIndex2);
    	    skillID[j] = workstr.substring(startIndex2, endIndex2);

    	    startIndex2 = workstr.indexOf("class=\"thickbox\">");
    	    endIndex2   = workstr.indexOf("</a>",startIndex2);
    	    skillName[j] = workstr.substring(startIndex2+17, endIndex2);

//			FA_log("2906:skill_cardid["+j+"]="+skill_cardid[j] + "skillID["+j+"]="+skillID[j] + " skillName["+j+"]="+skillName[j]);
			startIndex = endIndex;
		}

		//随行兵の有効数取得
		startIndex = 0;

	    for(var j = 0; j < troopCount.length;j++){
			troopCount[j] = 0;
		}
	    for(var j = 0; j < troopId.length;j++){

			startIndex = text.indexOf("id=\""+troopId[j],startIndex);
        	endIndex   = text.indexOf("</span>",startIndex);
    	    workstr = text.substring(startIndex, endIndex);

    	    startIndex2 = workstr.indexOf(">(");
    	    endIndex2   = workstr.indexOf(")",startIndex2);
    	    troopCount[j] = workstr.substring(startIndex2+2, endIndex2);

			FA_log("----2868:troopCount["+j+"]="+troopCount[j]);
			startIndex = endIndex;
		}

    }
	FA_log("2883:getSkillList() end");
	loadSkillInfoEnd = 1;
}
function FA_log(mes) {
	//GM_log(mes);
}
