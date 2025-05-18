const pgClient = require('../DB');

exports.fetchUser = async (req, res) => {
    const {username} = req.query;
    console.log(username);
    const sqlQuery = `SELECT id, username, email FROM users WHERE username = $1`
    try {
        const response = await pgClient.query(sqlQuery, [username])
        if(response.rows[0]){
            res.json({
                success: true,
                user: response.rows[0],
            })
        }
    } catch (error) {
       console.log(error),
       res.json({
        success: false,
        message: 'try again later',
        error: error
       }) 
    }
}

exports.signupUser = async (req, res) => {
    const {username, email, password} = req.body;
    console.log(username, email, password);
    const sqlQuery = `INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id;`
    const selectQuery = `SELECT id, username, email FROM users WHERE username = $1`
    try {
        const res1 = await pgClient.query(selectQuery, [username]);
        if(res1.rows[0]){
            res.json({
                success: true,
                message: 'already logged in',
                userId: res1.rows[0].id,
            })
            return;
        }else{
            const id = await pgClient.query(sqlQuery, [username, password, email]);
            res.json({
                success: true,
                message: "user created!",
                userId: id.rows[0].id
            })
        }
    } catch (error) {
        console.log("error while adding user");
        res.json({
            success: false,
            message: "try again later"
        })
        return;
    }
    
}