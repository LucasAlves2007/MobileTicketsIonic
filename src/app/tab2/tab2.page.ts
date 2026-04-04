import { Component, OnInit } from '@angular/core';
import { TicketService, Ticket } from '../services/ticket.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false
})
export class Tab2Page implements OnInit {

  senhaAtual: Ticket | null = null;
  fila: Ticket[] = [];
  totalEmitidas: number = 0;
  totalAtendidas: number = 0;
  filaEmpera: number = 0;

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.atualizarDados();
  }

  chamar() {
    this.senhaAtual = this.ticketService.chamarProximo();
    this.atualizarDados();
  }

  finalizar() {
    if (this.senhaAtual) {
      this.ticketService.finalizar(this.senhaAtual);
      this.senhaAtual = null;
      this.atualizarDados();
    }
  }

  private atualizarDados() {
    this.fila = this.ticketService.obterFila();
    this.totalEmitidas = this.ticketService.totalEmitidas();
    this.totalAtendidas = this.ticketService.totalAtendidas();
    this.filaEmpera = this.fila.filter(t => t.status === 'esperando').length;
  }

  getTipoLabel(tipo: string): string {
    const labels: { [key: string]: string } = {
      'SP': '👔 Prioritário',
      'SG': '👨‍👩‍👧‍👦 Gerência',
      'SE': '⚡ Simples'
    };
    return labels[tipo] || tipo;
  }

  getBadgeColor(status: string): string {
    const colors: { [key: string]: string } = {
      'esperando': 'primary',
      'atendendo': 'success',
      'finalizado': 'medium'
    };
    return colors[status] || 'medium';
  }

  calcularTempo(ticket: Ticket): string {
    if (!ticket.dataEmissao) return '0 min';
    const agora = new Date();
    const diferenca = agora.getTime() - new Date(ticket.dataEmissao).getTime();
    const minutos = Math.floor(diferenca / 60000);
    return minutos + ' min';
  }

}