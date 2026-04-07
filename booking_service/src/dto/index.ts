export type CreateBookingDto = {
    userId:number,
    hotelId:number,
    totalGuests:number,
    bookingAmount:number
}

export interface NotificationDto {
    to:string,
    subject:string,
    templateId:string,
    params:Record<string,any>
}