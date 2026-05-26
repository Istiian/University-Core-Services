import { persons } from "../../db/Person";
import {
    Request,
    Response
} from "express";
import {
    getAllRegions,
    getAllProvinces,
    getProvincesByRegion,
    getMunicipalitiesByProvince,
    getBarangaysByMunicipality,
} from "@aivangogh/ph-address";

export const getRegions = async (req: Request, res: Response) => {
    try {
        const regions = await getAllRegions();
        res.json(regions);
    } catch (error) {
        console.error("Error fetching regions:", error);
        res.status(500).json({ error: "Failed to fetch regions" });
    }
};

export const getProvinces = async (req: Request, res: Response) => {
    const { regionCode } = req.query;

    try {
        const provinces = await getProvincesByRegion(regionCode as string);

        if (!provinces) {
            return res.status(404).json({ error: "Region not found" });
        }

        // Some regions may not have provinces, so we check if the array is empty
        if (provinces.length === 0) {
            return res.status(200).json({ error: "No provinces found for the specified region" });
        }

        res.status(200).json(provinces);
    } catch (error) {
        console.error("Error fetching provinces:", error);
        res.status(500).json({ error: "Failed to fetch provinces" });
    }
};

export const getMunicipalities = async (req: Request, res: Response) => {
    const { provinceCode } = req.query;
    try {
        const municipalities = await getMunicipalitiesByProvince(provinceCode as string);

        if (!municipalities) {
            return res.status(404).json({ error: "Province not found" });
        }

        // Some provinces may not have municipalities, so we check if the array is empty
        if (municipalities.length === 0) {
            return res.status(200).json({ error: "No municipalities found for the specified province" });
        }

        res.status(200).json(municipalities);
    } catch (error) {
        console.error("Error fetching municipalities:", error);
        res.status(500).json({ error: "Failed to fetch municipalities" });
    }
};

export const getBarangays = async (req: Request, res: Response) => {
    const { municipalityCode } = req.query;
    console.log("Received municipality code:", municipalityCode);
    try {
        const barangays = await getBarangaysByMunicipality(municipalityCode as string);
        if (!barangays) {
            return res.status(404).json({ error: "Municipality not found" });
        }
        res.status(200).json(barangays);
    } catch (error) {
        console.error("Error fetching barangays:", error);
        res.status(500).json({ error: "Failed to fetch barangays" });
    }
};