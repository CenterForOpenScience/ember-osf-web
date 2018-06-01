import { service } from '@ember-decorators/service';
import { assert } from '@ember/debug';
import Route from '@ember/routing/route';
import GuidContext from 'ember-osf-web/services/guid-context';

export default class AnalyticsPageRoute extends Route {
    @service guidContext!: GuidContext;

    model() {
        assert('Must have a GUID context', Boolean(this.guidContext.id && this.guidContext.taskInstance));
        return {
            taskInstance: this.guidContext.taskInstance,
            id: this.guidContext.id,
        };
    }
}
