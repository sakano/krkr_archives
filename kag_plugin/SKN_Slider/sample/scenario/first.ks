; SKN_SliderLayerプラグインのサンプル


; ◆プラグイン読込 その他初期設定
; ￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
@call storage="SKN_Slider.ks"
@history enabled="false"
@position layer="message0" page="fore" opacity="128" color="0x000000"
@image layer="base" storage="bg"
@playbgm storage="bgm"

; ◆スライダー設定
; ￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
; ◇スライダーの値を入れる配列
@eval exp="f.slider = [ (int)(kag.bgm.buf1.volume2 / 1000), (int)(kag.se[0].volume2 / 1000), 0, 0, 0,128]"

; ◇スライダーの数
@setSliderCount sliders="6"

; ◇スライダー0の設定(上から１番目のスライダ) - (BGM音量調整)
@setSliderImages slider="0" forebase="base_white" forethumb="note_black"
@setSliderOptions slider="0" page="fore" visible="true" left="100" top="50" changing="20" max="100" min="0" visible="true" mtop="-5" mleft="-3" scale="2" hit="true" cursor="false"
; ◇スライダー1の設定(上から２番目のスライダ) - (SE音量調整)
@setSliderImages slider="1" forebase="base_yellow" forethumb="note_red"
@setSliderOptions slider="1" page="fore" visible="true" left="100" top="100" changing="20" max="100" min="0" visible="true" mtop="-5" mleft="-3" scale="2" hit="true" cursor="true"
; ◇スライダー2の設定(上から３番目のスライダ) - (赤)
@setSliderImages slider="2" forebase="base_pink" forethumb="thumb_tomato"
@setSliderOptions slider="2" page="fore" visible="true" left="50" top="180" changing="30" max="255" min="0" visible="true" scale="1" hit="true" cursor="true"
; ◇スライダー3の設定(上から４番目のスライダ) - (緑)
@setSliderImages slider="3" forebase="base_lime" forethumb="thumb_lime"
@setSliderOptions slider="3" page="fore" visible="true" left="50" top="230" changing="30" max="255" min="0" visible="true" scale="1" hit="true" cursor="true"
; ◇スライダー4の設定(上から５番目のスライダ) - (青)
@setSliderImages slider="4" forebase="base_aqua" forethumb="thumb_purple"
@setSliderOptions slider="4" page="fore" visible="true" left="50" top="280" changing="30" max="255" min="0" visible="true" scale="1" hit="true" cursor="true"
; ◇スライダー5の設定(上から６番目のスライダ) - (透明度)
@setSliderImages slider="5" forebase="base_gray" forethumb="thumb_gray"
@setSliderOptions slider="5" page="fore" visible="true" left="50" top="330" changing="30" max="255" min="0" visible="true" scale="1" hit="true" cursor="true"


; ◇スライダが動いたときの処理
[iscript]
	// スライダの値が変わった時に呼び出される関数
	// num(値が変わったスライダの番号), page(値が変わったスライダのページ)の2つの引数がとれます。
function myValueChangeHook(num, page) {
	if (!kag.inSleep) { return; } // sタグで止まっていなかったら何もしない。
	
	tf.name = "f.slider[" + num + "]";
	skn_slider.getSliderValue(%["slider"=>num, "name"=>tf.name]); // [getSliderValue slider="&num" name="&tf.name"]と同じ
		// ▲これでf.sliderの値は常に最新の値になる▲
		
	if (num == 0 && page == "fore") { // スライダ0の表画面の値が変わった。
		kag.process("","*bgmSlider");
	} else if (num == 1 && page == "fore") {// スライダ1の表画面の値が変わった	
		kag.process("", "*seSlider");
	} else if (2 <= num && num <= 5 && page == "fore") { // スライダ2~5の表画面の値が変わった。
		kag.process("", "*messageSlider");
	}
}
[endscript]
@eval exp="skn_slider.valueChangeHook.add(myValueChangeHook)"
; ▲作った関数(myValueChangeHook)をvalueChangeHookに登録▲  （値が変わった時に登録した関数が呼ばれる。）

; ◇スライダの値を初期設定
@eval exp="tf.index = 0"
*_loop_setValue
@setSliderValue slider="&tf.index" value="&f.slider[tf.index]"
@eval exp="tf.index += 1"
@jump target="*_loop_setValue" cond="tf.index < skn_slider.sliderCount"
; ▲skn_slider.sliderCountはスライダの数です▲

; ◇スライダの現在値を表示
@call target="*showValues"

; ◆ボタン配置
; ￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
@call target="*putButton"
@backlay
@trans method=crossfade time=1000
@wt

; ◆配置終了
; ￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
; スライダの入力受付開始
@setSliderEnabled enabled="true"
@s









; ◆ボタンが押されたときの処理
; ￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
; ◇再生ボタンが押されたときの処理
*volume
@setSliderEnabled enabled="false"
; SEを再生
[playse storage="se"][ws]
; スライダの値表示更新
@cm
@call target="*putButton"
@call target="*showValues"
@setSliderEnabled enabled="true"
@s

; ◆スライダが動いたときの処理
; ￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
; ◇BGM音量調整のスライダが動いたときの処理
*bgmSlider
@setSliderEnabled enabled="false"
@bgmopt gvolume="&f.slider[0]"
; スライダの値表示更新
@cm
@call target="*putButton"
@call target="*showValues"
@setSliderEnabled enabled="true"
@s

; ◇SE音量調整のスライダが動いたときの処理
*seSlider
@setSliderEnabled enabled="false"
@seopt buf="0" gvolume="&f.slider[1]"
; スライダの値表示更新
@cm
@call target="*putButton"
@call target="*showValues"
@setSliderEnabled enabled="true"
@s

; ◇メッセージウィンドウの色or透明度調整のスライダが動いたときの処理
*messageSlider
@setSliderEnabled enabled="false"
@position layer="message0" page="fore" color="&'0x%02x%02x%02x'.sprintf(f.slider[2], f.slider[3], f.slider[4])" opacity="&f.slider[5]"
; スライダの値表示更新(position設定すると消えるので[cm]必要なし)
@call target="*putButton"
@call target="*showValues"
@setSliderEnabled enabled="true"
@s

		
; ◆サブルーチン
; ￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣

; ◇ボタンを配置するサブルーチン
*putButton
@current layer="message0" page="fore"
@locate x="300" y="75"
@button graphic="button_play" target="*volume"
@return

; ◇スライダの値を表示するサブルーチン
*showValues
@current layer="message0" page="fore"
[nowait]
[locate x="400" y="20"][emb exp="f.slider[0]"]
[locate x="400" y="70"][emb exp="f.slider[1]"]
[locate x="400" y="150"][emb exp="f.slider[2]"]
[locate x="400" y="200"][emb exp="f.slider[3]"]
[locate x="400" y="250"][emb exp="f.slider[4]"]
[locate x="400" y="300"][emb exp="f.slider[5]"]
[endnowait]
@return