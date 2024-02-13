/*
 * SPDX-FileCopyrightText: 2022-2023 European Data Protection Board (EDPB)
 *
 * SPDX-License-Identifier: EUPL-1.2
 */
import { FirstThirdCard } from "./firstthird-card.model";

export class LinksCard extends FirstThirdCard{
    public social : any[];
    public keywords : any[];

    constructor(links:any){
        super("All links", "links");
        super.firstParty = links.firstParty;
        super.thirdParty = links.thirdParty;
        this.social = links.social;
        this.keywords = links.keywords;
    }
}
