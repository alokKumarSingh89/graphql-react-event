const Event = require("../../models/event");
const {transferEvent} = require("./merge")
module.exports = {
    events: async () => {
        try{
            const events =  Event.find()
            return events.map(event=>{
                return transferEvent(event)
            });
        }catch (error) {
            throw error;
        }
    },
    createEvent: (args,req) => {
        const isAuth = req.isAuth;
        if(!isAuth) throw new Error("Unauthorized");
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
                createdEvent = transferEvent(result);
                return User.findById(req.userId);
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
    }
}