# QR Code Scanner with 3D Model Viewer

An enhanced QR code scanner that automatically detects 3D model URLs and displays them in a full-screen 3D viewer using Google's model-viewer component.

## 🎯 Features

### QR Code Scanning
- **Real-time scanning** with live camera feed
- **Professional UI** with scanning frame and animations
- **Multiple QR types** support (URLs, text, email, phone, SMS)
- **Auto-camera selection** (prefers back camera on mobile)
- **Error handling** with user-friendly messages

### 3D Model Viewing
- **Automatic detection** of 3D model URLs (.gltf, .glb, .obj, etc.)
- **Full-screen 3D viewer** with Google's model-viewer
- **Interactive controls** (rotate, zoom, pan)
- **Auto-rotate toggle**
- **Camera reset** functionality
- **Fullscreen mode** support
- **Back button** for easy navigation

### User Experience
- **Responsive design** for mobile and desktop
- **Smooth animations** and transitions
- **Keyboard shortcuts** (ESC to close)
- **Visual feedback** for all interactions
- **Loading states** with spinners
- **Error handling** with helpful messages

## 📱 Usage

### Basic QR Scanning
1. Open `index.html` in your browser
2. Allow camera access when prompted
3. Point camera at any QR code
4. View results in the popup modal

### 3D Model Viewing
1. Scan a QR code containing a 3D model URL
2. Click **"🎯 View 3D Model"** button
3. Interact with the 3D model:
   - **Drag** to rotate
   - **Pinch/scroll** to zoom
   - **Click controls** for additional features
4. Use **← Back button** to return to scanner

### Testing
1. Open `test-qr.html` to generate test QR codes
2. Print or display the generated QR code
3. Scan with the main app to test 3D viewing

## 🔧 Technical Details

### Dependencies
- **html5-qrcode** - QR code scanning functionality
- **@google/model-viewer** - 3D model rendering
- **Modern browser** with camera support

### 3D Model Support
The app automatically detects URLs containing:
- `.gltf` and `.glb` files (preferred)
- `.obj`, `.fbx`, `.dae`, `.ply` files
- Known 3D model hosting patterns
- URLs containing "result.gltf" or "model.glb"

### File Structure
```
app/qr_app/
├── index.html          # Main QR scanner app
├── test-qr.html       # QR code generator for testing
└── README.md          # This documentation
```

## 🎨 Customization

### Adding Model Detection Patterns
Edit the `is3DModelURL()` function in `index.html`:

```javascript
function is3DModelURL(url) {
    const modelExtensions = ['.gltf', '.glb', '.obj', '.fbx'];
    const lowerUrl = url.toLowerCase();
    
    // Add your custom patterns here
    if (lowerUrl.includes('your-3d-site.com')) {
        return true;
    }
    
    return modelExtensions.some(ext => lowerUrl.includes(ext));
}
```

### Styling the 3D Viewer
Modify the CSS classes in the `<style>` section:
- `.model-viewer-container` - Main container
- `.model-header` - Header with title and back button
- `.back-button` - Back button styling
- `.model-controls` - Control buttons at bottom

### Model Viewer Configuration
Customize the `<model-viewer>` attributes:

```html
<model-viewer 
    id="model-viewer"
    auto-rotate          <!-- Enable auto-rotation -->
    camera-controls      <!-- Enable camera controls -->
    tone-mapping="neutral"
    shadow-intensity="1"
    loading="eager">
</model-viewer>
```

## 📋 Example QR Codes

### 3D Model URLs
- `https://kittolau.github.io/app/demo/ar/2d23d/result.gltf`
- `https://your-site.com/models/spaceship.glb`
- `https://example.com/assets/character.gltf`

### Other QR Types
- **Website**: `https://google.com`
- **Email**: `mailto:user@example.com`
- **Phone**: `tel:+1234567890`
- **SMS**: `sms:+1234567890`

## 🚀 Deployment

### Local Development
1. Start a local web server (required for camera access)
2. Navigate to the app directory
3. Open `index.html` in browser

### Production Deployment
1. Ensure HTTPS (required for camera access)
2. Configure proper CORS headers for 3D models
3. Test on various devices and browsers

## 🔍 Troubleshooting

### Camera Issues
- **Permission Denied**: Check browser settings, reload page
- **No Camera Found**: Ensure device has camera, try different browser
- **Poor Scanning**: Improve lighting, hold QR code steady

### 3D Model Issues
- **Model Won't Load**: Check URL accessibility, CORS headers
- **Loading Stuck**: Verify model file format and size
- **Performance Issues**: Use optimized GLTF/GLB files

### Browser Compatibility
- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 12+)
- **Mobile Browsers**: Optimized experience

## 🛠️ Development

### Adding New Features
1. Modify the QR detection logic in `onScanSuccess()`
2. Update the UI components as needed
3. Test on multiple devices and browsers

### Model Viewer Enhancements
- Add model metadata display
- Implement model sharing features
- Add screenshot/recording capabilities
- Integrate with AR frameworks

## 📄 License

This project uses open-source libraries:
- html5-qrcode (Apache License 2.0)
- @google/model-viewer (Apache License 2.0)

## ✨ Credits

Built with modern web technologies for seamless QR scanning and 3D model viewing experience.
