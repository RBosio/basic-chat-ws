import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import moment from 'moment';

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
    private router: Router,
    private cookieService: CookieService
  ) {}

  users: any[] = [];
  usersRoom: any[] = [];
  rooms = ['default', 'cine', 'juegos'];
  id = null;
  msg: string = '';
  messages: any[] = [];
  count: number = 0;
  name!: string;
  userId!: number;

  ngOnInit() {
    const n = localStorage.getItem('name');
    if (this.cookieService.get('id') && n) {
      this.name = n;
    } else {
      this.router.navigateByUrl('/');
    }

    this.socket.fromEvent('users').subscribe((users: any) => {
      this.users = JSON.parse(users);
      this.count = this.users.filter(
        (r: any) => r.id === this.id
      )[0]?.usersOn.length;

      this.usersRoom = this.users.filter(
        (r: any) => r.id === this.id
      )[0]?.usersOn;
    });

    this.socket.fromEvent('message').subscribe((message: any) => {
      message.date = moment(new Date()).format('LLL');

      this.messages.push(message);

      setTimeout(() => {
        const scroller = document.getElementById('scroller');
        if (scroller) {
          scroller.scrollTop = scroller.scrollHeight - scroller.clientHeight;
        }
      }, 200);
    });

    this.route.params.subscribe(({ id }) => {
      if (!id || (id !== 'default' && id !== 'cine' && id !== 'juegos')) {
        this.router.navigateByUrl('chat/default');
        return;
      }
      this.id = id;

      this.socket.emit('join', {
        roomId: this.id,
        user: {
          id: this.userId,
          name: this.name,
        },
      });
    });
  }

  change(name: string): void {
    if (name !== this.id) {
      this.socket.emit('leave', {
        roomId: this.id,
        user: {
          id: this.userId,
          name: this.name,
        },
      });
      this.messages = [];
      this.router.navigateByUrl('/chat/' + name);
    }
  }

  sendMessage() {
    this.socket.emit('send', {
      roomId: this.id,
      message: this.msg,
      user: {
        name: this.name,
      },
    });
    this.msg = '';
  }
}
