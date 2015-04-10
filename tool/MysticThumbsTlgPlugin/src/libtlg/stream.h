#ifndef __TLGSTREAM
#define __TLGSTREAM

#include "tjs.h"

#define TJS_BS_SEEK_SET 0
#define TJS_BS_SEEK_CUR 1
#define TJS_BS_SEEK_END 2

//---------------------------------------------------------------------------
// tTJSBinaryStream base stream class
//---------------------------------------------------------------------------
class tTJSBinaryStream
{
public:
	tTJSBinaryStream() {}
	virtual ~tTJSBinaryStream() {}

	//-- must implement
	virtual tjs_uint64 Seek(tjs_int64 offset, tjs_int whence) = 0;
	virtual tjs_uint Read(void *buffer, tjs_uint read_size) = 0;
	virtual tjs_uint Write(const void *buffer, tjs_uint write_size) = 0;

	tjs_uint64 GetPosition();
	void SetPosition(tjs_uint64 pos);
	bool ReadBuffer(void *buffer, tjs_uint read_size);

	bool WriteBuffer(const void *buffer, tjs_uint write_size);
	bool ReadI64LE(tjs_uint64 &value);
	bool ReadI32LE(tjs_uint32 &value);
	bool ReadI16LE(tjs_uint16 &value);

	bool WriteInt32(long num);
	void CopyFrom(tTJSBinaryStream *stream, int pos);
};

#endif
