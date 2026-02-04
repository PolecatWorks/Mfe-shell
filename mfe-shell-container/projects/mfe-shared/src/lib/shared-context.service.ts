import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserContext {
  username: string;
  roles: string[];
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class SharedContextService {
  private contextSubject = new BehaviorSubject<UserContext | null>(null);
  public context$: Observable<UserContext | null> = this.contextSubject.asObservable();

  constructor() {
    console.log('SharedContextService initialized');
  }

  setContext(context: UserContext) {
    this.contextSubject.next(context);
  }

  getContext(): UserContext | null {
    return this.contextSubject.getValue();
  }
}
