#pragma once

class LoadDataInfo {
public:
	LoadDataInfo() : width(0), height(0), pitch(0), data(nullptr)
	{
	}

	~LoadDataInfo()
	{
		if (data) {
			free(data);
			data = nullptr;
		}
	}

	bool setSize(int w, int h) {
		width = w;
		height = h;
		pitch = (width * (32/8) + 3) & ~ 3;
		DWORD imgsize = pitch * height;
		data = (unsigned char *)malloc(imgsize);
		return data != nullptr;
	}

	void *getScanLine(int y) {
		if (y < 0 || data == nullptr) {
			return nullptr;
		}
		return data + pitch * y;
	}

	int width;
	int height;
	int pitch;
	unsigned char *data;
};