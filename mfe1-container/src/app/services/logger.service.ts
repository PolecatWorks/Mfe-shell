import { Injectable, isDevMode } from '@angular/core';
import { SharedOtelService } from '@polecatworks/mfe-shared';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  constructor(private otelService: SharedOtelService) {}

  log(message?: any, ...optionalParams: any[]) {
    if (isDevMode()) {
      console.log(message, ...optionalParams);
    }
    this.otelService.logRecord('info', this.formatMessage(message, optionalParams));
  }

  warn(message?: any, ...optionalParams: any[]) {
    if (isDevMode()) {
      console.warn(message, ...optionalParams);
    }
    this.otelService.logRecord('warn', this.formatMessage(message, optionalParams));
  }

  error(message?: any, ...optionalParams: any[]) {
    if (isDevMode()) {
      console.error(message, ...optionalParams);
    }
    this.otelService.logRecord('error', this.formatMessage(message, optionalParams));
  }

  private formatMessage(message: any, optionalParams: any[]): string {
    let output = typeof message === 'string' ? message : JSON.stringify(message);
    if (optionalParams && optionalParams.length > 0) {
      output += ' ' + optionalParams.map(p => typeof p === 'string' ? p : JSON.stringify(p)).join(' ');
    }
    return output;
  }
}
