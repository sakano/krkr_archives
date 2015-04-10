#include "handlestream.h"

/**
 * ハンドル指定で開く
 */
tHandleStream::tHandleStream(HANDLE handle) : handle(handle), release(false)
{
}

/**
 * ファイル名指定で開く
 */
tHandleStream::tHandleStream(const char *filename, DWORD mode) : release(true)
{
	DWORD share = mode == GENERIC_READ ? FILE_SHARE_READ : 0;
	DWORD disp  = mode == GENERIC_READ ? OPEN_EXISTING : CREATE_ALWAYS;
	handle = CreateFile(filename, mode, share, NULL, disp, 0, NULL);
}

tHandleStream::~tHandleStream()
{
	if (handle != INVALID_HANDLE_VALUE && release) {
		CloseHandle(handle);
	}
}

//-- must implement
tjs_uint64
tHandleStream::Seek(tjs_int64 offset, tjs_int whence)
{
	if (handle != INVALID_HANDLE_VALUE) {
		DWORD origin;
		switch(whence) {
		case TJS_BS_SEEK_SET:			origin = FILE_BEGIN;	break;
		case TJS_BS_SEEK_CUR:			origin = FILE_CURRENT;	break;
		case TJS_BS_SEEK_END:			origin = FILE_END;		break;
		default:						origin = FILE_BEGIN;	break;
		}
		
		LARGE_INTEGER ofs;
		LARGE_INTEGER newpos;
		
		ofs.QuadPart = offset;
		
		if (SetFilePointerEx(handle, ofs, &newpos, origin)) {
			return newpos.QuadPart;
		}
	}
	return 0;
}

tjs_uint
tHandleStream::Read(void *buffer, tjs_uint read_size)
{
	if (handle != INVALID_HANDLE_VALUE) {
		DWORD readBytes;
		if (ReadFile(handle, buffer, read_size, &readBytes, NULL)) {
			return readBytes;
		}
	}
	return 0;
}

tjs_uint
tHandleStream::Write(const void *buffer, tjs_uint write_size)
{
	if (handle != INVALID_HANDLE_VALUE) {
		DWORD writeBytes;
		if (WriteFile(handle, buffer, write_size, &writeBytes, NULL)) {
			return writeBytes;
		}
	}
	return 0;
}
