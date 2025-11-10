# QR Scanner with ZXing Library

This QR scanner has been rewritten to use the **@zxing/library** instead of html5-qrcode for improved performance and better QR code format support.

## 🚀 Key Features

### Enhanced QR Code Support
- **Multiple QR Code Formats**: Supports QR Code, Data Matrix, Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, Codabar, ITF, RSS-14, RSS-Expanded, and more
- **Better Performance**: ZXing library provides faster and more reliable QR code detection
- **Improved Accuracy**: Enhanced decoding algorithms for better recognition in various lighting conditions

### 3D Model Integration
- **Automatic 3D Model Detection**: Automatically detects URLs pointing to 3D model files (.gltf, .glb, .obj, etc.)
- **Full-Screen 3D Viewer**: Integrated Google Model-Viewer for interactive 3D model display  
- **Interactive Controls**: Auto-rotate, camera controls, fullscreen mode, and reset view
- **Seamless Navigation**: Back button for easy return to QR scanner

## 📱 Usage Instructions

### Basic QR Scanning
1. Open `index.html` in a web browser
2. Allow camera access when prompted
3. Point your camera at a QR code
4. The scanner will automatically detect and display the QR code content

### 3D Model Viewing
1. Scan a QR code containing a 3D model URL
2. Click the "🎯 View 3D Model" button when it appears
3. The 3D model will load in full-screen mode
4. Use the controls to interact with the model:
   - **Auto Rotate**: Toggle automatic rotation
   - **Reset View**: Return to default camera position
   - **Fullscreen**: Enter/exit fullscreen mode
5. Click the back arrow (←) to return to the scanner

## 🔧 Technical Changes

### Library Migration
- **Removed**: `html5-qrcode@2.3.8`
- **Added**: `@zxing/library@latest`

### Code Architecture
- **Video Management**: Direct video stream control with MediaDevices API
- **Continuous Scanning**: Real-time QR code detection without manual triggers
- **Error Handling**: Improved error messages and recovery mechanisms
- **Memory Management**: Proper cleanup of video streams and scanner resources

### Performance Improvements
- **Faster Initialization**: Reduced camera startup time
- **Better Resource Usage**: Efficient memory and CPU usage
- **Responsive Design**: Optimized for both mobile and desktop devices

## 🧪 Testing

### Test Files Included
- **`test-zxing.html`**: Simple test page to verify ZXing functionality
- **`test-qr.html`**: QR code generator for creating test QR codes

### Testing Steps
1. Open `test-zxing.html` to verify basic ZXing functionality
2. Use `test-qr.html` to generate test QR codes with 3D model URLs
3. Test the main `index.html` with generated QR codes

### Supported 3D Model URLs
The scanner automatically detects these 3D model formats:
- `.gltf` (glTF 2.0 format)
- `.glb` (Binary glTF)
- `.obj` (Wavefront OBJ)
- `.fbx` (Autodesk FBX)
- `.dae` (COLLADA)
- `.ply` (Stanford PLY)

## 🔍 Browser Compatibility

### Supported Browsers
- **Chrome/Chromium**: Full support
- **Firefox**: Full support  
- **Safari**: Full support (iOS 11+)
- **Edge**: Full support

### Required Features
- WebRTC (getUserMedia)
- ES6 Modules
- WebGL (for 3D model viewing)

## 🛠️ Customization

### Scanner Settings
You can modify these parameters in the JavaScript code:

```javascript
// Camera constraints
const constraints = {
    video: {
        facingMode: { ideal: 'environment' }, // Use back camera
        width: { ideal: 1280 },
        height: { ideal: 720 }
    }
};
```

### 3D Model Detection
Add custom URL patterns for 3D model detection:

```javascript
function is3DModelURL(url) {
    const customPatterns = [
        'your-domain.com/models',
        'another-pattern.com/3d'
    ];
    
    // Add your custom logic here
    return modelExtensions.some(ext => url.includes(ext)) ||
           customPatterns.some(pattern => url.includes(pattern));
}
```

## 📋 Troubleshooting

### Common Issues

**Camera Not Working**
- Ensure HTTPS connection (required for camera access)
- Check browser permissions for camera access
- Verify camera is not being used by another application

**QR Codes Not Detected**
- Ensure good lighting conditions
- Hold camera steady and at proper distance
- Clean camera lens
- Try different QR code sizes

**3D Models Not Loading**
- Verify the URL is accessible
- Ensure CORS headers are properly configured
- Check that the model file format is supported
- Verify stable internet connection

### Debug Mode
Enable console logging by opening browser developer tools (F12) to see detailed scanner activity.

## 🌟 Advantages of ZXing Library

1. **Better Format Support**: Supports more barcode and QR code formats
2. **Improved Performance**: Faster processing and lower CPU usage
3. **Enhanced Accuracy**: Better detection in challenging conditions
4. **Active Development**: Regularly updated with improvements
5. **Cross-Platform**: Consistent behavior across different devices and browsers

## 📄 License

This implementation uses:
- **@zxing/library**: Apache License 2.0
- **@google/model-viewer**: Apache License 2.0

## 🔗 References

- [ZXing Library Documentation](https://github.com/zxing-js/library)
- [Google Model-Viewer](https://modelviewer.dev/)
- [WebRTC getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
