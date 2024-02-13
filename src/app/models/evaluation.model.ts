/*
 * SPDX-FileCopyrightText: 2022-2023 European Data Protection Board (EDPB)
 *
 * SPDX-License-Identifier: EUPL-1.2
 */
export type Status ='pending' | 'TBD' | 'not_compliant' | 'compliant';
export const allStatus : Status[] = ['pending' , 'TBD' , 'not_compliant' , 'compliant'];

export class Evaluation {
    public id: number=0;
    public status: Status = 'pending'; 
    public created_at:Date = new Date();
    public updated_at:Date = new Date();
    public evaluation_comment: string="";
}
