import { randomStaticGravatar } from '../utils';

/* eslint-disable max-len */
export default [
    {
        links: {},
        url: 'https://www.box.com',
        image: randomStaticGravatar(),
        name: 'Box',
        categories: ['storage'],
        auth: {
            type: 'oauth',
            help_info: null,
            oauth_url: 'https://www.box.com',
        },
        description:
            'Box is a file storage add-on. Connect your Box account to an OSF project to interact with files hosted on Box via the OSF.',
        type: 'addon',
        id: 'box',
    },
    {
        links: {},
        url: 'https://dataverse.harvard.edu/',
        image: randomStaticGravatar(),
        name: 'Dataverse',
        categories: ['storage'],
        auth: {
            type: 'token_auth',
            help_info: '/dataverseuser.xhtml?selectTab=apiTokenTab',
            oauth_url: null,
        },
        description:
            'Dataverse is an open source software application to share, cite, and archive data. Connect your Dataverse account to share your Dataverse datasets via the OSF.',
        type: 'addon',
        id: 'dataverse',
    },
    {
        links: {},
        url: 'https://www.dropbox.com',
        image: randomStaticGravatar(),
        name: 'Dropbox',
        categories: ['storage'],
        auth: {
            type: 'oauth',
            help_info: null,
            oauth_url: 'https://www.dropbox.com',
        },
        description:
            'Dropbox is a file storage add-on. Connect your Dropbox account to an OSF project to interact with files hosted on Dropbox via the OSF.',
        type: 'addon',
        id: 'dropbox',
    },
    {
        links: {},
        url: 'https://www.figshare.com',
        image: randomStaticGravatar(),
        name: 'figshare',
        categories: ['storage'],
        auth: {
            type: 'oauth',
            help_info: null,
            oauth_url: 'https://www.figshare.com',
        },
        description:
            'Figshare is an online digital repository. Connect your figshare account to share your figshare files along with other materials in your OSF project.',
        type: 'addon',
        id: 'figshare',
    },
    {
        links: {},
        url: 'https://www.github.com',
        image: randomStaticGravatar(),
        name: 'GitHub',
        categories: ['storage'],
        auth: {
            type: 'oauth',
            help_info: null,
            oauth_url: 'https://www.box.com',
        },
        description:
            'GitHub is a web-based Git repository hosting service. Connect your GitHub repo to your OSF project to share your code alongside other materials in your OSF project.',
        type: 'addon',
        id: 'github',
    },
    {
        links: {},
        url: 'https://www.gitlab.com',
        image: randomStaticGravatar(),
        name: 'GitLab',
        categories: ['storage'],
        auth: {
            type: 'token_auth',
            help_info: '/profile/personal_access_tokens',
            oauth_url: null,
        },
        description:
            'GitLab is a web-based Git repository hosting service. Connect your GitLab repo to your OSF project to share your code alongside other materials in your OSF project.',
        type: 'addon',
        id: 'gitlab',
    },
    {
        links: {},
        url: 'https://www.mendeley.com',
        image: randomStaticGravatar(),
        name: 'Mendeley',
        auth: {
            type: 'oauth',
            help_info: null,
            oauth_url: 'https://www.box.com',
        },
        categories: ['citations'],
        description:
            'Mendeley is a reference management tool. Connecting Mendeley folders to OSF projects allows you and others to view, copy, and download citations that are relevant to your project from the Project Overview page.',
        type: 'addon',
        id: 'mendeley',
    },
    {
        links: {},
        url: 'https://www.zotero.org',
        image: randomStaticGravatar(),
        name: 'Zotero',
        auth: {
            type: 'oauth',
            help_info: null,
            oauth_url: 'https://www.box.com',
        },
        categories: ['citations'],
        description:
            'Zotero is a reference management tool. Connecting Zotero folders to OSF projects allows you and others to view, copy, and download citations that are relevant to your project from the Project Overview page.',
        type: 'addon',
        id: 'zotero',
    },
    {
        links: {},
        url: 'https://owncloud.org/',
        image: randomStaticGravatar(),
        name: 'ownCloud',
        categories: ['storage'],
        auth: {
            type: 'user_auth',
            help_info: null,
            oauth_url: null,
        },
        description:
            'ownCloud is an open source, self-hosted file sync and share app platform. Connect your ownCloud account to an OSF project to interact with files hosted on ownCloud via the OSF.',
        type: 'addon',
        id: 'owncloud',
    },
    {
        links: {},
        url: 'https://aws.amazon.com/s3/',
        image: randomStaticGravatar(),
        name: 'Amazon S3',
        categories: ['storage'],
        auth: {
            type: 'key_auth',
            help_info: null,
            oauth_url: null,
        },
        description:
            'Amazon S3 is a file storage add-on. Connect your S3 account to an OSF project to interact with files hosted on S3 via the OSF.',
        type: 'addon',
        id: 's3',
    },
    {
        links: {},
        url: 'https://drive.google.com',
        image: randomStaticGravatar(),
        name: 'Google Drive',
        categories: ['storage'],
        auth: {
            type: 'oauth',
            help_info: null,
            oauth_url: 'https://www.google.com',
        },
        description:
            'Google Drive is a file storage add-on. Connect your Google Drive account to an OSF project to interact with files hosted on Google Drive via the OSF.',
        type: 'addon',
        id: 'googledrive',
    },
];
/* eslint-enable */
