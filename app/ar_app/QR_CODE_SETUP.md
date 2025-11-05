# QR Code Support Documentation

## Overview
This AR application now supports both traditional AR pattern markers and QR code detection simultaneously using AR.js.

## How to Configure QR Code Markers

### 1. Update Model Configuration
In each model's `config.json` file, add the following fields to enable QR code detection:

```json
{
  "size": 0.3,
  "position": { "x": 0, "y": 0, "z": 0 },
  "rotation": { "x": 0, "y": 0, "z": 0 },
  "marker_type": "qrcode",
  "qr_code_value": "your-unique-qr-code-content",
  "desc_info": {
    "title": "Model Name",
    "hk_narrative": "Description in Cantonese",
    "youtube_video_src": "https://youtube.com/...",
    "local_video_src": "path/to/video.mp4"
  }
}
```

### 2. Configuration Fields

#### `marker_type` (string)
- **Values**: `"pattern"` or `"qrcode"`
- **Default**: `"pattern"`
- **Description**: Defines whether to use AR pattern marker or QR code detection

#### `qr_code_value` (string)
- **Required when**: `marker_type` is `"qrcode"`
- **Description**: The content/value of the QR code that triggers this model
- **Example**: `"SPUTNIK1"`, `"MODEL_ISS"`, or any unique string
- **Note**: Must match the actual QR code content exactly

### 3. Example Configurations

#### Pattern Marker (Traditional AR)
```json
{
  "size": 0.3,
  "position": { "x": 0, "y": 0, "z": 0 },
  "rotation": { "x": 0, "y": 0, "z": 0 },
  "marker_type": "pattern",
  "desc_info": {
    "title": "Sputnik 1",
    "hk_narrative": "史潑尼克一號是第一顆人造衛星..."
  }
}
```

#### QR Code Marker
```json
{
  "size": 0.3,
  "position": { "x": 0, "y": 0, "z": 0 },
  "rotation": { "x": 0, "y": 0, "z": 0 },
  "marker_type": "qrcode",
  "qr_code_value": "ISS_STATION",
  "desc_info": {
    "title": "International Space Station",
    "hk_narrative": "國際太空站是一個多國合作的太空研究設施..."
  }
}
```

## Creating QR Codes

### Online QR Code Generators
1. **QR Code Generator** - https://www.qr-code-generator.com/
2. **QR Stuff** - https://www.qrstuff.com/
3. **Free QR Code Generator** - https://www.the-qrcode-generator.com/

### Steps to Create QR Code
1. Choose "Text" or "Plain Text" type
2. Enter your unique value (e.g., "SPUTNIK1")
3. Generate and download the QR code image
4. Print or display the QR code
5. Update your model's `config.json` with the same value in `qr_code_value`

## AR.js QR Code Support

AR.js uses **barcode markers** for QR code detection. The system supports:
- QR Codes with text content
- Standard barcode formats
- Multiple markers simultaneously (both pattern and QR codes)

### Important Notes
1. **Exact Match Required**: The `qr_code_value` in config.json must exactly match the QR code content
2. **Case Sensitive**: "ISS" and "iss" are different values
3. **Special Characters**: Avoid special characters in QR code values for best compatibility
4. **Testing**: Use a QR code scanner app to verify your QR code content before testing in AR

## Mixed Marker Setup

You can have models using both pattern markers and QR codes in the same application:

```
/model
  /sputnik1           (uses pattern marker)
    - config.json     (marker_type: "pattern")
    - pattern-marker.patt
    - model.gltf
  
  /international_space_station  (uses QR code)
    - config.json     (marker_type: "qrcode", qr_code_value: "ISS")
    - model.gltf
```

## Troubleshooting

### QR Code Not Detected
1. Ensure `qr_code_value` matches QR code content exactly
2. Verify QR code is clear and well-lit
3. Check browser console for error messages
4. Try increasing QR code size (physical size when printed)

### Model Not Appearing
1. Check model file path is correct
2. Verify position/rotation values in config.json
3. Try adjusting the `size` parameter

### Both Markers at Once
- AR.js can detect multiple markers simultaneously
- Only one model will show at a time based on which marker is detected
- The system prioritizes the most recently detected marker

## Testing Checklist

- [ ] QR code generated with correct content
- [ ] `config.json` updated with `marker_type: "qrcode"`
- [ ] `qr_code_value` matches QR code content exactly
- [ ] Model files exist in correct directory
- [ ] Test in well-lit environment
- [ ] Camera permissions granted in browser
- [ ] Use HTTPS or localhost for camera access
