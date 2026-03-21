import { TestBed } from '@angular/core/testing';
import { SharedContextService, UserContext } from './shared-context.service';

describe('SharedContextService', () => {
  let service: SharedContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedContextService]
    });
    service = TestBed.inject(SharedContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial context as null', () => {
    expect(service.getContext()).toBeNull();
  });

  it('should set and get context correctly', () => {
    const mockUser: UserContext = {
      username: 'testuser',
      roles: ['admin'],
      name: 'Test User',
      accessToken: 'test-token'
    };

    service.setContext(mockUser);
    expect(service.getContext()).toEqual(mockUser);
  });

  it('should get access token correctly when context is set', () => {
    const mockUser: UserContext = {
      username: 'testuser',
      roles: ['admin'],
      name: 'Test User',
      accessToken: 'test-token'
    };

    service.setContext(mockUser);
    expect(service.getAccessToken()).toBe('test-token');
  });

  it('should return undefined for access token when context is null', () => {
    expect(service.getAccessToken()).toBeUndefined();
  });

  it('should emit context via context$ observable', () => {
    return new Promise<void>((resolve) => {
      const mockUser: UserContext = {
        username: 'testuser',
        roles: ['admin'],
        name: 'Test User'
      };

      let emissionCount = 0;
      service.context$.subscribe(context => {
        emissionCount++;
        if (emissionCount === 1) {
          expect(context).toBeNull();
        } else if (emissionCount === 2) {
          expect(context).toEqual(mockUser);
          resolve();
        }
      });

      service.setContext(mockUser);
    });
  });
});
