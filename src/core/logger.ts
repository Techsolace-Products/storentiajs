export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

interface Colors {
  reset: string;
  bright: string;
  dim: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  cyan: string;
  gray: string;
}

const colors: Colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const levelColors: Record<LogLevel, string> = {
  debug: colors.gray,
  info: colors.blue,
  warn: colors.yellow,
  error: colors.red,
  success: colors.green,
};

const levelLabels: Record<LogLevel, string> = {
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
  success: '✓',
};

export class Logger {
  private name: string;
  private isDevelopment: boolean;

  constructor(name: string) {
    this.name = name;
    this.isDevelopment = process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true';
  }

  private formatTimestamp(): string {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    return `${time}.${ms}`;
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.isDevelopment) return;

    const timestamp = this.formatTimestamp();
    const color = levelColors[level];
    const label = levelLabels[level];
    const nameColor = colors.cyan;

    const prefix = `${colors.gray}[${timestamp}]${colors.reset} ${color}${label}${colors.reset} ${nameColor}${this.name}${colors.reset}`;

    if (data !== undefined) {
      const logFn = level === 'error' ? console.error : console.log;
      logFn(`${prefix} ${message}`, data);
    } else {
      const logFn = level === 'error' ? console.error : console.log;
      logFn(`${prefix} ${message}`);
    }
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown): void {
    this.log('error', message, data);
  }

  success(message: string, data?: unknown): void {
    this.log('success', message, data);
  }
}
