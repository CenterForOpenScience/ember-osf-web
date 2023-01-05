import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { BufferedChangeset } from 'validated-changeset';
import { Funder } from 'ember-osf-web/models/custom-item-metadata-record';

interface Args {
    changeset: BufferedChangeset;
}

export default class FundingMetadata extends Component<Args> {
    @tracked funderObjects: Funder[] = [];
    constructor(owner: unknown, args: Args) {
        super(owner, args);
        this.funderObjects = [...this.args.changeset.funders as Funder[]];
    }

    @action
    saveToChangeset() {
        this.args.changeset.set('funders', this.funderObjects);
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
