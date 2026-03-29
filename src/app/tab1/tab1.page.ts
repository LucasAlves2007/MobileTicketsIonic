import { Component } from '@angular/core';
import { TicketService } from '../services/ticket.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  senhaGerada: any;

  constructor(private ticketService: TicketService) {}

  gerar(tipo: 'SP' | 'SG' | 'SE') {
    this.senhaGerada = this.ticketService.gerarSenha(tipo);
  }

}