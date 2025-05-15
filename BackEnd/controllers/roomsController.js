const pgClient = require("../DB");

// all the message that is going to be added when chats are under way will be saved to
// their respective tables.

exports.insertMsg = async (req, res) => {
    const {user_id, username, rec_id, message} = req.body;
    console.log(user_id, rec_id);
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
    const {user_id, rec_id} = req.body;
    console.log(user_id + " " + rec_id);
    const tableName = user_id > rec_id ? `room_${rec_id}_${user_id}` : `room_${user_id}_${rec_id}`;
    const fetchQuery = `SELECT * FROM ${tableName}`;
    try {
        const result = await pgClient.query(fetchQuery);
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