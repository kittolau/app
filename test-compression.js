#!/usr/bin/env node

/**
 * Test script to check if GLB files are being compressed
 */

const express = require('express');
const compression = require('compression');
const fs = require('fs');

const app = express();

// Enable compression with force flag for binary files
app.use(compression({
    level: 9,
    threshold: 0, // Compress everything
    filter: (req, res) => {
        // Force compression for GLB files
        if (req.url.endsWith('.glb') || req.url.endsWith('.gltf')) {
            console.log('✅ Forcing compression for:', req.url);
            return true;
        }
        return compression.filter(req, res);
    }
}));

app.use(express.static('.'));

// Middleware to log compression
app.use((req, res, next) => {
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks = [];

    res.write = function(chunk) {
        chunks.push(Buffer.from(chunk));
        return oldWrite.apply(res, arguments);
    };

    res.end = function(chunk) {
        if (chunk) {
            chunks.push(Buffer.from(chunk));
        }
        
        const encoding = res.getHeader('Content-Encoding');
        const contentLength = res.getHeader('Content-Length');
        
        console.log(`📦 ${req.url}`);
        console.log(`   Content-Encoding: ${encoding || 'none'}`);
        console.log(`   Content-Length: ${contentLength}`);
        
        return oldEnd.apply(res, arguments);
    };

    next();
});

const PORT = 9000;
app.listen(PORT, () => {
    console.log(`\n🧪 Test Server Running on http://localhost:${PORT}\n`);
    console.log(`Test URL: http://localhost:${PORT}/app/ar_app/model/sputnik1/sputnik1.glb\n`);
});
