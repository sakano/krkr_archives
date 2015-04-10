
curlimit タグを使ったサンプルスクリプトです。[p][r]

@curlimit enabled=true
画面外にカーソルが出ないように制限[p][r]

@curlimit left=10 right=10 bottom=10
画面より一回り小さな範囲しか動けないように制限[p][r]

@curlimit enabled=false
機能を無効にしました[p][r]

@curlimit enabled=true
機能を再び有効にしました。ここでも left, right, bottom は 10 のままです。[p][r]

@curlimit enabled=true left=20 right=30 bottom=0
enabled と left, top, right, bottom を同時に指定することもできます。[p][r]
