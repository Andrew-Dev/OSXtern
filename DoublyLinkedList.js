/**
 * Doubly Linked List - Utiliy File - OSXtern
 * 
 * A doubly linked list data structure, can be used to effeciently handle browser navigation
 * This list is non-circular, as we do not want a browser to go forward to the first page in the list.
 * The list can also be broken easily if you go back then wish to go to a different page
 * 
 * Andrew Arpasi
 */

/**
 * Method that creates a ListNode object
 * 
 * @param {object} data - The data to store in the node
 * @param {object} next - The next node in the list
 * @param {object} prev - The previous node in the list
 * 
 * @returns {object} - The list node
 */
const ListNode = (data,next,prev) => {
    return {
        data: data,
        next: next,
        prev: prev,
    }
}

/**
 * DoublyLinkedList class - uses new ES6 class syntax
 */
class DoublyLinkedList {
    /**
     * Initializes a Doubly Linked List and sets head and tail to null
     */
    constructor() {
        this.head = null
        this.tail = null
    }

    /**
     * Creates a node and adds it to the end of the list
     * 
     * @param {object} data - The data of the node to be added
     */
    addAtEnd(data) {
        const tailNode = this.tail || null
        //make next null, as it is non-circular
        const newNode = ListNode(data,null,tailNode)
        //update tail and set old tail's next node
        if(tailNode) tailNode.next = newNode
        this.tail = newNode
        if(!this.head) this.head = newNode
        return newNode
    }

    /**
     * Creates a node and adds it to the beginning of the list
     * 
     * @param {object} data - The data of the node to be added 
     */
    addAtBeginning(data) {
        const headNode = this.head || null
        //make prev null, as it is non-circular
        const newNode = ListNode(data,headNode,null)
        if(headNode) headNode.prev = newNode
        this.head = newNode
        if(!this.tail) this.tail = newNode
        return newNode
    }

    /**
     * Traverses the list until it finds a specific key value pair
     * 
     * @param {object} key 
     * @param {object} value 
     */
    traverseForKeyValuePair(key,value) {
        let currentNode = this.head
        while(currentNode) {
            if(currentNode.data[key] === value) {
                return currentNode
            }
            currentNode = currentNode.next
        }
        return null
    }

    /**
     * Does a traversal of the linked list
     * 
     * @param {function} nodeCallback 
     */
    forwardTraversalUntilNode(node,nodeCallback) {
        let currentNode = this.head
        while(currentNode) {
            nodeCallback(currentNode)      
            if(Object.is(currentNode,node)) return            
            currentNode = currentNode.next
        }
    }

    /**
     * Removes all nodes after the node provided
     * Other nodes should be freed automatically through JS garbage collection
     * 
     * @param {object} node
     */
    breakListAfterNode(node) {
        node.next = null
        this.tail = node
    }

}

module.exports = DoublyLinkedList