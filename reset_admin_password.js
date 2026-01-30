const Database = require("better-sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");

const dbPath = path.join(__dirname, "data", "skillsync.db");
const db = new Database(dbPath);

async function resetPassword() {
    const email = "admin@gmail.com";
    const newPassword = "admin123";

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const info = db.prepare("UPDATE users SET password = ? WHERE email = ?").run(hashedPassword, email);

        if (info.changes > 0) {
            console.log(`✅ Password for '${email}' has been reset to '${newPassword}'`);
        } else {
            console.log(`❌ User '${email}' not found.`);
        }
    } catch (error) {
        console.error("Error resetting password:", error);
    }
}

resetPassword();
