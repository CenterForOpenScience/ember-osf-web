import { action, notifyPropertyChange } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { BufferedChangeset } from 'validated-changeset';
import { Funder } from 'ember-osf-web/models/custom-item-metadata-record';
import DS from 'ember-data';
import { restartableTask, timeout } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import CrossrefFunderModel from 'ember-osf-web/models/crossref-funder';
import IntlService from 'ember-intl/services/intl';

interface Args {
    changeset: BufferedChangeset;
}

interface FunderObjects extends Funder {
    errors: string[];
}

export default class FundingMetadata extends Component<Args> {
    @service store!: DS.Store;
    @service intl!: IntlService;
    @tracked funderObjects: FunderObjects[] = [];
    constructor(owner: unknown, args: Args) {
        super(owner, args);
        this.funderObjects = (this.args.changeset.funders as Funder[]).map((item: Funder) => ({...item, errors : []}));
    }

    get isValid() {
        return this.funderObjects.every(item => item.errors.length === 0);
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
    validateFunderObjects() {
        for (const item of this.funderObjects) {
            if (item.award_number || item.award_title || item.award_uri || item.funder_name) {
                item.errors.removeObject(this.intl.t('osf-components.funding-metadata.error'));
            } else if (item.errors.length === 0) {
                item.errors.pushObject(this.intl.t('osf-components.funding-metadata.error'));
            }
        }
        notifyPropertyChange(this, 'funderObjects');
        if (!this.isValid) {
            return Promise.reject();
        }
        return true;
    }

    @action
    saveToChangeset() {
        this.validateFunderObjects();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.args.changeset.set('funders', this.funderObjects.map(({ errors, ...props }) => props));
    }

    @action
    selectFunder(item: FunderObjects, funder: CrossrefFunderModel) {
        item.funder_identifier = funder.uri;
        item.funder_identifier_type = 'Crossref Funder URI';
        item.funder_name = funder.name;
        this.saveToChangeset();
        this.validateFunderObjects();
    }

    @action
    addAnother() {
        this.funderObjects.pushObject({
            funder_name: '',
            funder_identifier: '',
            funder_identifier_type: '',
            award_number: '',
            award_title: '',
            award_uri: '',
            errors: [],
        });
    }

    @action
    delete(item: FunderObjects) {
        this.funderObjects.removeObject(item);
        this.saveToChangeset();
    }
}
