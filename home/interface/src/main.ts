import test from "./devlib/test"
import * as polygonio from "./polygonio"
import fs from "fs"
import path from "path"

class File {
    constructor ( public name: string ) {}
    public save( contents: string ): Promise<void> {
        let self = this;
        return new Promise(( resolve, reject ) => {
            fs.writeFile( self.name, new Uint8Array(Buffer.from( contents )), ( error ) => {
                if ( error ) {
                    reject( error );
                } else {
                    resolve();
                }
            });
        });
    }
    public read(): Promise<string> {
        let self = this;
        return new Promise(( resolve, reject ) => {
            fs.readFile( self.name, "utf-8", ( error, data ) => {
                if ( error ) { 
                    reject(new Error("That file does not exist."));
                } else {
                    resolve( data );
                }
            });
        });
    }
}

async function main() {
    let _path = path.resolve( "../../etc/interface/apikey.json" );
    let json: string = await new File( _path ).read();
    let apiKey: string = JSON.parse( json )?.key;
    await test(polygonio.tests( apiKey ));
}

main().catch(( error ) => {
    console.log( error );
});