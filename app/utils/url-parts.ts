import param from './param';
import pathJoin from './path-join';

interface UrlParts {
    path: string;
    queryString?: string;
    fragment?: string;
}

export function splitUrl(url: string): UrlParts {
    const [, path, queryString, fragment] = url.match(
        /^([^?#]+)(?:\?([^#]+))?(?:#(.+))?$/,
    ) as Array<string | undefined>;

    return {
        path: path || '',
        queryString,
        fragment,
    };
}

export function joinUrl({ path, queryString, fragment }: UrlParts): string {
    const pathAndQuery = queryString ? `${path}?${queryString}` : path;
    return fragment ? `${pathAndQuery}#${fragment}` : pathAndQuery;
}

function deserializeQueryString(queryString: string): Record<string, string> {
    return queryString.split('&').reduce(
        (acc, q) => {
            if (q) {
                const [key, val] = q.split('=');
                acc[key] = val;
            }
            return acc;
        },
        {} as Record<string, string>,
    );
}

export function addQueryParam(url: string, key: string, value: string): string {
    const { path, queryString, fragment } = splitUrl(url);

    const queryParams = {
        ...deserializeQueryString(queryString || ''),
        [key]: value,
    };
    return joinUrl({
        path,
        queryString: param(queryParams),
        fragment,
    });
}

export function addPathSegment(url: string, segment: string): string {
    const { path, queryString, fragment } = splitUrl(url);
    return joinUrl({
        path: pathJoin(path, segment),
        queryString,
        fragment,
    });
}
