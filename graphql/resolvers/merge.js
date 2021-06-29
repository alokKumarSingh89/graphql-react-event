const Event = require("../../models/event");
const User = require("../../models/user");
const {dateToString} = require("../../utils/date");

const events = async eventIds =>{
    try {
        const events = await Event.find({_id: {$in: eventIds}})
        events.map(event => {
            return transferEvent(event)
        })
    }catch(error){
        throw error;
    }

}
const singleEvent = async eventId =>{
    try{
        const event = await Event.findById(eventId);
        return transferEvent(event)
    }catch (e) {
        throw e;
    }
}
const user = async userId =>{
    try{
        const user = await User.findById(userId);
        return {
            ...user._doc,
            createdEvent: events.bind(this,user._doc.createdEvent)
        };
    }catch (error) {
        throw error;
    }

}
const transferBooking = booking =>{
    return{
        ...booking,
        _id: booking._doc._id,
        event:singleEvent.bind(this,booking.event),
        user:user.bind(this,booking.user),
        createdAt: dateToString(booking.createdAt),
        updatedAt: dateToString(booking.updatedAt),
    }
}
const transferEvent = event =>{
    return{
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
}
exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent;
exports.transferEvent = transferEvent;
exports.transferBooking = transferBooking;
