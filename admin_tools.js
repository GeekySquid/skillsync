const Database = require("better-sqlite3");
const path = require("path");

// Adjust path if needed
const dbDir = path.join(__dirname, "data");
const dbPath = path.join(dbDir, "skillsync.db");

console.log(`Connecting to database at: ${dbPath}`);
const db = new Database(dbPath);

// List all users
const users = db.prepare("SELECT id, email, full_name, role FROM users").all();

console.log("\n--- Current Users ---");
if (users.length === 0) {
    console.log("No users found.");
} else {
    users.forEach(u => {
        console.log(`ID: ${u.id} | Email: ${u.email} | Name: ${u.full_name} | Role: ${u.role}`);
    });
}
console.log("---------------------\n");

// If arguments are provided, promote the user
const args = process.argv.slice(2);
if (args.length > 0) {
    const emailToPromote = args[0];

    // Check if user exists
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(emailToPromote);

    if (user) {
        // Update role
        db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(user.id);
        console.log(`✅ Successfully promoted user '${user.email}' to ADMIN.`);
    } else {
        console.error(`❌ User with email '${emailToPromote}' not found.`);
    }
} else {
    console.log("To promote a user, run: node admin_tools.js <email>");
}
