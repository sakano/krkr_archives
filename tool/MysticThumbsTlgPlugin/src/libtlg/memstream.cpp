#include "stream.h"
#include <windows.h>

/**
 * 完全オンメモリ動作するストリーム
 */
class tMemoryStream : public tTJSBinaryStream
{
public:
	// コンストラクタ
	tMemoryStream() : hBuffer(0), stream(0) {
		hBuffer = ::GlobalAlloc(GMEM_MOVEABLE, 0);
		if (hBuffer) {
			::CreateStreamOnHGlobal(hBuffer, FALSE, &stream);
		}
	}

	// デストラクタ
	~tMemoryStream() {
		if (stream) {
			stream->Release();
			stream = 0;
		}
		if (hBuffer) {
			::GlobalFree(hBuffer);
			hBuffer = 0;
		}
	}

	virtual tjs_uint64 Seek(tjs_int64 offset, tjs_int whence) {
		if (stream) {
			DWORD origin;
			switch(whence) {
			case TJS_BS_SEEK_SET:			origin = STREAM_SEEK_SET;		break;
			case TJS_BS_SEEK_CUR:			origin = STREAM_SEEK_CUR;		break;
			case TJS_BS_SEEK_END:			origin = STREAM_SEEK_END;		break;
			default:						origin = STREAM_SEEK_SET;		break;
			}
			
			LARGE_INTEGER ofs;
			ULARGE_INTEGER newpos;
			
			ofs.QuadPart = offset;
			
			if (SUCCEEDED(stream->Seek(ofs, origin, &newpos))) {
				return newpos.QuadPart;
			}
		}
		return 0;
	}

	virtual tjs_uint Read(void *buffer, tjs_uint read_size) {
		if (stream) {
			ULONG cb = read_size;
			ULONG read;
			if (SUCCEEDED(stream->Read(buffer, cb, &read))) {
				return read;
			}
		}
		return 0;
	}

	virtual tjs_uint Write(const void *buffer, tjs_uint write_size) {
		if (stream) {
			ULONG cb = write_size;
			ULONG written;
			if (SUCCEEDED(stream->Write(buffer, cb, &written))) {
				return written;
			}
		}
		return 0;
	}

private:
	HGLOBAL hBuffer;
	IStream *stream;
};

tTJSBinaryStream *
GetMemoryStream()
{
	return new tMemoryStream();
}
