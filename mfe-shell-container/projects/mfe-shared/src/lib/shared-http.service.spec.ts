import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SharedHttpService } from './shared-http.service';
import { HttpHeaders, HttpParams, provideHttpClient } from '@angular/common/http';
describe('SharedHttpService', () => {
  let service: SharedHttpService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SharedHttpService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(SharedHttpService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform a GET request', () => {
    const testData = { name: 'Test Data' };
    const url = '/api/data';

    service.get(url).subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(testData);
  });

  it('should perform a GET request with options', () => {
    const testData = { name: 'Test Data' };
    const url = '/api/data';
    const options = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer test-token' }),
      params: new HttpParams().set('page', '1')
    };

    service.get(url, options).subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne(request => request.url === url);
    expect(req.request.method).toEqual('GET');
    expect(req.request.headers.get('Authorization')).toEqual('Bearer test-token');
    expect(req.request.params.get('page')).toEqual('1');
    req.flush(testData);
  });

  it('should perform a POST request', () => {
    const testData = { id: 1, name: 'New Data' };
    const url = '/api/data';
    const body = { name: 'New Data' };

    service.post(url, body).subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(body);
    req.flush(testData);
  });

  it('should perform a PUT request', () => {
    const testData = { id: 1, name: 'Updated Data' };
    const url = '/api/data/1';
    const body = { name: 'Updated Data' };

    service.put(url, body).subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(body);
    req.flush(testData);
  });

  it('should perform a PATCH request', () => {
    const testData = { id: 1, name: 'Patched Data' };
    const url = '/api/data/1';
    const body = { name: 'Patched Data' };

    service.patch(url, body).subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('PATCH');
    expect(req.request.body).toEqual(body);
    req.flush(testData);
  });

  it('should perform a DELETE request', () => {
    const url = '/api/data/1';

    service.delete(url).subscribe();

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
  });

  it('should perform a DELETE request with body', () => {
    const url = '/api/data/1';
    const options = {
      body: { reason: 'Obsolete' }
    };

    service.delete(url, options).subscribe();

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.body).toEqual(options.body);
    req.flush(null);
  });
});
