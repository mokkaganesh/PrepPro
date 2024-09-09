import axios from "axios";

const sendEmail=(data)=>axios.post('/api/sendEmail',data);

export default {sendEmail};
