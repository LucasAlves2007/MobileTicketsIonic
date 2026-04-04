
import { Component } from '@angular/core';
import { TicketService } from '../services/ticket.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

  totalEmitidas = 0;

  constructor(private ticketService: TicketService) {}

  ionViewWillEnter() {
    this.totalEmitidas = this.ticketService.totalEmitidas();
  }

}
