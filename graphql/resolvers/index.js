const bcryptjs = require("bcryptjs");

const Event = require("../../models/event")
const User = require("../../models/user")
const Booking = require("../../models/booking")
const events = async eventIds =>{
    try {
        const events = await Event.find({_id: {$in: eventIds}})
        events.map(event => {
            return {
                ...event._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }
        })
    }catch(error){
            throw error;
    }

}
const singleEvent = async eventId =>{
    try{
        const event = await Event.findById(eventId);
        return{
            ...event._doc,
            creator: user.bind(this,event._doc.creator)
        }
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
module.exports = {
    events: async () => {
        try{
            const events =  Event.find()
            return events.map(event=>{
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator:user.bind(this,event._doc.creator)
                }
            });
        }catch (error) {
            throw error;
        }


    },
    createEvent: (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator:"5db041f98cf5c61f35a73742"
        })
        let createdEvent;
        return event.save()
            .then((result)=>{
                createdEvent = {
                    ...result._doc,
                    date: new Date(result._doc.date).toISOString(),
                    creator:user.bind(this,result._doc.creator)};
                return User.findById("5db041f98cf5c61f35a73742");
            })
            .then(user=>{
                if(!user){
                    throw new Error("User not found");
                }
                user.createdEvent.push(event);
                return user.save();
            })
            .then(result=>{
                return createdEvent;
            })
            .catch(error=> {
                console.log(error);
                throw error;
            })
    },
    createUser: args =>{
        return User.findOne({email:args.userInput.email})
            .then(user=>{
                if(user){
                    throw new Error("User already exits");
                }
                return bcryptjs.hash(args.userInput.password,12)
            }).then(hashedPassword=>{
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword,
                });
                return user.save();
            }).then(result=>{
                return {...result._doc,password:null}
            }).catch(error=>{
                throw error
            });

    },
    bookings:async () =>{
        try {
            const bookings = await Booking.find();
            return bookings.map(booking=>{
                console.log(booking)
                return{
                    ...booking,
                    _id: booking._doc._id,
                    event:singleEvent.bind(this,booking.event),
                    user:user.bind(this,booking.user),
                    createdAt: new Date(booking.createdAt).toISOString(),
                    updatedAt: new Date(booking.updatedAt).toISOString(),
                }
            })
        }catch (e) {
            throw e;
        }
    },
    bookEvent: async args =>{
        const fetchEvent = await Event.findOne({_id:args.eventId});
        const booking = new Booking({
            user:"5db041f98cf5c61f35a73742",
            event: fetchEvent,
        })
        const result = await booking.save();
        return {
            ...result,
            _id:result._id,
            event:singleEvent.bind(this,result.event),
            user:user.bind(this,result.user),
            createAt: new Date(result.createdAt),
            updateAt: new Date(result.updateAt),
        }
    },
    cancelEvent: async args =>{
        try{
            const booking = await Booking.findById(args.bookingId).populate("event");
            const event ={
                ...booking.event._doc,
                _id: booking.event._id,
                creator: user.bind(this,booking.event.creator)
            }
            await Booking.deleteOne({_id:args.bookingId});
            return event;
        }catch(e){
            throw e;
        }

    }
}