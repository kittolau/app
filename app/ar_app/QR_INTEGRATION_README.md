# AR Viewer with ZXing QR Code Support

This AR application now supports both traditional AR markers and QR code detection using the ZXing library.

## Features

### 🔍 QR Code Scanning
- **Real-time QR scanning**: Scan QR codes from live camera feed
- **File upload scanning**: Upload images containing QR codes
- **Multiple QR formats**: Supports all standard QR code formats
- **Model triggering**: QR codes can trigger specific 3D models
- **Generic QR handling**: Handles URLs, text, and other QR content

### 🎯 AR Marker Support
- Traditional pattern markers
- Barcode markers
- Multiple marker detection

### 🎮 Interactive Features
- Speech synthesis (TTS) in Cantonese
- Personal info cards for astronauts
- Mission briefings
- Video integration
- Photo sharing

## QR Code Implementation

### 1. Library Integration
The app now uses **@zxing/library** for QR code detection:

```html
<script src="https://unpkg.com/@zxing/library@latest/umd/index.min.js"></script>
```

### 2. QR Scanner Controls
- **启动QR扫描** - Toggle real-time QR scanning
- **上传图片扫描** - Upload and scan images containing QR codes

### 3. Model Configuration
To make a QR code trigger a specific 3D model, add these properties to your model's `config.json`:

```json
{
  "marker_type": "qrcode",
  "qr_code": "YOUR_QR_CODE_CONTENT",
  "size": 0.8,
  "position": {"x": 0, "y": 1.2, "z": 0},
  "rotation": {"x": 90, "y": 0, "z": 0},
  "model_file": "model.glb",
  "desc_info": {
    "title": "Your Model Title",
    "hk_narrative": "Your description..."
  }
}
```

## Usage Instructions

### For Developers

1. **Configure Models**: Add QR code settings to your model configurations
2. **Generate QR Codes**: Use the included `qr-generator.html` tool
3. **Test Scanning**: Use the QR scanner controls in the AR app

### For Users

1. **Start the App**: Open the AR application
2. **Enable QR Scanning**: Click "启动QR扫描" button
3. **Scan QR Codes**: Point camera at QR codes or upload images
4. **View Models**: QR codes matching configured models will display 3D content
5. **Handle URLs**: Generic URL QR codes will prompt to open in browser

## QR Code Generator

Use the included `qr-generator.html` tool to create QR codes:

1. Open `qr-generator.html` in your browser
2. Select a preset or enter custom content
3. Choose QR code size
4. Click "生成QR碼" to generate
5. Download the QR code image

### Preset QR Codes
- `SPUTNIK1_MODEL` - Triggers Sputnik 1 model
- `ROCKET1_MODEL` - Triggers Rocket model
- `ISS_MODEL` - Triggers Space Station model
- `MOON_LANDING_MODEL` - Triggers Moon Landing scene
- `ASTRONAUT_MODEL` - Triggers Astronaut model

## Technical Details

### ZXing Integration
- **Real-time scanning**: Uses `requestAnimationFrame` for continuous scanning
- **Image processing**: Scans from video frames using HTML5 Canvas
- **Error handling**: Graceful handling of scanning failures
- **Performance**: Efficient scanning with minimal CPU impact

### QR Code Matching
1. Check if QR content matches any model's `qr_code` field
2. Check if QR content matches model name
3. Handle generic QR codes (URLs, text)

### Browser Compatibility
- **Modern browsers**: Full support with native features
- **Safari**: WebKit prefix support for backdrop filters
- **Mobile**: Touch-friendly responsive design

## File Structure

```
app/ar_app/
├── index.html              # Main AR application with QR support
├── qr-generator.html       # QR code generator tool
└── model/
    ├── config.qr.example.json   # Example QR model configuration
    └── [model-folders]/
        └── config.json     # Individual model configurations
```

## Examples

### QR Model Configuration
```json
{
  "marker_type": "qrcode",
  "qr_code": "SPACE_STATION_2024",
  "size": 1.0,
  "model_file": "station.glb",
  "desc_info": {
    "title": "International Space Station",
    "hk_narrative": "國際太空站是人類在太空中的家..."
  }
}
```

### Generic QR Handling
- **URLs**: `https://nasa.gov` → Prompts to open website
- **Text**: `Hello World` → Shows alert with content
- **Data**: `MODEL:ROCKET1` → Could be parsed for special handling

## Troubleshooting

### QR Scanner Not Working
1. Check browser permissions for camera access
2. Ensure ZXing library loaded successfully
3. Verify QR code is clear and properly lit
4. Try uploading a high-quality image instead

### Model Not Appearing
1. Check `qr_code` field matches exactly
2. Verify model files exist and load properly
3. Check browser console for error messages
4. Ensure model configuration is valid JSON

### Performance Issues
1. Stop QR scanning when not needed
2. Use appropriate QR code sizes (300x300 recommended)
3. Ensure good lighting for camera scanning
4. Close other browser tabs using camera

## Future Enhancements

- **Multiple QR simultaneous detection**
- **QR code positioning for AR anchoring**
- **Custom QR code validation**
- **Batch QR code generation**
- **QR analytics and tracking**
