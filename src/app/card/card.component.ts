import { Component, Input, OnInit } from '@angular/core';
import { Card } from '@app/_models';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
    @Input() card: Card;

    isActive: boolean;

    constructor() { }

    ngOnInit(): void {
        this.isActive = false;
    }

    onDeleteClicked() {
        console.log('Delete button was clicked.');
    }

    onEditClicked() {
        console.log('Edit button was clicked.');
    }
}
