import { cos } from "@tensorflow/tfjs";
import axios from "axios";


const sendEmail=(data)=>axios.post('/api/sendEmail',data);

const sendEmailThroughClerk =  async (email)=>{
    console.log(email+"  dsda");
   await axios.post('/api/sendInvitation',{email_address : email});
};

export default {sendEmail,
                sendEmailThroughClerk
};
