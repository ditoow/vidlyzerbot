// Load environment variables
require('dotenv').config();

console.log('='.repeat(50));
console.log('✅ DOTENV VERIFICATION');
console.log('='.repeat(50));

console.log('📋 Environment Variables Status:');
console.log(`   BOT_TOKEN: ${process.env.BOT_TOKEN ? '✅ Loaded' : '❌ Missing'}`);
console.log(`   CLIENT_ID: ${process.env.CLIENT_ID ? '✅ Loaded' : '❌ Missing'}`);
console.log(`   GUILD_ID: ${process.env.GUILD_ID ? '✅ Loaded' : '❌ Missing'}`);
console.log(`   PREFIX: ${process.env.PREFIX || 'Not set'}`);

if (process.env.BOT_TOKEN) {
    console.log('');
    console.log('🔍 Token Details:');
    console.log(`   Length: ${process.env.BOT_TOKEN.length} characters`);
    console.log(`   Preview: ${process.env.BOT_TOKEN.substring(0, 10)}...`);
    console.log(`   Format: ${process.env.BOT_TOKEN.split('.').length === 3 ? '✅ Valid format' : '❌ Invalid format'}`);
}

console.log('');
console.log('='.repeat(50));
console.log('✅ DOTENV BERJALAN DENGAN BAIK!');
console.log('💡 Jika bot masih error "TokenInvalid", token perlu diperbarui');
console.log('📖 Lihat SETUP_TOKEN.md untuk cara mendapatkan token baru');
console.log('='.repeat(50));