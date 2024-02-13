/*
 * SPDX-FileCopyrightText: 2022-2023 European Data Protection Board (EDPB)
 *
 * SPDX-License-Identifier: EUPL-1.2
 */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CookieKnowledge } from 'src/app/models/knowledges/cookie-knowledge.model';
import { KnowledgeBase } from 'src/app/models/knowledgeBase.model';
import { KnowledgeBaseService } from 'src/app/services/knowledge-base.service';
import { CookieKnowledgesService } from 'src/app/services/knowledges/cookie-knowledges.service';
import { Knowledge } from 'src/app/models/knowledge.model';
import { LocalStorageKnowledge } from 'src/app/models/knowledges/localstorage-knowledge.model';
import { LocalstorageKnowledgesService } from 'src/app/services/knowledges/localstorage-knowledges.service';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {
  base: KnowledgeBase = new KnowledgeBase(0, "", "", "", new Date());
  knowledges: Knowledge[] = [];
  cookieKnowledges : CookieKnowledge[] = [];
  localStorageKnowledges : LocalStorageKnowledge[] = [];
  
  entryForm: FormGroup = new FormGroup({
    category: new FormControl(),
    domain: new FormControl(),
    key:new FormControl(),
    script:new FormControl(),
    name: new FormControl(),
    source: new FormControl(),
    controller: new FormControl(),
    policy: new FormControl(),
    reference: new FormControl(),
    comment: new FormControl()
  });

  showForm = false;
  editMode: 'edit' | 'new' = 'edit';
  selectedKnowledgeId: number | null = 0;
  categories: string[] = ["Targeted advertising", "Non-Targeted advertising", "Technical", "Analytics (exempted)", "Analytics (non exempted)", "Social media", "Content customisation", "?"];
  itemsSelected: number[] = [];
  KnowledgesService : CookieKnowledgesService | LocalstorageKnowledgesService;

  constructor(
    private cookieKnowledgesService: CookieKnowledgesService,
    private localStorageKnowledgeService:LocalstorageKnowledgesService,
    private knowledgeBaseService: KnowledgeBaseService,
    private route: ActivatedRoute
  ) { 

    this.KnowledgesService = this.cookieKnowledgesService;
  }

  ngOnInit(): void {
    const sectionId = parseInt(this.route.snapshot.params['id'], 10);

    this.knowledgeBaseService
      .get(sectionId)
      .then((base: KnowledgeBase) => {
        this.base = base;
        this.KnowledgesService = base.category == 'cookie'? this.cookieKnowledgesService : this.localStorageKnowledgeService;

        // GET Knowledges entries from selected base
        this.KnowledgesService
          .getEntries(this.base.id)
          .then((result: Knowledge[]) => {
            this.knowledges = result;
            if (base.category == 'cookie'){
              this.cookieKnowledges =result as CookieKnowledge[];
            }else if (base.category == 'localstorage'){
              this.localStorageKnowledges =result as LocalStorageKnowledge[];
            }
          });
      })
      .catch((error: Error) => {
        console.log(error);

      });

  }

  duplicate(id: number): void {
    this.KnowledgesService
      .duplicate(this.base.id, id)
      .then((entry: Knowledge) => {
        this.knowledges.push(entry);
      })
      .catch(err => {
        console.error(err);
      });
  }

  delete(id: number): void {
    this.KnowledgesService
      .delete(id)
      .then(() => {
        const index = this.knowledges.findIndex(e => e.id === id);
        if (index !== -1) {
          this.knowledges.splice(index, 1);
        }
      })
      .catch(() => {
        return;
      });
  }

  /**
   * One shot update
   */
  focusOut(): void {
    if (this.selectedKnowledgeId) {
      this.KnowledgesService
        .find(this.selectedKnowledgeId)
        .then((res: Knowledge) => {
          let entry : any;
          
          if (this.base.category == 'cookie'){
            const cookieKnowledge = res as CookieKnowledge;
            cookieKnowledge.domain = this.entryForm.value.domain;
            cookieKnowledge.name = this.entryForm.value.name;
            cookieKnowledge.source = this.entryForm.value.source;
            cookieKnowledge.controller = this.entryForm.value.controller;
            cookieKnowledge.policy = this.entryForm.value.policy;
            cookieKnowledge.category = this.entryForm.value.category;
            cookieKnowledge.reference = this.entryForm.value.reference;
            cookieKnowledge.comment = this.entryForm.value.comment;
            cookieKnowledge.knowledge_base_id = this.base.id;
            entry = cookieKnowledge;
          }else if (this.base.category == 'localstorage'){
            const localStorageKnowledge = res as LocalStorageKnowledge;
            localStorageKnowledge.key = this.entryForm.value.key;
            localStorageKnowledge.script = this.entryForm.value.script;
            localStorageKnowledge.source = this.entryForm.value.source;
            localStorageKnowledge.controller = this.entryForm.value.controller;
            localStorageKnowledge.policy = this.entryForm.value.policy;
            localStorageKnowledge.category = this.entryForm.value.category;
            localStorageKnowledge.reference = this.entryForm.value.reference;
            localStorageKnowledge.comment = this.entryForm.value.comment;
            localStorageKnowledge.knowledge_base_id = this.base.id;
            entry = localStorageKnowledge;
          }else{
            throw new Error();
          }

          // Update object
          this.KnowledgesService
            .update(entry)
            .then(() => {
              // Update list
              const index = this.knowledges.findIndex(e => e.id === entry.id);
              if (index !== -1) {
                this.knowledges[index] = entry;
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  /**
   * Create a new Knowledge entry
   */
  onSubmit(): void {
    let entry : any = null;
    if (this.base.category == 'cookie'){
      entry = new CookieKnowledge();
      entry.domain = this.entryForm.value.domain;
      entry.name = this.entryForm.value.name;
      entry.source = this.entryForm.value.source;
      entry.controller = this.entryForm.value.controller;
      entry.policy = this.entryForm.value.policy;
      entry.category = this.entryForm.value.category;
      entry.reference = this.entryForm.value.reference;
      entry.comment = this.entryForm.value.comment;
      entry.created_at = new Date();
      entry.updated_at = entry.created_at;
    }else if (this.base.category == 'localstorage'){
      entry = new LocalStorageKnowledge();
      entry.key = this.entryForm.value.key;
      entry.script = this.entryForm.value.script;
      entry.source = this.entryForm.value.source;
      entry.controller = this.entryForm.value.controller;
      entry.policy = this.entryForm.value.policy;
      entry.category = this.entryForm.value.category;
      entry.reference = this.entryForm.value.reference;
      entry.comment = this.entryForm.value.comment;
      entry.created_at = new Date();
      entry.updated_at = entry.created_at;
    }else{
      throw new Error();
    }


    this.KnowledgesService
      .add(this.base.id, entry)
      .then((result: Knowledge) => {
        this.knowledges.push(result);
        this.entryForm.reset();
        this.showForm = false;
        this.editEntry(result.id); // Go to edition mode*/
      });
  }

  /**
 * Open form in edition mode, with preset values
 * @param id Knowledge entry's id
 */
  editEntry(id: number): void {
    if (id) {
      this.selectedKnowledgeId = id;
      this.KnowledgesService
        .find(id)
        .then((result: CookieKnowledge | LocalStorageKnowledge) => {
          
          if (this.base.category=='cookie'){
            result = result as CookieKnowledge;
            this.entryForm.controls['domain'].setValue(result.domain);
            this.entryForm.controls['name'].setValue(result.name);
          }else if (this.base.category=='localstorage'){
            result = result as LocalStorageKnowledge;
            this.entryForm.controls['key'].setValue(result.key);
            this.entryForm.controls['script'].setValue(result.script);
          }


          this.entryForm.controls['source'].setValue(result.source);
          this.entryForm.controls['controller'].setValue(result.controller);
          this.entryForm.controls['category'].setValue(result.category);
          this.entryForm.controls['policy'].setValue(result.policy);
          this.entryForm.controls['reference'].setValue(result.reference);
          this.entryForm.controls['comment'].setValue(result.comment);
          this.itemsSelected = [];

          this.editMode = 'edit';
          this.showForm = true;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  sortBy(sort: Sort): void {

  }

}
