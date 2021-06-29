const Booking = require("../../models/booking");
const Event = require("../../models/event");
const {transferBooking,transferEvent} = require("./merge");

module.exports = {
    bookings:async (args,req) =>{
        try {
            const bookings = await Booking.find();
            return bookings.map(booking=>{
                return transferBooking(booking)
            })
        }catch (e) {
            throw e;
        }
    },
    bookEvent: async args =>{
        const fetchEvent = await Event.findOne({_id:args.eventId});
        const booking = new Booking({
            user:req.userId,
            event: fetchEvent,
        })
        const result = await booking.save();
        return transferBooking(result);
    },
    cancelEvent: async args =>{
        try{
            const booking = await Booking.findById(args.bookingId).populate("event");
            const event = transferEvent(booking.event)
            await Booking.deleteOne({_id:args.bookingId});
            return event;
        }catch(e){
            throw e;
        }

    }
}