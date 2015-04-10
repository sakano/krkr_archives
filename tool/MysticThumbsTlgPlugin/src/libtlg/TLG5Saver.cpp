//---------------------------------------------------------------------------

#include "tlg.h"
#include "slide.h"

#define BLOCK_HEIGHT 4

/**
 * TLG5画像の保存
 * @param out 出力先
 * @param width 画像横幅
 * @param height 画像縦幅
 * @param colors 色数指定 1/3/4
 * @param callback コールバック用パラメータ
 * @param scanlinecallback 行データを返すコールバック。NULL を返すと中断される。1つ前に渡したバッファは有効である必要がある
 */
int
SaveTLG5(tTJSBinaryStream *out,
		 int width, int height, int colors,
		 void *callbackdata,
		 tTVPGraphicScanLineCallback scanlinecallback)
{
	int ret = TLG_SUCCESS;

	// header
	if (!out->WriteBuffer("TLG5.0\x00raw\x1a\x00", 11) ||
		!out->WriteBuffer(&colors, 1) ||
		!out->WriteInt32(width) ||
		!out->WriteInt32(height) ||
		!out->WriteInt32(BLOCK_HEIGHT)) {
		return TLG_ERROR;
	}

	int blockcount = (int)((height - 1) / BLOCK_HEIGHT) + 1;

	// buffers/compressors
	SlideCompressor * compressor = NULL;
	unsigned char *cmpinbuf[4];
	unsigned char *cmpoutbuf[4];
	for(int i = 0; i < colors; i++)
		cmpinbuf[i] = cmpoutbuf[i] = NULL;
	long written[4];
	int *blocksizes;

	// allocate buffers/compressors
	try
	{
		compressor = new SlideCompressor();
		for(int i = 0; i < colors; i++)
		{
			cmpinbuf[i] = new unsigned char [width * BLOCK_HEIGHT];
			cmpoutbuf[i] = new unsigned char [width * BLOCK_HEIGHT * 9 / 4];
			written[i] = 0;
		}
		blocksizes = new int[blockcount];

		tjs_uint64 blocksizepos = out->GetPosition();
		// write block size header
		// (later fill this)
		for(int i = 0; i < blockcount; i++)
		{
			if(!out->WriteBuffer("    ", 4)) {
				ret = TLG_ERROR;
				goto errend;
			}
		}

		//
		int block = 0;
		for(int blk_y = 0; blk_y < height; blk_y += BLOCK_HEIGHT, block++)
		{
			int ylim = blk_y + BLOCK_HEIGHT;
			if(ylim > height) ylim = height;

			int inp = 0;

			for(int y = blk_y; y < ylim; y++)
			{
				// retrieve scan lines
				const unsigned char * upper;
				if(y != 0)
					upper = (const unsigned char *)scanlinecallback(callbackdata, y-1);
				else
					upper = NULL;
				const unsigned char * current;
				current = (const unsigned char *)scanlinecallback(callbackdata, y);

				if (current == NULL) {
					ret = TLG_ABORT;
					goto errend;
				}

				// prepare buffer
				int prevcl[4];
				int val[4];

				for(int c = 0; c < colors; c++) prevcl[c] = 0;

				for(int x = 0; x < width; x++)
				{
					for(int c = 0; c < colors; c++)
					{
						int cl;
						if(upper)
							cl = 0[current++] - 0[upper++];
						else
							cl = 0[current++];
						val[c] = cl - prevcl[c];
						prevcl[c] = cl;
					}
					// composite colors
					switch(colors)
					{
					case 1:
						cmpinbuf[0][inp] = val[0];
						break;
					case 3:
						cmpinbuf[0][inp] = val[0] - val[1];
						cmpinbuf[1][inp] = val[1];
						cmpinbuf[2][inp] = val[2] - val[1];
						break;
					case 4:
						cmpinbuf[0][inp] = val[0] - val[1];
						cmpinbuf[1][inp] = val[1];
						cmpinbuf[2][inp] = val[2] - val[1];
						cmpinbuf[3][inp] = val[3];
						break;
					}

					inp++;
				}
			}

			// compress buffer and write to the file

			// LZSS
			int blocksize = 0;
			for(int c = 0; c < colors; c++)
			{
				long wrote = 0;
				compressor->Store();
				compressor->Encode(cmpinbuf[c], inp,
					cmpoutbuf[c], wrote);
				if(wrote < inp)
				{
					if (!out->WriteBuffer("\x00", 1) ||
						!out->WriteInt32(wrote) ||
						!out->WriteBuffer(cmpoutbuf[c], wrote)) {
						ret = TLG_ERROR;
						goto errend;
					}
					blocksize += wrote + 4 + 1;
				}
				else
				{
					compressor->Restore();
					if (!out->WriteBuffer("\x01", 1) ||
						!out->WriteInt32(inp) ||
						!out->WriteBuffer(cmpinbuf[c], inp)) {
						ret = TLG_ERROR;
						goto errend;
					}
					blocksize += inp + 4 + 1;
				}
				written[c] += wrote;
			}

			blocksizes[block] = blocksize;
		}

		// write block sizes
		tjs_uint64 pos_save = out->GetPosition();
		out->SetPosition(blocksizepos);
		for(int i = 0; i < blockcount; i++)
		{
			if (!out->WriteInt32(blocksizes[i])) {
				ret = TLG_ERROR;
				goto errend;
			}
		}
		out->SetPosition(pos_save);

		// deallocate buffers/compressors
	}
	catch(...)
	{
		for(int i = 0; i < colors; i++)	{
			if(cmpinbuf[i]) delete [] cmpinbuf[i];
			if(cmpoutbuf[i]) delete [] cmpoutbuf[i];
		}
		if(compressor) delete compressor;
		if(blocksizes) delete [] blocksizes;
		throw;
	}

errend:
	for(int i = 0; i < colors; i++)	{
		if(cmpinbuf[i]) delete [] cmpinbuf[i];
		if(cmpoutbuf[i]) delete [] cmpoutbuf[i];
	}
	if(compressor) delete compressor;
	if(blocksizes) delete [] blocksizes;
	return ret;
}
