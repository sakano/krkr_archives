#include <Windows.h>
#include "ncbind.hpp"

#pragma comment(lib, "ncbind.lib")



static HWND GetHWND(iTJSDispatch2 *obj) {
	tTJSVariant val;
	obj->PropGet(0, TJS_W("HWND"), 0, &val, obj);
	return (HWND)(tjs_int)(val);
}
static tjs_error TJS_INTF_METHOD isActive(tTJSVariant *r, tjs_int n, tTJSVariant **p, iTJSDispatch2 *obj) 
{
	HWND hwnd = GetHWND(obj);
	*r = hwnd == GetForegroundWindow();
	return TJS_S_OK;
}
static tjs_error TJS_INTF_METHOD clipCursor(tTJSVariant *r, tjs_int n, tTJSVariant **p, iTJSDispatch2 *obj)
{
	if (n < 4) {
		ClipCursor(NULL);
	} else {
		RECT rect;
		rect.left = (int)*p[0];
		rect.top = (int)*p[1];
		rect.right = (int)*p[2];
		rect.bottom = (int)*p[3];
		ClipCursor(&rect);
	}
	return TJS_S_OK;
}

NCB_ATTACH_FUNCTION(isActive, Window, isActive);
NCB_ATTACH_FUNCTION(clipCursor, System, clipCursor);

static void PostUnregistCallback() {
	ClipCursor(NULL);
}
