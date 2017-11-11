/**
 * NetXTern - OSXTern
 * 
 * Keeps track of browser history and ouputs full URL based on navigation commands
 * 
 * Andrew Arpasi
 */

//Require the DoublyLinkedList I implemented in DoublyLinkedList.js
const DoublyLinkedList = require('./DoublyLinkedList')
//Require my Utilities from Utilities.js
const Utilities = require('./Util')

const NetXTern = {
    /**
     * Initialize NetXTern and process inputs
     */
    init() {
        //A doubly linked list used for navigation
        this.navigation = new DoublyLinkedList()
        //The current domain string
        this.currentDomain = null
        //The current node in navigation
        this.currentNode = null
        //Full history log
        this.historyLog = []

        Utilities.initializeLineReader(
            (line) => { //For each line in StdIn
                if(line.trim() === 'BACK') {
                    this.goBack()
                    this.addNodeToHistory()                    
                    return
                } else if(line.trim() == 'FORWARD') {
                    this.goForward()
                    this.addNodeToHistory()
                    return
                }
                const URLData = this.parseURL(line)
                if(this.currentNode) this.navigation.breakListAfterNode(this.currentNode)
                this.currentNode = this.navigation.addAtEnd(URLData)
                this.addNodeToHistory()
            },() => { //On linereader close
                //Print out log of full browsing history
                this.historyLog.map((urlStr) => {
                    console.log(urlStr)
                })
            }
        )
    },

    /**
     * Parse an URL into a nice object with multiple properties
     * 
     * @param {string} urlStr - A string of a full URL, absolute path or relative path
     * 
     * @returns {object} - A URL Object with a path array and optional domain
     */
    parseURL(urlInput) {
        let urlStr = urlInput
        const URL = {}
        //parse the domain with regex if it is in the string
        const domainRegex = /https:\/\/[A-Za-z0-9]+\.com/
        const domainMatch = domainRegex.exec(urlStr)
        //does the input specify a new domain name?
        if(domainMatch) {
            this.currentDomain = domainMatch[0]
            URL.domain = domainMatch[0]
        } else if(this.currentDomain) {
            URL.domain = this.currentDomain
        }
        urlStr = urlStr.replace(domainRegex,'')
        //check if relative and determine if array should be recreated or concatenated
        URL.components = []
        if(!Utilities.isRelativePath(urlStr) && urlStr.length > 0) {
            URL.components = Utilities.pathToArray(urlStr)
        } else if(this.currentNode && urlStr.length > 0) {
            URL.components = this.currentNode.data.components.concat(Utilities.pathToArray(urlStr))
        }
        return URL
    },

    /**
     * Assembles the full URL string with domain and path
     * 
     * @param {object} URL
     * 
     * @returns {string} - The full route string 
     */
    assembleRouteFromURL(URL) {
        let urlStr = URL.domain
        URL.components.map((component) => {
            urlStr += '/' + component
        })
        return urlStr
    },

    /**
     * If there is page in the navigation DLL to go back to, go to that page
     */
    goBack() {
        if(this.currentNode.prev) this.currentNode = this.currentNode.prev
        if(this.currentNode.data.domain) this.currentDomain = this.currentNode.data.domain
    },

    /**
     * If there is a page in front of the current node, go to that page
     */
    goForward() {
        if(this.currentNode.next) this.currentNode = this.currentNode.next
        if(this.currentNode.data.domain) this.currentDomain = this.currentNode.data.domain
    },

    /**
     * Adds the current node to the full history log
     */
    addNodeToHistory() {
         this.historyLog.push(this.assembleRouteFromURL(this.currentNode.data))
    }

}

module.exports = NetXTern

NetXTern.init()