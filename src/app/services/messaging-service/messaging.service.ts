import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { User } from './../../interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  currentMessage = new BehaviorSubject(null);

  constructor(
    private afs: AngularFirestore,
    private angularFireMessaging: AngularFireMessaging) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    );
  }

  // update token in firebase database
  updateToken(user, token) {
    let tokensInFirebase = [];
    let isTokenAlreadyInFb = false;

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    return userRef
      .valueChanges()
      .subscribe((data) => {
        if (data !== undefined) {
          console.log('Subscribe Value Changed');
          if (data.fcmTokens.length > 0) {
            tokensInFirebase = data.fcmTokens;
            tokensInFirebase.forEach(tokenFb => {
              if (tokenFb === token) {
                isTokenAlreadyInFb = true;
              }
            });
            if (!isTokenAlreadyInFb) {
              tokensInFirebase.push(token);
              this.callTest(user, userRef, tokensInFirebase)
            }
          }
        } else {
          tokensInFirebase.push(token);
          this.callTest(user, userRef, tokensInFirebase);
        }
      });
  }

  private callTest(user, userRef, tokensInFirebase) {
    if (tokensInFirebase.length > 0) {
      return userRef.set({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        fcmTokens: tokensInFirebase
      });
    }
  }

  // request permission for notification from firebase cloud messaging
  // .requestToken first asks for permission and then get a token
  requestPermission(user) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log('Permission granted. New Token: ', token);
        return this.updateToken(user, token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }
}
