const pgClient = require("../DB");

exports.insertMsg = async (req, res) => {
    const {user_id, username, rec_id, message} = req.body;
    console.log("inside inserMsg", user_id, rec_id);
    const tableName = user_id > rec_id ? `room_${rec_id}_${user_id}` : `room_${user_id}_${rec_id}`;
    const insertQuery = `INSERT INTO ${tableName} (s_id, s_username, message) VALUES ($1, $2, $3);`
    try {
        const result = await pgClient.query(insertQuery, [user_id, username, message]);
        console.log(result.rows);
        res.json({
            success: true,
            response:  result.rows
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            error: error,
            message: "try again later"
        })
    }
}

exports.fetchChats = async(req, res) => {
    const {rec_id} = req.query;
    const user_id = req.userData.id;
    const tableName = user_id > rec_id ? `room_${rec_id}_${user_id}` : `room_${user_id}_${rec_id}`;
    const fetchQuery = `SELECT * FROM ${tableName}`;
    try {
        const result = await pgClient.query(fetchQuery);
        res.json({
            success: true,
            response:  result.rows
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            error: error,
            message: "try again later"
        })
    }
}