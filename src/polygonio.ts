import * as _url from "url"
import * as _path from "path"
import fetch from "isomorphic-fetch"

export default class polygonio {
    constructor( public key: string ) {}
    public url: string = "https://api.polygon.io/";

    public async pullAll( date: string ): Promise<any[]> {
        let self = this;
        let endpoint = new _url.URL( self.url );
        endpoint.pathname = _path.resolve( "/v2/aggs/grouped/locale/us/market/stocks/",  date );
        endpoint.search = new _url.URLSearchParams({
            apiKey: self.key
        }).toString();
        let url = endpoint.toString();
        let response = await fetch( url ).then( response => response.json() );
        let data = response?.results;
        return data;
    }
}

export function tests( key: string ) {
    let context = new polygonio( key );
    return [{
        name: "pullAll_today_resolvesAllDataForToday",
        input: ["2021-08-19"],
        function: async ( input: any ) => {
            let output: any[] = await polygonio.prototype.pullAll.call( context, input );
            let result = (Array.isArray( output ) && output.length > 0)? true: false;
            return result;
        },
        output: true
    }];
}