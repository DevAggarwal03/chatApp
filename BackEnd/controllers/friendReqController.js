const pgClient = require('../DB')

exports.fetchSentRequests = async (req, res) => {
    const {id} = req.body;
    const retriveSentQuery = `SELECT id, requestee_id, timestamp, status FROM friendRequests where requester_id = $1`
    const retriveRecievedQuery = `SELECT id, requester_id, timestamp, status FROM friendRequests where requestee_id = $1`
    try {
       const result = await pgClient.query(retriveSentQuery, [id]);
       const result2 = await pgClient.query(retriveRecievedQuery, [id]);
       res.json({
        success: true,
        requestsSent: result.rows,
        requestRecieved: result2.rows,
       }) 

    } catch (error) {
       res.json({
        success: false,
        error: error,
        message: "try again"
       }) 
    }
}

exports.sendRequest = async (req, res) => {
    const {id, friendId} = req.body;
    const sendQuery = `INSERT INTO friendRequests (requester_id, requestee_id) VALUES ($1, $2)`
    try {
       const result = await pgClient.query(sendQuery, [id, friendId]); 
       res.json({
        success: true,
       })
    } catch (error) {
       res.json({
        success: false,
        error: error,
        message: "try again later"
       }) 
    }
}

exports.handleRequest = async (req, res) => {
    const { req_id, id, isAccept } = req.body;
    const status = isAccept ? "accepted" : "rejected"; 
    console.log('userId: '+id);
    console.log('req_id: '+req_id);
    const checkReqQuery = `SELECT * FROM friendRequests WHERE id = $1 AND requester_id = $2`;
    const handleQuery = `UPDATE friendRequests SET status = $1 WHERE id = $2;`;

    try {
        const checkResults = await pgClient.query(checkReqQuery, [req_id, id]);
        console.log(checkResults);
        if (!checkResults.rows[0]) {
            return res.json({
                success: false,
                message: 'No such friend request'
            });
        }

        if (checkResults.rows[0].status !== "pending") {
            return res.json({
                success: false,
                message: "The request is already handled"
            });
        }

        const senderUserid = checkResults.rows[0].requester_id;
        const recieverUserId = checkResults.rows[0].requestee_id;

        const sortedIds = [senderUserid, recieverUserId].sort((a, b) => a - b);
        const tableName = `room_${sortedIds[0]}_${sortedIds[1]}`;

        const setUpRoomQuery = `
            CREATE TABLE IF NOT EXISTS ${tableName} (
                id SERIAL PRIMARY KEY,
                s_id INTEGER NOT NULL,
                s_username VARCHAR(255) NOT NULL,
                message VARCHAR(255) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (s_id) REFERENCES users(id) ON DELETE CASCADE      
            );
        `;

        await pgClient.query('BEGIN');
        await pgClient.query(handleQuery, [status, req_id]);
        if (isAccept) {
            await pgClient.query(setUpRoomQuery);
        }
        await pgClient.query('COMMIT');

        return res.json({ success: true });

    } catch (error) {
        await pgClient.query('ROLLBACK');
        console.error("Error:", error);
        return res.json({
            success: false,
            error: error.message,
            message: "Try again"
        });
    }
}
