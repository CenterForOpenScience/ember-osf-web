import Store from '@ember-data/store';
import { action } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import config from 'ember-osf-web/config/environment';
import { Item } from 'ember-osf-web/models/addon-operation-invocation';
import StorageManager from 'osf-components/components/storage-provider-manager/storage-manager/component';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

const {
    GOOGLE_FILE_PICKER_SCOPES,
    GOOGLE_FILE_PICKER_API_KEY,
    GOOGLE_FILE_PICKER_APP_ID,
} = config.OSF.googleFilePicker;

//
// 📚 Interface for Expected Arguments
//
interface Args {
  /**
   * selectFolder
   *
   * @description
   * A callback function passed into the component
   * that accepts a partial Item object and handles it (e.g., selects a file).
   */
  selectFolder?: (a: Partial<Item>) => void;
  onRegisterChild?: (a: GoogleFilePickerWidget) => void;
  selectedFolderName?: string;
  isFolderPicker: boolean;
  rootFolderId: string;
  manager: StorageManager;
  accountId: string;
}

//
// 📚 Extend Global Window Type
//
// Declares that `window` can optionally have a GoogleFilePickerWidget instance.
// This allows safe typing when accessing it elsewhere.
//
declare global {
  interface Window {
    GoogleFilePickerWidget?: GoogleFilePickerWidget;
    gapi?: any;
    google?: any;
  }
}

//
// GoogleFilePickerWidget Component
//
// @description
// An Ember Glimmer component that exposes itself to the global `window`
// so that external JavaScript (like Google Picker API callbacks)
// can interact with it directly.
//
export default class GoogleFilePickerWidget extends Component<Args> {
    @service intl!: Intl;
    @service store!: Store;
    @tracked folderName!: string | undefined;
    @tracked isFolderPicker = false;
    @tracked openGoogleFilePicker = false;
    @tracked visible = false;
    @tracked isGFPDisabled = true;
    pickerInited = false;
    selectFolder: any = undefined;
    accessToken!: string;
    scopes = GOOGLE_FILE_PICKER_SCOPES;
    apiKey = GOOGLE_FILE_PICKER_API_KEY;
    appId = GOOGLE_FILE_PICKER_APP_ID;
    mimeTypes = '';
    parentId = '';
    isMultipleSelect: boolean;
    title!: string;

    /**
     * Constructor
     *
     * @description
     * Initializes the GoogleFilePickerWidget component and exposes its key methods to the global `window` object
     * for integration with external JavaScript (e.g., Google Picker API).
     *
     * - Sets `window.GoogleFilePickerWidget` to the current component instance (`this`),
     *   allowing external scripts to call methods like `filePickerCallback()`.
     * - Captures the closure action `selectFolder` from `this.args` and assigns it directly to `window.selectFolder`,
     *   preserving the correct closure reference even outside of Ember's internal context.
     *
     * @param owner - The owner/context passed by Ember at component instantiation.
     * @param args - The arguments passed to the component, including closure actions like `selectFolder`.
     */
    constructor(owner: unknown, args: Args) {
        super(owner, args);

        window.GoogleFilePickerWidget = this;
        this.selectFolder = this.args.selectFolder;
        this.mimeTypes = this.args.isFolderPicker ? 'application/vnd.google-apps.folder' : '';
        this.parentId = this.args.isFolderPicker ? '': this.args.rootFolderId;
        this.title = this.args.isFolderPicker ?
            this.intl.t('addons.configure.google-file-picker.root-folder-title') :
            this.intl.t('addons.configure.google-file-picker.file-folder-title');
        this.isMultipleSelect = !this.args.isFolderPicker;
        this.isFolderPicker = this.args.isFolderPicker;


        this.folderName = this.args.selectedFolderName;

        taskFor(this.loadOauthToken).perform();
    }

    @task
    @waitFor
    private async loadOauthToken(): Promise<void>{
        if (this.args.accountId) {
            const authorizedStorageAccount = await this.store.
                findRecord('authorized-storage-account', this.args.accountId);
            authorizedStorageAccount.serializeOauthToken = true;
            const token = await authorizedStorageAccount.save();
            this.accessToken = token.oauthToken;
            this.isGFPDisabled = this.accessToken ? false : true;
        }
    }

    /**
     * filePickerCallback
     *
     * @description
     * Action triggered when a file is selected via an external picker.
     * Logs the file data and notifies the parent system by calling `selectFolder`.
     *
     * @param file - The file object selected (format determined by external API)
     */
    @action
    filePickerCallback(data: any) {
        if (this.selectFolder !== undefined) {
            this.folderName = data.name;
            this.selectFolder({
                itemName: data.name,
                itemId: data.id,
            });
        } else {
            this.args.manager.reload();
        }
    }

    @action
    registerComponent() {
        if (this.args.onRegisterChild) {
            this.args.onRegisterChild(this); // Pass the child's instance to the parent
        }
    }

    willDestroy() {
        super.willDestroy();
        this.pickerInited = false;
    }


    /**
    * Callback after api.js is loaded.
    */
    gapiLoaded() {
        window.gapi.load('client:picker', this.initializePicker.bind(this));
    }

    /**
    * Callback after the API client is loaded. Loads the
    * discovery doc to initialize the API.
    */
    async initializePicker() {
        this.pickerInited = true;
        if (this.isFolderPicker) {
            this.visible = true;
        }
    }

    /**
    *  Create and render a Picker object for searching images.
    */
    @action
    createPicker() {
        const googlePickerView = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS);
        googlePickerView.setSelectFolderEnabled(true);
        googlePickerView.setMimeTypes(this.mimeTypes);
        googlePickerView.setIncludeFolders(true);
        googlePickerView.setParent(this.parentId);

        const picker = new window.google.picker.PickerBuilder()
            .enableFeature(this.isMultipleSelect ? window.google.picker.Feature.MULTISELECT_ENABLED : '')
            .setDeveloperKey(this.apiKey)
            .setAppId(this.appId)
            .addView(googlePickerView)
            .setTitle(this.title)
            .setOAuthToken(this.accessToken)
            .setCallback(this.pickerCallback.bind(this))
            .build();
        picker.setVisible(true);
    }

    /**
    * Displays the file details of the user's selection.
    * @param {object} data - Containers the user selection from the picker
    */
    async pickerCallback(data: any) {
        if (data.action === window.google.picker.Action.PICKED) {
            this.filePickerCallback(data.docs[0]);
        }
    }
}


