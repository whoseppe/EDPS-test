/*
 * SPDX-FileCopyrightText: 2022-2023 European Data Protection Board (EDPB)
 *
 * SPDX-License-Identifier: EUPL-1.2
 */
import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { DetailsService } from 'src/app/services/details.service';
import { KnowledgeBaseService } from 'src/app/services/knowledge-base.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.scss']
})
export class LogDetailsComponent implements OnInit, OnDestroy {

  constructor(
    public settingService: SettingsService,
    public detailsService: DetailsService,
    public knowledgeBaseService: KnowledgeBaseService,
    private bottomSheetRef: MatBottomSheetRef<LogDetailsComponent>
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.detailsService.detailsData = null;
  }
  
  closeBottomSheet() {
    this.bottomSheetRef.dismiss();
  }
}
