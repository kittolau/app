# Orbit Animation Feature

This feature allows 3D models (satellites, space stations) to orbit around an Earth model in AR.

## Configuration

To enable orbit animation for a model, add the following properties to your `config.json`:

```json
{
  "spin_around_earth_orbit": true,
  "earth": {
    "model_file": "../common_model/earth.glb",
    "size": 0.5,
    "position": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "rotation": {
      "x": 0,
      "y": 0,
      "z": 0
    }
  },
  "orbit_radius": 2.5,
  "orbit_speed": 1,
  "orbit_tilt": 23
}
```

## Parameters

### Required Parameters

- **`spin_around_earth_orbit`** (boolean)
  - Set to `true` to enable orbit animation
  - Default: `false`

- **`earth`** (object)
  - Configuration object for the Earth model
  - Required if `spin_around_earth_orbit` is `true`
  
  - **`earth.model_file`** (string)
    - Path to the Earth GLB/GLTF model (relative to model folder)
    - Example: `"../common_model/earth.glb"`
    - This Earth model will be placed at the center
  
  - **`earth.size`** (number)
    - Scale of the Earth model
    - Default: `0.5`
    - Recommended range: `0.3` to `1.0`
  
  - **`earth.position`** (object)
    - Position of Earth model (x, y, z)
    - Default: `{"x": 0, "y": 0, "z": 0}`
    - Usually kept at center (0, 0, 0)
  
  - **`earth.rotation`** (object)
    - Rotation of Earth model in degrees (x, y, z)
    - Default: `{"x": 0, "y": 0, "z": 0}`
    - Example: `{"x": 23.5, "y": 0, "z": 0}` for Earth's axial tilt

### Optional Parameters

- **`orbit_radius`** (number)
  - Distance from Earth center in A-Frame units
  - Default: `2`
  - Recommended range: `1.5` to `5`
  - Larger values = farther from Earth

- **`orbit_speed`** (number)
  - Speed multiplier for orbital rotation
  - Default: `1`
  - Recommended range: `0.5` to `3`
  - Higher values = faster orbit
  - Use `0.5` for slow, realistic orbits
  - Use `2` or `3` for dramatic demonstration

- **`orbit_tilt`** (number)
  - Tilt angle of the orbital plane in degrees
  - Default: `0` (equatorial orbit)
  - Example: `23` for Earth's axial tilt
  - Example: `90` for polar orbit
  - Range: `-90` to `90`

## How It Works

1. **Earth Model**: A 3D Earth model is placed at the marker center
2. **Orbit Container**: An invisible container rotates around the Y-axis
3. **Satellite Position**: The satellite/station is positioned at `orbit_radius` distance
4. **Animation**: JavaScript continuously rotates the container, creating orbital motion

## Visual Structure

```
Marker
├── Earth (stationary at center)
│   └── 3D Earth Model
└── Orbit Container (rotates)
    └── Satellite/Station (at orbit_radius distance)
        └── 3D Model
```

## Example Configurations

### Low Earth Orbit (ISS-style)
```json
{
  "spin_around_earth_orbit": true,
  "earth": {
    "model_file": "../common_model/earth.glb",
    "size": 0.5,
    "position": {"x": 0, "y": 0, "z": 0},
    "rotation": {"x": 0, "y": 0, "z": 0}
  },
  "orbit_radius": 2,
  "orbit_speed": 1.5,
  "orbit_tilt": 51.6
}
```

### Geostationary Orbit
```json
{
  "spin_around_earth_orbit": true,
  "earth": {
    "model_file": "../common_model/earth.glb",
    "size": 0.5,
    "position": {"x": 0, "y": 0, "z": 0},
    "rotation": {"x": 0, "y": 0, "z": 0}
  },
  "orbit_radius": 4,
  "orbit_speed": 0.3,
  "orbit_tilt": 0
}
```

### Polar Orbit
```json
{
  "spin_around_earth_orbit": true,
  "earth": {
    "model_file": "../common_model/earth.glb",
    "size": 0.5,
    "position": {"x": 0, "y": 0, "z": 0},
    "rotation": {"x": 0, "y": 0, "z": 0}
  },
  "orbit_radius": 2.5,
  "orbit_speed": 2,
  "orbit_tilt": 90
}
```

## Compatibility

- Works with pattern markers, NFT image tracking, and QR codes
- Compatible with GLB and GLTF model files
- No changes needed to marker patterns or model files
- Simply add orbit parameters to `config.json`

## Troubleshooting

**Earth model not showing:**
- Check that `earth.model_file` path is correct
- Ensure Earth GLB/GLTF file exists at specified location
- Path is relative to the model's folder
- Verify `earth` object is properly formatted in config.json

**Satellite not orbiting:**
- Verify `spin_around_earth_orbit` is set to `true`
- Check browser console for errors
- Make sure `earth` object with `model_file` is defined
- Ensure both `spin_around_earth_orbit` and `earth.model_file` are set

**Orbit too fast/slow:**
- Adjust `orbit_speed` parameter
- Lower values (0.3-0.7) = slower, more realistic
- Higher values (1.5-3) = faster, more dramatic

**Satellite at wrong distance:**
- Adjust `orbit_radius` parameter
- Typical range: 1.5 to 5 units
- Test different values to find optimal distance for your scene

## Notes

- The Earth model is scaled to 0.5 by default (can be adjusted in code)
- Orbital motion is continuous and starts automatically when marker is detected
- Animation continues even when marker is temporarily lost
- Multiple satellites can orbit simultaneously (each on their own marker)
