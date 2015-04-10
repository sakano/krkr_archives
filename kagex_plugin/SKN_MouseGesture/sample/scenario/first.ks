@env init

@position layer=message1 top=400 visible
@linemode mode=free
@current layer=message0

;▼右クリック動作と共存可能になりました
@rclick call storage=first.ks target=*RCLICK

;▼マウスジェスチャ登録
; ※「enabled」は「enabled=true」とおなじ
@setgesture gesture=2 enabled exp="kag.onExitMenuItemClick()"
@setgesture gesture=4 enabled exp="kag.onShowHistoryMenuItemClick()"
@setgesture gesture=8 enabled exp="kag.onAutoModeMenuItemClick()"
@setgesture gesture=6 enabled exp="kag.onSkipToNextStopMenuItemClick()"
@setgesture gesture=2684 enabled exp="Debug.console.visible = !Debug.console.visible"
@setgesture gesture=86 enabled call target=*MG_UR storage=first.ks

;▼マウスジェスチャ受付開始
@mousegesture enabled limit=5



;▼以下サンプル用テキストの繰り返し
*START

マウスジェスチャのサンプルです

「↑」で終了確認
「→」で既読スキップ
「↓」でオートモード
「←」で履歴表示
「↑→↓←」でコンソール表示
「↓←」でマウスジェスチャサブルーチン
右クリックで右クリックサブルーチンです。

最初にジャンプします。

@next target=*START


*RCLICK
; 右クリックサブルーチン
	@call target=*routine_start
	@nowait
		右クリックルーチンに入りました。[r]
		クリックで戻ります。
	@endnowait
	[p][er]

	@call target=*routine_end
@return

*MG_UR
; マウスジェスチャサブルーチン
	@call target=*routine_start

	@nowait
		マウスジェスチャサブルーチンに入りました。[r]
		クリックで戻ります。
	@endnowait
	[p][er]

	@call target=*routine_end
@return


*routine_start
; サブルーチンの開始処理
	@linemode mode=none
	@current layer=message1
	@rclick enabled=false
	;▼マウスジェスチャ受付停止
	@mousegesture enabled=false
@return

*routine_end
; サブルーチンの終了処理
	@linemode mode=free
	@current layer=message0
	@rclick enabled
	;▼マウスジェスチャ受付再開
	@mousegesture enabled
@return
