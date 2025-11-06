#!/usr/bin/env node

const gltfPipeline = require('gltf-pipeline');
const fsPromises = require('fs').promises;
const path = require('path');

const processGlb = gltfPipeline.processGlb;

// Find all original GLB files
async function findOriginalGlbFiles(dir) {
    const glbFiles = [];
    
    async function scanDir(currentDir) {
        const entries = await fsPromises.readdir(currentDir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            
            if (entry.isDirectory()) {
                await scanDir(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.original.glb')) {
                glbFiles.push(fullPath);
            }
        }
    }
    
    await scanDir(dir);
    return glbFiles;
}

// Compress with ultra settings
async function compressGlbUltra(originalPath) {
    const outputPath = originalPath.replace('.original.glb', '.glb');
    console.log(`\n📦 Processing: ${path.basename(originalPath)}`);
    console.log(`   Output: ${path.basename(outputPath)}`);
    
    try {
        // Get original file size
        const stats = await fsPromises.stat(originalPath);
        const originalSize = stats.size;
        console.log(`   Original size: ${formatFileSize(originalSize)}`);
        
        // Read the original GLB file
        const glb = await fsPromises.readFile(originalPath);
        
        // Try ultra compression first
        console.log('   🔄 Attempting ultra compression...');
        let results;
        let compressionLevel = 'ultra';
        
        try {
            results = await processGlb(glb, {
                dracoOptions: {
                    compressionLevel: 10,       // Maximum
                    quantizePositionBits: 10,   // Ultra aggressive
                    quantizeNormalBits: 8,      
                    quantizeTexcoordBits: 10,   
                    quantizeColorBits: 8,
                    quantizeGenericBits: 8,     
                    unifiedQuantization: true
                },
                separate: false,
                separateTextures: false
            });
        } catch (error) {
            // If ultra fails, try high compression
            console.log('   ⚠️  Ultra failed, trying high compression...');
            compressionLevel = 'high';
            results = await processGlb(glb, {
                dracoOptions: {
                    compressionLevel: 10,
                    quantizePositionBits: 12,   // Less aggressive
                    quantizeNormalBits: 10,
                    quantizeTexcoordBits: 12,
                    quantizeColorBits: 8,
                    quantizeGenericBits: 10,
                    unifiedQuantization: true
                },
                separate: false,
                separateTextures: false
            });
        }
        
        // Write compressed file
        await fsPromises.writeFile(outputPath, results.glb);
        
        // Get new file size
        const newStats = await fsPromises.stat(outputPath);
        const newSize = newStats.size;
        const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
        
        console.log(`   ✅ Compressed size: ${formatFileSize(newSize)} [${compressionLevel}]`);
        console.log(`   💾 Size reduction: ${reduction}% (saved ${formatFileSize(originalSize - newSize)})`);
        
        return {
            file: outputPath,
            originalSize,
            newSize,
            reduction: parseFloat(reduction),
            compressionLevel
        };
    } catch (error) {
        console.error(`   ❌ Error compressing ${originalPath}:`, error.message);
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
    console.log('🚀 ULTRA GLB Compression from Original Files');
    console.log('=============================================\n');
    console.log('This script compresses .original.glb files with maximum settings');
    console.log('Falls back to high compression if ultra fails\n');
    
    const modelDir = path.join(__dirname, 'app', 'ar_app', 'model');
    
    console.log(`📂 Scanning for .original.glb files in: ${modelDir}\n`);
    
    const originalFiles = await findOriginalGlbFiles(modelDir);
    
    if (originalFiles.length === 0) {
        console.log('❌ No .original.glb files found.');
        console.log('   Run the initial compression first to create backups.');
        return;
    }
    
    console.log(`Found ${originalFiles.length} original GLB file(s):\n`);
    originalFiles.forEach((file, i) => {
        console.log(`${i + 1}. ${path.relative(modelDir, file)}`);
    });
    
    console.log('\n🔄 Starting ultra compression...\n');
    console.log('Compression Settings:');
    console.log('  Ultra mode:');
    console.log('    - compressionLevel: 10');
    console.log('    - quantizePositionBits: 10 (very aggressive)');
    console.log('    - quantizeNormalBits: 8');
    console.log('    - quantizeTexcoordBits: 10');
    console.log('  Fallback to High mode if ultra fails:');
    console.log('    - quantizePositionBits: 12 (less aggressive)');
    console.log('\n');
    
    const results = [];
    for (const file of originalFiles) {
        const result = await compressGlbUltra(file);
        if (result) {
            results.push(result);
        }
    }
    
    // Summary
    console.log('\n\n📊 Ultra Compression Summary');
    console.log('============================\n');
    
    if (results.length > 0) {
        const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
        const totalNew = results.reduce((sum, r) => sum + r.newSize, 0);
        const totalReduction = ((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1);
        
        console.log(`Files processed: ${results.length}`);
        console.log(`Total original size: ${formatFileSize(totalOriginal)}`);
        console.log(`Total compressed size: ${formatFileSize(totalNew)}`);
        console.log(`Total saved: ${formatFileSize(totalOriginal - totalNew)} (${totalReduction}%)`);
        
        // Show compression levels used
        const ultraCount = results.filter(r => r.compressionLevel === 'ultra').length;
        const highCount = results.filter(r => r.compressionLevel === 'high').length;
        
        console.log('\nCompression levels used:');
        console.log(`  Ultra: ${ultraCount} files`);
        console.log(`  High: ${highCount} files`);
        
        // Compare with previous compression
        const previousSize = 40200000; // 40.2 MB from first compression
        if (totalNew < previousSize) {
            const extraSaved = previousSize - totalNew;
            const extraPercent = ((extraSaved / previousSize) * 100).toFixed(1);
            console.log(`\n🎯 Improvement over previous compression:`);
            console.log(`   ${formatFileSize(previousSize)} → ${formatFileSize(totalNew)}`);
            console.log(`   Extra saved: ${formatFileSize(extraSaved)} (${extraPercent}% smaller)`);
        }
        
        console.log('\n✅ Ultra compression complete!');
        console.log('\n💡 Tips:');
        console.log('   - Test models visually to ensure quality is acceptable');
        console.log('   - Original files are still available as *.original.glb');
        console.log('   - If quality is too low, run standard compression again');
    } else {
        console.log('No files were successfully compressed.');
    }
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
