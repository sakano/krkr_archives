@wait time=200
@env init
@linemode mode=free

*start
; ▼選択肢後はスキップ解除
@eval exp=kag.afterskip=false
; ▼コメントアウトを外すと選択肢後スキップ継続でテスト
;@eval exp=kag.afterskip=true

*fade_default
単純な type=fade
選択肢はどれを選んでもおなじです

@seladd text=選択肢１ target=*fade_each
@seladd text=選択肢２ target=*fade_each
@seladd text=選択肢３ target=*fade_each
@selact show type="fade"
@selact hide type="fade"
@select
; ▲属性値を省略すると true になるので注意
; 「show」 は 「show=true」 とおなじ

*fade_each
間隔をあけた type=fade
消去時は reverse=true

@seladd text=選択肢１ target=*fade_accel
@seladd text=選択肢２ target=*fade_accel
@seladd text=選択肢３ target=*fade_accel
@seladd text=選択肢４ target=*fade_accel
@selact show type="fade" time=600 waittime=200
@selact hide type="fade" time=600 waittime=200 reverse
@select
; ▲reverse をつけるとアクションの順番が逆順になります

*fade_accel
加速度をつけた type=fade

@seladd text=選択肢１ target=*scroll_default
@seladd text=選択肢２ target=*scroll_default
@seladd text=選択肢３ target=*scroll_default
@seladd text=選択肢４ target=*scroll_default
@seladd text=選択肢５ target=*scroll_default
@selact show type="fade" time=600 waittime=200 accel=0.1
@selact hide type="fade" time=600 waittime=100 accel=-0.1
@select
; ▲accel 属性で加速度を指定できます

*scroll_default
単純な type=scroll

@seladd text=選択肢１ target=*scroll_each
@seladd text=選択肢２ target=*scroll_each
@selact show type="scroll" from=left
@selact hide type="scroll" from=left
@select

*scroll_each
間隔をあけた type=scroll
消去時は reverse=true

@seladd text=選択肢１ target=*scroll_accel
@seladd text=選択肢２ target=*scroll_accel
@seladd text=選択肢３ target=*scroll_accel
@seladd text=選択肢４ target=*scroll_accel
@seladd text=選択肢５ target=*scroll_accel
@selact show type="scroll" from=right time=600 waittime=100
@selact hide type="scroll" from=right time=600 waittime=200 reverse
@select

*scroll_accel
加速度をつけた type=scroll
表示時は reverse=true

@seladd text=選択肢１ target=*scroll_from
@seladd text=選択肢２ target=*scroll_from
@seladd text=選択肢３ target=*scroll_from
@selact show type="scroll" from=right time=800 waittime=200 accel=-0.1 reverse
@selact hide type="scroll" from=right time=800 waittime=200 accel=0.1
@select


*scroll_from
別方向の type=scroll

@seladd text=選択肢１ target=*scroll_fromeach
@seladd text=選択肢２ target=*scroll_fromeach
@seladd text=選択肢３ target=*scroll_fromeach
@selact show type="scroll" from=top time=400
@selact hide type="scroll" from=bottom time=400
@select

*scroll_fromeach
間隔をあけた別方向の type=scroll

@seladd text=選択肢１ target=*each
@seladd text=選択肢２ target=*each
@seladd text=選択肢３ target=*each
@selact show type="scroll" from=top time=600 waittime=140
@selact hide type="scroll" from=bottom time=600 waittime=140 reverse
@select

*each
@iscript
	// アクション定義
	tf.showDic = [];
	tf.showDic[0] = %[
		top : %[
			handler : MoveAction,
			start : "@+640", // 選択肢は 標準の位置で初期化されているので相対指定が使えます
			value : "@",
			accel : -1,
			time : 500,
			canskip : true,
		],
		opacity : %[
			handler : MoveAction,
			start : 255, // 表示するとき、選択肢は opacity=0 で初期化されているので不透明度を上げる必要があります
			value : 255,
			time : 0,
		],
	];
	tf.showDic[1] = %[
		top : %[ handler:MoveAction, start:"@-640", value:"@", accel:-1, time:500, canskip:true, ],
		opacity : %[ handler:MoveAction, start:255, value:255, time:0, ],
	];
	tf.hideDic = [];
	tf.hideDic[0] = %[
		left : %[ handler:MoveAction, start:"@", value:"@+640", accel:1, time:500, canskip:true, ],
		opacity : %[ handler:MoveAction, start:255, value:0, accel:1, time:500, canskip:true, ],
	];
	tf.hideDic[1] = %[
		left : %[ handler:MoveAction, start:"@", value:"@-640", accel:1, time:500, canskip:true, ],
		opacity : %[ handler:MoveAction, start:255, value:0, accel:1, time:500, anskip:true, ],
	];
@endscript
個別にアクションを指定

@seladd text=選択肢１ target=*p_each showaction=tf.showDic[0] hideaction=tf.hideDic[0]
@seladd text=選択肢２ target=*p_each showaction=tf.showDic[1] hideaction=tf.hideDic[1]
@select
; ▲showaction, hideaction 属性で直接ボタンごとにアクションを指定できます

*p_each
一部の選択肢のみ個別にアクションを指定

@seladd text=選択肢１ target=*end showaction=tf.showDic[0] 
@seladd text=選択肢２ target=*end hideaction=tf.hideDic[1]
@seladd text=選択肢３ target=*end showaction=tf.showDic[1]
@seladd text=選択肢４ target=*end hideaction=tf.hideDic[1]
@selact show type=scroll time=500 from=right accel=-1
@selact hide type=scroll time=500 from=right accel=1
@select
; ▲[seladd]タグで指定されなかった属性のみ[selact]タグで指定されます

*end
最初にもどります

@next target=*start
