import https = require('https');

type ERGetOptions = {
    host: string,
    path?: string,
    port?: number,
    headers?: {
        Authorization?: string,
        Accept?: string
    }
};

async function get(options: ERGetOptions): Promise<{
    body: null | string,
    headers: null | Object
} | Error> {
    return new Promise((resolve) => {

        const req = https.request(options, res => {
            var str = '';
            res.on('data', d => str += d);
            res.on('end', function() {
                var result: {
                    body: null | string,
                    headers: null | Object
                } = {
                    body: null,
                    headers: res.headers
                };
                result.body = str;

                resolve(result);
            });
        })

        req.on('error', error => {
            resolve(error)
        });

        req.end();

    });
}

export = {
    get
};