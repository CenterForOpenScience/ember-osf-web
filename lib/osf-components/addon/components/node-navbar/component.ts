import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';
import Media from 'ember-responsive';
import { tracked } from 'tracked-built-ins';

import { layout } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';

import styles from './styles';
import template from './template';

export type NodeLike = Pick<Node, 'id' | 'isRegistration'>;

@layout(template, styles)
export default class NodeNavbar extends Component {
    @service media!: Media;
    // Optional parameters
    node?: Node;
    allowComments?: boolean;
    renderInPlace?: boolean;

    // Private properties
    secondaryNavbarId = config.secondaryNavbarId;
    @tracked collapsedNav = true;

    @computed('node.isRegistration')
    get fakeParent(): NodeLike | null {
        if (this.node) {
            const id = this.node.belongsTo('parent').id();
            if (id) {
                return {
                    id,
                    // The parent of a registration is always a registration. When a component
                    // is registered without its parent, the registration is its own root.
                    isRegistration: this.node.isRegistration,
                };
            }
        }
        return null;
    }

    @action
    toggleNav() {
        this.toggleProperty('collapsedNav');
    }

    get shouldShowNavLinks() {
        if (this.media.isMobile || this.media.isTablet){
            return !this.collapsedNav;
        }
        return true;
    }
}
