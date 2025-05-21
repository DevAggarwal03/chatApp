const pgClient = require('../DB')

exports.fetchSentRequests = async (req, res) => {
    const userData = req.userData;
    const status = req.query.status;
    const fetchQuery = `
        SELECT 
            fr.id AS request_id,
            fr.requester_id,
            fr.requestee_id,
            fr.timestamp,
            fr.status,
            u.username AS friend_username,
            u.id AS user_id
        FROM 
            friendRequests fr
        JOIN 
            users u 
            ON u.id = CASE 
                WHEN fr.requester_id = $1 THEN fr.requestee_id
                ELSE fr.requester_id
            END
        WHERE 
            (fr.requester_id = $1 OR fr.requestee_id = $1)
            AND fr.status = $2;
    `
    try {
       const result = await pgClient.query(fetchQuery, [userData.id, status]);
       res.json({
        success: true,
        requests: result.rows,
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
    const {friendId} = req.body;
    const userData = req.userData;
    const getAllReqQuery = `SELECT requester_id, requestee_id from friendRequests`;
    const sendQuery = `INSERT INTO friendRequests (requester_id, requestee_id) VALUES ($1, $2)`
    try {
        const response = await pgClient.query(getAllReqQuery);
        const isPresent = response.rows.find(r => (r.requester_id === friendId && r.requestee_id === userData.id) || (r.requester_id === userData.id && r.requestee_id === friendId))
        if(isPresent){
            res.json({
                message: 'friend request already send!',
                success: false,
            })
        }
    } catch (error) {
            res.json({
                message: 'try again later',
                success: false
            })    
    }

    try {
       const result = await pgClient.query(sendQuery, [userData.id, friendId]); 
       res.json({
        success: true,
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

exports.handleRequest = async (req, res) => {
    const { req_id, isAccept } = req.body;
    const userData = req.userData;
    const status = isAccept ? "accepted" : "rejected"; 
    const checkReqQuery = `SELECT * FROM friendRequests WHERE id = $1 AND requestee_id = $2`;
    const handleQuery = `UPDATE friendRequests SET status = $1 WHERE id = $2;`;

    try {
        const checkResults = await pgClient.query(checkReqQuery, [req_id, userData.id]);
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
        console.log(error);
        await pgClient.query('ROLLBACK');
        return res.json({
            success: false,
            error: error.message,
            message: "Try again"
        });
    }
}
