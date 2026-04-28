import Enterprise from '../../../models/Enterprise.js';
import connectDb from '../../../middleware/mongoose';
import bcrypt from 'bcrypt';


const handler = async (req, res) => {
    if(req.method === "POST" ) {

        try {
           

            
                var enterprise = await Enterprise.findOne({phone: req.body.phone})
                     
                     if(!enterprise) {
                        const hashedPassword = await bcrypt.hash(req.body.password, 12);
                        enterprise = new Enterprise({
                            firstName: req.body.firstName,
                            phone: req.body.phone,
                            password: hashedPassword,
                            // isuser: req.body[i].isuser
                        });
            
                        await enterprise.save();
                        res.status(200).json({success: "New Enterprise created"});
           
                        return b;
                         
                     }
                 
                 const isPasswordValid = await bcrypt.compare(password, req.password);
 
                 if(!isPasswordValid) {
                     res.status(400).json({err: "Invalid password"});
                 } else {
                    res.status(200).json({success: "Login Successful"})
                    return enterprise;
                 }

                 res.status(200).json({success: "Enterprise login successful"});
             
    
        }
        catch (error) {
            res.json(error);
            res.status(405).end();
          }
        
    } else {
        res.status(400).json({err: "This method is not allowed"});
    }
}

export default connectDb(handler);