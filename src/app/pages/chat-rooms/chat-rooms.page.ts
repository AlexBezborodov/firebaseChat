import { Component, OnInit } from '@angular/core';
import { ChatService, User } from '../../services/chat.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-rooms',
  templateUrl: './chat-rooms.page.html',
  styleUrls: ['./chat-rooms.page.scss'],
})
export class ChatRoomsPage implements OnInit {
  dataUsers: Observable<User[]> ;
  dataChatRooms:Observable<any[]>;
  users: Array<User>;
  chats: Array<any>;
  filteredChats: Array<any>;
  constructor(
   private chatService: ChatService,
   private router: Router
  ) { }

  ngOnInit() {
    const auth = localStorage.getItem('token');
    if (!auth) {
      this.router.navigate(['']);
    }

    this.dataUsers = this.chatService.getUsers();
    this.dataUsers.subscribe( users => {
      this.users = users;
      console.log('USERS', users);
    })
    this.dataChatRooms = this.chatService.getChatRooms();
    this.dataChatRooms.subscribe( chats => {
      console.log('CHats', chats)
      this.chats = chats;
      this.showChats();
    })
  }

  showChats() {
   const chatRooms =  this.chats.filter( chat => chat.uid.match(this.chatService.getCurrentUserId()))
   this.filteredChats = chatRooms.map( chat => {
      const oponentId = null;
      return {
        userId: (this.chatService.getCurrentUserId() === chat.creatorId) ?  chat.joined :  chat.creatorId,
        messages: chat.messages
      }
    })
    console.log('FILTERED', this.filteredChats)
  }
  getUserNamebyId(id) {
     const idx = this.users.findIndex(user => user.uid === id)
     return this.users[idx].name
  }
}
