//Checking the crypto module
const CryptoJS = require("crypto-js");
const { SECURITY_KEY } = require("../../../../utils/constants/app.constants");

module.exports = {
    encrypt: async function(text) {
        let encryptdEmail = CryptoJS.AES.encrypt(text, SECURITY_KEY).toString();
        return encryptdEmail;
    },

    //Decrypting text
    decrypt:async function(text) {
        let bytes  = CryptoJS.AES.decrypt(text, SECURITY_KEY);
        let decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedText;
    },
    
    comparePass:async function(reqPass, dbPass) {
        return reqPass == dbPass;
    },
}