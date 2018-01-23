export default function contributorList(node, and) {
    const contribs = node.get('contributors.content.canonicalState');
    if (!contribs) {
        return;
    }
    const len = contribs.length;
    const namePath = index => node.get(`_internalModel.__relationships.initializedRelationships.contributors.canonicalState.${index}.__data.links.relationships.users.data.attributes.family_name`) || node.get(`_internalModel.__relationships.initializedRelationships.contributors.canonicalState.${index}.__data.links.relationships.users.data.attributes.given_name`);
    switch (len) {
    case 1: return namePath(0);
    case 2: return `${namePath(0)}${and ? ` ${and}` : ','} ${namePath(1)}`;
    case 3: return `${namePath(0)}, ${namePath(1)}${and ? ` ${and}` : ','} ${namePath(2)}`;
    default: return `${namePath(0)}, ${namePath(1)}, ${namePath(2)} +${len - 3}`;
    }
}
