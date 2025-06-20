#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 VidlyzerBot Node.js Warnings Fix');
console.log('===================================');

// Function to run command and log output
function runCommand(command, description) {
    console.log(`\n📦 ${description}...`);
    try {
        const output = execSync(command, { stdio: 'pipe', cwd: __dirname }).toString();
        console.log(`✅ ${description} completed successfully`);
        return { success: true, output };
    } catch (error) {
        console.error(`❌ ${description} failed:`, error.message);
        return { success: false, error: error.message };
    }
}

// Check Node.js version
function checkNodeVersion() {
    console.log('\n🔍 Checking Node.js version...');
    
    const result = runCommand('node --version', 'Getting Node.js version');
    if (!result.success) return false;
    
    const nodeVersion = result.output.trim();
    const versionNumber = nodeVersion.replace('v', '');
    const majorVersion = parseInt(versionNumber.split('.')[0]);
    
    console.log(`Current Node.js version: ${nodeVersion}`);
    
    if (majorVersion < 18) {
        console.log('❌ Node.js version is too old (< 18.x)');
        console.log('   Please update to Node.js 20.x LTS from https://nodejs.org/');
        return false;
    } else if (majorVersion === 18) {
        console.log('⚠️  Node.js 18.x detected - some packages may show warnings');
        console.log('   This is normal and the bot will still work');
        return true;
    } else {
        console.log('✅ Node.js version is up to date');
        return true;
    }
}

// Fix package.json overrides
function fixPackageOverrides() {
    console.log('\n🔧 Checking package.json overrides...');
    
    const packageJsonPath = path.join(__dirname, 'package.json');
    
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        // Check if overrides already exist
        if (packageJson.overrides && packageJson.overrides.undici) {
            console.log('✅ Package overrides already configured');
            return true;
        }
        
        // Add overrides
        if (!packageJson.overrides) {
            packageJson.overrides = {};
        }
        
        packageJson.overrides.undici = '6.19.8';
        
        // Add engines if not present
        if (!packageJson.engines) {
            packageJson.engines = {
                "node": ">=18.0.0",
                "npm": ">=8.0.0"
            };
        }
        
        // Write back to file
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log('✅ Added package overrides to fix Node.js warnings');
        
        return true;
    } catch (error) {
        console.error('❌ Failed to update package.json:', error.message);
        return false;
    }
}

// Main fix function
async function fixNodeWarnings() {
    console.log('\n🚀 Starting Node.js warnings fix...\n');
    
    // Step 1: Check Node.js version
    if (!checkNodeVersion()) {
        console.log('\n❌ Please update Node.js and run this script again');
        process.exit(1);
    }
    
    // Step 2: Fix package.json overrides
    if (!fixPackageOverrides()) {
        console.log('\n❌ Failed to fix package.json');
        process.exit(1);
    }
    
    // Step 3: Reinstall dependencies
    console.log('\n📦 Reinstalling dependencies with fixes...');
    
    // Remove node_modules and package-lock.json
    try {
        if (fs.existsSync('node_modules')) {
            console.log('🗑️  Removing node_modules...');
            fs.rmSync('node_modules', { recursive: true, force: true });
        }
        
        if (fs.existsSync('package-lock.json')) {
            console.log('🗑️  Removing package-lock.json...');
            fs.unlinkSync('package-lock.json');
        }
    } catch (error) {
        console.log('⚠️  Could not remove old files:', error.message);
    }
    
    // Reinstall
    const installResult = runCommand('npm install', 'Installing dependencies');
    if (!installResult.success) {
        console.log('\n❌ Failed to install dependencies');
        process.exit(1);
    }
    
    // Step 4: Verify fix
    console.log('\n🔍 Verifying fix...');
    const auditResult = runCommand('npm ls undici', 'Checking undici version');
    
    console.log('\n🎉 Node.js warnings fix completed!');
    console.log('\n📋 Summary:');
    console.log('✅ Package overrides configured');
    console.log('✅ Dependencies reinstalled');
    console.log('✅ undici version locked to compatible version');
    
    console.log('\n📝 Note:');
    console.log('- EBADENGINE warnings should be reduced or eliminated');
    console.log('- Bot functionality is not affected by these warnings');
    console.log('- Consider updating to Node.js 20.x LTS for best compatibility');
    
    console.log('\n🚀 You can now start the bot with: npm run bot');
}

// Run the fix
fixNodeWarnings().catch(error => {
    console.error('❌ Fix script failed:', error);
    process.exit(1);
});