import { A } from '@ember/array';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import { StorageStatus } from 'ember-osf-web/models/node-storage';
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
    nodeTitle: string | null = defaultTo(this.nodeTitle, null);
    projectSelectState: string = defaultTo(this.projectSelectState, ProjectSelectState.main);
    selected: Node | null = defaultTo(this.selected, null);
    showErrorMessage: boolean = defaultTo(this.showErrorMessage, false);

    // Private properties
    didValidate = false;
    projectList = A([]);

    @alias('selected.public') isPublicProject!: boolean;
    @bool('selected.links.relationships.parent') isChildNode!: boolean;

    @computed('selected.storage.storageLimitStatus', 'isPublicProject')
    get fileMovable(): boolean {
        const storageStatus = this.selected!.storage.storageLimitStatus;
        if (storageStatus === StorageStatus.DEFAULT) {
            return true;
        }
        if (storageStatus === StorageStatus.OVER_PUBLIC) {
            return false;
        }
        if (storageStatus === StorageStatus.OVER_PRIVATE) {
            if (this.isPublicProject) {
                return true;
            }
            return false;
        }
        return true;
    }

    @computed('selected.storage.storageLimitStatus', 'fileMovable')
    get fileMoveMessage(): string {
        const storageStatus = this.selected!.storage.storageLimitStatus;
        if (storageStatus === StorageStatus.DEFAULT) {
            return '';
        }
        if (!this.fileMovable) {
            return 'move_to_project.storage_limit.error';
        }
        return 'move_to_project.storage_limit.warning';
    }

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

    @task({ withTestWaiter: true })
    initialLoad = task(function *(this: ProjectSelector) {
        this.setProperties({
            didValidate: false,
            selected: null,
            projectList: yield this.get('findNodes').perform(),
        });
    });

    @task({ withTestWaiter: true, restartable: true })
    findNodes = task(function *(this: ProjectSelector, filter?: string) {
        if (filter) {
            yield timeout(250);
        }

        const { user } = this.currentUser;
        if (!user) {
            return [];
        }

        const nodes = yield user.queryHasMany('nodes', {
            embed: ['storage'],
            filter: filter ? { title: filter } : undefined,
        });

        return nodes;
    });

    didReceiveAttrs(this: ProjectSelector) {
        if (this.projectSelectState === ProjectSelectState.main) {
            this.get('initialLoad').perform();
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
