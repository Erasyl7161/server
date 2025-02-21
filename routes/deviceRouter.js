// routes/deviceRouter.js
const Router = require('express');
const router = new Router();
const deviceController = require('../controllers/deviceController');

router.post('/', deviceController.create);
router.get('/', deviceController.getAll);
router.get('/:id', deviceController.getOne);
router.put('/:id', deviceController.updateDevice); 
router.delete('/:id', deviceController.deleteDevice);
router.post('/explain', deviceController.explainQuery);
module.exports = router;
