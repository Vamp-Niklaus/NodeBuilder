export const LogLevel = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
};

class Logger {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  _formatMessage(level, message, metadata) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  info(message, metadata = {}) {
    console.info(this._formatMessage(LogLevel.INFO, message, metadata), metadata);
  }

  warn(message, metadata = {}) {
    console.warn(this._formatMessage(LogLevel.WARN, message, metadata), metadata);
  }

  error(message, error = null, metadata = {}) {
    console.error(this._formatMessage(LogLevel.ERROR, message, metadata), error || '', metadata);
  }

  debug(message, metadata = {}) {
    if (!this.isProduction) {
      console.debug(this._formatMessage(LogLevel.DEBUG, message, metadata), metadata);
    }
  }
}

export const logger = new Logger();
