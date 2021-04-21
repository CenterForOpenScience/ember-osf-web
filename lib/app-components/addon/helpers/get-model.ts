import Helper from '@ember/component/helper';
import ObjectProxy from '@ember/object/proxy';
import DS from 'ember-data';
import OsfModel from 'ember-osf-web/models/osf-model';

export default class GetModelHelper extends Helper {
    compute([model]: [DS.PromiseObject<OsfModel>]) {
        if (!model) {
            return undefined;
        }
        return model instanceof ObjectProxy ? model.content : model;
    }
}
