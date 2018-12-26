import { ModelInstance } from 'ember-cli-mirage';
import Institution from 'ember-osf-web/models/institution';

import ApplicationSerializer from './application';

export default class InstitutionSerializer extends ApplicationSerializer<Institution> {
    buildNormalLinks(model: ModelInstance<Institution>) {
        const { id } = model;
        return {
            ...super.buildNormalLinks(model),
            html: `/institutions/${id}/`,
        };
    }
}
