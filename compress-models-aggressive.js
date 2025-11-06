#!/usr/bin/env node

const gltfPipeline = require('gltf-pipeline');
const fsPromises = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const processGlb = gltfPipeline.processGlb;

// Find all GLB files in model directories
async function findGlbFiles(dir) {
    const glbFiles = [];
    
    async function scanDir(currentDir) {
        const entries = await fsPromises.readdir(currentDir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            
            if (entry.isDirectory()) {
                await scanDir(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.glb') && !entry.name.includes('.original.')) {
                glbFiles.push(fullPath);
            }
        }
    }
    
    await scanDir(dir);
    return glbFiles;
}

// Compress a single GLB file with aggressive settings
async function compressGlb(filePath) {
    console.log(`\n📦 Processing: ${filePath}`);
    
    try {
        // Get original file size
        const stats = await fsPromises.stat(filePath);
        const originalSize = stats.size;
        console.log(`   Original size: ${formatFileSize(originalSize)}`);
        
        // Read the GLB file
        const glb = await fsPromises.readFile(filePath);
        
        // Process with aggressive Draco compression
        console.log('   🔄 Applying aggressive compression...');
        const results = await processGlb(glb, {
            dracoOptions: {
                compressionLevel: 10,       // Maximum compression
                quantizePositionBits: 11,   // Lower = more compression (11 is good balance)
                quantizeNormalBits: 8,      // Lower = more compression
                quantizeTexcoordBits: 10,   // Lower = more compression
                quantizeColorBits: 8,
                quantizeGenericBits: 8,     // Lower = more compression
                unifiedQuantization: true
            },
            separate: false,
            separateTextures: false
        });
        
        // Create backup of original file
        const backupPath = filePath.replace('.glb', '.original.glb');
        const backupExists = await fsPromises.access(backupPath).then(() => true).catch(() => false);
        
        if (!backupExists) {
            await fsPromises.copyFile(filePath, backupPath);
            console.log(`   ✓ Backup created: ${path.basename(backupPath)}`);
        }
        
        // Write compressed file
        await fsPromises.writeFile(filePath, results.glb);
        
        // Get new file size
        const newStats = await fsPromises.stat(filePath);
        const newSize = newStats.size;
        const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
        
        console.log(`   ✅ Compressed size: ${formatFileSize(newSize)}`);
        console.log(`   💾 Size reduction: ${reduction}% (saved ${formatFileSize(originalSize - newSize)})`);
        
        return {
            file: filePath,
            originalSize,
            newSize,
            reduction: parseFloat(reduction)
        };
    } catch (error) {
        console.error(`   ❌ Error compressing ${filePath}:`, error.message);
        return null;
    }
}

// Format bytes to human-readable size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

// Main function
async function main() {
    console.log('🚀 AGGRESSIVE GLB Compression Tool');
    console.log('====================================\n');
    console.log('⚠️  This uses more aggressive compression settings');
    console.log('   Lower quality but much smaller file sizes\n');
    
    const modelDir = path.join(__dirname, 'app', 'ar_app', 'model');
    
    console.log(`📂 Scanning directory: ${modelDir}\n`);
    
    const glbFiles = await findGlbFiles(modelDir);
    
    if (glbFiles.length === 0) {
        console.log('No GLB files found.');
        return;
    }
    
    console.log(`Found ${glbFiles.length} GLB file(s):\n`);
    glbFiles.forEach((file, i) => {
        console.log(`${i + 1}. ${path.relative(modelDir, file)}`);
    });
    
    console.log('\n🔄 Starting aggressive compression...\n');
    console.log('Settings:');
    console.log('  - compressionLevel: 10 (max)');
    console.log('  - quantizePositionBits: 11 (reduced from 14)');
    console.log('  - quantizeNormalBits: 8 (reduced from 10)');
    console.log('  - quantizeTexcoordBits: 10 (reduced from 12)');
    console.log('  - quantizeGenericBits: 8 (reduced from 12)');
    console.log('\n');
    
    const results = [];
    for (const file of glbFiles) {
        const result = await compressGlb(file);
        if (result) {
            results.push(result);
        }
    }
    
    // Summary
    console.log('\n\n📊 Compression Summary');
    console.log('=====================\n');
    
    if (results.length > 0) {
        const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
        const totalNew = results.reduce((sum, r) => sum + r.newSize, 0);
        const totalReduction = ((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1);
        
        console.log(`Files processed: ${results.length}`);
        console.log(`Total original size: ${formatFileSize(totalOriginal)}`);
        console.log(`Total compressed size: ${formatFileSize(totalNew)}`);
        console.log(`Total saved: ${formatFileSize(totalOriginal - totalNew)} (${totalReduction}%)`);
        
        // Show comparison with previous compression
        console.log('\n📈 Comparison with Standard Compression:');
        console.log('   Standard: 116.6 MB → 40.2 MB (65.5% reduction)');
        console.log(`   Aggressive: 116.6 MB → ${formatFileSize(totalNew)} (${totalReduction}% reduction)`);
        
        const extraSaved = 40200000 - totalNew; // Approximate
        if (extraSaved > 0) {
            console.log(`   🎯 Extra space saved: ~${formatFileSize(extraSaved)}`);
        }
        
        console.log('\n✅ Aggressive compression complete!');
        console.log('\n💡 Tips:');
        console.log('   - Original files are backed up as *.original.glb');
        console.log('   - Test models visually to ensure quality is acceptable');
        console.log('   - If quality is too low, restore from .original.glb files');
    } else {
        console.log('No files were successfully compressed.');
    }
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
