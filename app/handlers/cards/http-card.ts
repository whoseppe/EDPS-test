/*
 * SPDX-FileCopyrightText: 2022-2023 European Data Protection Board (EDPB)
 *
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * Based on https://github.com/EU-EDPS/website-evidence-collector/blob/master/collector/connection.js
 * from the Website Evidence Collector (https://github.com/EU-EDPS/website-evidence-collector)
 */

import * as url from 'url';
import * as got from 'got';
import { Collector } from "../collectors/collector";
import { Card } from "./card";

export class HTTPCard extends Card {
    _callback = null;
    _secure_connection = null;

    enable() {
        this._callback = this.launch.bind(this);
        this.collector.domReadyCallbacks.push(this._callback);
    }

    disable() {
        const index = this.collector.domReadyCallbacks.indexOf(this._callback);
        this.collector.onBeforeRequestCallbacks.splice(index, 1);
        this._callback = null;
    }

    constructor(collector: Collector) {
        super("https", collector);
    }

    override clear() {
        this._secure_connection = null;
    }

    override async launch(){
        const secure_connection: any = {};

        async function gotWrapper() {
            return await import("got");
        }

        try {
            const uri_ins_https = new url.URL(this.collector.contents.getURL());
            
            uri_ins_https.protocol = "https:";
             // @ts-ignore
            await got(uri_ins_https, {
                followRedirect: false,
            });
            secure_connection.https_support = true;

        } catch (error) {
            secure_connection.https_support = false;
            secure_connection.https_error = error.toString();
            if (this.logger.writable == true)
            this.logger.log("error", error.message, { type: "http-card" });
        }
        // test if server redirects http to https
        try {
            const uri_ins_http = new url.URL(this.collector.contents.getURL());
            const got = await gotWrapper();
            uri_ins_http.protocol = "http:";
             // @ts-ignore
            let res = await got(uri_ins_http, {
                followRedirect: true,
                // ignore missing/wrongly configured SSL certificates when redirecting to
                // HTTPS to avoid reporting SSL errors in the output field http_error
                https: {
                    rejectUnauthorized: false,
                },
            });

            secure_connection.redirects = res.redirectUrls.map(x => x.toString());

            if (secure_connection.redirects.length > 0) {
                let last_redirect_url = new url.URL(
                    secure_connection.redirects[
                    secure_connection.redirects.length - 1
                    ]
                );
                secure_connection.https_redirect =
                    last_redirect_url.protocol.includes("https");
            } else {
                secure_connection.https_redirect = false;
            }
        } catch (error) {
            secure_connection.http_error = error.toString();
            if (this.logger.writable == true)
            this.logger.log("error", error.message, { type: "http-card" });
        }

        this._secure_connection = secure_connection;
    }

    inspect(output) {
        output.secure_connection= this._secure_connection;
    }
}