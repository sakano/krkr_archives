@wait time=500
@env init
@linemode mode=page

*test0
; canskip パラメータのテスト
@iscript
	// アクションの準備
	var actionArray = [
		%[
			opacity : %[
				handler:MoveAction,
				value:0,
				time:500,
			],
		],
		%[
			opacity : %[
				handler:MoveAction,
				value:255,
				time:500,
			],
			canskip:true, // canskip
		],
		%[
			loop : 0,
		],
	];
	function onCompleted() {
		invalidate layer;
		kag.process("","*test1");
	}
	// レイヤの準備
	var layer = new Layer(kag, kag.fore.base);
	layer.colorRect(0, 0, 32, 32, 0xFF0000, 255);
	layer.visible = true;
	// アクション開始
	kag.beginAction(layer, actionArray, onCompleted, false);
@endscript
@nowait
	スキップ機能のテスト。リターンキー、コントロールキー、左クリック、スペースキーでアクションが終了します。[nor]
@endnowait
@s


*test1
; boost パラメータのテスト

[nowait]
	ブースト機能のテスト。リターンキー、コントロールキー、左クリック、スペースキーで早送りできます。[nor]
[endnowait]

@newlay name=スタッフロール file=image ypos=-760
@スタッフロール 流れるアクション
@wat canskip=false

@nowait
	アクションおわり。[nor]
@endnowait
