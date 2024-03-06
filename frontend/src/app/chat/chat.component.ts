import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { NgClass, NgFor } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgFor, RouterLink, NgClass],
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
  constructor(
    private socket: Socket,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  users: any[] = [];
  rooms = ['default', 'cine', 'juegos'];
  id = null;

  ngOnInit() {
    this.socket.fromEvent('users').subscribe((users: any) => {
      this.users = JSON.parse(users);
    });

    this.route.params.subscribe(({ id }) => {
      if (!id) return;
      this.id = id;

      if (!this.users.filter((name) => name.id === id).includes('Fido')) {
        this.socket.emit('join', { roomId: this.id, userName: 'Fido' });
      }
    });
  }

  change(name: string): void {
    this.socket.emit('leave', { roomId: this.id, userName: 'Fido' });
    this.router.navigateByUrl('/chat/' + name);
  }
}
