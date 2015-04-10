#pragma once

#include "libtlg\stream.h"
#include "objidl.h"

class tIStream : public tTJSBinaryStream
{
public:
	tIStream(IStream *stream);

	~tIStream();

	virtual tjs_uint64  Seek(tjs_int64 offset, tjs_int whence);
	virtual tjs_uint  Read(void *buffer, tjs_uint read_size);
	virtual tjs_uint  Write(const void *buffer, tjs_uint write_size);	

	IStream *stream;
};