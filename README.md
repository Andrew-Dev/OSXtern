# OSXtern

An amazing "operating system" written in the coolest language, Javascript. Because who doesn't want to use an operating system written in JS?

This is my Xtern 2017 technical screen, not a real OS.

There are 3 components:
* **User group reporting**: manage user permissions and roles which belong to each user, save and encrypt/decrypt this information for security purposes.

* **NetXTern**: manages browser history based on user links. Uses a doubly linked list for efficiency and has full, easy navigation capabilities.

* **Activity Monitor**: view running processes after opening and closing them by PID. Uses a simple stack implementation.

There are some utility classes:

* **Util.js** Contains general utilities for string manipulation and input reading

* **MergeSort.js** Contains an implentation of merge sort, a stable sort that runs in linearithmic efficiency.

* **DoublyLinkedList.js** A non circular doubly linked list, designed with browser navigation in mind. Contains methods for adding/managing nodes and traversals.

* **Persistence.js** Includes functionality for persisting files and encrypting/decrypting them using AES 256 with a randomized initialization vector.

