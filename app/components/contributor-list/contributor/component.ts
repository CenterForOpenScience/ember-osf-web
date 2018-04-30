import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import { Contrib } from '../component';

@tagName('span')
export default class ContributorListContributor extends Component {
    contributor: Contrib = defaultTo(this.contributor, { title: '', id: '' });
    useLink: boolean = defaultTo(this.useLink, false);
}
