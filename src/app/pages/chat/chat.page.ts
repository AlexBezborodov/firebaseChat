import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  constructor(
    private chatService: ChatService,
    private router: Router
  ) { }

  ngOnInit() {
    const auth = localStorage.getItem('token');
    if (!auth) {
      this.router.navigate(['/']);
    }
  }
  signOut() {
    this.chatService.signOut();
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
