#!/usr/bin/env node

/**
 * Production Server with Compression
 * 
 * Features:
 * - Gzip/Deflate compression for all assets
 * - Proper MIME types for GLTF/GLB files
 * - CORS enabled
 * - Cache headers for production
 * - Compression for GLB files (can reduce transfer by 20-30%)
 */

const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Compression middleware - enables gzip/deflate
// This will compress responses on-the-fly
app.use(compression({
    // Compression level (0-9, 9 is maximum)
    level: 9,
    
    // Minimum size to compress (bytes)
    threshold: 1024,
    
    // Filter function to decide what to compress
    filter: (req, res) => {
        // Don't compress if client doesn't accept encoding
        if (req.headers['x-no-compression']) {
            return false;
        }
        
        // IMPORTANT: Force compression for GLB/GLTF files
        // Even though they're binary, gzip can still reduce size by ~20-30%
        // because Draco compression doesn't compress the entire file structure
        if (req.url && (req.url.endsWith('.glb') || req.url.endsWith('.gltf') || 
            req.url.endsWith('.bin') || req.url.endsWith('.json'))) {
            return true;
        }
        
        // Compress everything else by default
        return compression.filter(req, res);
    }
}));

// Set proper MIME types for AR/3D files
app.use((req, res, next) => {
    // GLTF/GLB MIME types
    if (req.url.endsWith('.glb')) {
        res.setHeader('Content-Type', 'model/gltf-binary');
    } else if (req.url.endsWith('.gltf')) {
        res.setHeader('Content-Type', 'model/gltf+json');
    }
    
    // Cache headers for production
    if (process.env.NODE_ENV === 'production') {
        if (req.url.match(/\.(glb|gltf|jpg|jpeg|png|gif|webp|woff|woff2)$/)) {
            // Cache static assets for 1 year
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (req.url.match(/\.(js|css)$/)) {
            // Cache JS/CSS for 1 week
            res.setHeader('Cache-Control', 'public, max-age=604800');
        }
    } else {
        // No caching in development
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    
    next();
});

// CORS middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Serve static files from current directory
app.use(express.static('.', {
    dotfiles: 'ignore',
    index: 'index.html',
    setHeaders: (res, filepath) => {
        // Add Vary header for proper caching with compression
        res.setHeader('Vary', 'Accept-Encoding');
    }
}));

// Log compression stats
app.use((req, res, next) => {
    const start = Date.now();
    const originalWrite = res.write;
    const originalEnd = res.end;
    let originalSize = 0;
    let compressedSize = 0;
    
    res.write = function(chunk, ...args) {
        if (chunk) {
            originalSize += chunk.length || 0;
        }
        return originalWrite.apply(res, [chunk, ...args]);
    };
    
    res.end = function(chunk, ...args) {
        if (chunk) {
            originalSize += chunk.length || 0;
        }
        originalEnd.apply(res, [chunk, ...args]);
        
        const duration = Date.now() - start;
        const encoding = res.getHeader('Content-Encoding');
        
        if (encoding && originalSize > 1024) {
            const saved = originalSize - (res.getHeader('Content-Length') || originalSize);
            const percent = saved > 0 ? ((saved / originalSize) * 100).toFixed(1) : 0;
            console.log(
                `📦 ${req.method} ${req.url} - ` +
                `${formatSize(originalSize)} → ${formatSize(res.getHeader('Content-Length'))} ` +
                `(${percent}% ${encoding}) - ${duration}ms`
            );
        } else if (req.url.endsWith('.glb') || req.url.endsWith('.gltf')) {
            console.log(`📦 ${req.method} ${req.url} - ${formatSize(originalSize)} - ${duration}ms`);
        }
    };
    
    next();
});

function formatSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Start server
app.listen(PORT, () => {
    console.log('🚀 Production Server with Compression');
    console.log('====================================\n');
    console.log(`✅ Server running at: http://localhost:${PORT}`);
    console.log(`✅ Compression: Enabled (gzip/deflate)`);
    console.log(`✅ CORS: Enabled`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('\n📱 Access from mobile:');
    
    // Try to get local IP
    const os = require('os');
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                console.log(`   http://${iface.address}:${PORT}`);
            }
        }
    }
    
    console.log('\n💡 Tips:');
    console.log('   - GLB files will be compressed ~20-30% during transfer');
    console.log('   - First load downloads full size, browser caches it');
    console.log('   - Set NODE_ENV=production for aggressive caching');
    console.log('\nPress Ctrl+C to stop\n');
});
