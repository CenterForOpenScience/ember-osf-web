import { layout, tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { isArray } from '@ember/array';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import RouterService from '@ember/routing/router-service';
import defaultTo from 'ember-osf-web/utils/default-to';
import template from './template';

type AnchorRel = 'noreferrer' | 'noopener';
type AnchorTarget = '_self' | '_blank' | '_parent' | '_top';

@tagName('')
@layout(template)
export default class Link extends Component {
    @service router!: RouterService;

    route?: string;
    models?: any[];
    queryParams?: Record<string, any>;

    rel: AnchorRel = defaultTo(this.rel, 'noreferrer');
    target: AnchorTarget = defaultTo(this.target, '_self');

    onclick?: () => void;

    @computed('route', 'models')
    get href() {
        if (!this.route) {
            return undefined;
        }

        return this.router.urlFor(this.route, ...(this.models || []), {
            queryParams: this.queryParams || {},
        });
    }

    @computed('router.currentURL')
    get isActive() {
        return Boolean(this.route && this.router.isActive(this.route, ...(this.models || []), {
            queryParams: this.queryParams || {},
        }));
    }

    didReceiveAttrs() {
        assert(
            '@models must be undefined or an array. Consider using the `array` helper',
            !this.models || isArray(this.models),
        );
    }

    @action
    _onclick(e: MouseEvent) {
        if (this.onclick) {
            this.onclick();
        }

        if (!this.route) {
            return true;
        }

        e.preventDefault();

        this.router.transitionTo(this.route, ...(this.models || []), {
            queryParams: this.queryParams || {},
        });

        return false;
    }
}
