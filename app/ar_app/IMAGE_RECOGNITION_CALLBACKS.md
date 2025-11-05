# Image Recognition with Callbacks

AR.js uses **NFT (Natural Feature Tracking)** for image recognition. This allows you to detect natural images (photos, posters, etc.) and trigger custom JavaScript callbacks.

## How Image Recognition Works in AR.js

1. **NFT = Image Recognition**: NFT markers ARE image recognition in AR.js
2. **Detection Events**: When image is found/lost, events are triggered
3. **Custom Callbacks**: You can run custom JavaScript when images are detected

## Adding Callbacks to Image Recognition

### Method 1: Using Event Listeners (Current Implementation)

The `index.html` already supports callbacks through event listeners:

```javascript
// In createMarkerForModel() function
marker.addEventListener('markerFound', function() {
    onMarkerFound(modelName);  // Your callback here
});

marker.addEventListener('markerLost', function() {
    onMarkerLost(modelName);   // Your callback here
});
```

### Method 2: Custom Callbacks in Config.json

You can add custom callback function names in your `config.json`:

```json
{
  "marker_type": "nft",
  "nft_descriptor": "model/your-model/image",
  "model_file": "model.glb",
  "callbacks": {
    "onFound": "handleImageFound",
    "onLost": "handleImageLost",
    "onTracking": "handleImageTracking"
  }
}
```

### Method 3: Inline Callback Functions

Define custom behavior per model:

```json
{
  "marker_type": "nft",
  "nft_descriptor": "model/poster/concert-poster",
  "callbacks": {
    "onFound": "playConcertMusic",
    "onLost": "stopMusic",
    "onTracking": "updateTicketInfo"
  }
}
```

## Available Callback Events

### 1. **markerFound** - Image Detected
Triggered when the image is first recognized by the camera.

```javascript
marker.addEventListener('markerFound', function() {
    console.log('Image detected!');
    // Your custom code here:
    // - Play audio
    // - Show UI elements
    // - Start animation
    // - Send analytics
    // - Make API call
});
```

### 2. **markerLost** - Image Lost
Triggered when the image goes out of view or loses tracking.

```javascript
marker.addEventListener('markerLost', function() {
    console.log('Image lost!');
    // Your custom code here:
    // - Stop audio
    // - Hide UI elements
    // - Pause animation
    // - Save state
});
```

### 3. **getMarker** (Advanced)
Access marker position and rotation data:

```javascript
marker.addEventListener('getMarker', function(event) {
    var matrix = event.detail.matrix;  // 4x4 transformation matrix
    var position = event.detail.position;  // {x, y, z}
    var rotation = event.detail.rotation;  // {x, y, z}
    
    // Use for advanced tracking
    console.log('Marker position:', position);
});
```

## Example Use Cases

### Use Case 1: Movie Poster Recognition
```javascript
// When movie poster is detected
function onMoviePosterFound(posterName) {
    // Play movie trailer audio
    var audio = new Audio('trailers/' + posterName + '.mp3');
    audio.play();
    
    // Show "Buy Tickets" button
    document.getElementById('buy-tickets-btn').style.display = 'block';
    
    // Send analytics
    fetch('/api/poster-scanned', {
        method: 'POST',
        body: JSON.stringify({ poster: posterName, time: Date.now() })
    });
}

function onMoviePosterLost(posterName) {
    // Pause audio
    var audio = document.getElementById('trailer-audio');
    if (audio) audio.pause();
    
    // Hide button
    document.getElementById('buy-tickets-btn').style.display = 'none';
}
```

### Use Case 2: Product Package Recognition
```javascript
function onProductFound(productName) {
    // Show product information
    fetch('/api/product/' + productName)
        .then(response => response.json())
        .then(data => {
            document.getElementById('product-name').textContent = data.name;
            document.getElementById('product-price').textContent = data.price;
            document.getElementById('product-info').style.display = 'block';
        });
    
    // Add to recently viewed
    localStorage.setItem('lastViewed', productName);
}
```

### Use Case 3: Museum Exhibit Recognition
```javascript
function onExhibitFound(exhibitName) {
    // Start audio tour
    speakNarrative(exhibitName);
    
    // Show additional info overlay
    showExhibitDetails(exhibitName);
    
    // Log visit time
    visitStartTime = Date.now();
}

function onExhibitLost(exhibitName) {
    // Stop audio
    stopNarrative();
    
    // Calculate viewing duration
    var duration = Date.now() - visitStartTime;
    logVisitDuration(exhibitName, duration);
}
```

### Use Case 4: Business Card Recognition
```javascript
function onBusinessCardFound(cardId) {
    // Fetch contact info from database
    fetch('/api/contact/' + cardId)
        .then(response => response.json())
        .then(contact => {
            // Show AR contact card
            displayContactCard(contact);
            
            // Offer to save contact
            showSaveContactButton(contact);
        });
}

function saveContact(contact) {
    // Add to phone contacts (requires user permission)
    navigator.contacts.save(contact);
}
```

## Implementation: Adding Callbacks to Your App

I'll update your `index.html` to support custom callbacks from config.json.

### Step 1: Config.json Structure
```json
{
  "marker_type": "nft",
  "nft_descriptor": "model/poster/image",
  "model_file": "model.glb",
  "callbacks": {
    "onFound": "customFoundHandler",
    "onLost": "customLostHandler",
    "onTracking": "customTrackingHandler"
  },
  "callback_data": {
    "audio_file": "audio/narration.mp3",
    "api_endpoint": "/api/track",
    "custom_param": "value"
  }
}
```

### Step 2: Define Global Callback Functions

Add to your page or external JS file:

```javascript
// Define your custom callbacks globally
window.customFoundHandler = function(modelName, config) {
    console.log('Custom: Image found!', modelName);
    
    // Access callback data from config
    if (config.callback_data && config.callback_data.audio_file) {
        var audio = new Audio(config.callback_data.audio_file);
        audio.play();
    }
    
    // Make API call if specified
    if (config.callback_data && config.callback_data.api_endpoint) {
        fetch(config.callback_data.api_endpoint, {
            method: 'POST',
            body: JSON.stringify({ model: modelName, event: 'found' })
        });
    }
};

window.customLostHandler = function(modelName, config) {
    console.log('Custom: Image lost!', modelName);
    // Your custom lost logic
};

window.customTrackingHandler = function(modelName, config, trackingData) {
    console.log('Custom: Tracking update', trackingData);
    // Access real-time position/rotation
};
```

## Advanced: Real-time Tracking Data

Access continuous tracking information:

```javascript
function setupTrackingCallback(marker, modelName) {
    // Update every frame while marker is visible
    marker.object3D.addEventListener('componentchanged', function(event) {
        if (marker.object3D.visible) {
            var position = marker.object3D.position;
            var rotation = marker.object3D.rotation;
            
            // Your real-time tracking logic
            console.log('Position:', position.x, position.y, position.z);
            console.log('Rotation:', rotation.x, rotation.y, rotation.z);
            
            // Example: Update UI based on distance
            var distance = Math.sqrt(
                position.x * position.x + 
                position.y * position.y + 
                position.z * position.z
            );
            
            if (distance < 1) {
                console.log('Camera is close to marker');
            }
        }
    });
}
```

## Performance Considerations

### Optimize Callbacks
- **Debounce rapid events**: Avoid calling expensive operations on every frame
- **Use flags**: Track state to prevent duplicate operations
- **Clean up**: Remove event listeners when not needed

```javascript
var isProcessing = false;

function optimizedCallback(modelName) {
    if (isProcessing) return;  // Prevent duplicate calls
    isProcessing = true;
    
    // Your logic here
    expensiveOperation(modelName);
    
    setTimeout(function() {
        isProcessing = false;
    }, 1000);  // Debounce for 1 second
}
```

## Comparison: NFT vs Other Technologies

| Technology | Use Case | Pros | Cons |
|------------|----------|------|------|
| **NFT (AR.js)** | Image recognition in AR | Free, web-based, no app needed | Limited to specific images |
| **ARCore/ARKit** | Native AR apps | High performance, device features | Requires app install |
| **ML Kit / Vision API** | General object recognition | Recognizes any object | Cloud-dependent, costs |
| **QR Codes** | Quick data transfer | Fast, reliable | Visually unappealing |

## Summary

- **NFT = Image Recognition** in AR.js
- **Use `markerFound`/`markerLost` events** for callbacks
- **Define custom functions** globally or per-model
- **Access tracking data** for real-time interactions
- **Optimize performance** with debouncing and flags

The guide shows how to add any custom behavior when images are detected! 🎯📸
