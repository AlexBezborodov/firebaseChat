import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService, Message } from 'src/app/services/chat.service';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  messages: Observable<Message[]>
  newMsg = '';

  constructor(
    private chatService: ChatService,
    private router: Router
  ) { }

  ngOnInit() {
    const auth = localStorage.getItem('token');
    if (!auth) {
      this.router.navigate(['/']);
    }
    this.messages = this.chatService.getChatMessages();
  }
  signOut() {
    this.chatService.signOut()
      .then(() => {
        localStorage.removeItem('token');
        this.router.navigateByUrl('/', {replaceUrl: true});
      });
  }
  sendMessage() {
    this.chatService.addChatMessage(this.newMsg)
      .then( () => {
        this.newMsg = '';
        this.content.scrollToBottom();
      });
  }

  deleteMsg(id: string) {
    this.chatService.deleteMessage(id);
  }

  createChat() {
    this.chatService.createDialog('oponent2')
  }
}
