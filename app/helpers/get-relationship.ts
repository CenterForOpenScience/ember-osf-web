import { helper } from '@ember/component/helper';
import OsfModel from 'ember-osf-web/models/osf-model';

export function getRelationship([model, relationshipName]: [OsfModel, string]) {
    if (model === undefined || model === null || relationshipName === undefined || relationshipName === null) {
        return null;
    }

    // @ts-ignore
    return model.belongsTo(relationshipName).id();
}

export default helper(getRelationship);
