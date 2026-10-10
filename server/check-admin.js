const { initDb, getDbWrapper } = require("./src/config/db");

(async () => {
    await initDb();

    const users = getDbWrapper().query(
        "SELECT id, name, email, role FROM users"
    );

    console.log(users);
})();
