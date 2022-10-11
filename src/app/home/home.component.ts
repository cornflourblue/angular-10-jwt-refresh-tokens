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

    onCardMoved(card: Card) {
        this.cardService.updateCard(card).subscribe();
    }

    onCardAdded(card: Card) {
        this.cardService.addCard(card).subscribe(card => {
            this.cardService.getAll().subscribe(cards => {
                this.loading = false;
                this.cards = cards;
            });
        });
    }
}