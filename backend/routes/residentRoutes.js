import express from 'express';
import {
  getResidents,
  getResident,
  createResident,
  editResident,
  removeResident
} from '../controllers/residentController.js';

const router = express.Router();

router.get('/', getResidents);
router.get('/:id', getResident);
router.post('/', createResident);
router.put('/:id', editResident);
router.delete('/:id', removeResident);

export default router;
