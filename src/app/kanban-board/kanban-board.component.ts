import { Component, Input, OnInit } from '@angular/core';
import { Card } from '@app/_models';

@Component({
    selector: 'app-kanban-board',
    templateUrl: './kanban-board.component.html',
    styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent implements OnInit {
    @Input() cards: Card[];

    constructor() { }

    ngOnInit(): void {
    }

    onAddClicked() {
        console.log('Add button was clicked.');
    }

}
