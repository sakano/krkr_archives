■使い方
説明書.txtを参照してください。



■limitCursor.dll
以下の2つの関数を追加するプラグインです。
・Window.isActive()
  そのウィンドウがアクティブならtrue, 非アクティブならfalseを返します。
・System.clipCursor(left, top, right, bottom)
  マウスカーソルが動ける範囲をスクリーン座標で設定します。
  引数を省略すると範囲制限を解除します。
  left : カーソルが動ける範囲の左端
  top : カーソルが動ける範囲の上端
  right : カーソルが動ける範囲の右端
  bottom : カーソルが動ける範囲の下端



■ライセンス
パブリックドメインです。自由に使ってください。特に条件はありません。

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org>



■利用しているライブラリ等
・windowEx(https://sv.kikyou.info/svn/kirikiri2/trunk/kirikiri2/src/plugins/win32/shellExecute)
・tp_stub(https://sv.kikyou.info/svn/kirikiri2/trunk/kirikiri2/src/plugins/win32)
・ncbind(https://sv.kikyou.info/svn/kirikiri2/trunk/kirikiri2/src/plugins/win32/ncbind)

これらのライセンスは吉里吉里本体に準拠しています。



---------------------------------------------------------------------------
                      吉里吉里および KAG のライセンス
---------------------------------------------------------------------------
                                                            2005/7/21 W.Dee

　以下のライセンスをよくお読みになった上でこのソフトウェアを使用してください。
　以下のライセンスに同意できない場合はこのソフトウェアを使用することはできま
せん。

　また、吉里吉里１と吉里吉里２ではライセンスが異なりますのでご注意ください。
このライセンスは吉里吉里２ (および KAG 3) に適用されるものです。


● デュアルライセンス

　このソフトウェアのライセンスは、以下に示す吉里吉里独自のライセンスと、GNU
General Public License ( GNU GPL ) のデュアルライセンスとして提供されます。
ユーザーは、以下のライセンスか、GNU GPL のいずれかを選択して、それに従ってこ
のソフトウェアを使用することができます。

　GNU GPL に関しては www.gnu.org または、添付されている

  gpl-2e-plain.txt (原文; 英語)
  gpl-2j-plain.txt (日本語訳)

　を参照してください。

　吉里吉里関連ツールの一部は他のライセンスで提供されるものがあります ( それ
ぞれのドキュメントをお読みください )。



---------------------------------------------------------------------------

以下は吉里吉里独自のライセンスに関する説明です。
ここに明記されていない条件については、該当国の著作権法に従う物とします。


● 著作権

　このソフトウェアの著作権は、作者 W.Dee が保有します。


● 無償

　このソフトウェアは無償で使用できます。ユーザは、このソフトウェアの作者に金
銭を支払う必要はありません。
　これは、このソフトウェアの利用対象がどのようであっても (商用、フリー、シェ
アウェアなど) 同じです。

　ここで「ユーザ」とは、このソフトウェアを用いて作られた、一次ユーザの著作物
を利用する二次ユーザや、このソフトウェアのソースを利用するユーザも含みます。


● ライセンスの終了

　ユーザが本ライセンスに違反した場合、ユーザがこのソフトウェアを使用する権利
は、直ちに、通知なく消失します。ライセンスが消失した場合、ユーザはこのソフト
ウェアおよび、このソフトウェアを使用して作成されたユーザの著作物のうち、この
ソフトウェアに関わる部分を直ちに破棄しなければなりません。


● 無保証・無責任

　このソフトウェアは無保証です。いかなる人・物が被ったいかなる損害にも、この
ソフトウェアの作者は関知しません。
　また、作者は、このソフトウェアに対するバージョンアップ、バグ修正などのいっ
さいの責任を負わないものとします。


● 著作権の表示と使用通知

　このソフトウェアを使用するにあたり、このソフトウェアを使用した、ということ
を二次ユーザに改めて示す義務はありません。また、このソフトウェアを使用してい
ることを、このソフトウェアの作者に対して通知する義務はありません。

　ソフトウェアに含まれる著作権の表示や、吉里吉里本体のバージョン情報のリソー
ス(バージョン番号を除く)を改変して再配布することを禁じます。
　また、吉里吉里本体を '-about' オプション付きで起動すると著作権表示の詳細が
表示されますが、これを抑止するような改変を禁じます。

　例外として、二次ユーザに配布するドキュメントに、吉里吉里を使っている旨と、
'-about' オプションを付けて吉里吉里を起動するとバージョン情報の詳細を見るこ
とができる旨を付記するのであれば、吉里吉里本体のバージョン情報のリソースを書
き換えて配布することを許可します。


● 二次配布

　このソフトウェアを、このライセンス書を伴わずに二次的に配布することはできま
せん。また、このソフトウェア自体の配布に際し金銭的なやりとりを伴うことはでき
ません (メディア代金等の必要経費を除く)。

　ただし、以下の例外があります。

   ・吉里吉里２の実行コア (krkr.eXe) 
   ・吉里吉里 SDK 配布ファイルに付属する吉里吉里用プラグイン
   ・KAG のシステム (kag3\template以下の各ファイル)
   ・吉里吉里 SDK 配布ファイルに付属する KAG 用プラグイン

　上記の項目に該当するファイルは、これらの実行コアなどを利用するユーザの著作
物とともに、このライセンス書を伴わずに配布することができます。この際、配布物
全体としては、そのユーザ指定の配布ライセンスに基づいて配布することができます。
ユーザ指定の配布ライセンスは、有償配布に基づくもの、無償配布に基づくもの、ま
た、オープンソース、クローズドソースの別を問いません。
　ただし、上記の項目そのもののライセンスが変わるわけではありません。これらの
実行コアあるいはシステムを、その配布物から分離した場合、あるいは分離して考え
る場合は、元々のライセンスを保つものとします。

　エンドユーザ向け吉里吉里設定 (エンジン設定.exe) は、二次ユーザが吉里吉里の
設定を二次ユーザ自身で行えるようにする目的において配布する場合のみ、このライ
センス書を伴わずに配布することができます。

　ファイル破損チェックツール は、二次ユーザがファイルの破損のチェックを二次
ユーザ自身で行えるようにする目的において配布する場合のみ、このライセンス書を
伴わずに配布することができます。


● 流用・改造とライセンスの変更

　このソフトウェアはオープンソースです。ソフトウェアのソースは 吉里吉里
Support Page から入手するか、それが不可能な場合は、作者に連絡を取ってくださ
い。

　このソフトウェアのソース、あるいはその断片を、他のソフトウェアに組み込んで
流用することができます。これは、オープンソース、クローズドソースの別を問いま
せん。
　ここで流用とは、このソフトウェアの一部が他のソフトウェアに組み込まれること
を示します。

　このソフトウェアを改造して配布することができますが、この場合は、このソフト
ウェアのライセンスと同じライセンス、またはこのソフトウェアの作者が特に認めた
ライセンスのみにて配布することができます。

　改造とはこのソフトウェアに変更を加えることを示します。ただし、このソフトウェ
アの作者から一次配布されているままのバイナリをそのまま変更を加えずに (付属ツー
ルによるカスタマイズ等の変更、上記[著作権の表示と使用通知]の条件にて許可された
吉里吉里本体のバージョン情報のリソースの改変を除く) 用いる場合は改造とは見なし
ません。

　流用の場合も改造の場合も、このソフトウェアに含まれるソース、あるいはバイナ
リを使用している旨をドキュメント等に表記することか、あるいは、このソフトウェ
アの作者に配布を行う旨を事前に連絡し確認をとることの、どちらかあるいは両方を
行う必要があります。
　前文に関し作者は、「このソフトウェアの作者に配布を行う旨を事前に連絡し確認
をとること」が行われたソフトウェアのリストを希望者に対してのみ公開する場合が
あります。

　ただし、例外として KAG のシステム (kag3\template以下の各ファイル) はオープ
ンソースですが、流用、改造について何ら制限や義務はありません。


● プラグインの作成

　プラグインを作成する為に、吉里吉里のソースに含まれている tp_stub.h や
tp_stub.cpp、tvpsnd.h をプラグインで使用することができます。
　これらのファイルを、プラグインで使用する目的でプラグインに組み込んで使用す
る際には、上記の流用や改造とはみなしません。そのため、この場合は上記「このソ
フトウェアに含まれるソースを使用している旨をドキュメント等に表記することか、
あるいは、このソフトウェアの作者に配布を行う旨を事前に連絡し確認をとることの、
どちらかあるいは両方」は行う必要はありません。また、プラグインのソースを公開
する必要はありません。
　ただし、これらのファイル以外の吉里吉里のソースの一部をプラグインに組み込ん
だ場合や、これらのファイルをプラグインを作成する目的以外で使用した場合は、上
記の流用として見なします。


● パッチ/コードの適用

　作者以外の方からパッチや追加のコードをこのソフトウェアのオリジナルのソース
に適用し、作者にフィードバックする場合 (コントリビュートする場合) は、その
パッチやコードのライセンスが、このソフトウェアのライセンス(GNU GPLと本ライセ
ンスのデュアルライセンス)下で適用できることが条件となります。


● 作者によるライセンスの変更

　このソフトウェアの作者は、このライセンスを予告無しに変更/改変する可能性が
あります。ただし、旧ライセンスとともに配布された旧ソフトウェアにまでさかのぼっ
て、新ライセンスがその旧ソフトウェアに適用されることはありません。


● ERI (恵理ちゃん) に関して

　吉里吉里本体は L.Entis 氏による画像形式である「恵理ちゃん」の展開ライブラ
リが含まれています。この形式を使用する場合は、特に恵理ちゃんに関するライセン
スにも注意してください。この形式を使用しない場合は関係ありません。
　詳細は恵理ちゃん club
　http://www.entis.jp/eri/
　を参照してください。


● 作者の連絡先

　W.Dee <dee@kikyou.info>
　吉里吉里/KAG 推進委員会 : http://www.piass.com/kpc/
　吉里吉里 ダウンロード ページ : http://kikyou.info/tvp/
