import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

import {Card} from '@app/_models';

@Injectable({
    providedIn: 'root'
})
export class CardService {

    url = `${environment.apiUrl}/cards`;
    
    constructor(private http: HttpClient) {}

    getAll() {
        return this.http.get<Card[]>(this.url, { withCredentials: true });
    }

    updateCard(card: Card) {
        return this.http.put<Card>(`${this.url}/${card.id}`, card, { withCredentials: true });
    }

    addCard(card: Card) {
        return this.http.post<Card>(this.url, card, {withCredentials: true});
    }
}
