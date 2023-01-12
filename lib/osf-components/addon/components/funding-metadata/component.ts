import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { BufferedChangeset } from 'validated-changeset';
import { Funder } from 'ember-osf-web/models/custom-item-metadata-record';
import DS from 'ember-data';
import { restartableTask, timeout } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import CrossrefFunderModel from 'ember-osf-web/models/crossref-funder';

interface Args {
    changeset: BufferedChangeset;
}

export default class FundingMetadata extends Component<Args> {
    @service store!: DS.Store;
    @tracked funderObjects: Funder[] = [];
    constructor(owner: unknown, args: Args) {
        super(owner, args);
        this.funderObjects = [...this.args.changeset.funders as Funder[]];
    }

    @restartableTask
    @waitFor
    async searchFunders(name: string) {
        await timeout(500);
        const funders = await this.store.query('crossref-funder', {
            query: name,
        });
        return funders;
    }

    @action
    saveToChangeset() {
        this.args.changeset.set('funders', this.funderObjects);
    }

    @action
    selectFunder(item: Funder, funder: CrossrefFunderModel) {
        item.funder_identifier = funder.uri;
        item.funder_identifierType = 'Crossref Funder URI';
        item.funder_name = funder.name;
        this.saveToChangeset();
    }

    @action
    addAnother() {
        this.funderObjects.pushObject({});
    }

    @action
    delete(item: Funder) {
        this.funderObjects.removeObject(item);
        this.saveToChangeset();
    }
}
