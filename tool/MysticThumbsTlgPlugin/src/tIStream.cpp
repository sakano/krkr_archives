#include "tIStream.h"



tIStream::tIStream(IStream *iStream) : stream(iStream)
{
}

tIStream::~tIStream()
{
}

tjs_uint64 tIStream::Seek(tjs_int64 offset, tjs_int whence)
{
	if (stream == nullptr) return 0;
	DWORD origin;
	switch (whence) {
	case TJS_BS_SEEK_SET: origin = STREAM_SEEK_SET; break;
	case TJS_BS_SEEK_CUR: origin = STREAM_SEEK_CUR; break;
	case TJS_BS_SEEK_END: origin = STREAM_SEEK_END; break;
	default: origin = STREAM_SEEK_SET; break;
	}
	LARGE_INTEGER ofs;
	ULARGE_INTEGER newpos;
	ofs.QuadPart = offset;
	if (stream->Seek(ofs, origin, &newpos) != S_OK) {
		return 0;
	}
	return newpos.QuadPart;
}

tjs_uint tIStream::Read(void *buffer, tjs_uint read_size)
{
	if (stream == nullptr) return 0;
	ULONG readBytes;
	if (stream->Read(buffer, read_size, &readBytes) != S_OK) {
		return 0;
	}
	return readBytes;
}

tjs_uint tIStream::Write(const void *buffer, tjs_uint write_size)
{
	if (stream == nullptr) return 0;
	ULONG writeBytes;
	if (stream->Write(buffer, write_size, &writeBytes) != S_OK) {
		return 0;
	}
	return writeBytes;
}