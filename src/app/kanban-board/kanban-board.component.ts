import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CardStatus } from '@app/_enums/card-status';
import { Card } from '@app/_models';

@Component({
    selector: 'app-kanban-board',
    templateUrl: './kanban-board.component.html',
    styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent implements OnInit {
    @Input() cards: Card[];

    @Output() cardMoved = new EventEmitter<Card>();
    @Output() cardAdded = new EventEmitter<Card>();

    todo: Card[] = [];
    doing: Card[] = [];
    done: Card[] = [];

    constructor() { }

    ngOnInit(): void {
        if (Array.isArray(this.cards)) {
            this.cards.forEach(card => {
                if (card.status === CardStatus.Todo) {
                    this.todo.push(card);
                }
                else if (card.status === CardStatus.Doing) {
                    this.doing.push(card);
                }
                else if (card.status === CardStatus.Done) {
                    this.done.push(card);
                }
            });
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        // if previousValue is defined than this is not the initial load of the cards
        if (changes.cards.previousValue) {
            let cardAFound = false;
            let newCard: Card;

            changes.cards.currentValue.forEach(cardA => {
                cardAFound = false;
                changes.cards.previousValue.forEach(cardB => {
                    if (cardA.id === cardB.id) {
                        cardAFound = true;
                    }
                });
                if (!cardAFound) {
                    newCard = new Card();
                        newCard.id = cardA.id;
                        newCard.title = cardA.title;
                        newCard.description = cardA.description;
                        newCard.status = cardA.status;

                    if (newCard.status === CardStatus.Todo) {
                        this.todo.push(newCard);
                    }
                    else if (newCard.status === CardStatus.Doing) {
                        this.doing.push(newCard);
                    }
                    else if (newCard.status === CardStatus.Done) {
                        this.done.push(newCard);
                    }
                }
            });
        }
    }

    onAddClicked() {
        // Currently hard coded to test functionality
        let newCard = new Card();

        newCard.title = 'Will this work';
        newCard.description = 'Let\'s Go!';
        
        this.cardAdded.emit(newCard);
    }

    drop(event: CdkDragDrop<Card[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            // There has to be a better way to do this
            const movedCardElementId = event.item.element.nativeElement.children[0].children[0].id;
            let movedCardId = movedCardElementId.replace('kanban-card-', '');

            let selectedCard = this.cards.filter(c => {
                return c.id === parseInt(movedCardId)
            })[0];

            // Change card status
            selectedCard.status = this.deriveStatus(event.container.id);
          
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );

            this.cardMoved.emit(selectedCard);
        }
    }
    
    private deriveStatus(id: string): string {
        let status: string;

        if (id === 'todoDropList') {
            status = CardStatus.Todo;
        } else if (id === 'doingDropList') {
            status = CardStatus.Doing;
        } else {
            status = CardStatus.Done;
        }

        return status;
    }
}
