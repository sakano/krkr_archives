@wait time=200
@env init
@linemode mode=free
; EditLayer.tjs も一部変更してます。
; 参考:http://kasekey.blog101.fc2.com/blog-entry-105.html

@iscript
	// 変数の準備
	tf.test = ["てすと", "password", "", "選択したときの色変更", "TEST", "", "", "色変更"];
@endscript

@laycount messages=3

*SHOW
@nowait
	; 横書きテスト
	@current layer=message0 page=fore
	@position visible left=10 top=10 width=620 height=220 marginl=0 margint=0 marginr=0 marginb=0
	ただのエディタ
	@locate x=300
	@edit exp=tf.test[0] length=300 color=0xFFFF00 bgcolor=0x999999
	パスワード入力テスト
	@locate x=300
	@edit exp=tf.test[1] length=300 password passwordmark="●"
	placeholder のテスト
	@locate x=300
	@edit exp=tf.test[2] length=300 placeholder="なんか入力してください"
	ハイライトのテスト
	@locate x=300
	@edit exp=tf.test[3] length=300 highlightbgcolor=0x00FF00 highlightcolor=0x0000FF caretcolor=0xFF0000
@endnowait

@nowait
	; 縦書きテスト
	@current layer=message1 page=fore
	@position visible left=10 top=250 width=310 height=220 marginl=0 margint=0 marginr=0 marginb=0 vertical
	ただのエディタ[r]
	@edit exp=tf.test[4] length=200 color=0xFF00FF bgcolor=0x009999
	パスワード入力[r]
	@edit exp=tf.test[5] length=200 password passwordmark="★"
	placeholder[r]
	@edit exp=tf.test[6] length=200 placeholder="なんか入力してください" placeholdercolor=0x996699
	ハイライト[r]
	@edit exp=tf.test[7] length=200 highlightbgcolor=0xFF0000 highlightcolor=0x00FFFF caretcolor=0x00FF00
	
@endnowait

@nowait
	; 結果表示欄
	@current layer=message2 page=fore
	@position visible left=330 top=160 width=310 height=320 marginl=0 margint=0 marginr=0 marginb=0
	@button normal=commit target=*COMMIT
	0:[emb exp="tf.test[0]"][r]\
	1:[emb exp="tf.test[1]"][r]\
	2:[emb exp="tf.test[2]"][r]\
	3:[emb exp="tf.test[3]"][r]\
	4:[emb exp="tf.test[4]"][r]\
	5:[emb exp="tf.test[5]"][r]\
	6:[emb exp="tf.test[6]"][r]\
	7:[emb exp="tf.test[7]"]\
@endnowait
@s

*COMMIT
@current layer=message0
@commit
@current layer=message1
@commit
@trace exp=tf.test[0]
@next target=*SHOW