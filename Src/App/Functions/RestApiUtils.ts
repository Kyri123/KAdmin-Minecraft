/**
 * Format the URL in an array for parameters
 * @param BaseUrl the URL
 * @param Splice first items that should remove (like v1/discord)
 * @return return a string array with the parameters. can be len 0
 */
export function RAH_ParseUrl(BaseUrl: string, Splice = 0): string[] {
    let EditedUrl = BaseUrl;
    if(EditedUrl.startsWith("/"))
        EditedUrl = EditedUrl.slice(1);
    if(EditedUrl.endsWith("/"))
        EditedUrl = EditedUrl.slice(0, EditedUrl.length - 1);

    let ReturnData: string[] = EditedUrl.split("/");
    if(Splice > 0)
        ReturnData.splice(0, Splice);
    return ReturnData;
}

/**
 * Generate a random ID
 * @param length
 * @constructor
 */
export function GenerateRndID(length: number) {
    let result: string = '';
    let characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength: number = characters.length;
    for (let i: number = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}