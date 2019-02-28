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
            const value = loaded[key];
            const data = typeof value.toArray === "function" ?
                value.toArray() : value;

            modelData = { ...modelData, [key]: data };
        });

        this.set('data', { ...modelData, loaded: true });
    }

    async didInsertElement() {
        await this.loadData();
    }
}
