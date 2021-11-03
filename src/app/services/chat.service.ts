import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface User {
  uid: string;
  email: string;
  token?: string;
}

export interface Message {
  createdAt: firebase.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
 currentUser: User = null;
 constructor(
   private afAuth: AngularFireAuth,
   private afs: AngularFirestore
 ) {
   this.afAuth.onAuthStateChanged(user => {
     console.log('changed', user);
     this.currentUser = user;
   });
 }
 async signUp({ email, password}) {
   const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
   const uid = credential.user.uid;
   await credential.user.getIdToken().then(result => localStorage.setItem('token', result));
  return this.afs.doc(
     `users/${uid}`
   ).set({
     uid,
     email: credential.user.email
   });

 }

 signIn({ email, password}) {
   return this.afAuth.signInWithEmailAndPassword(email, password);

 }

 signOut() {
   return this.afAuth.signOut();
 }
  addChatMessage(msg) {
    return this.afs.collection('messages').add({
      msg,
      from: this.currentUser,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  // getChatMessages() {
  //  let users = [];
  //  return this.getUsers().pipe(
  //    switchMap( res => {
  //      users = res;
  //      console.log('All users', users);
  //      return this.afs.collection('messages', ref => ref.orderBy('createdAt')).valueChanges({ idField: 'id'}) as Observable<Message[]>
  //    }),
  //    map( messages => {
  //      for(let m of messages) {
  //        console.log('INSIDE CYCLE', m );
  //        m.fromName = this.getUserForMsg(m.from, users);
  //        m.myMsg = this.currentUser.uid === m.from;
  //      }
  //      console.log('All messages', messages);
  //      return messages
  //    })
  //  )
  // }
  getChatMessages() {
    let users = [];
    return this.getUsers().pipe(
      switchMap(res => {
        users = res;
        console.log('All users', users);
        return this.afs.collection('messages', ref => ref.orderBy('createdAt')).valueChanges({ idField: 'id' }) as Observable<Message[]>;
      }),
      map(messages => {
        // Get the real name for each user
        for (let m of messages) {
          m.fromName = this.getUserForMsg(m.from, users);
          m.myMsg = this.currentUser.uid === m.from;
        }
        console.log('All messages', messages);
        return messages
      })
    )
  }
  getUsers() {
    return this.afs.collection('users').valueChanges({idField: 'uid'}) as Observable<User[]>;
  }

  getUserForMsg(msgFormId, users: User[]): string {
   console.log('msgFormId', msgFormId);
    console.log('users', users);
    for (let usr of users) {
      if (usr.uid == msgFormId) {
        return usr.email
      }
    }
    return 'Deleted';
  }
}

