const pgClient = require('../DB');

exports.signupUser = async (req, res) => {
    const {username, email, password} = req.body;
    console.log(username, email, password);
    const sqlQuery = `INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id;`
    try {
        const id = await pgClient.query(sqlQuery, [username, password, email]);
        res.json({
            message: "user created!",
            userId: id.rows[0].id
        })
    } catch (error) {
        console.log("error while adding user");
        return;
    }
    
}