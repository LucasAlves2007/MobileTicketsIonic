import { Injectable } from '@angular/core';

export interface Ticket {
  numero: string;
  tipo: 'SP' | 'SG' | 'SE';
  status: 'esperando' | 'atendendo' | 'finalizado';
  dataEmissao: Date;
  dataAtendimento: Date | null;
  guiche: number | null;
  tempoEstimado?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  tickets: Ticket[] = [];

  contador = {
    SP: 0,
    SG: 0,
    SE: 0
  };

  // 🎟️ Gerar senha
  gerarSenha(tipo: 'SP' | 'SG' | 'SE'): Ticket {

    this.contador[tipo]++;

    const numero = tipo + this.contador[tipo].toString().padStart(3, '0');

    const ticket: Ticket = {
      numero,
      tipo,
      status: 'esperando',
      dataEmissao: new Date(),
      dataAtendimento: null,
      guiche: null,
      tempoEstimado: this.calcularTempo(tipo)
    };

    this.tickets.push(ticket);

    return ticket;
  }

  // ⏱️ Calcular tempo médio (TM)
  calcularTempo(tipo: 'SP' | 'SG' | 'SE'): number {

    if (tipo === 'SP') {
      // 15 min ±5
      return 15 + (Math.random() * 10 - 5);
    }

    if (tipo === 'SG') {
      // 5 min ±3
      return 5 + (Math.random() * 6 - 3);
    }

    if (tipo === 'SE') {
      // 95% = 1 min | 5% = 5 min
      return Math.random() < 0.95 ? 1 : 5;
    }

    return 0;
  }

  // 📣 Chamar próximo (com prioridade)
  chamarProximo(): Ticket | null {

    let ticket =
      this.tickets.find(t => t.tipo === 'SP' && t.status === 'esperando') ||
      this.tickets.find(t => t.tipo === 'SE' && t.status === 'esperando') ||
      this.tickets.find(t => t.tipo === 'SG' && t.status === 'esperando');

    if (ticket) {
      ticket.status = 'atendendo';
      ticket.dataAtendimento = new Date();
      ticket.guiche = Math.floor(Math.random() * 3) + 1; // guichê 1 a 3
    }

    return ticket || null;
  }

  // ✅ Finalizar atendimento
  finalizar(ticket: Ticket) {
    ticket.status = 'finalizado';
  }

  // 📊 Relatórios

  // total geral
  totalEmitidas() {
    return this.tickets.length;
  }

  totalAtendidas() {
    return this.tickets.filter(t => t.status === 'finalizado').length;
  }

  // por tipo
  totalPorTipo(tipo: 'SP' | 'SG' | 'SE') {
    return this.tickets.filter(t => t.tipo === tipo).length;
  }

  atendidasPorTipo(tipo: 'SP' | 'SG' | 'SE') {
    return this.tickets.filter(t => t.tipo === tipo && t.status === 'finalizado').length;
  }

}