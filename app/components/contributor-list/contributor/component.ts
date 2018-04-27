import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';

@tagName('span')
export default class ContributorListContributor extends Component {
    contributor: {title: string, id: string} = defaultTo(this.contributor, { title: '', id: '' });
    useLink: boolean = defaultTo(this.useLink, false);
}
