import Mysqli from "./lib/mysqli"
import Restify from "./lib/restify"
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
    console.log("Main initialized successfully!");
    let _path = path.resolve("../../etc/backend/db.json");
    let json = await new File( _path ).read();
    let db = JSON.parse( json );
    let database = new Mysqli( db );
    await database.connect();

    let api = new Restify({
        port: 3000,
        database,
        schema: [{
            database: "stocks",
            table: "data",
            id: "data_id",
            properties: [ 
                "close", 
                "high",
                "low",
                "timestamp",
                "transactions",
                "open",
                "ticker",
                "volume",
                "weight",
                "data_id"
            ]
        }]
    });

    await api.initialize();
}

main().catch(error => {
    console.log( error );
});
