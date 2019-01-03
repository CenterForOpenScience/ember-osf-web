import ArrayProxy from '@ember/array/proxy';
import Component from '@ember/component';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class ProjectContributors extends Component {
    node: Node = this.node;
    contributors: ArrayProxy<Contributor> = this.contributors;

    @requiredAction discard!: () => void;
    @requiredAction continue!: () => void;
}
