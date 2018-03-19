import { action, computed } from '@ember-decorators/object';
import { alias, bool } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import Node from 'ember-osf-web/models/node';

/**
 * @module ember-osf-web
 * @submodule components
 */

enum ProjectSelectState {
    main = 'main',
    newProject = 'newProject',
    existingProject = 'existingProject',
}

/**
 * project-selector - to be used within a modal to select existing projects or create a new one
 * Mainly used in Quick Files as a way to move file to project
 *
 * Same usage:
 * ``` handlebars
 * {{project-selector
 *   projectSelectState=projectSelectState
 *   valueChanged=(action 'valueChanged')
 * }}
 * ```
 * @class project-selector
 */
export default class ProjectSelector extends Component.extend({
    didReceiveAttrs() {
        if (this.get('projectSelectState') === ProjectSelectState.main) {
            this.get('initialLoad').perform();
        }
    },

    initialLoad: task(function* (this: ProjectSelector) {
        this.setProperties({
            didValidate: false,
            selected: null,
            projectList: yield this.get('findNodes').perform(),
        });
    }),

    findNodes: task(function* (this: ProjectSelector, filter?: string) {
        if (filter) {
            yield timeout(250);
        }

        const user = yield this.get('currentUser.user');

        const nodes = yield user.queryHasMany('nodes', {
            filter: filter ? { title: filter } : undefined,
        });

        return nodes;
    }).restartable(),
}) {
    @service currentUser;
    @service i18n;
    @service store;

    didValidate = false;
    nodeTitle = this.nodeTitle || null;
    projectSelectState = this.projectSelectState || ProjectSelectState.main;
    selected: Node | null = this.selected || null;
    showErrorMessage = this.showErrorMessage || null;
    projectList = A([]);
    newProject: Node = this.newProject;

    @alias('selected.public') isPublicProject;
    @bool('selected.links.relationships.parent') isChildNode;

    @computed('projectSelectState', 'newProject.validations.isValid', 'selected')
    get isValid(this: ProjectSelector): boolean {
        switch (this.get('projectSelectState')) {
        case ProjectSelectState.newProject:
            return this.get('newProject').get('validations.isValid');
        case ProjectSelectState.existingProject:
            return !!this.get('selected');
        default:
            return false;
        }
    }

    @action
    valueChanged(this: ProjectSelector, value?): void {
        if (value) {
            this.set('selected', value);

            if (this.get('projectSelectState') === ProjectSelectState.existingProject) {
                this.get('projectSelected')(value);
            }
        }

        this.validationChanged(this.get('isValid'));
    }

    @action
    changeState(this: ProjectSelector, projectSelectState: ProjectSelectState): void {
        const selected = projectSelectState === ProjectSelectState.newProject ? this.get('newProject') : null;

        this.setProperties({
            projectSelectState,
            selected,
        });

        if (selected) {
            this.get('projectSelected')(selected);
        }
    }
}
