const bcrypt = require('bcryptjs');

const password = 'hafssi123';
const hash = bcrypt.hashSync(password, 10);

console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nAdd this to your .env.local:');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
