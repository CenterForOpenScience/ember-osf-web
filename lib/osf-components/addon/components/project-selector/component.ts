import { action, computed } from '@ember-decorators/object';
import { alias, bool } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

/**
 * @module ember-osf-web
 * @submodule components
 */

export enum ProjectSelectState {
    main = 'main',
    newProject = 'newProject',
    newProjectSelected = 'newProjectSelected',
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
@layout(template, styles)
export default class ProjectSelector extends Component.extend({
    initialLoad: task(function *(this: ProjectSelector) {
        this.setProperties({
            didValidate: false,
            selected: null,
            projectList: yield this.get('findNodes').perform(),
        });
    }),

    findNodes: task(function *(this: ProjectSelector, filter?: string) {
        if (filter) {
            yield timeout(250);
        }

        const { user } = this.currentUser;
        if (!user) {
            return [];
        }

        const nodes = yield user.queryHasMany('nodes', {
            filter: filter ? { title: filter } : undefined,
        });

        return nodes;
    }).restartable(),
}) {
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;
    @service store!: DS.Store;
    @service analytics!: Analytics;

    // Required arguments
    newProject!: Node;
    @requiredAction projectSelected!: (value: Node) => void;
    @requiredAction validationChanged!: (isValid: boolean) => void;
    @requiredAction moveToNewProject!: () => unknown;

    // Optional arguments
    nodeTitle: string | null = defaultTo(this.nodeTitle, null);
    projectSelectState: string = defaultTo(this.projectSelectState, ProjectSelectState.main);
    selected: Node | null = defaultTo(this.selected, null);
    showErrorMessage: boolean = defaultTo(this.showErrorMessage, false);

    // Private properties
    didValidate = false;
    projectList = A([]);

    @alias('selected.public') isPublicProject!: boolean;
    @bool('selected.links.relationships.parent') isChildNode!: boolean;

    @computed('projectSelectState', 'newProject.validations.isValid', 'selected')
    get isValid(): boolean {
        switch (this.projectSelectState) {
        case ProjectSelectState.newProject:
            return this.newProject.validations.isValid;
        case ProjectSelectState.newProjectSelected:
            return this.newProject.validations.isValid;
        case ProjectSelectState.existingProject:
            return !!this.selected;
        default:
            return false;
        }
    }

    didReceiveAttrs(this: ProjectSelector) {
        if (this.projectSelectState === ProjectSelectState.main) {
            this.get('initialLoad').perform();
        }
    }

    @action
    valueChanged(this: ProjectSelector, value?: Node): void {
        if (value) {
            this.set('selected', value);

            if (this.projectSelectState === ProjectSelectState.existingProject) {
                this.projectSelected(value);
            }
        }

        this.validationChanged(this.isValid);
    }

    @action
    changeState(this: ProjectSelector, projectSelectState: ProjectSelectState): void {
        const selected = projectSelectState === ProjectSelectState.newProjectSelected ? this.newProject : null;
        this.setProperties({
            projectSelectState,
            selected,
        });

        if (selected) {
            this.projectSelected(selected);
        }
    }

    @action
    prevent(event: Event) {
        event.preventDefault();
        return false;
    }

    @action
    moveToNew(this: ProjectSelector) {
        this.moveToNewProject();
    }
}
