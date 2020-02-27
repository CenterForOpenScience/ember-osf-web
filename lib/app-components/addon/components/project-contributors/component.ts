import ArrayProxy from '@ember/array/proxy';
import Component from '@ember/component';
import { action } from '@ember/object';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class ProjectContributors extends Component {
    node: Node = this.node;
    contributors: ArrayProxy<Contributor> = this.contributors;
    reloadContributorsList?: () => void; // bound by project-contributors/list

    @requiredAction discard!: () => void;
    @requiredAction continue!: () => void;
    onAddContributor?: () => void;

    @action
    reloadContributors() {
        if (this.reloadContributorsList) {
            this.reloadContributorsList();
        }
        if (this.onAddContributor) {
            this.onAddContributor();
        }
    }
}
