//---------------------------------------------------------------------------
/*
	TVP2 ( T Visual Presenter 2 )  A script authoring tool
	Copyright (C) 2000 W.Dee <dee@kikyou.info> and contributors

	See details of license at "license.txt"
*/
//---------------------------------------------------------------------------
// TLG5/6 decoder/encoder
//---------------------------------------------------------------------------

#ifndef __TLG_H__
#define __TLG_H__

#include "tjs.h"
#include "stream.h"
#include <string>
#include <map>

//---------------------------------------------------------------------------
// Graphic Loading Handler Type
//---------------------------------------------------------------------------

/*
	callback type to inform the image's size.
	call this once before TVPGraphicScanLineCallback.
	return false can stop processing
*/
typedef bool (*tTVPGraphicSizeCallback)(void *callbackdata, tjs_uint w, tjs_uint h);

/*
	callback type to ask the scanline buffer for the decoded image, per a line.
	returning null can stop the processing.

	passing of y=-1 notifies the scan line image had been written to the buffer that
	was given by previous calling of TVPGraphicScanLineCallback. in this time,
	this callback function must return NULL.
*/
typedef void * (*tTVPGraphicScanLineCallback)(void *callbackdata, tjs_int y);

//---------------------------------------------------------------------------
// return code
//---------------------------------------------------------------------------

#define TLG_SUCCESS (0)
#define TLG_ABORT   (1)
#define TLG_ERROR  (-1)


//---------------------------------------------------------------------------
// functions
//---------------------------------------------------------------------------

/**
 * src 読み込み元ストリーム
 * TLG画像かどうかの判定
 */
bool
TVPCheckTLG(tTJSBinaryStream *src);

/**
 * TLG画像の情報を取得
 * @param src 読み込み元ストリーム
 * @param width 横幅情報格納先
 * @parma height 縦幅情報格納先
 */
extern bool
TVPGetInfoTLG(tTJSBinaryStream *src, int *width, int *height);

/**
 * TLG画像のロード
 * @param dest 読み込み元ストリーム
 * @param callbackdata
 * @param sizecallback サイズ情報格納用コールバック
 * @param scanlinecallback ロードデータ格納用コールバック
 * @param tags 読み込んだタグ情報の格納先
 * @return 0:成功 1:中断 -1:エラー
 */
extern int
TVPLoadTLG(void *callbackdata,
		   tTVPGraphicSizeCallback sizecallback,
		   tTVPGraphicScanLineCallback scanlinecallback,
		   std::map<std::string,std::string> *tags,
		   tTJSBinaryStream *src);

/**
 * TLG画像のセーブ
 * @param dest 格納先ストリーム
 * @param type 種別 0:TLG5 1:TLG6
 * @parma width 画像横幅
 * @param height 画像縦幅
 * @param colors 色数指定 1:8bitグレー 3:RGB 4:RGBA
 * @param callbackdata コールバック用データ
 * @param scanlinecallback セーブデータ通知用コールバック(データが入っているアドレスを渡す)
 * @param tags 保存するタグ情報
 * @return 0:成功 1:中断 -1:エラー
 */
extern int
TVPSaveTLG(tTJSBinaryStream *dest,
		   int type,
		   int width, int height, int colors,
		   void *callbackdata,
		   tTVPGraphicScanLineCallback scanlinecallback,
		   const std::map<std::string,std::string> *tags);

#endif
