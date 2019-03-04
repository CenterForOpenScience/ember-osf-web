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
export default class OsfLink extends Component {
    @service router!: RouterService;

    route?: string;
    models?: any[];
    href?: string;
    queryParams?: Record<string, unknown>;
    fragment?: string;

    rel: AnchorRel = defaultTo(this.rel, 'noopener');
    target: AnchorTarget = defaultTo(this.target, '_self');

    onClick?: () => void;

    @computed('href', 'route', 'models.[]', 'queryParams', 'fragment')
    get _href() {
        let url: string | undefined = this.href;

        if (url === undefined && this.route) {
            url = this.router.urlFor(this.route, ...(this.models || []), {
                queryParams: this.queryParams || {},
            });
            if (this.fragment) {
                url = `${url}#${this.fragment}`;
            }
        }

        return url;
    }

    @computed('route', 'models.[]', 'queryParams', 'router.currentURL')
    get isActive() {
        return Boolean(this.route && this.router.isActive(this.route, ...(this.models || []), {
            queryParams: this.queryParams || {},
        }));
    }

    didReceiveAttrs() {
        assert(
            '`@models` must be undefined or an array. Consider using the `array` helper.',
            !this.models || isArray(this.models),
        );
        assert(
            'Must pass `@href` xor `@route`. Did you pass `href` instead of `@href`?',
            !(this.route === undefined && this.href === undefined),
        );
        assert(
            'Both `@href` and `@route` were improperly set (probably to empty strings)',
            Boolean(this.route) !== Boolean(this.href),
        );
        assert(
            '`@models` makes sense only with `@route`',
            Boolean(!this.models || this.route),
        );
    }

    @action
    _onClick(e: MouseEvent) {
        if (this.onClick) {
            this.onClick();
        }

        if (!this.route) {
            return true;
        }

        e.preventDefault();

        // TODO: add fragment
        this.router.transitionTo(this.route, ...(this.models || []), {
            queryParams: this.queryParams || {},
        });

        return false;
    }
}
