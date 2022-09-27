import { Component } from '@angular/core';

import { Card } from '@app/_models';
import { CardService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    cards: Card[];

    constructor(private cardService: CardService) { }

    ngOnInit() {
        this.loading = true;

        this.cardService.getAll().subscribe(cards => {
            this.loading = false;
            this.cards = cards;
        });
    }
}