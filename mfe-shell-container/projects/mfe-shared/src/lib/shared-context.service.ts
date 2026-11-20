import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserContext {
  userId?: string;
  username: string;
  roles: string[];
  name: string;
  email?: string;
  clientRoles?: Record<string, string[]>;
  claims?: Record<string, any>;
  accessToken?: string;
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

  getAccessToken(): string | undefined {
    return this.contextSubject.getValue()?.accessToken;
  }

  getClientRoles(clientId: string): string[] {
    return this.contextSubject.getValue()?.clientRoles?.[clientId] || [];
  }

  hasClientRole(clientId: string, role: string): boolean {
    const roles = this.getClientRoles(clientId);
    return roles.includes(role);
  }
}
