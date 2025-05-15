const pgClient = require('../DB');

exports.signupUser = async (req, res) => {
    const {username, email, password} = req.body;
    console.log(username, email, password);
    const sqlQuery = `INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id;`
    const selectQuery = `SELECT id, username, email FROM users WHERE username = $1`
    try {
        const res1 = await pgClient.query(selectQuery, [username]);
        if(res1.rows[0]){
            res.json({
                message: 'already logged in',
                userId: res1.rows[0].id,
            })
            return;
        }else{
            const id = await pgClient.query(sqlQuery, [username, password, email]);
            res.json({
                message: "user created!",
                userId: id.rows[0].id
            })
        }
    } catch (error) {
        console.log("error while adding user");
        return;
    }
    
}