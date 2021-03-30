import AbstractNodeModel from 'ember-osf-web/models/abstract-node';

export default class DraftNode extends AbstractNodeModel {
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'draft-node': DraftNode;
    } // eslint-disable-line semi
}
