/**
 * User Group Reporting - OSXtern
 * 
 * Saves users into groups and reports it
 * 
 * Features optional persistent data loading
 * 
 * Andrew Arpasi
 */

//Require readline to read from StdIn (part of Node standard library)
const readline = require('readline')
//Require my implementation of Merge Sort in MergeSort.js
const MergeSort = require('./MergeSort')
//Require my Utilities from Utilities.js
const Utilities = require('./Util')
//Require secure persistent data saving to save user groups for later
const Persistence = require('./Persistence')

const UserGroupReporting = {
    groups: {}, //Maintain a hash table of groups and users

    /**
     * Initialize UserGroupReporting by processing inputs
     */
    init() {
        this.groups = {}

        this.loading = false //true if reading from file, prevent overwriting while loading groups
        this.pendingStore = false //true if waiting to store after loading and merging for persistence
        this.closed = false //true if the lineReader is complete, used for asynchronous data persistency

        //Initialize the linereader interface to read from StdIn
        Utilities.initializeLineReader(
            (line) => { //Read a line in from StdIn
                //Using the optional STORE <password> command, save the users to an encrypted file
                if(line.startsWith('STORE') && !this.loading) {
                    this.storeGroups(line.split(' ')[1])
                    return
                } else if(line.startsWith('STORE') && this.loading) {
                    this.pendingStore = true
                    return
                }
                //Using the optional LOAD <password> command, load the users from an encrypted file
                if(line.startsWith('LOAD')) {
                    this.loading = true
                    this.loadGroups(line.split(' ')[1])
                    return
                }
                const userObj = this.parseInput(line)
                this.addToGroup(userObj)
            },() => { //StdIn is done reading lines
                this.closed = true
                if(!this.loading) {
                    this.sortAndPrintGroups()
                }
                
            }
        )
    },

    /**
     * Parse the input line into a group and user
     * 
     * @param {string} inputStr - The string received from StdIn
     * 
     * @returns {object} - The user object with key userName and key groupName 
     */
    parseInput(inputStr) {
        const stringPartials = inputStr.split(' ')
        const userObj = {}
        if(stringPartials.length > 1) {
            userObj.userName = stringPartials[0]
            userObj.groupName = stringPartials[1]
        }
        return userObj
    },

    /**
     * Add a user to the groups object
     * 
     * @param {object} userObj - An object with userName and groupName keys 
     * @param {boolean} temp - Add to temporary groups if loading persistent data
     */
    addToGroup(userObj) {
        //check if group exists, if not add to group
        if(this.groups[userObj.groupName])
            this.groups[userObj.groupName].push(userObj.userName)
        else if(!this.groups[userObj.group] || !Array.isArray(this.groups[userObj.groupName]))
            this.groups[userObj.groupName] = [userObj.userName]
    },

    /**
     * This will sort the groups and print them to the output in CSV format
     */
    sortAndPrintGroups() {
        let groupNames = Object.keys(this.groups)
        groupNames = MergeSort.sort(groupNames)
        groupNames.map((groupName) => {
            let users = this.groups[groupName]
            users = MergeSort.sort(users)
            const outputLine = Utilities.arrayToCommaString(users,groupName)
            console.log(outputLine)
        })
    },

    /**
     * This will optionally store the groups in a persistent manner with a root user password.
     * 
     * @param {string} rootPassword - The password of the root user used to encrypt the file
     */
    storeGroups(rootPassword) {
        const aesKey = Persistence.generateAESKey(rootPassword)
        Persistence.storeToSecureFile('roles.osxt',aesKey,this.groups,(err) => {
            if(err) return console.log('Error:',err)
        })
    },

    /**
     * This will optionally load groups from a file with a root user password.
     * 
     * @param {string} rootPassword - The password from the root user, will be used to decrypt file
     */
    loadGroups(rootPassword) {
        const aesKey = Persistence.generateAESKey(rootPassword)
        this.loading = true        
        Persistence.loadFromSecureFile('roles.osxt',aesKey,(err,data) => {
            if(err) return console.log('Error:',err)
            this.mergeGroups(data)
            if(this.pendingStore) {
                this.storeGroups(rootPassword)
            }
            this.sortAndPrintGroups()
            this.loading = false
        })
    },

    /**
     * Merge a group objecg with the main groups object, good for async loading
     * 
     * @param {object} groups 
     */
    mergeGroups(groups) {
        Object.keys(groups).map((group) => {
            groups[group].map((user) => {
                this.addToGroup({
                    userName: user,
                    groupName: group,
                })
            })
        })
    }

}

module.exports = UserGroupReporting

UserGroupReporting.init()