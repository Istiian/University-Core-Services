import {
    Router, 
    Request, 
    Response
} from "express";
import {
    getRegions,
    getProvinces,
    getMunicipalities,
    getBarangays
} from "./person.service";

const router = Router();

router.get("/regions", getRegions);
router.get("/provinces", getProvinces);
router.get("/municipalities", getMunicipalities);
router.get("/barangays", getBarangays);

export default router;