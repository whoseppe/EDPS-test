/*
 * SPDX-FileCopyrightText: 2022-2023 European Data Protection Board (EDPB)
 *
 * SPDX-License-Identifier: EUPL-1.2
 */
import { Component, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowserService } from 'src/app/services/browser.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent {
  localStorage:any=null;
  
  SSLLocation: FormGroup = new FormGroup({
    ssl_location: new FormControl('', [])
  });

  constructor(
    private el: ElementRef,
    public settingService : SettingsService,
    public browserService : BrowserService
  ) { 
    this.localStorage =localStorage;

  }

  checkSSLLocation(event:any) :void{
    if (event.target.files[0].path){
      this.settingService.setTestSSLLocation(event.target.files[0].path)
      this.browserService.updateSettings();
    }
  }

  getSSLLocation(event?: any):void{
    if (event) {
      
    } else {
      this.el.nativeElement.querySelector('#ssl_location').click();
    }
  }
}
