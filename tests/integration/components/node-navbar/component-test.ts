import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import faker from 'faker';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import { OsfLinkRouterStub } from '../../helpers/osf-link-router-stub';

enum NavCondition {
    HasParent,
    IsRegistration = 'isRegistration',
    IsPublic = 'public',
    UserCanRead = 'userHasReadPermission',
    UserCanWrite = 'userHasWritePermission',
    UserIsContributor = 'currentUserIsContributor',
    WikiEnabled = 'wikiEnabled',
}

enum NavLink {
    ParentNode,
    ThisNode,
    Files = 'files',
    Wiki = 'wiki',
    Analytics = 'analytics',
    Registrations = 'registrations',
    Contributors = 'contributors',
    Addons = 'addons',
    Settings = 'settings',
}

interface NavTestCase {
    conditions: NavCondition[];
    links: NavLink[];
}

export class FakeNode {
    id: string = faker.random.uuid();
    title: string = faker.lorem.sentence();
    public: boolean = false;
    isRegistration: boolean = false;
    wikiEnabled: boolean = false;
    currentUserIsContributor: boolean = false;
    userHasWritePermission: boolean = false;
    userHasReadPermission: boolean = false;
    parentId: string | null = null;
    links = {
        html: 'http://localhost:4200/fak3d',
    };

    constructor(conditions: NavCondition[] = []) {
        for (const condition of conditions) {
            if (condition === NavCondition.HasParent) {
                this.parentId = faker.random.uuid();
            } else {
                this[condition] = true;
            }
        }
    }

    belongsTo() {
        return { id: () => this.parentId };
    }
}

module('Integration | Component | node-navbar', () => {
    module('basic rendering', hooks => {
        setupRenderingTest(hooks);

        test('it renders', async function(assert) {
            this.owner.register('service:router', OsfLinkRouterStub);

            this.set('node', new FakeNode());
            await render(hbs`{{node-navbar node=this.node renderInPlace=true}}`);

            assert.ok((this.element.textContent as string).trim());
        });

        test('it renders active tab when in proper route', async function(assert) {
            const routerStub = OsfLinkRouterStub.extend({
                isActive(routeName: string) {
                    return routeName.includes('guid-node.wiki');
                },
            });
            this.owner.register('service:router', routerStub);

            this.set('node', new FakeNode([NavCondition.WikiEnabled]));
            await render(hbs`{{node-navbar node=this.node renderInPlace=true}}`);

            assert.dom('[data-test-node-navbar-link]').exists();
            const assertActiveLink = assert.dom('[data-test-node-navbar-links] .active');
            assertActiveLink.exists({ count: 1 });
            assertActiveLink.containsText('Wiki');
        });

        test('it renders no active tabs', async function(assert) {
            const routerStub = OsfLinkRouterStub.extend({
                isActive(routeName: string) {
                    return routeName.includes('guid-node.forks');
                },
            });
            this.owner.register('service:router', routerStub);

            this.set('node', new FakeNode());
            await render(hbs`{{node-navbar node=this.node renderInPlace=true}}`);

            assert.dom('[data-test-node-navbar-links] .active').doesNotExist();
        });
    });

    module('renders the correct links', hooks => {
        setupRenderingTest(hooks);

        const testCases: NavTestCase[] = [
            {
                conditions: [],
                links: [
                    NavLink.ThisNode,
                    NavLink.Files,
                    NavLink.Registrations,
                ],
            },
            {
                conditions: [NavCondition.IsRegistration],
                links: [
                    NavLink.ThisNode,
                    NavLink.Files,
                ],
            },
            {
                conditions: [NavCondition.HasParent],
                links: [
                    NavLink.ParentNode,
                    NavLink.ThisNode,
                    NavLink.Files,
                    NavLink.Registrations,
                ],
            },
            {
                conditions: [NavCondition.IsPublic],
                links: [
                    NavLink.ThisNode,
                    NavLink.Files,
                    NavLink.Analytics,
                    NavLink.Registrations,
                ],
            },
            {
                conditions: [
                    NavCondition.HasParent,
                    NavCondition.IsPublic,
                ],
                links: [
                    NavLink.ParentNode,
                    NavLink.ThisNode,
                    NavLink.Files,
                    NavLink.Analytics,
                    NavLink.Registrations,
                ],
            },
            {
                conditions: [
                    NavCondition.UserIsContributor,
                    NavCondition.UserCanRead,
                    NavCondition.UserCanWrite,
                ],
                links: [
                    NavLink.ThisNode,
                    NavLink.Files,
                    NavLink.Analytics,
                    NavLink.Registrations,
                    NavLink.Contributors,
                    NavLink.Addons,
                    NavLink.Settings,
                ],
            },
            {
                conditions: [
                    NavCondition.UserIsContributor,
                    NavCondition.UserCanRead,
                ],
                links: [
                    NavLink.ThisNode,
                    NavLink.Files,
                    NavLink.Analytics,
                    NavLink.Registrations,
                    NavLink.Contributors,
                    NavLink.Settings,
                ],
            },
            {
                conditions: [
                    NavCondition.HasParent,
                    NavCondition.UserIsContributor,
                    NavCondition.UserCanRead,
                    NavCondition.UserCanWrite,
                    NavCondition.WikiEnabled,
                ],
                links: [
                    NavLink.ParentNode,
                    NavLink.ThisNode,
                    NavLink.Files,
                    NavLink.Wiki,
                    NavLink.Analytics,
                    NavLink.Registrations,
                    NavLink.Contributors,
                    NavLink.Addons,
                    NavLink.Settings,
                ],
            },
            {
                conditions: [
                    NavCondition.IsRegistration,
                    NavCondition.UserIsContributor,
                    NavCondition.UserCanRead,
                    NavCondition.WikiEnabled,
                ],
                links: [
                    NavLink.ThisNode,
                    NavLink.Files,
                    NavLink.Wiki,
                    NavLink.Analytics,
                    NavLink.Contributors,
                ],
            },
            {
                conditions: [
                    NavCondition.IsRegistration,
                    NavCondition.UserIsContributor,
                    NavCondition.UserCanRead,
                    NavCondition.UserCanWrite,
                    NavCondition.WikiEnabled,
                ],
                links: [
                    NavLink.ThisNode,
                    NavLink.Files,
                    NavLink.Wiki,
                    NavLink.Analytics,
                    NavLink.Contributors,
                    NavLink.Settings,
                ],
            },
            {
                conditions: [
                    NavCondition.HasParent,
                    NavCondition.UserCanRead,
                    NavCondition.WikiEnabled,
                ],
                links: [
                    NavLink.ParentNode,
                    NavLink.ThisNode,
                    NavLink.Files,
                    NavLink.Wiki,
                    NavLink.Registrations,
                    NavLink.Settings,
                ],
            },
            {
                conditions: [
                    NavCondition.HasParent,
                    NavCondition.IsRegistration,
                    NavCondition.IsPublic,
                    NavCondition.WikiEnabled,
                ],
                links: [
                    NavLink.ParentNode,
                    NavLink.ThisNode,
                    NavLink.Files,
                    NavLink.Wiki,
                    NavLink.Analytics,
                ],
            },
        ];

        testCases.forEach((testCase, i) => {
            test(`it renders the correct links (${i})`, async function(assert) {
                this.owner.register('service:router', OsfLinkRouterStub);

                const node = new FakeNode(testCase.conditions);
                this.set('node', node);

                await render(hbs`{{node-navbar node=this.node renderInPlace=true}}`);

                assert.dom('[data-test-node-navbar-link]').exists({ count: testCase.links.length });

                for (const link of testCase.links) {
                    let key: string;
                    if (link === NavLink.ParentNode && node.parentId) {
                        key = node.parentId;
                    } else if (link === NavLink.ThisNode) {
                        key = node.id;
                    } else {
                        key = link.toString();
                    }

                    assert.dom(`[data-test-node-navbar-link="${key}"]`).exists({ count: 1 });
                }
            });
        });
    });
});
