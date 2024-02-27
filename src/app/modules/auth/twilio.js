
const { TWILIO } = require('../../../../utils/constants/app.constants');
const client = require('twilio')(TWILIO.ACCOUNTSID, TWILIO.AUTH_TOKEN);
const helper = require('./helper');

module.exports = {


    twilioWhatsappResponse: async function (body, to_phone) {
        try{
            const ab = await client.messages.create({
                body: body,
                from: `whatsapp:${TWILIO.TWILIO_FROM_WHATSAPP}`,
                to: `whatsapp:${to_phone}`,
            })
            console.log("Message sent successfully",ab);
            return true;
        } catch (err) {
            console.log("Error sending message:", err);
            throw err;
        }
    },

    twilioResponse: async function (body, to_phone) {
        try{
            await client.messages.create({
                body: body,
                from: TWILIO.TWILIO_FROM,
                to: to_phone
            })
            console.log("Message sent successfully");
            return true;
        } catch (err) {
            console.log("Error sending message:", err);
            throw err;
        }
    },


    send_otp: async function (body) {
        try {

            let otp = await helper.getOtp(1);
            if(otp){
                await module.exports.twilioWhatsappResponse("Your verification code is "+otp, body.full_phone_number);
                return otp;
            }
        } catch (err) {
            throw err;
        }
    },

}