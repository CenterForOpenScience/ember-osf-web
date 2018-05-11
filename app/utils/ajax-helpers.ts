import config from 'ember-get-config';
import RSVP from 'rsvp';

const {
    OSF: {
        apiHeaders,
    },
} = config;

/**
 * Performs an AJAX request with any additional authorization config as needed
 * for the configured authorization type.
 */
export default function authenticatedAJAX(
    options: JQuery.AjaxSettings,
    addApiHeaders: boolean = true,
): RSVP.Promise<any> {
    const opts = { ...options };

    if (addApiHeaders) {
        opts.headers = {
            ...apiHeaders,
            ...opts.headers,
        };
    }

    opts.xhrFields = {
        withCredentials: true,
        ...opts.xhrFields,
    };

    // Return RSVP.Promise so the callbacks are run within the current runloop
    return new RSVP.Promise((resolve, reject) => $.ajax(opts).then(resolve).catch(reject));
}

/**
 * Modify a given XMLHttpRequest to add the current user's authorization.
 */
export function authorizeXHR(xhr: XMLHttpRequest, addApiHeaders: boolean = true): void {
    if (addApiHeaders) {
        Object.entries(apiHeaders).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
        });
    }
    xhr.withCredentials = true; // eslint-disable-line no-param-reassign
}
