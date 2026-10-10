const bcrypt = require("bcryptjs");
const { initDb, getDbWrapper } = require("./src/config/db");

(async () => {
    await initDb();

    const users = getDbWrapper().query(
        "SELECT email, password_hash FROM users WHERE email = 'raj.admin@bloodconnect.com'"
    );

    const user = users[0];

    console.log("User:", user?.email || "NOT FOUND");
    console.log("Hash exists:", !!user?.password_hash);

    if (user?.password_hash) {
        const matches = await bcrypt.compare(
            "BloodConnect@123",
            user.password_hash
        );

        console.log("Password matches:", matches);
    }
})();
