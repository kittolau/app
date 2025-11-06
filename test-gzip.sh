#!/bin/bash

echo "🧪 Testing GLB Compression"
echo "=========================="
echo ""

# Kill any existing servers
pkill -f "node.*server.js" 2>/dev/null
sleep 1

# Start server
echo "🚀 Starting production server..."
npm run prod > /tmp/server-test.log 2>&1 &
SERVER_PID=$!
sleep 5

# Check if server is running
if ! curl -s http://localhost:8000 > /dev/null; then
    echo "❌ Server failed to start"
    cat /tmp/server-test.log
    exit 1
fi

echo "✅ Server started"
echo ""

# Test file
TEST_FILE="app/ar_app/model/sputnik1/sputnik1.glb"
ORIGINAL_SIZE=$(wc -c < "$TEST_FILE")

echo "📁 Original file: $TEST_FILE"
echo "   Size on disk: $(numfmt --to=iec-i --suffix=B $ORIGINAL_SIZE)"
echo ""

# Download with gzip
echo "📥 Downloading WITH gzip compression..."
HTTP_CODE=$(curl -s -w "%{http_code}" -H "Accept-Encoding: gzip" \
    "http://localhost:8000/$TEST_FILE" \
    -o /tmp/with-gzip.bin)

if [ "$HTTP_CODE" != "200" ]; then
    echo "❌ Download failed with code: $HTTP_CODE"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

GZIP_SIZE=$(wc -c < /tmp/with-gzip.bin)
echo "   Downloaded: $(numfmt --to=iec-i --suffix=B $GZIP_SIZE)"

# Download without gzip
echo ""
echo "📥 Downloading WITHOUT gzip compression..."
HTTP_CODE=$(curl -s -w "%{http_code}" \
    "http://localhost:8000/$TEST_FILE" \
    -o /tmp/without-gzip.bin)

NO_GZIP_SIZE=$(wc -c < /tmp/without-gzip.bin)
echo "   Downloaded: $(numfmt --to=iec-i --suffix=B $NO_GZIP_SIZE)"

# Compare
echo ""
echo "📊 Results:"
echo "=========="
echo "Original file:     $ORIGINAL_SIZE bytes ($(numfmt --to=iec-i --suffix=B $ORIGINAL_SIZE))"
echo "With gzip:         $GZIP_SIZE bytes ($(numfmt --to=iec-i --suffix=B $GZIP_SIZE))"
echo "Without gzip:      $NO_GZIP_SIZE bytes ($(numfmt --to=iec-i --suffix=B $NO_GZIP_SIZE))"
echo ""

if [ "$GZIP_SIZE" -lt "$NO_GZIP_SIZE" ]; then
    SAVINGS=$((NO_GZIP_SIZE - GZIP_SIZE))
    PERCENT=$((SAVINGS * 100 / NO_GZIP_SIZE))
    echo "✅ Compression working! Saved $SAVINGS bytes ($PERCENT%)"
else
    echo "❌ No compression detected - sizes are the same!"
    echo ""
    echo "Checking response headers:"
    curl -s -I -H "Accept-Encoding: gzip" "http://localhost:8000/$TEST_FILE" | grep -i "content-"
fi

echo ""
echo "🧹 Cleaning up..."
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null
rm -f /tmp/with-gzip.bin /tmp/without-gzip.bin

echo "✅ Done!"
