import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgFor, RouterLink, NgClass, FormsModule],
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
  msg: string = '';
  messages: string[] = [];

  ngOnInit() {
    this.socket.fromEvent('users').subscribe((users: any) => {
      this.users = JSON.parse(users);
    });

    this.socket.fromEvent('message').subscribe((message: any) => {
      this.messages.push(message);
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
    this.messages = [];
    this.router.navigateByUrl('/chat/' + name);
  }

  sendMessage() {
    this.socket.emit('send', { roomId: this.id, message: this.msg });
    this.msg = '';
  }
}
