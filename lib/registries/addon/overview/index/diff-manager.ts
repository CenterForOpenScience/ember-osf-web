// take in 1 revision and compare it to the original version (future work to support any base version)
// if there is no selected revisionId, then compare to the latest version
// if there is a selected revisionId, then compare to the selected version

// takes in a revisionId (and a base version)
// outputs a list of changed response Ids


// onInit: fetch original revision
// onInit: check if we are given a revisionId, if so, fetch that revision, if not, compare to responses on registration
// onInit: check if we are given a base version, if so, compare to that version, if not, compare to original responses

export default class DiffManager {
    constructor(revisionId: string, baseRevisionId?: string) {
        if (revisionId) {
            // fetch revision
        } else {
            // fetch registration
        }
        if (baseRevisionId) {
            // fetch base revision
        } else {
            // compare to original responses
        }

        // const newChanges = revisionId ? revision.revisionResponses : registration.registrationResponses;
        // const baseChanges = baseRevisionId ? baseRevision.revisionResponses : originalRevision.revisionResponses;
        // loop through each key/value pair of newChanges and baseChanges, compare values,
        // if the values are different, add the key to the array
        // Object.entries(newChanges).reduce((key, value) => { // goes through each key value pair
        //     if (value !== baseChanges[key]) {
        //         return key;
        //     }
        // }, []);
    }
}
