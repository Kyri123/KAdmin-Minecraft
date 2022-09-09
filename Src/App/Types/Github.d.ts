export interface GithubBuild extends Record<string, any> {
    "name"?: string,
    "path"?: string,
    "sha"?: string,
    "size"?: number,
    "url"?: string,
    "html_url"?: string,
    "git_url"?: string,
    "download_url"?: string,
    "type"?: string,
    "content"?: string
    "encoding"?: string,
    "_links"?: GithubBuild_Links,
    "valid": boolean
}

export interface GithubBuild_Links extends Record<string, any> {
    "self": string,
    "git": string,
    "html": string
}