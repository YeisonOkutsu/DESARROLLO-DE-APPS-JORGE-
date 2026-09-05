import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CharacterResponse } from '../models/character.model';

@Injectable({ providedIn: 'root' })
export class CharacterService {

  private readonly http = inject(HttpClient);
  private readonly API_URL = 'https://rickandmortyapi.com/api/character';

  getCharacters(page: number = 1): Observable<CharacterResponse> {
    return this.http.get<CharacterResponse>(`${this.API_URL}?page=${page}`);
  }
}
