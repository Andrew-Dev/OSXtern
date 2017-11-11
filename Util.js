/**
 * General Utilities File - OSXtern
 * 
 * Andrew Arpasi
 */

//Require readline to read from StdIn (part of Node standard library)
const readline = require('readline')

const Utilities = {
    /**
     * Converts an array of strings into a comma separated string
     * 
     * @param {array} arr - The array to convert
     * @param {string} prefix - A prefix to add to the front, separated by comma
     * 
     * @returns {string} The formatted string with commas
     */
    arrayToCommaString(arr,prefix) {
        let str = prefix ? prefix + ',' : ''
        for(let i = 0; i < arr.length; i++) {
            str += arr[i]
            if(i < arr.length - 1) {
                 str += ','
            }
        }
        return str
    },

    /**
     * Initializes a line reader for StdIn and handles inputs and close
     * 
     * @param {function} onInput - Callback for inputs line by line
     * @param {function} onClose - Callback when inputs are done
     */
    initializeLineReader(onInput,onClose) {
        const lineReader = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false, //prevent stray output
        })
        lineReader.on('line', (line) => {
            onInput(line)
        })
        lineReader.on('close', () => {
            onClose()
        })
    },

    /**
     * Converts a path string to an array
     * 
     * @param {string} pathStr - A string with path components separated by /, must not include domain
     * 
     * @returns {array} - An array of path components
     */
    pathToArray(pathStr) {
        if(!this.isRelativePath(pathStr)) {
            pathStr = pathStr.substr(1)
        }
        const pathComponents = pathStr.split('/')
        return pathComponents
    },

    /**
     * Checks if path is relative or absolute
     *  
     * @param {string} pathStr - A string with path components separated by /
     * @returns {boolean} - true if path is relative, false is absolute
     */
    isRelativePath(pathStr) {
        return !(pathStr.charAt(0) === '/')
    }
}

module.exports = Utilities