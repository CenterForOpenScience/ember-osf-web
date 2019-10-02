import Route from '@ember/routing/route';

import { DefaultPage } from 'ember-osf-web/utils/page-param';

export default class DraftIndexRoute extends Route {
    model(this: DraftIndexRoute, params: { id: string }) {
        return this.replaceWith('drafts.draft', params.id, DefaultPage);
    }
}
