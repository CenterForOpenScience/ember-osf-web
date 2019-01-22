import { helper } from '@ember/component/helper';
import ObjectProxy from '@ember/object/proxy';
import Node from 'ember-osf-web/models/node';

// TODO: i18n-ize, this is probably better off as a component rather than a helper

/**
 * Functions to format project titles the way they are displayed on the dashboard
 * Copied from ember-osf-preprints:
 * https://github.com/centerforopenscience/ember-osf-preprints/blob/develop/app/helpers/get-ancestor-descriptor.js
 */
function fetchIdFromRelationshipLink(node: Node, relationship: keyof Node) {
    // If id is not embedded in request, Private node ids can be accessed under initializedRelationships.
    // May still return undefined if parent, for example, does not exist.
    if (node) {
        // @ts-ignore - private attribute
        const initializedRelationship = node._internalModel._relationships.initializedRelationships[relationship];

        if (initializedRelationship && initializedRelationship.link) {
            return initializedRelationship.link.split('nodes')[1].replace(/\//g, '');
        }
    }

    return undefined;
}

function fetchTitle(node: Node, relationship: 'parent' | 'root') {
    // Fetches parent or root title.  If null, marks 'Private'.
    const title = node.get(relationship).get('title');

    return typeof title !== 'undefined' ? title : 'Private';
}

export function getAncestorDescriptor(params: any[]): string {
    // Formats titles similar to the way they're displayed in the dashboard.
    // For example, Root Name / ... / Parent Name / Node Name.
    const node = params[0] as Node;
    const nodeId = node.id;
    let rootId = node.root.get('id');
    let parentId = node.parent.get('id');
    const parent: Node = node.parent instanceof ObjectProxy ? node.get('parent').content as Node : node.parent;
    let parentParentId = parent ? parent.parent && parent.parent.get('id') : undefined;

    const separator = ' / ';
    const ellipsis = '\u2026';

    if (typeof rootId === 'undefined') {
        rootId = fetchIdFromRelationshipLink(node, 'root');
    }

    if (typeof parentId === 'undefined') {
        parentId = fetchIdFromRelationshipLink(node, 'parent');
    }

    if (typeof parentParentId === 'undefined') {
        parentParentId = fetchIdFromRelationshipLink(parent, 'parent');
    }

    const parentTitle = fetchTitle(node, 'parent');
    const rootTitle = fetchTitle(node, 'root');

    const result: string[] = [];

    if (rootId === nodeId) { // One level
        return '';
    } else if (rootId === parentId) { // Two levels
        result.push(parentTitle);
    } else if (rootId === parentParentId) { // Three levels
        result.push(rootTitle, parentTitle);
    } else if (parentParentId === undefined) { // Cannot deduce number of levels.
        result.push(ellipsis);
    } else { // Four + levels
        result.push(rootTitle, ellipsis, parentTitle);
    }

    return [...result, ''].join(separator);
}

export default helper(getAncestorDescriptor);
