import { helper } from '@ember/component/helper';

export function getRelationship(params: any[]) {
    if (params === undefined || params === null || params.length < 2) {
        return null;
    }

    const model = params[0];
    const relationshipName = params[1];

    if (model === undefined || model === null || relationshipName === undefined || relationshipName === null) {
        return null;
    }

    return model.belongsTo(relationshipName).id();
}

export default helper(getRelationship);
