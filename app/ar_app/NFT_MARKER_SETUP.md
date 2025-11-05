# NFT (Natural Feature Tracking) Marker Setup Guide

NFT markers allow AR tracking using natural images instead of QR codes or pattern markers. This is useful for tracking photos, posters, book covers, etc.

## Step 1: Generate NFT Descriptor Files

### Option A: Online Tool (Recommended for Beginners)

1. Visit: **https://carnaux.github.io/NFT-Marker-Creator/**
2. Click "Choose File" and select your image (JPG or PNG)
3. Wait for processing (may take 1-2 minutes)
4. Download the generated ZIP file
5. Extract 3 files: `.fset`, `.fset3`, `.iset`

### Option B: Command Line Tool (Advanced)

```bash
# Install Node.js from https://nodejs.org first

# Install the NFT marker creator globally
npm install -g nft-marker-creator

# Generate markers from your image
nft-marker-creator -i path/to/your-image.jpg -o output-folder

# Optional: Specify DPI for better accuracy
nft-marker-creator -i image.jpg -o output -d 300
```

### Option C: Using Emscripten Build (Most Control)

```bash
# Clone the AR.js repository
git clone https://github.com/AR-js-org/AR.js.git
cd AR.js

# Follow instructions in tools/NFT/readme.md
# This gives you the most control over generation parameters
```

## Step 2: Choose a Good Tracking Image

### ✅ Good Images:
- **High contrast** - Mix of light and dark areas
- **Rich texture** - Lots of unique details
- **Clear features** - Distinct patterns or shapes
- **Minimum 480x480px** - Higher resolution is better
- **Non-reflective** - Matte finish when printed

### ❌ Bad Images:
- Solid colors or gradients
- Very dark or very bright
- Simple logos with few features
- Blurry or low resolution
- Highly reflective surfaces
- Repetitive patterns

### Examples:
- ✅ Photographs with details
- ✅ Artwork or paintings
- ✅ Magazine covers
- ✅ Product packaging
- ✅ Posters with graphics
- ❌ Plain colored paper
- ❌ Simple text on white background
- ❌ Minimalist logos

## Step 3: Organize Your Files

Create a folder structure for your model:

```
app/ar_app/model/your-model-name/
├── tracking-image.fset      # Feature set file
├── tracking-image.fset3     # 3D feature set file
├── tracking-image.iset      # Image set file
├── tracking-image.jpg       # Original image (optional, for reference)
├── model.glb                # Your 3D model
└── config.json              # Configuration file
```

**Important:** All 3 descriptor files must have the **same base name**:
- ✅ `poster.fset`, `poster.fset3`, `poster.iset`
- ❌ `poster.fset`, `image.fset3`, `track.iset`

## Step 4: Configure Your Model

Edit `config.json` to use NFT marker:

```json
{
  "marker_type": "nft",
  "nft_descriptor": "model/your-model-name/tracking-image",
  "model_file": "model.glb",
  "size": 0.5,
  "position": {
    "x": 0,
    "y": 0,
    "z": 0
  },
  "rotation": {
    "x": -90,
    "y": 0,
    "z": 0
  },
  "desc_info": {
    "title": "Your Model Name",
    "hk_narrative": "Audio description in Cantonese"
  }
}
```

### Configuration Notes:

- **`marker_type`**: Must be `"nft"` for natural feature tracking
- **`nft_descriptor`**: Path to descriptor files **WITHOUT extension**
  - ✅ Correct: `"model/satellite/mars-rover"`
  - ❌ Wrong: `"model/satellite/mars-rover.fset"`
  - ❌ Wrong: `"mars-rover"` (needs full path from model folder)

- **Position/Rotation**: 
  - NFT markers place models on the tracked image surface
  - Use rotation `x: -90` to make model stand upright
  - Adjust `y` position to lift model above surface

## Step 5: Add Model to model_list.json

Edit `app/ar_app/model/model_list.json`:

```json
{
  "models": [
    "sputnik1",
    "your-model-name"
  ]
}
```

## Step 6: Test Your NFT Marker

1. **Print or Display the Original Image**:
   - Print on matte paper (not glossy)
   - Or display on a tablet/computer screen
   - Recommended size: A4 (21cm x 29.7cm) or larger

2. **Open the AR App**:
   - Open `index.html` in a web browser on your phone
   - Allow camera access
   - Point camera at the printed/displayed image

3. **Adjust if Needed**:
   - If tracking is poor, try better lighting
   - Ensure entire image is visible in camera
   - Keep camera steady at 20-40cm distance
   - Avoid shadows or reflections on image

## Troubleshooting

### Marker Not Detecting

**Problem:** Camera doesn't detect the NFT marker

**Solutions:**
- Check that all 3 files (.fset, .fset3, .iset) are present
- Verify `nft_descriptor` path in config.json is correct (no extension)
- Ensure original image has enough detail and contrast
- Try better lighting conditions
- Move camera closer (20-30cm away)
- Keep camera parallel to the image surface

### Tracking is Unstable

**Problem:** Model appears but jumps around or disappears

**Solutions:**
- Use a higher resolution source image (try 1920x1080px or more)
- Regenerate NFT markers with higher DPI: `nft-marker-creator -i image.jpg -o output -d 300`
- Ensure tracking image is flat (not curved or wrinkled)
- Improve lighting (avoid shadows and glare)
- Print image larger (A4 or A3 size)

### Model Appears in Wrong Position

**Problem:** Model is floating, sideways, or underground

**Solutions:**
- Adjust `position.y` to lift model above surface (try 0.5 to 2)
- Use `rotation.x: -90` to make model stand upright
- NFT coordinate system: X=right, Y=up, Z=towards camera
- Test different rotation values in 90° increments

### Console Shows 404 Error

**Problem:** Browser console shows "Failed to load NFT descriptor"

**Solutions:**
- Verify file paths are correct (case-sensitive!)
- Check that files are in the right folder
- Make sure `nft_descriptor` path is relative to `index.html`
- Remove file extension from `nft_descriptor` path

## Advanced: Customizing NFT Generation

### Using Command Line with Options

```bash
# Basic generation
nft-marker-creator -i input.jpg -o output/

# High DPI for better tracking (recommended for print)
nft-marker-creator -i input.jpg -o output/ -d 300

# Specify width for processing (larger = better but slower)
nft-marker-creator -i input.jpg -o output/ -w 1920

# Multiple images at once
nft-marker-creator -i folder/*.jpg -o output/
```

### DPI Guidelines

- **Screen display**: 72-96 DPI (default)
- **Home printing**: 150-200 DPI
- **Professional printing**: 300 DPI
- **Large format (posters)**: 150 DPI

Higher DPI = Better tracking but larger file sizes

## NFT vs Pattern Markers

| Feature | NFT Markers | Pattern Markers |
|---------|-------------|-----------------|
| **Appearance** | Natural images/photos | Black and white patterns |
| **User Experience** | More attractive | Technical looking |
| **Setup Complexity** | Medium (needs generation) | Easy (auto-generated) |
| **Tracking Speed** | Slower initialization | Fast detection |
| **Tracking Stability** | Good with good images | Very stable |
| **File Size** | Larger (3 files) | Small (1 .patt file) |
| **Best For** | Marketing, posters, books | Quick prototypes, demos |

## Resources

- **NFT Marker Creator Online**: https://carnaux.github.io/NFT-Marker-Creator/
- **NFT Marker Creator (npm)**: https://www.npmjs.com/package/nft-marker-creator
- **AR.js Documentation**: https://ar-js-org.github.io/AR.js-Docs/
- **AR.js GitHub**: https://github.com/AR-js-org/AR.js

## Example: Complete NFT Setup

```bash
# 1. Generate markers
nft-marker-creator -i space-poster.jpg -o model/space-station/ -d 200

# 2. Files created:
#    model/space-station/space-poster.fset
#    model/space-station/space-poster.fset3
#    model/space-station/space-poster.iset

# 3. Add your model:
#    model/space-station/station.glb

# 4. Create config.json:
{
  "marker_type": "nft",
  "nft_descriptor": "model/space-station/space-poster",
  "model_file": "station.glb",
  "size": 1.5,
  "position": {"x": 0, "y": 1, "z": 0},
  "rotation": {"x": -90, "y": 0, "z": 0}
}

# 5. Update model_list.json:
{
  "models": ["space-station"]
}

# 6. Print space-poster.jpg and test!
```

---

**Tip:** Start with the online tool for your first NFT marker. Once comfortable, move to the command-line tool for batch processing and more control.
