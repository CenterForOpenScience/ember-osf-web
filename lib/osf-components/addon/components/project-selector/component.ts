import { A } from '@ember/array';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { restartableTask, task, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import DS from 'ember-data';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';

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
export default class ProjectSelector extends Component {
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;
    @service analytics!: Analytics;

    // Required arguments
    newProject!: Node;
    @requiredAction projectSelected!: (value: Node) => void;
    @requiredAction validationChanged!: (isValid: boolean) => void;
    @requiredAction moveToNewProject!: () => unknown;

    // Optional arguments
    nodeTitle: string | null = null;
    projectSelectState: string = ProjectSelectState.main;
    selected: Node | null = null;
    showErrorMessage: boolean = false;

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

    @task
    async initialLoad() {
        this.setProperties({
            didValidate: false,
            selected: null,
            projectList: await taskFor(this.findNodes).perform(),
        });
    }

    @restartableTask
    async findNodes(filter?: string) {
        if (filter) {
            await timeout(250);
        }

        const { user } = this.currentUser;
        if (!user) {
            return [];
        }

        const nodes = await user.queryHasMany('nodes', {
            embed: ['storage'],
            filter: filter ? { title: filter } : undefined,
        });

        return nodes;
    }

    didReceiveAttrs(this: ProjectSelector) {
        if (this.projectSelectState === ProjectSelectState.main) {
            taskFor(this.initialLoad).perform();
        }
    }

    @action
    valueChanged(value?: Node): void {
        if (value) {
            this.set('selected', value);

            if (this.projectSelectState === ProjectSelectState.existingProject) {
                this.projectSelected(value);
            }
        }

        this.validationChanged(this.isValid);
    }

    @action
    changeState(projectSelectState: ProjectSelectState): void {
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
    moveToNew() {
        this.moveToNewProject();
    }
}
