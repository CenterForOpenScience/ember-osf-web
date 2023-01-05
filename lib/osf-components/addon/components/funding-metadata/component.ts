import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { BufferedChangeset } from 'validated-changeset';
import { Funder } from 'ember-osf-web/models/custom-item-metadata-record'

interface Args {
    changeset: BufferedChangeset;
}

export default class FundingMetadata extends Component<Args> {
    // noop
    @tracked fundingObjects: Funder[] = [];

}
