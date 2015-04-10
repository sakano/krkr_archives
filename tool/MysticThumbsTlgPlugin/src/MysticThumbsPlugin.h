/////////////////////////////////////////////////////////////////////////////
// 
// Header for MysticThumbs plugins
// 
// Copyright 2011 MysticCoder
// http://mysticcoder.net/mysticthumbs
//
// This file is the primary interface header for MysticThumbs plugins.
// It should not be modified or redistributed in any way.
// Please see the MysticThumbs license.
// 
/////////////////////////////////////////////////////////////////////////////

#pragma once

#ifndef _MysticThumbsPlugin_h_
#define _MysticThumbsPlugin_h_


// Header version
#define MYSTICTHUMBS_PLUGIN_VERSION 1


#ifndef IN
#define IN
#endif

#ifndef OUT
#define OUT
#endif


// Include Windows headers that we need
#include <Windows.h>
#include <Objidl.h>



/////////////////////////////////////////////////////////////////////////////
// 
// Ping information, used when MysticThumbs is requesting image information
// 
/////////////////////////////////////////////////////////////////////////////

struct MysticThumbsPluginPing
{
	unsigned int width;
	unsigned int height;
	unsigned int bitDepth;
};

/////////////////////////////////////////////////////////////////////////////
// 
// Flags passed to IMysticThumbsPlugin::GenerateImage()
// 
/////////////////////////////////////////////////////////////////////////////

enum MysticThumbsPluginFlags
{
	// Transparency flags, one of the following:
	MT_Transparency_Disable         = 0x00000001,
	MT_Transparency_Transparent     = 0x00000002,
	MT_Transparency_Checkerboard    = 0x00000004,
	MT_Transparency_Checkerboard2   = 0x00000008,

	// Embedded thumbnail flags, one of the following:
	MT_EmbeddedThumb_Never          = 0x00000010,
	MT_EmbeddedThumb_IfLarger       = 0x00000020,
	MT_EmbeddedThumb_Always         = 0x00000040,

	// Scale up is requested. This is handled by MysticThumbs, but the hint is here.
	MT_ScaleUp                      = 0x00000100,
};

/////////////////////////////////////////////////////////////////////////////
// 
// Derive your plugin class from this interface and implement all methods
// 
/////////////////////////////////////////////////////////////////////////////

struct IMysticThumbsPlugin
{
protected:
	virtual ~IMysticThumbsPlugin() {}

public:
	/// Destroy this plugin instance
	virtual void Destroy() = 0;

	/// Identify this plugin by name
	/// Use LocalAlloc to allocate the string, for example by using StrDupW()
	virtual LPWSTR GetName() = 0;

	virtual LPCGUID GetGuid() = 0;

	// List extensions supported
	virtual unsigned int GetExtensionCount() = 0;

	/// Use LocalAlloc to allocate the returned extension
	virtual LPWSTR GetExtension(IN unsigned int index) = 0;

	/// Ping an image to report it's information such as dimensions and bit depth.
	/// Fill in fields that are relevant. If no ping information can be determined do nothing and return false.
	virtual bool PingImage(IN IStream* pStream, OUT MysticThumbsPluginPing& ping) = 0;

	/// Create a bitmap image from the given file stream
	/// returns an array of size length allocated with LocalAlloc that will be freed by MysticThumbs.
	/// if hasAlpha is false then the size of the bitmap should be width * height * 3 in the format RGB
	/// if hasAlpha is true then the size of the bitmap should be width * height * 4 in the format RGBA
	/// flags are of the MysticThumbsPluginFlags set
	virtual unsigned char* GenerateImage(IN IStream* pStream, IN unsigned int desiredSize, IN unsigned int flags, OUT bool& hasAlpha, OUT unsigned int& width, OUT unsigned int& height) = 0;
};


/////////////////////////////////////////////////////////////////////////////
// 
// DLL functions required to be implemented by each plugin
// 
// Note: These these functions should defined extern "C" so they can be found
//       See ExamplePlugin.cpp
// 
/////////////////////////////////////////////////////////////////////////////


// Initialize the plugin. Any initialization required for all instances can be done here.
typedef bool (*MTP_Initialize)();

// Shutdown the plugin. Clean up everything when the plugin is being unloaded.
typedef bool (*MTP_Shutdown)();

// Create an instance of a thumbnail provider
typedef IMysticThumbsPlugin* (*MTP_CreateInstance)();


#endif // _MysticThumbsPlugin_h_
