; 一回しか読み込まない
[if exp="tf.SKN_Slider_GUARD"]
	@return
[endif]
@eval exp="tf.SKN_Slider_GUARD = true"


@iscript
// 本体読込
Scripts.evalStorage("SKN_SliderLayer.tjs");

	// ◆SKN_SliderのKAG組み込み用クラス
	// ￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
class SKN_SliderForKAG extends KAGPlugin {
	var window;	// KAGWindowオブジェクト
	var sliders = [];	// スライダ管理オブジェクト
	var sliderCount = 0;	// オブジェクトの数
	var fore = %["maxValues" => [], "minValues" => [], "scale" => [], "curValues" => []];
	var back = %["maxValues" => [], "minValues" => [], "scale" => [], "curValues" => []];
	/****** fore, backの中身 ******
		maxValues = [];	// スライダの最大値
		minValues = [];	// スライダの最小値
		scale = [];	// 1目盛りの幅(px単位)
		curValues = []; // 保存、読込時専用
	*/
	var valueChangeHook = []; // 値が変わった時に呼び出される
	
	// ------------------------------------------------------------------------ マネージャ管理関数
	function SKN_SliderForKAG(win) { this.window = win; }
	function finalize() { for (var i = 0; i < sliderCount; ++i) { invalidate sliders[i]; } }
	
	function addSlider(num) {
		// スライダを生成
		sliders[num] = new SKN_Slider(window);
		fore.maxValues[num] = back.maxValues[num] = 100;
		fore.minValues[num] = back.minValues[num] = 0;
		fore.curValues[num] = back.curValues[num] = 0;
		fore.scale[num] = back.scale[num] = 1;
		sliders[num].fore.baseLayer.name="スライダ\[" + num +"\]表 ベース";
		sliders[num].fore.thumbLayer.name="スライダ\[" + num +"\]表 つまみ";
		sliders[num].back.baseLayer.name="スライダ\[" + num +"\]裏 ベース";
		sliders[num].back.thumbLayer.name="スライダ\[" + num +"\]裏 つまみ";
		
		// sliders[num].onValueChangedオーバーロード
		sliders[num].NUMBER = num;
		sliders[num].OWNER = this;
		sliders[num].onValueChanged = function(page) {
			OWNER.onValueChange(NUMBER, page);
		} incontextof sliders[num];
	}
	function eraseSlider(num) {
		// スライダ消去
		invalidate sliders[num];
		delete fore.maxValues[num];
		delete back.maxValues[num];
		delete fore.minValues[num];
		delete back.minValues[num];
		delete fore.scale[num];
		delete back.scale[num];
		delete fore.curValues[num];
		delete back.curValues[num];
	}
	function getSliderPageFromElm(elm) {
		if (elm.page == "back") {
			return sliders[+elm.slider].back;
		}
		return sliders[+elm.slider].fore;
	}
	function getThisPageFromElm(elm) {
		if (elm.page == "back") {
			return this.back;
		}
		return this.fore;
	}
	function clearSliderImages(page, num) {
		// 指定されたスライダの画像情報をクリア
		// page == voidのときは両面クリア
		if(num !== void) { sliders[num].clearImages(page); }
		for (var i = 0; i < sliderCount; ++i) {
			sliders[i].clearImages(page);
		}
	}
	
	// ------------------------------------------------------------------------ マクロ用関数
	function setSliderCount(elm) {
		// スライダの数をelm.slidersに設定
		if(sliderCount > elm.sliders) {
			for(var i = elm.sliders; i < sliderCount; ++i) {
				eraseSlider(i);
			}
		}
		else if(sliderCount < elm.sliders) {
			// レイヤが増える
			for(var i = sliderCount; i < elm.sliders; ++i) {
				addSlider(i);
			}
		}
		sliderCount = elm.sliders;
	}
	function setSliderImages(elm) {
		// スライダの画像を設定
		sliders[+elm.slider].setImages(elm);
	}	
	function setSliderOptions(elm) {
		// スライダの属性を設定		
		var page = getSliderPageFromElm(elm);
		var t_page = getThisPageFromElm(elm);
			// このクラスで管理しているデータ
		with(t_page) {
			.scale[+elm.slider] = +elm.scale if elm.scale !== void;
			.maxValues[+elm.slider] = +elm.max if elm.max !== void;
			.minValues[+elm.slider] = +elm.min if elm.min !== void;
		}
			// スライダの関数に渡す引数(voidを渡すと変更されない)
		var top = (elm.top === void ? void : +elm.top);
		var left = (elm.left === void ? void : +elm.left);
		var mleft = (elm.mleft === void ? void : +elm.mleft);
		var mright = t_page.scale[+elm.slider] * (t_page.maxValues[+elm.slider] - t_page.minValues[+elm.slider] + 1) + mleft;
		var mtop = (elm.mtop === void ? void : +elm.mtop);
			// スライダの関数呼び出し
		with(sliders[+elm.slider]) {
			.setThumbRange(page, mleft, mright, mtop);
			.setPosition(page, top, left, mtop) if (top !== void || left !== void || mtop !== void);
			.setHitThreshold(page, (elm.hit ? 0 : 16)) if elm.hit !== void;
			.setChangingValue(page, +elm.changing) if elm.changing !== void;
			.setEnabled(page, +elm.enabled) if elm.enabled !== void;
			.setCursorChanging(page, +elm.curchanging) if elm.curchanging !== void;
			.setCursorEnabled(page, +elm.cursor) if elm.cursor !== void;
			.setVisible(page, +elm.visible) if elm.visible !== void;
		}
	}
	function setSliderEnabled(elm) {
		// 全てのスライダのenabledを一括で変更
		elm.enabled = +elm.enabled;
		for (var i = 0; i < sliderCount; ++i) {
			with(sliders[i]) {
				.setEnabled(.fore, elm.enabled);
				.setEnabled(.back, elm.enabled);
			}
		}
	}		
	function setSliderValue(elm) {
		// スライダの値を設定
		getSliderValue(%["slider"=>elm.slider, "page"=>elm.page, "name"=>"tf.skn_old_value"]);
		if (tf.skn_old_value != elm.value) {	// 変更前と値が異なっていたら
			var page = getSliderPageFromElm(elm);
			var t_page = getThisPageFromElm(elm);
			elm.value = (int)(elm.value * t_page.scale[+elm.slider]);
			sliders[+elm.slider].setValue(page, elm.value);
		}
	}	
	function getSliderValue(elm) {
		// スライダの値を返す
		var value = sliders[+elm.slider].getCurrentValue(getSliderPageFromElm(elm));
		var r;
		with (getThisPageFromElm(elm)) {
			r = (int)(value / .scale[+elm.slider]);
			if (r > .maxValues[+elm.slider]) { r = .maxValues[+elm.slider]; }
			if (r < .minValues[+elm.slider]) { r = .minValues[+elm.slider]; }
		}
		Scripts.eval('(' + elm.name + ') = ' + r);
	}	
	function getSliderValues(elm) {
		// 全てのスライダの値を一括で得る
		if (sliderCount == 0) {
			Debug.message("スライダが存在しないときにgetSliderValuesが呼ばれました");
			return;
		}
		var page = getSliderPageFromElm(elm);
		for (var i = 0; i < sliderCount; ++i) {
			getSliderValue(%["slider" => i, "page" => elm.page, "name" => elm.name + '[' + i + ']' ]);
		}
	}
	
	// ------------------------------------------------------------------------ セーブ/ロード対応
	function onStore(f, elm) {
		// 栞を保存する際に呼ばれる
		f.skn_slider_store = %[];
		f.skn_slider_store["fore"] = %[];
		f.skn_slider_store["back"] = %[];
		setCurValues() if this.sliderCount != 0;
		(Dictionary.assignStruct incontextof f.skn_slider_store["fore"])(this.fore);
		(Dictionary.assignStruct incontextof f.skn_slider_store["back"])(this.back);
		f.skn_slider_store["sliderCount"] = this.sliderCount;		
		f.skn_slider_store["sliders"] = [];
		for (var i = 0; i < this.sliderCount; ++i) {
			with (this.sliders[i]) {
				f.skn_slider_store["sliders"][i] = %["fore" => %[], "back" => %[]];
				(Dictionary.assignStruct incontextof f.skn_slider_store["sliders"][i].fore)(.fore);
				(Dictionary.assignStruct incontextof f.skn_slider_store["sliders"][i].back)(.back);
			}
		}
	}	
	function onRestore(f, clear, elm) {
		// 栞を読み出すときに呼ばれる		
		if (elm !== void && elm.backlay) {	// temploadかつ backlay == trueのとき(表画面の情報を裏画面に読み込む)
			var sliders = (f.skn_slider_store['sliderCount'] > sliderCount ? f.skn_slider_store['sliderCount'] : sliderCount);
			setSliderCount(%["sliders" => sliders]);	// オブジェクトの数を設定
			for (var i = 0; i < this.sliderCount; ++i) {
				with(f.skn_slider_store["sliders"][i]) {
					if (.fore.baseImage !== void) { clearSliderImages("back", i); }
					setSliderImages(%["slider" => i, "backbase" => .fore.baseImage, "backthumb" => .fore.thumbImage]);
					restoreSlider(i, "back", .fore, f.skn_slider_store.fore);
				}
			}
		}
		else {	// 通常のロード
			setSliderCount(%["sliders" => f.skn_slider_store['sliderCount']]);	// オブジェクト生成
			for (var i = 0; i < this.sliderCount; ++i) {
				with (f.skn_slider_store["sliders"][i]) {
					if (.fore.baseImage !== void) { clearSliderImages("fore", i); }
					if (.back.baseImage !== void) { clearSliderImages("back", i); }
					setSliderImages(%["slider" => i, "forebase" => .fore.baseImage, "backbase" => .back.baseImage, "forethumb" => .fore.thumbImage, "backthumb" => .back.thumbImage]); // 画像指定
					restoreSlider(i, "fore", .fore, f.skn_slider_store.fore); // 表画面
					restoreSlider(i, "back", .back, f.skn_slider_store.back); // 裏画面
				}
			}
			
		}
	}
	function restoreSlider(slider, page = "fore", sliderDic, thisDic) {
		// 指定されたスライダを引数に従って復元
		// slider : 0,1,2,...
		// page : "fore" or "back"
		// sldierDic : f.skn_slider_store["sliders"][i].foreもしくはf.skn_slider_store["sliders"][i].backのオブジェクト
		// thisDic : f.skn_slider_store.foreもしくはf.skn_slider_store.back
		setSliderOptions(%[
			"slider" => slider, "page" => page,
			"top" => sliderDic.top, "left" => sliderDic.left, "mtop" => sliderDic.mtop, "mleft" => sliderDic.mleft,
			"max" => thisDic.maxValues[slider], "min" => thisDic.minValues[slider], "scale" => thisDic.scale[slider],
			"changing" => sliderDic.changingValue, "curchanging" => sliderDic.cursorChanging, "hit" => !sliderDic.hitThreshold,
			"enabled" => sliderDic.enabled, "cursor" => sliderDic.cursorEnabled,
			"visible" => sliderDic.visible
		]);
		setSliderValue(%["slider" => slider, "page" => page, "value" => thisDic.curValues[slider]]);
	}
	function setCurValues(page = "both") {
		// curValuesを更新
		getSliderValues(%["page" => "fore", "name" => "skn_slider.fore.curValues"]) if page !== "back";
		getSliderValues(%["page" => "back", "name" => "skn_slider.back.curValues"]) if page !== "fore";
	}
	// ------------------------------------------------------------------------ トランジション対応
	function onExchangeForeBack() {
		// トランジション時に呼び出される
		for (var i = 0; i < sliderCount; ++i) {
			sliders[i].onExchangeForeBack();
		}
	}
	function onCopyLayer(toback) {
		// backlay タグ / forelay タグがすべてのレイヤに対して実行される時よばれる
		if (sliderCount == 0) { return; }
		if (toback) {	// 表画面を裏画面にコピー
			setCurValues("fore");
			clearSliderImages("back");
			for (var i = 0; i < this.sliderCount; ++i) {
				with (sliders[i]) {
					setSliderImages(%["slider" => i, "backbase" => .fore.baseImage, "backthumb" => .fore.thumbImage]); // 画像指定
					restoreSlider(i, "back", .fore, this.fore);
				}
			}
		} else {	// 裏画面を表画面にコピー
			setCurValues("back");
			clearSliderImages("fore");
			for (var i = 0; i < this.sliderCount; ++i) {
				with (sliders[i]) {
					setSliderImages(%["slider" => i, "forebase" => .back.baseImage, "forethumb" => .back.thumbImage]); // 画像指定
					restoreSlider(i, "fore", .back, this.back);
				}
			}
		}
	}
	
	// ------------------------------------------------------------------------ 拡張用関数
	function onValueChange(num, page) {
		// スライダの値が変わったときに呼ばれる。
		// num : 値が変わったスライダの番号
		// page : 値が変わったページ("fore" 又は "back")
		for (var i = 0; i < valueChangeHook.count; ++i) {
			valueChangeHook[i](num, page);
		}
	}
}

kag.addPlugin(global.skn_slider = new SKN_SliderForKAG(kag));
@endscript

; ◆マクロ定義
; ￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
@macro name = "setSliderCount"
@eval exp = "skn_slider.setSliderCount(mp)"
@endmacro
@macro name = "setSliderImages"
@eval exp="skn_slider.setSliderImages(mp)"
@endmacro
@macro name = "setSliderOptions"
@eval exp="skn_slider.setSliderOptions(mp)"
@endmacro
@macro name = "setSliderEnabled"
@eval exp="skn_slider.setSliderEnabled(mp)"
@endmacro
@macro name = "setSliderValue"
@eval exp="skn_slider.setSliderValue(mp)"
@endmacro
@macro name = "getSliderValue"
@eval exp="skn_slider.getSliderValue(mp)"
@endmacro
@macro name = "getSliderValues"
@eval exp="skn_slider.getSliderValues(mp)"
@endmacro

@return