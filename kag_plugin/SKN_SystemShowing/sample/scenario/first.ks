; SKN_SystemShowingプラグインのサンプル

; ◆プラグイン読込 その他初期設定
; ￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
@call storage="SKN_SystemShowing.ks"

; 履歴非表示＆メッセージレイヤ及び背景の設定
@history enabled="false"
@position layer="message0" page="fore" opacity="128" color="0x000000"
@image layer="base" storage="bg"




; ◆サンプル
; ￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
@systemShow text="サンプル開始"


@eval exp="tf.bgimage = true"
;▲背景画像が表示されているか

; スタート画面に戻るだけのマクロ
@macro name="戻る"
	@jump target="*スタート"
@endmacro


;■スタート画面
*スタート
[nowait]
	[link target="*ラベルＡ"]リンクＡ[endlink]
	[r]
	[link target="*ラベルＢ"]リンクＢ[endlink]
	[r]
	[link target="*ラベルＣ"]リンクＣ[endlink]
	[r]
	[link target="*トランジション"]トランジション[endlink]
	[r]
	[link target="*スクロール"]スクロールトランジション(不具合あり)[endlink]
[endnowait]
@s


;■リンクＡが押されたとき
*ラベルＡ
@cm
@systemShow text="リンクＡが選択されました"
@戻る

;■リンクＢが押されたとき
*ラベルＢ
@cm
@systemShow text="リンクＢが選択されました"
@戻る

;■リンクＣが押されたとき
*ラベルＣ
@cm
@systemShow text="リンクＣが選択されました"
@systemShow text="同時にいくつでも表示することができます"
@systemShow text="文字列を指定するだけであとは勝手に表示されます"
@戻る


;■トランジションが押されたとき
*トランジション
@cm

@backlay

; 背景画像が表示されていたら消去
; 背景画像が表示されていなかったら表示
@if exp="tf.bgimage"
	@freeimage layer="base" page="back"
	@eval exp="tf.bgimage = false"
@else
	@image layer="base" page="back" storage="bg"
	@eval exp="tf.bgimage = true"
@endif

; トランジションで表示
@systemShow text="トランジションテスト開始"
@trans method="crossfade" time="1000"
@wt
@systemShow text="トランジションテスト終了"

@戻る

;■スクロールトランジションが押されたとき
*スクロール
@cm

@backlay

; 背景画像が表示されていたら消去
; 背景画像が表示されていなかったら表示
@if exp="tf.bgimage"
	@freeimage layer="base" page="back"
	@eval exp="tf.bgimage = false"
@else
	@image layer="base" page="back" storage="bg"
	@eval exp="tf.bgimage = true"
@endif


; トランジションで表示
@systemShow text="スクロールトランジション"
@systemShow text="KAG版ではシステムレイヤもトランジションされてしまいます。"
@trans method="scroll" from="bottom" time="1000"
@wt
@systemShow text="トランジションテスト終了"

@戻る