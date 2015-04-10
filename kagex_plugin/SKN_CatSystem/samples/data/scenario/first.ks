@linemode mode="line"
@cs000_1_1_1_1_1 show
キャラクタ表示

@cs000_1_2_3_3_2 fade=500 nosync
キャラクタ切替

@cs000_2_2_2_2_2 fade=500 nosync
もういっかい切替

@cs000_2_2_2_2_2 hide fade=500 nosync
消去

@しおり show fade=500
画像そのままのときはキャラ名のタグがそのまま使えます

*save|save
@しおり rotate=360 time=1000
アクション等も通常と同じように使えます

@しおり opacity=0 xpos=-100 time=500
消去

@cs001_1_2_3_3_2 fade=500 xpos=0 nosync
レベルを変えるのにはlevel属性を使いません
そのレベルの画像を読み込むとレベルも勝手に変わります