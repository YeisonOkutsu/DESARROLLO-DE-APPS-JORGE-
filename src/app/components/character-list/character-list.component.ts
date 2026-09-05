import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../models/character.model';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.css'
})
export class CharacterListComponent implements OnInit {

  private readonly characterService = inject(CharacterService);

  characters: Character[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;
  personajesMuertos: number[] = [];

  ngOnInit(): void {
    this.fetchCharacters();
  }

  fetchCharacters(page: number = 1): void {
    this.loading = true;
    this.errorMessage = null;

    this.characterService.getCharacters(page).subscribe({
      next: (response) => {
        this.characters = response.results;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los personajes. Intenta de nuevo más tarde.';
        this.loading = false;
        console.error('Error HTTP:', err);
      }
    });
  }

  matarPersonaje(id: number): void {
    if (!this.estaMuerto(id)) {
      this.personajesMuertos.push(id);
    }
  }

  estaMuerto(id: number): boolean {
    return this.personajesMuertos.includes(id);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Alive': 'status-alive',
      'Dead': 'status-dead',
      'unknown': 'status-unknown'
    };
    return map[status] ?? 'status-unknown';
  }
}
