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
  providedIn: 'root',
})
export class TicketService {
  tickets: Ticket[] = [];

  contador = {
    SP: 0,
    SG: 0,
    SE: 0,
  };

  // controle de dia
  dataAtual = new Date().toDateString();

  // controle de alternância
  ultimaChamada: 'SP' | 'SE' | 'SG' | null = null;

  // Gerar senha
  gerarSenha(tipo: 'SP' | 'SG' | 'SE'): Ticket {
    this.verificarReset();

    this.contador[tipo]++;

    const hoje = new Date();

    const yy = hoje.getFullYear().toString().slice(-2);
    const mm = (hoje.getMonth() + 1).toString().padStart(2, '0');
    const dd = hoje.getDate().toString().padStart(2, '0');

    const dataFormatada = `${yy}${mm}${dd}`;
    const sequencia = this.contador[tipo].toString().padStart(3, '0');

    const numero = `${dataFormatada}-${tipo}${sequencia}`;

    const ticket: Ticket = {
      numero,
      tipo,
      status: 'esperando',
      dataEmissao: new Date(),
      dataAtendimento: null,
      guiche: null,
      tempoEstimado: this.calcularTempo(tipo),
    };

    this.tickets.push(ticket);

    return ticket;
  }

  // Reset diário
  verificarReset() {
    const hoje = new Date().toDateString();

    if (this.dataAtual !== hoje) {
      this.contador = { SP: 0, SG: 0, SE: 0 };
      this.dataAtual = hoje;
    }
  }

  // Calcular tempo médio (TM)
  calcularTempo(tipo: 'SP' | 'SG' | 'SE'): number {
    if (tipo === 'SP') {
      return 15 + (Math.random() * 10 - 5);
    }

    if (tipo === 'SG') {
      return 5 + (Math.random() * 6 - 3);
    }

    if (tipo === 'SE') {
      return Math.random() < 0.95 ? 1 : 5;
    }

    return 0;
  }

  // Chamar próximo (COM REGRA CORRETA)
  chamarProximo(): Ticket | null {
    let ticket: Ticket | undefined;

    // tenta SP se não foi o último
    if (this.ultimaChamada !== 'SP') {
      ticket = this.tickets.find(
        (t) => t.tipo === 'SP' && t.status === 'esperando',
      );
    }

    // tenta SE se não achou
    if (!ticket && this.ultimaChamada !== 'SE') {
      ticket = this.tickets.find(
        (t) => t.tipo === 'SE' && t.status === 'esperando',
      );
    }

    // tenta SG
    if (!ticket) {
      ticket = this.tickets.find(
        (t) => t.tipo === 'SG' && t.status === 'esperando',
      );
    }

    if (ticket) {
      ticket.status = 'atendendo';
      ticket.dataAtendimento = new Date();
      ticket.guiche = Math.floor(Math.random() * 3) + 1;

      this.ultimaChamada = ticket.tipo;
    }

    return ticket || null;
  }

  // Finalizar atendimento
  finalizar(ticket: Ticket) {
    ticket.status = 'finalizado';
  }

  // Relatório detalhado
  relatorioDetalhado(): Ticket[] {
    return this.tickets;
  }

  // Tempo médio geral
  tempoMedioGeral(): number {
    const atendidos = this.tickets.filter(
      (t) => t.status === 'finalizado' && t.dataAtendimento,
    );

    if (atendidos.length === 0) return 0;

    const total = atendidos.reduce((acc, t) => {
      const tempo =
        new Date(t.dataAtendimento!).getTime() -
        new Date(t.dataEmissao).getTime();
      return acc + tempo;
    }, 0);

    return Math.round(total / atendidos.length / 60000); // em minutos
  }

  // Obter fila
  obterFila(): Ticket[] {
    return [...this.tickets].sort((a, b) => {
      // Prioridade: esperando > atendendo > finalizado
      const prioridade = { esperando: 0, atendendo: 1, finalizado: 2 };
      const prioA = prioridade[a.status];
      const prioB = prioridade[b.status];

      if (prioA !== prioB) return prioA - prioB;

      // Se mesma prioridade, ordenar por data
      return (
        new Date(a.dataEmissao).getTime() - new Date(b.dataEmissao).getTime()
      );
    });
  }
}
