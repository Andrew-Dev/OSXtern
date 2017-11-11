/**
 * Persistence - Utility File - OSXTern
 * 
 * Provides methods for storing objects in a persistent manner and encrypting/decrypting them
 * 
 * Andrew Arpasi
 */

//Require Node.js standard cryptography
const crypto = require('crypto')
//Require Node.js fs (filesystem) IO library
const fs = require('fs')
//Use AES 256 for encryption
const algorithm = 'aes-256-ctr'

const Persistence = {
    /**
     * Securely encrypt and store an object in a file
     * 
     * @param {string} path - The path of where the file should be saved
     * @param {string} rootPassword - The encryption key to use (hashed root password)
     * @param {object} data - The data to store
     * @param {function} callback - Callback method invoked on success, first parameter is an error if unsuccessful
     */
    storeToSecureFile(path,rootPassword,data,callback) {
        //Use an initialization vector for extra security
        const initializationVector = crypto.randomBytes(16)
        //create the cipher using aes256
        const cipher = crypto.createCipheriv(algorithm,rootPassword,initializationVector)
        //convert object to JSON string
        const objectJSON = JSON.stringify(data)
        let base64Encrypted = cipher.update(objectJSON,'utf8','base64')
        base64Encrypted += cipher.final('base64')
        base64Encrypted += '~' + initializationVector.toString('base64') //keep IV for later decryption
        fs.writeFile(path,base64Encrypted,(err) => {
            callback(err)
        })
    },
    
    /**
     * Load an object from an encrypted file
     * 
     * @param {string} path - The path of the file to load
     * @param {string} rootPassword - The encryption key to use (hashed root password)
     * @param {function} callback - Callback method which includes decrypted data in param
     */
    loadFromSecureFile(path,rootPassword,callback) {
        fs.readFile(path,'utf8', (err, data) => {
            const initializationVector = new Buffer(data.split('~').pop(),'base64')
            const decipher = crypto.createDecipheriv(algorithm,rootPassword,initializationVector)
            let decrypted = decipher.update(data,'base64','utf8')
            decrypted += decipher.final()
            callback(err,JSON.parse(decrypted))
        })
    },

    /**
     * Creates a 32 bit AES key from the root password
     * 
     * @param {string} rootPassword 
     */
    generateAESKey(rootPassword) {
        const secret = '9CTWqfJGv5'
        const hash = crypto.createHmac('sha256',secret)
        hash.update(rootPassword)
        const hashedPassword = hash.digest('hex')
        return hashedPassword.substring(0,32)
    }
}

module.exports = Persistence