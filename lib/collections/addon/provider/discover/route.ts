import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import { DS } from 'ember-data';
import Theme from 'ember-osf-web/services/theme';
// import Discover from '../../discover/route';

export default class ProviderDiscover extends Route {
    controllerName = 'discover';
    templateName = 'discover';

    @service store!: DS.Store;
    @service theme!: Theme;

    // async model(): Promise<any> {
    //     const records = await this.store.query('collected-metadatum', {
    //         provider: this.theme.id,
    //     });

    //     return records;
    // }

    model() {
        return [];
    }
}
