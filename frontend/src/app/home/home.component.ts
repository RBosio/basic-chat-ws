import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  name: string = '';
  constructor(private router: Router, private cookieService: CookieService) {}

  ngOnInit(): void {
    if (!this.cookieService.get('id')) {
      const userId = Math.random();
      this.cookieService.set('id', userId.toString());
    }
  }

  navigate() {
    if (this.name.length === 0) return;

    localStorage.setItem('name', this.name);
    this.router.navigateByUrl('/chat');
  }
}
