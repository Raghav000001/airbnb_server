import type { Request, Response } from "express";
import { createBookingService, finalizeBookingService } from "../service/booking.service.ts"

export const createBookingController = async (req: Request, res: Response) => {
    const response = await createBookingService(req.body);
    res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: response
    });
}

export const confirmBookingController = async (req: Request, res: Response) => {
    const { idemPotencyKey } = req.params;
    const response = await finalizeBookingService(idemPotencyKey as string);
    res.status(200).json({
        success: true,
        message: "Booking finalized successfully",
        data: response
    });
}