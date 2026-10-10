const bcrypt = require("bcryptjs");
const { initDb, getDbWrapper } = require("./src/config/db");

(async () => {
    await initDb();

    const db = getDbWrapper();

    const password = "BloodConnect@123";
    const hash = await bcrypt.hash(password, 10);

    const result = db.run(
        "UPDATE users SET password_hash = ? WHERE email = ?",
        [hash, "raj.admin@bloodconnect.com"]
    );

    console.log("Rows updated:", result);

    const user = db.query(
        "SELECT id, name, email, role, password_hash FROM users WHERE email = ?",
        ["raj.admin@bloodconnect.com"]
    )[0];

    console.log("User:", user?.email);
    console.log("Role:", user?.role);
    console.log(
        "Password matches:",
        user ? await bcrypt.compare(password, user.password_hash) : false
    );
})();
