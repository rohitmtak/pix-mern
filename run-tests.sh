#!/bin/bash

echo "🧪 Running Unit Tests for PIX MERN Stack"
echo "========================================"

# Function to run backend tests
run_backend_tests() {
    echo "📦 Running Backend Tests..."
    cd backend
    
    # Check if MongoDB is running (optional)
    if ! command -v mongod &> /dev/null; then
        echo "⚠️  MongoDB not found. Make sure MongoDB is running for database tests."
    fi
    
    # Run tests
    npm test
    
    if [ $? -eq 0 ]; then
        echo "✅ Backend tests passed!"
    else
        echo "❌ Backend tests failed!"
        exit 1
    fi
    
    cd ..
}

# Function to run frontend tests
run_frontend_tests() {
    echo "🎨 Running Frontend Tests..."
    cd frontend
    
    # Run tests
    npm test
    
    if [ $? -eq 0 ]; then
        echo "✅ Frontend tests passed!"
    else
        echo "❌ Frontend tests failed!"
        exit 1
    fi
    
    cd ..
}

# Main execution
case "$1" in
    "backend")
        run_backend_tests
        ;;
    "frontend")
        run_frontend_tests
        ;;
    "all"|"")
        run_backend_tests
        echo ""
        run_frontend_tests
        ;;
    *)
        echo "Usage: $0 [backend|frontend|all]"
        echo "  backend  - Run only backend tests"
        echo "  frontend - Run only frontend tests"
        echo "  all      - Run both backend and frontend tests (default)"
        exit 1
        ;;
esac

echo ""
echo "🎉 All tests completed!"
