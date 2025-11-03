# 🚀 Quick Start Guide

## Start the Server

```bash
# From project root: /Users/kitto/Desktop/kitto_app

# Option 1: NPM (opens /app folder automatically)
npm run dev

# Option 2: NPM (just starts server)
npm start

# Option 3: Python
npm run serve
# or
python3 -m http.server 8000
```

## Access Your Apps

### Main Pages
- **Landing Page**: http://localhost:8000/
- **App Menu (QR)**: http://localhost:8000/preview.html

### Apps in /app Folder
- **STEM Q&A**: http://localhost:8000/app/qa_mc/stem-qa-game.html
- **Memory Game**: http://localhost:8000/app/flipcard/index.html
- **Sputnik AR**: http://localhost:8000/app/ar_app/index.html
- **AR Demo**: http://localhost:8000/app/ar/ar-simple.html
- **3D Viewer**: http://localhost:8000/app/ar/show-model.html
- **Video Player**: http://localhost:8000/app/wmvplayer/app.html?video=sample.wmv

## Video Player Usage

Place videos in `/asset/video/` and access them:

```bash
# Example URLs
http://localhost:8000/app/wmvplayer/app.html?video=sample.wmv
http://localhost:8000/app/wmvplayer/app.html?video=myvideo.wmv
http://localhost:8000/app/wmvplayer/app.html?video=presentation.wmv
```

The player will automatically try:
1. `{filename}.mp4` (best compatibility)
2. `{filename}.webm` (good fallback)
3. `{filename}.wmv` (with download option)

## Mobile Access

1. Start server on your computer
2. Get your local IP:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```
3. On mobile, visit: `http://YOUR_IP:8000`
4. Or scan QR codes from the preview menu

## Tips

- All HTML files in `/app` are accessible via browser
- Server runs from project root, so all folders are available
- Use `npm run dev` to auto-open your browser
- CORS is enabled for AR and media features
- Camera permission needed for AR experiences

---

**That's it!** Your apps are now accessible at http://localhost:8000 🎉
