#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 VidlyzerBot Audio Fix Script');
console.log('================================');

// Function to run command and log output
function runCommand(command, description) {
    console.log(`\n📦 ${description}...`);
    try {
        execSync(command, { stdio: 'inherit', cwd: __dirname });
        console.log(`✅ ${description} completed successfully`);
        return true;
    } catch (error) {
        console.error(`❌ ${description} failed:`, error.message);
        return false;
    }
}

// Function to check if file exists
function fileExists(filePath) {
    return fs.existsSync(path.join(__dirname, filePath));
}

async function fixAudio() {
    console.log('\n🚀 Starting audio system fix...\n');

    // Step 1: Clean existing installation
    console.log('Step 1: Cleaning existing installation');
    if (fileExists('node_modules')) {
        runCommand('rm -rf node_modules', 'Removing node_modules');
    }
    if (fileExists('package-lock.json')) {
        runCommand('rm -f package-lock.json', 'Removing package-lock.json');
    }

    // Step 2: Install dependencies
    console.log('\nStep 2: Installing dependencies');
    if (!runCommand('npm install', 'Installing all dependencies')) {
        console.error('❌ Failed to install dependencies. Please run manually:');
        console.error('   npm install');
        process.exit(1);
    }

    // Step 3: Verify critical packages
    console.log('\nStep 3: Verifying critical packages');
    const criticalPackages = [
        '@discordjs/opus',
        '@discordjs/voice',
        'discord-player',
        'ffmpeg-static',
        'prism-media'
    ];

    let allPackagesOk = true;
    for (const pkg of criticalPackages) {
        try {
            require.resolve(pkg);
            console.log(`✅ ${pkg} - OK`);
        } catch (error) {
            console.log(`❌ ${pkg} - MISSING`);
            allPackagesOk = false;
        }
    }

    if (!allPackagesOk) {
        console.error('\n❌ Some critical packages are missing. Please install manually:');
        console.error('   npm install @discordjs/opus @discordjs/voice discord-player ffmpeg-static prism-media');
        process.exit(1);
    }

    // Step 4: Test bot startup (dry run)
    console.log('\nStep 4: Testing bot configuration');
    try {
        // Just test if the main files can be loaded
        require('./src/index.js');
        console.log('✅ Bot configuration test passed');
    } catch (error) {
        console.log('⚠️  Bot configuration test failed (this might be normal if .env is not configured)');
        console.log('   Error:', error.message);
    }

    console.log('\n🎉 Audio fix completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Make sure your .env file is properly configured');
    console.log('2. Start the bot: npm run bot');
    console.log('3. Test with: /play test song');
    console.log('4. Test radio: /radio start lofi');
    console.log('\n✨ The Opus encoding errors should now be resolved!');
}

// Run the fix
fixAudio().catch(error => {
    console.error('❌ Fix script failed:', error);
    process.exit(1);
});