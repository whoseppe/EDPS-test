/*
 * SPDX-FileCopyrightText: 2022-2023 European Data Protection Board (EDPB)
 *
 * SPDX-License-Identifier: EUPL-1.2
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportComponent } from './report.component';
import { MaterialAllModule } from 'src/app/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportRendererComponent } from './report-renderer/report-renderer.component';
import 'tinymce';
import { ReportModule } from './report.module';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportComponent, ReportRendererComponent ],
      imports:      [MaterialAllModule, RouterTestingModule, SharedModule, ReportModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
