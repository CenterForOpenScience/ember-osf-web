import Route from '@ember/routing/route';

import buildChangeset from 'ember-osf-web/utils/build-changeset';

import FormController from './controller';

export default class FormControls extends Route {
    setupController(controller: FormController) {
        const model = {
            title: '',
            description: '',
        };
        const changeset = buildChangeset(model, controller.validation);
        controller.set('changeset', changeset);
    }
}
