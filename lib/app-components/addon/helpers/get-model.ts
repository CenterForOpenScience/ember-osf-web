import { AsyncBelongsTo } from '@ember-data/model';
import Helper from '@ember/component/helper';
import ObjectProxy from '@ember/object/proxy';
import OsfModel from 'ember-osf-web/models/osf-model';

export default class GetModelHelper extends Helper {
    compute([model]: [AsyncBelongsTo<OsfModel>]) {
        if (!model) {
            return undefined;
        }
        return model instanceof ObjectProxy ? model.content : model;
    }
}
