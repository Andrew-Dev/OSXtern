/**
 * Merge Sort - Utility File - OSXTern
 * 
 * This provides Merge Sort, a stable sort that runs in O(nlogn) efficiency
 * 
 * Andrew Arpasi
 */

const MergeSort = {
    /**
     * Sort the array using Merge Sort
     * 
     * @param {array} arr - Array to be sorted
     * @param {number} i - Sort from index
     * @param {number} j - Sort to index
     * 
     * @returns {array} - A sorted array
     */
    sort(arr) {
        if(arr.length <= 1) {
            return arr
        }
        //get the midpoint and split array into left and right
        const midpoint = Math.floor(arr.length/2)
        const leftArr = this.sort(arr.slice(0,midpoint))
        const rightArr = this.sort(arr.slice(midpoint))
        
        const merged = this.merge(leftArr, rightArr)

        return merged
    },

    /**
     * Merge the two arrays
     * 
     * @param {array} leftArr - Left array
     * @param {array} rightArr - Right array
     * 
     * @returns {array} - The merged array
     */
    merge(leftArr,rightArr) {
        let mergedArr = []

        let left = 0;
        let right = 0;

        //check left and right values for result to merge
        while(left < leftArr.length && right < rightArr.length) {
            if(leftArr[left] < rightArr[right]) {
                mergedArr.push(leftArr[left])
                left++
            } else {
                mergedArr.push(rightArr[right])
                right++
            }
        }

        //merge everything together
        mergedArr = mergedArr.concat(leftArr.slice(left))
        mergedArr = mergedArr.concat(rightArr.slice(right))

        return mergedArr
    }
}

module.exports = MergeSort