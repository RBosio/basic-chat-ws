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
  usersRoom: any[] = [];
  rooms = ['default', 'cine', 'juegos'];
  id = null;
  msg: string = '';
  messages: string[] = [];
  count: number = 0;
  name: number = 0;

  ngOnInit() {
    this.socket.fromEvent('users').subscribe((users: any) => {
      this.users = JSON.parse(users);
      this.count = this.users.filter(
        (r: any) => r.id === this.id
      )[0].usersOn.length;

      this.usersRoom = this.users.filter(
        (r: any) => r.id === this.id
      )[0].usersOn;
    });

    this.socket.fromEvent('message').subscribe((message: any) => {
      this.messages.push(message);
    });

    this.route.params.subscribe(({ id }) => {
      if (!id) return;
      this.id = id;
      this.name = Math.random() * 1000;
      this.socket.emit('join', {
        roomId: this.id,
        userName: this.name,
      });
    });
  }

  change(name: string): void {
    if (name !== this.id) {
      this.socket.emit('leave', {
        roomId: this.id,
        userName: this.name,
      });
      this.messages = [];
      this.router.navigateByUrl('/chat/' + name);
    }
  }

  sendMessage() {
    this.socket.emit('send', { roomId: this.id, message: this.msg });
    this.msg = '';
  }
}
