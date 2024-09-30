//NOTE - match two array
exports.checkIfArraysMatch = async (arr1, arr2) => {
    for (let i = 0; i < arr2.length; i++) {
        if (!arr1.includes(arr2[i])) {
            return false;
        }
    }

    return true;
}

