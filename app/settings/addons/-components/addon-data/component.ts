import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import DS from 'ember-data';
import { hash } from 'rsvp';

export default class AddonData extends Component {
    data!: object;
    models!: object;
    @service store!: DS.Store;

    async loadData() {
        const loaded: any = await hash(this.models);
        let modelData: object = {};

        Object.keys(loaded).forEach(key => {
            let data = loaded[key];

            if(typeof data.toArray === "function") {
                data = loaded[key].toArray();
            }

            modelData = { ...modelData, [key]: data };
        });

        this.set('data', { ...modelData, loaded: true });
    }

    async didInsertElement() {
        await this.loadData();
    }
}
