import { Injectable, Optional } from '@angular/core';
import { LoggerProvider, BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { logs, Logger } from '@opentelemetry/api-logs';
import { SharedContextService, UserContext } from './shared-context.service';

export interface OTelConfig {
  collectorUrl: string;
  logLevel: string;
}

@Injectable({
  providedIn: 'root'
})
export class SharedOtelService {
  private logger?: Logger;
  private isInitialized = false;
  private config?: OTelConfig;

  constructor(private contextService: SharedContextService) {}

  initialize(config?: OTelConfig) {
    if (this.isInitialized || !config?.collectorUrl) {
      return;
    }

    this.config = config;

    const logExporter = new OTLPLogExporter({
      url: config.collectorUrl,
    });

    const loggerProvider = new LoggerProvider({
      processors: [new BatchLogRecordProcessor(logExporter)]
    });

    logs.setGlobalLoggerProvider(loggerProvider);
    this.logger = logs.getLogger('mfe-shared-logger');

    this.isInitialized = true;
    console.log('SharedOtelService initialized with config:', config);
  }

  logRecord(level: 'debug' | 'info' | 'warn' | 'error', body: string, attributes?: Record<string, any>) {
    if (!this.isInitialized || !this.logger) return;

    // Optional level filtering based on config
    const configuredLevel = this.config?.logLevel?.toLowerCase() || 'error';
    const levels = ['debug', 'info', 'warn', 'error'];
    const configLevelIndex = levels.indexOf(configuredLevel);
    const currentLevelIndex = levels.indexOf(level);

    if (currentLevelIndex < configLevelIndex) {
      return; // Filter out based on log level
    }

    const context = this.contextService.getContext();
    const mergedAttributes: Record<string, any> = {
      ...attributes,
      level
    };

    if (context?.username) mergedAttributes['username'] = context.username;
    if (context?.roles) mergedAttributes['roles'] = context.roles.join(',');

    // opentelemetry api-logs requires numeric severity number
    // using arbitrary mapping for severityNumber
    const severityMapping: Record<string, number> = {
      debug: 5,
      info: 9,
      warn: 13,
      error: 17
    };

    this.logger.emit({
      severityNumber: severityMapping[level] || 9,
      severityText: level.toUpperCase(),
      body: body,
      attributes: mergedAttributes
    });
  }
}
