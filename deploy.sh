#!/bin/bash

# Production Deployment Script
# Usage: ./deploy.sh [development|production]

ENVIRONMENT=${1:-development}

echo "🚀 Starting deployment for $ENVIRONMENT environment..."

# Check if environment is valid
if [[ "$ENVIRONMENT" != "development" && "$ENVIRONMENT" != "production" ]]; then
    echo "❌ Invalid environment. Use 'development' or 'production'"
    exit 1
fi

echo "📋 Environment: $ENVIRONMENT"

# Set environment variables based on deployment type
if [[ "$ENVIRONMENT" == "production" ]]; then
    echo "🔒 Setting up PRODUCTION environment..."
    export NODE_ENV=production
    
    # Check if production keys are set
    if [[ -z "$RAZORPAY_KEY_ID" || "$RAZORPAY_KEY_ID" == rzp_test_* ]]; then
        echo "⚠️  Warning: Using test Razorpay keys in production!"
        echo "   Please set RAZORPAY_KEY_ID=rzp_live_... for production"
    fi
    
    # Set higher limits for production
    export RAZORPAY_MAX_AMOUNT=1000000000  # ₹1 crore
    export RAZORPAY_MIN_AMOUNT=100         # ₹1
    
else
    echo "🧪 Setting up DEVELOPMENT environment..."
    export NODE_ENV=development
    
    # Set lower limits for testing
    export RAZORPAY_MAX_AMOUNT=10000000   # ₹1 lakh
    export RAZORPAY_MIN_AMOUNT=100        # ₹1
fi

echo "✅ Environment variables set:"
echo "   NODE_ENV: $NODE_ENV"
echo "   RAZORPAY_MAX_AMOUNT: $RAZORPAY_MAX_AMOUNT"
echo "   RAZORPAY_MIN_AMOUNT: $RAZORPAY_MIN_AMOUNT"

# Build frontend for production
if [[ "$ENVIRONMENT" == "production" ]]; then
    echo "🏗️  Building frontend for production..."
    cd frontend
    npm run build
    cd ..
    echo "✅ Frontend build complete"
fi

# Start backend server
echo "🚀 Starting backend server..."
cd backend
npm start
