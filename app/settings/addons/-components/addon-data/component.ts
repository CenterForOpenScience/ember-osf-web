import Component from '@ember/component';
import { service } from '@ember-decorators/service';
import DS from 'ember-data';
import { hash } from 'rsvp';

export default class AddonData extends Component {
    data!: object;
    models!: object;
    @service store!: DS.Store;

    async didInsertElement() {
        const loaded:any = await hash(this.models);
        let modelData:object = {};

        Object.keys(loaded).map((key) => {
            modelData = { ...modelData, [key]: loaded[key].toArray() }
        });

        this.set('data', { ...modelData, loaded: true });
    }
}
