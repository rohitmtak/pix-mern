#!/bin/bash

# Script to verify the build includes the correct backend URL
echo "🔍 Verifying build configuration..."
echo ""

# Check if .env.production exists
if [ -f ".env.production" ]; then
    echo "✅ .env.production file found:"
    cat .env.production
    echo ""
else
    echo "❌ .env.production file NOT found!"
    echo ""
fi

# Check if dist folder exists (built files)
if [ -d "dist" ]; then
    echo "✅ dist folder found (build exists)"
    echo ""
    
    # Search for backend URL in built JS files
    echo "🔍 Searching for backend URL in built files..."
    echo ""
    
    # Find the main JS bundle
    MAIN_JS=$(find dist/assets -name "*.js" -type f | head -1)
    
    if [ -n "$MAIN_JS" ]; then
        echo "📦 Main bundle: $MAIN_JS"
        echo ""
        
        # Check for the backend URL
        if grep -q "highstreetpix.com" "$MAIN_JS"; then
            echo "✅ Found 'highstreetpix.com' in built files"
            echo ""
            echo "📋 Backend URL references found:"
            grep -o "https\?://[^\"' ]*highstreetpix[^\"' ]*" "$MAIN_JS" | head -5
        else
            echo "⚠️  'highstreetpix.com' NOT found in built files"
            echo "   This might mean the build used a different URL or needs to be rebuilt"
        fi
        
        echo ""
        
        # Check for undefined
        if grep -q "/undefined/api" "$MAIN_JS"; then
            echo "❌ ERROR: Found '/undefined/api' in built files!"
            echo "   The build still has the old bug. You need to rebuild."
        else
            echo "✅ No '/undefined/api' found - good!"
        fi
        
        echo ""
        
        # Check for getBackendUrl function
        if grep -q "getBackendUrl\|VITE_BACKEND_URL" "$MAIN_JS"; then
            echo "✅ Found new backend URL logic in built files"
        else
            echo "⚠️  New backend URL logic not found - might need to rebuild"
        fi
    else
        echo "❌ No JS bundle found in dist/assets"
    fi
else
    echo "❌ dist folder NOT found - you need to run 'npm run build' first"
fi

echo ""
echo "📝 To rebuild with the correct environment:"
echo "   1. Make sure .env.production has: VITE_BACKEND_URL=https://highstreetpix.com"
echo "   2. Run: npm run build"
echo "   3. Deploy the dist folder to your server"

