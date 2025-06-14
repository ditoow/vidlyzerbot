#!/bin/bash

# Pterodactyl startup script for VidlyzerBot
# This script handles auto-deploy and bot startup

echo "=================================================="
echo "🚀 PTERODACTYL VIDLYZERBOT STARTUP"
echo "=================================================="

# Check if DEPLOY_ON_STARTUP is enabled
if [ "$DEPLOY_ON_STARTUP" = "true" ] || [ "$DEPLOY_ON_STARTUP" = "1" ]; then
    echo "🔄 Deploying commands before startup..."
    
    # Determine deploy type
    DEPLOY_TYPE=${AUTO_DEPLOY_TYPE:-guild}
    
    # Run deployment
    if [ "$DEPLOY_TYPE" = "global" ]; then
        echo "📡 Deploying global commands..."
        npm run deploy:global
    else
        echo "🏠 Deploying guild commands..."
        npm run deploy:guild
    fi
    
    echo "✅ Deploy completed!"
    echo ""
fi

echo "🤖 Starting bot..."
echo "=================================================="

# Start the bot
npm start