import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { CardStatus } from '@app/_enums/card-status';
import { Card } from '@app/_models';
import { CardService } from '@app/_services';

@Component({
    selector: 'app-kanban-board',
    templateUrl: './kanban-board.component.html',
    styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent implements OnInit {
    loading = false;

    todo: Card[] = [];
    doing: Card[] = [];
    done: Card[] = [];

    constructor(private cardService: CardService) { }

    ngOnInit(): void {
        this.loading = true;
        
        this.cardService.getAll().subscribe(cards => {
            this.loading = false;
            this.categorizeCards(cards);
        });
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
        
        this.cardService.addCard(newCard).subscribe(card => {
            this.categorizeCards([card]);
        });
    }

    drop(event: CdkDragDrop<Card[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            // There has to be a better way to do this
            const movedCardElementId = event.item.element.nativeElement.children[0].children[0].id;
            let movedCardId = movedCardElementId.replace('kanban-card-', '');

            let selectedCard = this.todo.filter(c => {
                return c.id === parseInt(movedCardId)
            })[0];

            if (!selectedCard) {
                selectedCard = this.doing.filter(c => {
                    return c.id === parseInt(movedCardId)
                })[0];
            }

            if (!selectedCard) {
                selectedCard = this.done.filter(c => {
                    return c.id === parseInt(movedCardId)
                })[0];
            }

            // Change card status
            selectedCard.status = this.deriveStatus(event.container.id);
          
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
            this.cardService.updateCard(selectedCard).subscribe();
        }
    }

    private categorizeCards(cards: Card[]) {
        cards.forEach(card => {
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
