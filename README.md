# Kitto App

Interactive educational application with AR experiences, games, and multimedia features.

## 🚀 Quick Start - Development Server

### Option 1: NPM (Recommended)

```bash
# Install dependencies (first time only)
npm install

# Start server and open /app folder
npm run dev

# Start server and open main landing page
npm start

# Open specific pages
npm run app        # Opens /app folder
npm run preview    # Opens preview menu with QR codes
```

The app will be available at: **http://localhost:8000**

- **Landing Page**: http://localhost:8000/ (index.html)
- **App Folder**: http://localhost:8000/app/
- **Menu with QR**: http://localhost:8000/preview.html

### Option 2: Python (No installation needed)

```bash
# Python 3
python3 -m http.server 8000

# Or use npm script
npm run serve
```

### Option 3: VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click `preview.html` → "Open with Live Server"

## 📱 Features

### 0. **Landing Page** (`index.html`)
- Beautiful dashboard with all apps organized by category
- Direct links to every application
- Quick navigation to educational games, AR experiences, and media player

### 1. **Main Menu** (`preview.html`)
- Central hub with QR codes for mobile access
- Links to all apps and experiences

### 2. **AR Experiences**
- **AR Simple Demo** (`app/ar/ar-simple.html`) - Basic AR marker demo
- **Sputnik 1 AR** (`app/ar_app/index.html`) - Interactive satellite experience with orbit animations
  - ⚡ **Optimized**: Models compressed with Draco (65.5% smaller, 76.3 MB saved)
  - 📦 **Fast Loading**: Download size reduced from 116.6 MB to 40.2 MB
  - 🚀 **Performance**: 65% faster load times on mobile networks
- **3D Model Viewer** (`app/ar/show-model.html`) - GLTF model preview

### 3. **Educational Games**
- **STEM Q&A Game** (`app/qa_mc/stem-qa-game.html`)
- **Config Generator** (`app/qa_mc/stem-qa-config-generator.html`)
- **Card Flip Memory** (`app/flipcard/index.html`)

### 4. **Media Player**
- **WMV Player** (`app/wmvplayer/app.html?video=sample.wmv`)
  - Supports query parameters for dynamic video loading
  - Mobile-friendly controls

## 📂 Project Structure

```
kitto_app/
├── app/
│   ├── ar/              # AR demos and 3D viewer
│   ├── ar_app/          # Sputnik 1 AR experience
│   ├── flipcard/        # Memory card game
│   ├── qa_mc/           # STEM quiz game
│   └── wmvplayer/       # Video player
├── asset/
│   └── video/           # Video files
├── demo/                # Additional demos
├── preview.html         # Main menu
└── package.json         # Dev server config
```

## 🎮 Usage Examples

### AR Experiences
```bash
# AR Simple Demo
http://localhost:8000/app/ar/ar-simple.html

# Sputnik 1 AR (requires AR marker)
http://localhost:8000/app/ar_app/index.html

# 3D Model Viewer
http://localhost:8000/app/ar/show-model.html
```

### Games
```bash
# STEM Q&A Game
http://localhost:8000/app/qa_mc/stem-qa-game.html

# Card Flip Memory Game
http://localhost:8000/app/flipcard/index.html
```

### Video Player
```bash
# Default video
http://localhost:8000/app/wmvplayer/app.html

# Custom video
http://localhost:8000/app/wmvplayer/app.html?video=myvideo.wmv
```

## 🔧 Development

### Model Compression
All GLB models are compressed with Draco for optimal performance. See `COMPRESSION_RESULTS.md` for details.

**To compress new models:**
```bash
node compress-models.js
```

**Results:**
- 65.5% average file size reduction
- 76.3 MB total space saved
- Original files backed up as `*.original.glb`

See `app/ar_app/MODEL_COMPRESSION.md` for full documentation.

### Adding New Videos
Place video files in `/asset/video/` and access them via:
```
http://localhost:8000/app/wmvplayer/app.html?video=filename.wmv
```

### AR Marker Setup
1. Print the marker from `pattern-marker.png`
2. Open AR app on mobile device
3. Point camera at marker to see 3D models

### Editing Quiz Questions
Use the Config Generator to create/edit questions:
```
http://localhost:8000/app/qa_mc/stem-qa-config-generator.html
```

## 📱 Mobile Access

1. Start the dev server
2. Find your local IP address:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```
3. Access from mobile: `http://YOUR_IP:8000`
4. Or scan QR codes from the main menu

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Use a different port
npx http-server -p 8080

# Or with Python
python3 -m http.server 8080
```

### CORS Issues
The npm script includes `--cors` flag. If using Python, you may need to add CORS headers manually for certain features.

### AR Camera Permission
- Ensure HTTPS or localhost
- Grant camera permissions in browser
- Use latest Chrome/Safari for best AR support

## 📄 License

MIT

## 🤝 Contributing

Feel free to submit issues and enhancement requests!
