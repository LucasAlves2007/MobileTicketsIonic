import { Component } from '@angular/core';
import { TicketService, Ticket } from '../services/ticket.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

  totalEmitidas = 0;
  totalAtendidas = 0;

  spTotal = 0;
  sgTotal = 0;
  seTotal = 0;

  spAtendidas = 0;
  sgAtendidas = 0;
  seAtendidas = 0;

  tempoMedio = 0;

  lista: Ticket[] = [];

  constructor(private ticketService: TicketService) {}

  ionViewWillEnter() {
    this.atualizar();
  }

  atualizar() {
    this.totalEmitidas = this.ticketService.totalEmitidas();
    this.totalAtendidas = this.ticketService.totalAtendidas();

    this.spTotal = this.ticketService.totalPorTipo('SP');
    this.sgTotal = this.ticketService.totalPorTipo('SG');
    this.seTotal = this.ticketService.totalPorTipo('SE');

    this.spAtendidas = this.ticketService.atendidasPorTipo('SP');
    this.sgAtendidas = this.ticketService.atendidasPorTipo('SG');
    this.seAtendidas = this.ticketService.atendidasPorTipo('SE');

    this.tempoMedio = this.ticketService.tempoMedioGeral();

    this.lista = this.ticketService.relatorioDetalhado();
  }

}
