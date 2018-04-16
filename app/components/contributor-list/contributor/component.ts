import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

@tagName('span')
export default class ContributorListContributor extends Component {
    contributor: {title: string, id: string};
    useLink: boolean;
}
