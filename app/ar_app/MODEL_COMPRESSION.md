# 3D Model Compression Guide

## Overview

All GLB models in this project have been compressed using **Draco compression** to significantly reduce file sizes and improve loading times.

## Compression Results

### Summary
- **Total Original Size**: 116.6 MB
- **Total Compressed Size**: 40.2 MB
- **Total Saved**: 76.3 MB (65.5% reduction)

### Individual Models

| Model | Original | Compressed | Reduction | Saved |
|-------|----------|------------|-----------|-------|
| beidou.glb | 24.4 MB | 1.7 MB | 93.2% | 22.8 MB |
| dongfanghong1-2.glb | 11.6 MB | 1.3 MB | 89.2% | 10.4 MB |
| dongfanghong1.glb | 9.8 MB | 882 KB | 91.2% | 8.9 MB |
| ISS_stationary.glb | 42.4 MB | 32.3 MB | 23.9% | 10.1 MB |
| sputnik1.glb | 14.2 MB | 1.2 MB | 91.8% | 13.0 MB |
| tiangongspacestation.glb | 12.9 MB | 1.8 MB | 86.1% | 11.1 MB |
| earth.glb (×3) | 430 KB ea. | 405 KB ea. | 5.8% | 25 KB ea. |
| p_ylw/model.glb | 430 KB | 405 KB | 5.8% | 25 KB |

## How It Works

### Draco Compression
Draco is a library for compressing and decompressing 3D geometric meshes and point clouds. It's designed to improve the storage and transmission of 3D graphics.

**Benefits:**
- 🚀 **Faster loading times** - Smaller files download quicker
- 📱 **Mobile-friendly** - Less data usage on cellular networks
- 💾 **Storage efficient** - Reduced server storage requirements
- ⚡ **Better performance** - Faster initial page load

### Compression Settings Used

```javascript
{
  compressionLevel: 10,          // Maximum compression (0-10)
  quantizePositionBits: 14,      // Position precision
  quantizeNormalBits: 10,        // Normal vector precision
  quantizeTexcoordBits: 12,      // Texture coordinate precision
  quantizeColorBits: 8,          // Color precision
  quantizeGenericBits: 12,       // Generic attribute precision
  unifiedQuantization: true      // Better compression ratio
}
```

## Browser Support

Draco decompression is handled automatically by the browser using Google's decoder library. It works in:

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (iOS and macOS)
- ✅ Mobile browsers

The decoder is loaded from Google's CDN:
```
https://www.gstatic.com/draco/versioned/decoders/1.5.6/
```

## Re-compressing Models

If you add new GLB models or want to re-compress existing ones:

### 1. Install Dependencies (if not already installed)
```bash
npm install gltf-pipeline
```

### 2. Run the Compression Script
```bash
node compress-models.js
```

The script will:
- Scan all subdirectories in `app/ar_app/model/`
- Find all `.glb` files
- Create `.original.glb` backups (if they don't exist)
- Compress each file with Draco
- Show compression statistics

### 3. Restore Original Files (if needed)
```bash
# Restore a specific file
cp model/sputnik1/sputnik1.original.glb model/sputnik1/sputnik1.glb

# Restore all files (bash)
find app/ar_app/model -name "*.original.glb" -exec sh -c 'cp "$1" "${1%.original.glb}.glb"' _ {} \;
```

## Quality Considerations

### What's Preserved
- ✅ Model geometry structure
- ✅ Textures (embedded or referenced)
- ✅ Materials and colors
- ✅ Animations (if any)
- ✅ Visual appearance

### Trade-offs
- Small precision loss in vertex positions (usually imperceptible)
- Slight increase in CPU usage for decompression (negligible on modern devices)
- Models must be decompressed before rendering (handled automatically)

## Performance Impact

### Before Compression
- **Total download**: 116.6 MB
- **Estimated load time** (4G): ~23 seconds
- **Estimated load time** (WiFi): ~3-5 seconds

### After Compression
- **Total download**: 40.2 MB
- **Estimated load time** (4G): ~8 seconds
- **Estimated load time** (WiFi): ~1-2 seconds

**Result**: 65.5% faster download time! ⚡

## Implementation in Code

The `index.html` file automatically configures Draco decoding:

```javascript
// Configure A-Frame to use Draco decoder for compressed models
if (typeof THREE !== 'undefined' && THREE.DRACOLoader) {
    THREE.DRACOLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    console.log('✓ Draco decoder configured');
}
```

A-Frame/Three.js will automatically detect Draco-compressed models and decompress them using the decoder.

## Troubleshooting

### Models not loading?
1. Check browser console for errors
2. Verify Draco decoder is loading: Look for "✓ Draco decoder configured"
3. Check network tab - decoder files should load from gstatic.com
4. Try using original files: Rename `.original.glb` to `.glb`

### Compression script errors?
- Ensure Node.js is installed
- Run `npm install` to install dependencies
- Check file permissions

### Want higher quality?
Edit `compress-models.js` and increase quantization bits:
```javascript
quantizePositionBits: 16,  // Higher = more precision
quantizeNormalBits: 12,    // Higher = smoother normals
```

Then re-run compression.

## References

- [Draco 3D Compression](https://google.github.io/draco/)
- [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline)
- [Three.js DRACOLoader](https://threejs.org/docs/#examples/en/loaders/DRACOLoader)
- [Stack Overflow: Making GLB files smaller](https://stackoverflow.com/questions/56271427/can-i-make-the-glb-file-smaller)

## License

The compression tools and scripts are part of this project. Individual 3D models have their own licenses (see `license.txt` in each model directory).
