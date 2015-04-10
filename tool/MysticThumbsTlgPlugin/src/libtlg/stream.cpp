#include "stream.h"

tjs_uint64
tTJSBinaryStream::GetPosition()
{
	return Seek(0, TJS_BS_SEEK_CUR);
}

void
tTJSBinaryStream::SetPosition(tjs_uint64 pos)
{
	Seek(pos, TJS_BS_SEEK_SET);
}

bool
tTJSBinaryStream::ReadBuffer(void *buffer, tjs_uint read_size)
{
	return Read(buffer, read_size) == read_size;
}

bool
tTJSBinaryStream::WriteBuffer(const void *buffer, tjs_uint write_size)
{
	return Write(buffer, write_size) == write_size;
}

bool
tTJSBinaryStream::ReadI64LE(tjs_uint64 &value)
{
#if TJS_HOST_IS_BIG_ENDIAN
	tjs_uint8 buffer[8];
	if (!ReadBuffer(buffer, 8)) {
		return false;
	}
	tjs_uint64 ret = 0;
	for(tjs_int i=0; i<8; i++)
		ret += (tjs_uint64)buffer[i]<<(i*8);
	value = ret;
#else
	tjs_uint64 temp;
	if (!ReadBuffer(&temp, 8)) {
		return false;
	}
	value = temp;
#endif
	return true;
}

bool
tTJSBinaryStream::ReadI32LE(tjs_uint32 &value)
{
#if TJS_HOST_IS_BIG_ENDIAN
	tjs_uint8 buffer[4];
	if (!ReadBuffer(buffer, 4)) {
		return false;
	}
	tjs_uint32 ret = 0;
	for(tjs_int i=0; i<4; i++)
		ret += (tjs_uint32)buffer[i]<<(i*8);
	value = ret;
#else
	tjs_uint32 temp;
	if (!ReadBuffer(&temp, 4)) {
		return false;
	}
	value = temp;
#endif
	return true;
}

bool
tTJSBinaryStream::ReadI16LE(tjs_uint16 &value)
{
#if TJS_HOST_IS_BIG_ENDIAN
	tjs_uint8 buffer[2];
	if (!ReadBuffer(buffer, 2)) {
		return false;
	}
	tjs_uint16 ret = 0;
	for(tjs_int i=0; i<2; i++)
		ret += (tjs_uint16)buffer[i]<<(i*8);
	value = ret;
#else
	tjs_uint16 temp;
	if (!ReadBuffer(&temp, 2)) {
		return false;
	}
	value = temp;
#endif
	return true;
}

bool
tTJSBinaryStream::WriteInt32(long num)
{
	unsigned char buf[4];
	buf[0] = num & 0xff;
	buf[1] = (num >> 8) & 0xff;
	buf[2] = (num >> 16) & 0xff;
	buf[3] = (num >> 24) & 0xff;
	return WriteBuffer(buf, 4);
}

#define BUFSIZE 8192

void
tTJSBinaryStream::CopyFrom(tTJSBinaryStream *stream, int pos)
{
	char buf[BUFSIZE];
	stream->SetPosition(pos);
	tjs_uint size;
	while ((size = stream->Read(buf, BUFSIZE)) > 0) {
		Write(buf, size);
	}
}
