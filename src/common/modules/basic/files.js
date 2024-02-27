const { S3Client, PutObjectCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3');
const { AWS , S3_BUCKET_URL } = require('../../../../utils/constants/app.constants');
const fs = require("fs");

module.exports = {
    //upload image
    uploadImageOnBuket: async function(file, folder) {
        var s3Client = new S3Client({ 
            region: AWS.REGION_NAME, 
            credentials: {
              accessKeyId: AWS.SECRET_ACCESS_ID,
              secretAccessKey:  AWS.SECRET_ACCESS_KEY,
            }
        });
        // Read file data
        let resultArr = [];
        if (file  && Array.isArray(file)) {
          for (var imgkey in file) {
            let fileData = fs.readFileSync(file[imgkey].tempFilePath);
            let result =  await module.exports.uploadMultiplefile(fileData, file[imgkey], folder, s3Client)
            console.log(result, "--r")
            resultArr.push(result)
          }
        }else{
            let fileData = fs.readFileSync(file.tempFilePath);
            let result =  await module.exports.uploadMultiplefile(fileData, file, folder, s3Client)
            resultArr.push(result)
        }
        return resultArr;
    },

    uploadMultiplefile: async function(fileData, file, folder, s3Client) {
      // Set S3 bucket and key
      const bucketName = AWS.BUCKET_NAME;
      const key = folder + "/" + Date.now().toString();

      // Set upload parameters
      const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileData,
        ACL: "public-read",
        ContentType: file.mimetype,
      };

      try {
        // Upload file to S3 bucket
          const command = new PutObjectCommand(params);
          await s3Client.send(command);
      
          // Return the uploaded image URL
          let imgResponse = {
            'image_url' : `https://${bucketName}.s3.amazonaws.com/${key}`
          }
          return imgResponse;
      } catch (error) {
          console.error("Error uploading image to S3:", error);
          throw error;
      }  
    },

    //delete image
    deleteImageOnBuket: async function(file) {
        // Configure S3 client
        const s3Client = new S3Client({
          region: AWS.REGION_NAME,
          credentials: {
            accessKeyId: AWS.SECRET_ACCESS_ID,
            secretAccessKey: AWS.SECRET_ACCESS_KEY,
          },
        });
        let image =  file.split(S3_BUCKET_URL)
        if(image.length>0){
          // Set delete parameters
            const params = {
              Bucket: AWS.BUCKET_NAME,
              Key: image[1],
            };
          
            try {
              // Delete object from S3 bucket
              const command = new DeleteObjectCommand(params);
              await s3Client.send(command);
              console.log("Image deleted successfully.");
              return command;
            } catch (error) {
              console.error("Error deleting image from S3:", error);
              throw error;
          }
        }
    },
  
}