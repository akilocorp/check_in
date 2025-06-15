const User = require('../models/User');
const TicketCheck=require('../models/TicketCheck')
const scanUsers=async(req,res)=>{
    try{
    const {id}=req.body
    userExists=await User.findOne({_id:id})
    if (userExists){

        if(userExists.is_active){
            
             ticket=await TicketCheck.findOne({ticket_id:id})
            if(ticket){
                console.log("here_ticket");

            //check the no_of people
                if(userExists.no_people>ticket.no_of_scans){
                    ticket.no_of_scans=ticket.no_of_scans+1
                    await ticket.save().then((updated_ticket)=>{
                        if (userExists.no_people==updated_ticket.no_of_scans){
                            userExists.is_active=false
                            userExists.save().then(()=>{
                                res.status(200).json({ message: `Successfully Checked In` });
                            })
                        }
                        else{
                            res.status(200).json({ message: `Successfully Checked In` });
                        }
                    });
                    

                    }
                else if(userExists.no_people==ticket.no_of_scans){
                    userExists.is_active=false
                    await userExists.save()
                     res.status(500).json({ message: `This ticket has already checked in` });
                }
            }else{
                const first_scan= TicketCheck.create({
                    no_of_scans:1,
                    ticket_id:id
                }).then((updated_ticket)=>{
                    if (userExists.no_people==updated_ticket.no_of_scans){
                            userExists.is_active=false
                            userExists.save().then(()=>{
                                res.status(200).json({ message: `Successfully Checked In` });
                            })
                        }
                        else{
                            res.status(200).json({ message: `Successfully Checked In` });
                        }
                })
            }
        }
        else{
            res.status(401).json({ message: `This ticket has already checked in` });
        }

       

    }
    else{
        res.status(500).json({ message: "Could not recognize the Qr Code." });
    }
}catch(error){
    console.error('Scanning error:', error);
    res.status(500).json({ message: `Server error scanning: ${error.message}` });

}
}

module.exports={scanUsers};