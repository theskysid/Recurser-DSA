#!/bin/bash

echo "🧪 Pre-Deployment Testing Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a command was successful
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
    else
        echo -e "${RED}✗ $1${NC}"
        exit 1
    fi
}

echo "📦 Testing Backend Build..."
cd backend
./mvnw clean package -DskipTests
check_status "Backend build successful"

echo ""
echo "📦 Testing Frontend Build..."
cd ../frontend
npm run build
check_status "Frontend build successful"

echo ""
echo "🧪 Running Backend Tests..."
cd ../backend
./mvnw test
check_status "Backend tests passed"

echo ""
echo "🔍 Checking Configuration Files..."

if [ -f "src/main/resources/application-production.properties" ]; then
    echo -e "${GREEN}✓ Production configuration exists${NC}"
else
    echo -e "${RED}✗ Production configuration missing${NC}"
    exit 1
fi

if [ -f "../frontend/vercel.json" ]; then
    echo -e "${GREEN}✓ Vercel configuration exists${NC}"
else
    echo -e "${RED}✗ Vercel configuration missing${NC}"
    exit 1
fi

if [ -f "../render-build.sh" ]; then
    echo -e "${GREEN}✓ Render build script exists${NC}"
else
    echo -e "${RED}✗ Render build script missing${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 All pre-deployment tests passed!${NC}"
echo -e "${YELLOW}📋 Ready for deployment to Render and Vercel${NC}"
echo ""
echo "Next steps:"
echo "1. Push changes to GitHub"
echo "2. Deploy backend to Render"
echo "3. Deploy frontend to Vercel"
echo "4. Update CORS configuration"
echo "5. Test the deployed application"