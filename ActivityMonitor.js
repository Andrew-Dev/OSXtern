/**
 * Activity Monitor
 * 
 * Keeps track of running processes
 * 
 * Andrew Arpasi
 */

//Require my Utilities from Utilities.js
const Utilities = require('./Util')

const ActivityMonitor = {
    /**
     * Initializes the Activity Monitor and records user input
     */
    init() {
        //Maintain a Hash Map of all the running processes
        this.processMap = {}

        Utilities.initializeLineReader(
            (line) => {
                this.toggleProcess(line)
            },() => {
                const processes = Object.keys(this.processMap)
                if(processes.length === 0) {
                    console.log('0')
                    return
                }
                processes.map((pid) => {
                    console.log(pid)
                })
            }
        )
    },

    toggleProcess(pid) {
        if(this.processMap[pid])
            //delete the item from the hash map to make iteration faster
            delete this.processMap[pid]
        else
            this.processMap[pid] = true
    }
}

module.exports = ActivityMonitor

ActivityMonitor.init()