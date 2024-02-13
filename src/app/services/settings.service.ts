/*
 * SPDX-FileCopyrightText: 2022-2023 European Data Protection Board (EDPB)
 *
 * SPDX-License-Identifier: EUPL-1.2
 */
import { Injectable } from '@angular/core';
import { BrowserService } from './browser.service';

export type TestSLLType ='script' | 'docker';
export const allTestSLLType : TestSLLType[] = ['script' , 'docker'];

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  detaultUserAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36";

  _settings = {
    dnt : false,
    devTool : false,
    testssl : false,
    testssl_type : 'docker',
    test_ssl_location : "",
    cookies : false,
    localstorage : false,
    https : false,
    traffic : false,
    webform : false,
    beacons : false,
    logs : false,
    useragent:  "",
    help: false
  }

  constructor(
  ) { 
    const test_ssl_location = localStorage.getItem('test_ssl_location');
    const setAgent = localStorage.getItem('useragent');
    this._settings.useragent = setAgent == null || setAgent == "" ? this.detaultUserAgent  : setAgent;
    this._settings.dnt = localStorage.getItem('DNT') == 'true'? true : false ;
    this._settings.testssl = localStorage.getItem('testssl') == 'true'? true : false ;
    this._settings.testssl_type = localStorage.getItem('testssl_type') == 'script'? 'script' : 'docker' ;
    this._settings.test_ssl_location = test_ssl_location? test_ssl_location : "";
    this._settings.cookies = localStorage.getItem('cookies') == 'false'? false : true ;
    this._settings.localstorage = localStorage.getItem('localstorage') == 'false'?false : true ;
    this._settings.https = localStorage.getItem('https') == 'false'? false : true ;
    this._settings.traffic = localStorage.getItem('traffic') == 'false'? false : true ;
    this._settings.webform = localStorage.getItem('webform') == 'false'? false : true ;
    this._settings.beacons = localStorage.getItem('beacons') == 'false'? false : true ;
    this._settings.logs = localStorage.getItem('logs') == 'false'? false : true ;
    this._settings.help = localStorage.getItem('help') == 'false'? false : true ;
    this._settings.devTool = localStorage.getItem('devTool') == 'true'? true : false ;
  }
  setItem(key :string, value:any):void{
    localStorage.setItem(key, value);
  }

  setUsageAgent(event:any){
    if (event){
      localStorage.setItem('useragent', event.value);
    }
  }

  setTestSSLLocation(location:string){
    this._settings.test_ssl_location = location;
    localStorage.setItem('test_ssl_location', location);
  }

  get settings(){
    return this._settings;
  }
}
