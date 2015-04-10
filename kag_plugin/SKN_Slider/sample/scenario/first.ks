; SKN_SliderLayerƒvƒ‰ƒOƒCƒ“‚ÌƒTƒ“ƒvƒ‹


; Ÿƒvƒ‰ƒOƒCƒ““Ç ‚»‚Ì‘¼‰Šúİ’è
; PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
@call storage="SKN_Slider.ks"
@history enabled="false"
@position layer="message0" page="fore" opacity="128" color="0x000000"
@image layer="base" storage="bg"
@playbgm storage="bgm"

; ŸƒXƒ‰ƒCƒ_[İ’è
; PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
; ƒXƒ‰ƒCƒ_[‚Ì’l‚ğ“ü‚ê‚é”z—ñ
@eval exp="f.slider = [ (int)(kag.bgm.buf1.volume2 / 1000), (int)(kag.se[0].volume2 / 1000), 0, 0, 0,128]"

; ƒXƒ‰ƒCƒ_[‚Ì”
@setSliderCount sliders="6"

; ƒXƒ‰ƒCƒ_[0‚Ìİ’è(ã‚©‚ç‚P”Ô–Ú‚ÌƒXƒ‰ƒCƒ_) - (BGM‰¹—Ê’²®)
@setSliderImages slider="0" forebase="base_white" forethumb="note_black"
@setSliderOptions slider="0" page="fore" visible="true" left="100" top="50" changing="20" max="100" min="0" visible="true" mtop="-5" mleft="-3" scale="2" hit="true" cursor="false"
; ƒXƒ‰ƒCƒ_[1‚Ìİ’è(ã‚©‚ç‚Q”Ô–Ú‚ÌƒXƒ‰ƒCƒ_) - (SE‰¹—Ê’²®)
@setSliderImages slider="1" forebase="base_yellow" forethumb="note_red"
@setSliderOptions slider="1" page="fore" visible="true" left="100" top="100" changing="20" max="100" min="0" visible="true" mtop="-5" mleft="-3" scale="2" hit="true" cursor="true"
; ƒXƒ‰ƒCƒ_[2‚Ìİ’è(ã‚©‚ç‚R”Ô–Ú‚ÌƒXƒ‰ƒCƒ_) - (Ô)
@setSliderImages slider="2" forebase="base_pink" forethumb="thumb_tomato"
@setSliderOptions slider="2" page="fore" visible="true" left="50" top="180" changing="30" max="255" min="0" visible="true" scale="1" hit="true" cursor="true"
; ƒXƒ‰ƒCƒ_[3‚Ìİ’è(ã‚©‚ç‚S”Ô–Ú‚ÌƒXƒ‰ƒCƒ_) - (—Î)
@setSliderImages slider="3" forebase="base_lime" forethumb="thumb_lime"
@setSliderOptions slider="3" page="fore" visible="true" left="50" top="230" changing="30" max="255" min="0" visible="true" scale="1" hit="true" cursor="true"
; ƒXƒ‰ƒCƒ_[4‚Ìİ’è(ã‚©‚ç‚T”Ô–Ú‚ÌƒXƒ‰ƒCƒ_) - (Â)
@setSliderImages slider="4" forebase="base_aqua" forethumb="thumb_purple"
@setSliderOptions slider="4" page="fore" visible="true" left="50" top="280" changing="30" max="255" min="0" visible="true" scale="1" hit="true" cursor="true"
; ƒXƒ‰ƒCƒ_[5‚Ìİ’è(ã‚©‚ç‚U”Ô–Ú‚ÌƒXƒ‰ƒCƒ_) - (“§–¾“x)
@setSliderImages slider="5" forebase="base_gray" forethumb="thumb_gray"
@setSliderOptions slider="5" page="fore" visible="true" left="50" top="330" changing="30" max="255" min="0" visible="true" scale="1" hit="true" cursor="true"


; ƒXƒ‰ƒCƒ_‚ª“®‚¢‚½‚Æ‚«‚Ìˆ—
[iscript]
	// ƒXƒ‰ƒCƒ_‚Ì’l‚ª•Ï‚í‚Á‚½‚ÉŒÄ‚Ño‚³‚ê‚éŠÖ”
	// num(’l‚ª•Ï‚í‚Á‚½ƒXƒ‰ƒCƒ_‚Ì”Ô†), page(’l‚ª•Ï‚í‚Á‚½ƒXƒ‰ƒCƒ_‚Ìƒy[ƒW)‚Ì2‚Â‚Ìˆø”‚ª‚Æ‚ê‚Ü‚·B
function myValueChangeHook(num, page) {
	if (!kag.inSleep) { return; } // sƒ^ƒO‚Å~‚Ü‚Á‚Ä‚¢‚È‚©‚Á‚½‚ç‰½‚à‚µ‚È‚¢B
	
	tf.name = "f.slider[" + num + "]";
	skn_slider.getSliderValue(%["slider"=>num, "name"=>tf.name]); // [getSliderValue slider="&num" name="&tf.name"]‚Æ“¯‚¶
		// £‚±‚ê‚Åf.slider‚Ì’l‚Íí‚ÉÅV‚Ì’l‚É‚È‚é£
		
	if (num == 0 && page == "fore") { // ƒXƒ‰ƒCƒ_0‚Ì•\‰æ–Ê‚Ì’l‚ª•Ï‚í‚Á‚½B
		kag.process("","*bgmSlider");
	} else if (num == 1 && page == "fore") {// ƒXƒ‰ƒCƒ_1‚Ì•\‰æ–Ê‚Ì’l‚ª•Ï‚í‚Á‚½	
		kag.process("", "*seSlider");
	} else if (2 <= num && num <= 5 && page == "fore") { // ƒXƒ‰ƒCƒ_2~5‚Ì•\‰æ–Ê‚Ì’l‚ª•Ï‚í‚Á‚½B
		kag.process("", "*messageSlider");
	}
}
[endscript]
@eval exp="skn_slider.valueChangeHook.add(myValueChangeHook)"
; £ì‚Á‚½ŠÖ”(myValueChangeHook)‚ğvalueChangeHook‚É“o˜^£  i’l‚ª•Ï‚í‚Á‚½‚É“o˜^‚µ‚½ŠÖ”‚ªŒÄ‚Î‚ê‚éBj

; ƒXƒ‰ƒCƒ_‚Ì’l‚ğ‰Šúİ’è
@eval exp="tf.index = 0"
*_loop_setValue
@setSliderValue slider="&tf.index" value="&f.slider[tf.index]"
@eval exp="tf.index += 1"
@jump target="*_loop_setValue" cond="tf.index < skn_slider.sliderCount"
; £skn_slider.sliderCount‚ÍƒXƒ‰ƒCƒ_‚Ì”‚Å‚·£

; ƒXƒ‰ƒCƒ_‚ÌŒ»İ’l‚ğ•\¦
@call target="*showValues"

; Ÿƒ{ƒ^ƒ“”z’u
; PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
@call target="*putButton"
@backlay
@trans method=crossfade time=1000
@wt

; Ÿ”z’uI—¹
; PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
; ƒXƒ‰ƒCƒ_‚Ì“ü—Íó•tŠJn
@setSliderEnabled enabled="true"
@s









; Ÿƒ{ƒ^ƒ“‚ª‰Ÿ‚³‚ê‚½‚Æ‚«‚Ìˆ—
; PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
; Ä¶ƒ{ƒ^ƒ“‚ª‰Ÿ‚³‚ê‚½‚Æ‚«‚Ìˆ—
*volume
@setSliderEnabled enabled="false"
; SE‚ğÄ¶
[playse storage="se"][ws]
; ƒXƒ‰ƒCƒ_‚Ì’l•\¦XV
@cm
@call target="*putButton"
@call target="*showValues"
@setSliderEnabled enabled="true"
@s

; ŸƒXƒ‰ƒCƒ_‚ª“®‚¢‚½‚Æ‚«‚Ìˆ—
; PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
; BGM‰¹—Ê’²®‚ÌƒXƒ‰ƒCƒ_‚ª“®‚¢‚½‚Æ‚«‚Ìˆ—
*bgmSlider
@setSliderEnabled enabled="false"
@bgmopt gvolume="&f.slider[0]"
; ƒXƒ‰ƒCƒ_‚Ì’l•\¦XV
@cm
@call target="*putButton"
@call target="*showValues"
@setSliderEnabled enabled="true"
@s

; SE‰¹—Ê’²®‚ÌƒXƒ‰ƒCƒ_‚ª“®‚¢‚½‚Æ‚«‚Ìˆ—
*seSlider
@setSliderEnabled enabled="false"
@seopt buf="0" gvolume="&f.slider[1]"
; ƒXƒ‰ƒCƒ_‚Ì’l•\¦XV
@cm
@call target="*putButton"
@call target="*showValues"
@setSliderEnabled enabled="true"
@s

; ƒƒbƒZ[ƒWƒEƒBƒ“ƒhƒE‚ÌFor“§–¾“x’²®‚ÌƒXƒ‰ƒCƒ_‚ª“®‚¢‚½‚Æ‚«‚Ìˆ—
*messageSlider
@setSliderEnabled enabled="false"
@position layer="message0" page="fore" color="&'0x%02x%02x%02x'.sprintf(f.slider[2], f.slider[3], f.slider[4])" opacity="&f.slider[5]"
; ƒXƒ‰ƒCƒ_‚Ì’l•\¦XV(positionİ’è‚·‚é‚ÆÁ‚¦‚é‚Ì‚Å[cm]•K—v‚È‚µ)
@call target="*putButton"
@call target="*showValues"
@setSliderEnabled enabled="true"
@s

		
; ŸƒTƒuƒ‹[ƒ`ƒ“
; PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

; ƒ{ƒ^ƒ“‚ğ”z’u‚·‚éƒTƒuƒ‹[ƒ`ƒ“
*putButton
@current layer="message0" page="fore"
@locate x="300" y="75"
@button graphic="button_play" target="*volume"
@return

; ƒXƒ‰ƒCƒ_‚Ì’l‚ğ•\¦‚·‚éƒTƒuƒ‹[ƒ`ƒ“
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