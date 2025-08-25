
#!/bin/bash

echo "🚀 Setting up Salad.id Project..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Creating .env.local file...${NC}"
    cat > .env.local << EOL
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="salad-id-super-secret-key-2025-make-this-very-long-and-random"

# Midtrans Configuration (Sandbox for testing)
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SERVER_KEY=SB-Mid-server-YOUR_SERVER_KEY_HERE
MIDTRANS_CLIENT_KEY=SB-Mid-client-YOUR_CLIENT_KEY_HERE
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-YOUR_CLIENT_KEY_HERE
EOL
    echo -e "${GREEN}✅ .env.local created${NC}"
else
    echo -e "${GREEN}✅ .env.local already exists${NC}"
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Generate Prisma client
echo -e "${YELLOW}🔧 Generating Prisma client...${NC}"
npx prisma generate

# Push database schema
echo -e "${YELLOW}🗄️  Creating database...${NC}"
npx prisma db push

# Seed database
echo -e "${YELLOW}🌱 Seeding database...${NC}"
npx prisma db seed

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Get Midtrans sandbox keys from: https://dashboard.sandbox.midtrans.com/"
echo "2. Update MIDTRANS_SERVER_KEY and MIDTRANS_CLIENT_KEY in .env.local"
echo "3. Run: npm run dev"
echo "4. Visit: http://localhost:3000"
echo "5. Test login: test@salad.id / 123456"
echo ""