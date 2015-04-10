#include "TlgPlugin.h"
#include "MysticThumbsPlugin.h"
#include <Shlwapi.h>
#include <new>
#include "libtlg\TLG.h"
#include "tIStream.h"
#include "LoadDataInfo.h"

// Define a name and the extensions supported by this plugin
static const LPCWSTR s_name = L"TLGPlugin";
static const LPCWSTR s_extensions[] = { L".tlg", L".tlg5", L".tlg6" };

// {FC0E5B75-0D05-415E-BA43-FE78EDB0EEFB}
static const GUID s_guid = { 0xfc0e5b75, 0xd05, 0x415e, { 0xba, 0x43, 0xfe, 0x78, 0xed, 0xb0, 0xee, 0xfb } };

EXAMPLEPLUGIN_API BOOL APIENTRY DllMain(HINSTANCE hModule, DWORD ul_reason_for_call, void *lpReserved)
{
	UNREFERENCED_PARAMETER(lpReserved);
	switch (ul_reason_for_call)
	{
	case DLL_PROCESS_ATTACH: break;
	case DLL_PROCESS_DETACH: break;
	case DLL_THREAD_ATTACH:  break;
	case DLL_THREAD_DETACH:  break;
	}
	return TRUE;
}



class CExamplePlugin : public IMysticThumbsPlugin
{
public:

	CExamplePlugin()
	{
		// Nothing to do here
	}

private:

	virtual LPWSTR GetName()
	{
		return StrDupW(s_name);
	}

	virtual LPCGUID GetGuid()
	{
		return &s_guid;
	}

	virtual void Destroy()
	{
		// Delete this instance
		this->~CExamplePlugin();
		CoTaskMemFree(this);
	}

	virtual bool PingImage(IN IStream* pStream, OUT MysticThumbsPluginPing& ping)
	{
		// Any ping members untouched will be ignored
		ping.bitDepth = 32;
		return true;
	}
	
	static bool sizeCallback(void *callbackdata, unsigned int w, unsigned int h)
	{
		LoadDataInfo *info = (LoadDataInfo*)callbackdata;
		return info->setSize(w, h);
	}

	static void *scanLineCallback(void *callbackdata, int y)
	{
		LoadDataInfo *info = (LoadDataInfo*)callbackdata;
		return info->getScanLine(y);
	}

	virtual unsigned char* GenerateImage(IN IStream* pStream, IN unsigned int desiredSize, IN unsigned int flags, OUT bool& hasAlpha, OUT unsigned int& width, OUT unsigned int& height)
	{
		tIStream stream(pStream);
		LoadDataInfo info;
		int ret = TVPLoadTLG(&info, sizeCallback, scanLineCallback, nullptr, &stream);
		if (ret != TLG_SUCCESS)
			return nullptr;

		hasAlpha = true;
		if (info.width > info.height) {
			width = desiredSize > info.width ? info.width : desiredSize;
			height = width * info.height / static_cast<float>(info.width);
		} else {
			height = desiredSize > info.height ? info.height : desiredSize;
			width = height * info.width / static_cast<float>(info.height);
		}

		float scale_w = (info.width/static_cast<float>(width));
		float scale_h = (info.height/static_cast<float>(height));
		unsigned char* image = (unsigned char*)LocalAlloc(GMEM_FIXED, width * height * 4);
		unsigned char* ptr = image;
		for (unsigned int y=0; y<height; ++y) {
			unsigned char *line = info.data + (static_cast<int>(y * scale_h) * info.pitch);
			for (unsigned int x=0; x<width; ++x) {
				unsigned char *pixel = line + (static_cast<int>(x * scale_w) * 4);
				unsigned char b = *pixel++;
				unsigned char g = *pixel++;
				unsigned char r = *pixel++;
				unsigned char a = *pixel++;
				*ptr++ = (unsigned char)r;
				*ptr++ = (unsigned char)g;
				*ptr++ = (unsigned char)b;
				*ptr++ = (unsigned char)a;
			}
		}

		return image;
	}

	virtual unsigned int GetExtensionCount()
	{
		return ARRAYSIZE(s_extensions);
	}

	virtual LPWSTR GetExtension(IN unsigned int index)
	{
		return StrDupW(s_extensions[index]);
	}
};




// Initialize the plugin. Perform any work here that needs to be done for all instances such as loading DLLs or initializing globals.
extern "C" EXAMPLEPLUGIN_API bool Initialize()
{
	// For this example we don't need to do anything
	return true;
}

// Shutdown the plugin. Clean everything up.
extern "C" EXAMPLEPLUGIN_API bool Shutdown()
{
	// For this example we don't need to do anything
	return true;
}

// Create an instance of a thumbnail plugin
extern "C" EXAMPLEPLUGIN_API IMysticThumbsPlugin* CreateInstance()
{
	// Be sure to use CoTaskMemAlloc and placement new to create your object so it is within
	// the processes memory space or it may end up being in protected memory if the DLL shuts down.

	// Note that the IMysticThumbsPlugin::Destroy method takes care of deleting this object when MysticThumbs is finished with it.
	CExamplePlugin* plugin = (CExamplePlugin*)CoTaskMemAlloc(sizeof(CExamplePlugin));
	new(plugin) CExamplePlugin();
	return plugin;
}
