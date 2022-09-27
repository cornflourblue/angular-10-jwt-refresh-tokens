import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

import {Card} from '@app/_models';

@Injectable({
    providedIn: 'root'
})
export class CardService {

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Card[]>(`${environment.apiUrl}/cards`, { withCredentials: true });
    }
}
