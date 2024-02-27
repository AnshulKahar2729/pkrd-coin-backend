'use strict';

var aes256 = require('aes256');
const { ENCRYPTION_KEY } = require('../../../../utils/constants/app.constants');
let cipher = aes256.createCipher(ENCRYPTION_KEY);

module.exports = {
    encryption: async function (data){
        try {
            data = JSON.stringify(data)

            //encrypt data
            let encryptedData = cipher.encrypt(data);

            return encryptedData

        } catch (err) {
            console.log(err,'------err--------');
        }
    },

    decryption: async function (data){
        try {
            //decrypt data
            let decryptedData = cipher.decrypt(data);
            decryptedData = JSON.parse(decryptedData)

            return decryptedData

        } catch (err) {
            console.log(err,'------err--------');
        }
    }
}