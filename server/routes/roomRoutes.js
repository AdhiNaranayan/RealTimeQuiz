const express = require('express');
const router = express.Router();
const { createRoom, joinRoom, startGame,
    getRooms,
    submitAnswer,
    endGame,
    deleteRoom } = require('../controllers/roomController');

router.post('/create', createRoom);
router.post('/join', joinRoom);
router.get('/', getRooms);
router.post('/:roomId/start', startGame);
router.post('/:roomId/submitAnswer', submitAnswer);
router.post('/:roomId/end', endGame);
router.post('/:roomId', deleteRoom);


module.exports = router;
