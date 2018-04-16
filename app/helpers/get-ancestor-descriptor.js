import ObjectProxy from '@ember/object/proxy';
import { helper } from '@ember/component/helper';

/*
 * Functions to format project titles the way they are displayed on the dashboard
 * Copied from ember-osf-preprints:
 * https://github.com/centerforopenscience/ember-osf-preprints/blob/develop/app/helpers/get-ancestor-descriptor.js
*/

function fetchIdFromRelationshipLink(node, relationship) {
    // If id is not embedded in request, Private node ids can be accessed under initializedRelationships.
    // May still return undefined if parent, for example, does not exist.
    if (node) {
        const initializedRelationship = node._internalModel._relationships.initializedRelationships[relationship];
        if (initializedRelationship && initializedRelationship.link) {
            return initializedRelationship.link.split('nodes')[1].replace(/\//g, '');
        }
    }
    return undefined;
}

function fetchTitle(node, relationship) {
    // Fetches parent or root title.  If null, marks 'Private'.
    let title = node.get(`${relationship}.title`);
    if (typeof title === 'undefined') {
        title = 'Private';
    }
    return title;
}

export function getAncestorDescriptor(params/* , hash */) {
    // Formats titles similar to the way they're displayed in the dashboard.
    // For example, Root Name / ... / Parent Name / Node Name.
    const node = params[0];
    const nodeId = node.get('id');
    let rootId = node.get('root.id');
    let parentId = node.get('parent.id');
    const parent = (node.get('parent') instanceof ObjectProxy) ? node.get('parent.content') : node.get('parent');
    let parentParentId = parent ? parent.get('parent.id') : undefined;

    if (typeof rootId === 'undefined') rootId = fetchIdFromRelationshipLink(node, 'root');
    if (typeof parentId === 'undefined') parentId = fetchIdFromRelationshipLink(node, 'parent');
    if (typeof parentParentId === 'undefined') parentParentId = fetchIdFromRelationshipLink(parent, 'parent');

    const parentTitle = fetchTitle(node, 'parent');
    const rootTitle = fetchTitle(node, 'root');

    let rootDescriptor;
    if (rootId === nodeId) { // One level
        rootDescriptor = '';
    } else if (rootId === parentId) { // Two levels
        rootDescriptor = `${parentTitle} / `;
    } else if (rootId === parentParentId) { // Three levels
        rootDescriptor = `${rootTitle} / ${parentTitle} / `;
    } else if (parentParentId === undefined) { // Cannot deduce number of levels.
        rootDescriptor = '... / ';
    } else { // Four + levels
        rootDescriptor = `${rootTitle} / ... / ${parentTitle} / `;
    }
    return rootDescriptor;
}

export default helper(getAncestorDescriptor);
