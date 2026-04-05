import { Injectable } from '@angular/core';

export interface Ticket {
  numero: string;
  tipo: 'SP' | 'SG' | 'SE';
  status: 'esperando' | 'atendendo' | 'finalizado'| 'abandonado';
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
  ultimasChamadas: Ticket[] = [];

  private sequenciaDiaria: { [key: string]: number } = {};

  private gerarNumero(tipo: 'SP' | 'SG' | 'SE'): string {
    const agora = new Date();

    const yy = String(agora.getFullYear()).slice(-2);
    const mm = String(agora.getMonth() + 1).padStart(2, '0');
    const dd = String(agora.getDate()).padStart(2, '0');

    const chave = `${yy}${mm}${dd}-${tipo}`;

    if (!this.sequenciaDiaria[chave]) {
      this.sequenciaDiaria[chave] = 1;
    } else {
      this.sequenciaDiaria[chave]++;
    }

    const seq = String(this.sequenciaDiaria[chave]).padStart(2, '0');

    return `${yy}${mm}${dd}-${tipo}${seq}`;
  }

  // Gerar senha
  gerarSenha(tipo: 'SP' | 'SG' | 'SE'): Ticket {
    const numero = this.gerarNumero(tipo);

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

  // Calcular tempo médio
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

  // Chamar próximo (com prioridade)
  chamarProximo(): Ticket | null {
    let ticket =
      this.tickets.find((t) => t.tipo === 'SP' && t.status === 'esperando') ||
      this.tickets.find((t) => t.tipo === 'SE' && t.status === 'esperando') ||
      this.tickets.find((t) => t.tipo === 'SG' && t.status === 'esperando');

    if (!ticket) return null;

    // REGRA DOS 5% (abandonos)
    if (ticket.tipo === 'SE' && Math.random() < 0.05) {
      ticket.status = 'abandonado'; // abandonou
      return this.chamarProximo(); // chama o próximo automaticamente
    }

    ticket.status = 'atendendo';
    ticket.dataAtendimento = new Date();
    ticket.guiche = Math.floor(Math.random() * 3) + 1;

    this.ultimasChamadas.unshift(ticket);

    // mantém só as 5 últimas
    if (this.ultimasChamadas.length > 5) {
      this.ultimasChamadas.pop();
    }

    return ticket;
  }

  // Finalizar atendimento
  finalizar(ticket: Ticket) {
    ticket.status = 'finalizado';
  }
  // Relatório detalhado
  relatorioDetalhado(): Ticket[] {
    return this.tickets;
  }

  //ultimas chamadas
  getUltimasChamadas(): Ticket[] {
    return this.ultimasChamadas;
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

  // total geral
  totalEmitidas() {
    return this.tickets.length;
  }

  totalAtendidas() {
    return this.tickets.filter((t) => t.status === 'finalizado').length;
  }

  totalAbandonadas() {
    return this.tickets.filter((t) => t.status === 'abandonado').length;
  }

  // por tipo
  totalPorTipo(tipo: 'SP' | 'SG' | 'SE') {
    return this.tickets.filter((t) => t.tipo === tipo).length;
  }

  atendidasPorTipo(tipo: 'SP' | 'SG' | 'SE') {
    return this.tickets.filter(
      (t) => t.tipo === tipo && t.status === 'finalizado',
    ).length;
  }

  // Obter fila
  obterFila(): Ticket[] {
    return [...this.tickets].sort((a, b) => {
      // Prioridade: esperando > atendendo > finalizado
      const prioridade = {
        esperando: 0,
        atendendo: 1,
        finalizado: 2,
        abandonado: 2,
      };
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