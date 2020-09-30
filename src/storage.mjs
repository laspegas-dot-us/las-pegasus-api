import fs from 'fs';
import path from 'path';
import isBase64 from 'is-base64';
'use strict';

export default class Storage {

    /*
     *  File structure example:
     *  - laspegasus/
     *     - songs/
     *        - 7e3cafa3-ec0b-4972-9491-309ac97ed6e4.mp3
     *        - c4e8e963-a667-4331-a2e8-71ee8dca61a4.mp3
     *     - arts/
     *        - 0aed4f4b-9366-4229-a09f-0ed7b5a8b5c4.png
     *     - bumpers/
     *        - b4099069-f116-4113-b1aa-ec2a537cb627.mp3
     *     - shows/
     *        - 564ea310-7fe0-4c17-8d80-f23ca28cc693.mp3
     *        - 7f156179-8ec9-4a85-b0ed-b79f21966cca.mp3
     */

    constructor(storage_path) {
        if (!storage_path.endsWith(path.sep))
            storage_path += path.sep;

        try {
            fs.accessSync(storage_path, fs.W_OK | fs.R_OK);
        } catch(e) {
            console.error(`WARNING: "${storage_path}" has no read and/or write access!`.bold.red);
        }

        this.path = storage_path;
    }

    save(filename, file_base64) {

        if (fs.existsSync(this.path + filename)) {
            console.error(`WARNING: Tried to overwrite "${this.path + filename}. Returning error.`.bold.red);
            return 'fatal';
        }

        if (!isBase64(file_base64))
            return 'not-b64';

        var bfrobj = Buffer.from(file_base64, 'base64');

        fs.writeFileSync(this.path + filename, bfrobj);
        bfrobj = null;

        return 'ok';

    }

    get(filename) {

        var bfrobj = fs.readFileSync(this.path + filename);
        return Buffer.from(bfrobj).toString('base64');

    }

}