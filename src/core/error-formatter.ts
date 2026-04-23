/**
 * Professional error formatting with ANSI colors
 */

// ANSI Color codes
const COLORS = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

export interface FormattedError {
  title: string;
  message: string;
  details?: string[];
  suggestion?: string;
  statusCode: number;
  context?: string;
}

export function formatApiError(statusCode: number, body: string): FormattedError {
  let parsed: any;

  try {
    parsed = JSON.parse(body);
  } catch {
    return {
      title: `API Error ${statusCode}`,
      message: body || 'Unknown error',
      statusCode,
      suggestion: 'Check API status at status.storentia.com or contact support',
      context: 'Unable to parse error response from server'
    };
  }

  // Handle validation errors
  if (parsed.errors && Array.isArray(parsed.errors)) {
    const validationErrors = parsed.errors
      .map((e: any) => `${e.field}: ${e.tag}`)
      .slice(0, 5);

    return {
      title: 'Validation Error',
      message: parsed.message || 'Request validation failed',
      details: validationErrors,
      statusCode,
      context: 'One or more fields in your request are invalid',
      suggestion: 'Review the validation errors above and correct your input'
    };
  }

  // Handle auth errors
  if (statusCode === 401 || statusCode === 403) {
    return {
      title: 'Authentication Failed',
      message: parsed.message || 'Invalid or missing credentials',
      statusCode,
      context: 'Your credentials were rejected by the API',
      suggestion: 'Verify your clientId and clientSecret match your Storentia dashboard credentials'
    };
  }

  // Handle not found
  if (statusCode === 404) {
    return {
      title: 'Resource Not Found',
      message: parsed.message || 'The requested resource does not exist',
      statusCode,
      context: 'Double-check the resource ID and that it has not been deleted',
      suggestion: 'Verify the correct resource ID and try again'
    };
  }

  // Handle rate limit
  if (statusCode === 429) {
    return {
      title: 'Rate Limited',
      message: 'Too many requests in a short period',
      statusCode,
      context: 'Your request rate exceeds the API limits',
      suggestion: 'Wait a moment before retrying, or implement exponential backoff'
    };
  }

  // Handle server error
  if (statusCode >= 500) {
    return {
      title: 'Server Error',
      message: 'Storentia API is experiencing issues',
      statusCode,
      context: 'The server encountered an unexpected error',
      suggestion: 'Try again in a moment. If the issue persists, contact support'
    };
  }

  return {
    title: `API Error ${statusCode}`,
    message: parsed.message || body,
    statusCode,
    suggestion: 'Contact Storentia support if the issue persists'
  };
}

export function printError(error: FormattedError): string {
  const lines: string[] = [];

  // Header with border
  lines.push('');
  lines.push(`${COLORS.bright}${COLORS.red}─────────────────────────────────────${COLORS.reset}`);

  // Title
  lines.push(`${COLORS.bright}${COLORS.red}ERROR${COLORS.reset}  ${COLORS.bright}${error.title}${COLORS.reset}`);

  // Status code
  lines.push(`${COLORS.gray}Code: ${error.statusCode}${COLORS.reset}`);

  lines.push(`${COLORS.bright}${COLORS.red}─────────────────────────────────────${COLORS.reset}`);

  // Main message
  lines.push('');
  lines.push(`${COLORS.white}${error.message}${COLORS.reset}`);

  // Context if available
  if (error.context) {
    lines.push('');
    lines.push(`${COLORS.cyan}Context${COLORS.reset}`);
    lines.push(`${COLORS.gray}${error.context}${COLORS.reset}`);
  }

  // Details/validation errors
  if (error.details && error.details.length > 0) {
    lines.push('');
    lines.push(`${COLORS.cyan}Issues${COLORS.reset}`);
    error.details.forEach(detail => {
      lines.push(`${COLORS.gray}  · ${detail}${COLORS.reset}`);
    });
  }

  // Suggestion/action
  if (error.suggestion) {
    lines.push('');
    lines.push(`${COLORS.yellow}Next Steps${COLORS.reset}`);
    lines.push(`${COLORS.white}${error.suggestion}${COLORS.reset}`);
  }

  // Footer with border
  lines.push('');
  lines.push(`${COLORS.bright}${COLORS.red}─────────────────────────────────────${COLORS.reset}`);
  lines.push('');

  return lines.join('\n');
}
