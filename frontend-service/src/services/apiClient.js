const RETRYABLE_STATUSES = new Set([502, 503, 504]);

export async function apiRequest(path, { session, body, headers, ...options } = {}) {
  const method = options.method || 'GET';
  const maxAttempts = method === 'GET' ? 6 : 1;
  let response;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    response = await fetch(path, {
      ...options,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(session?.accessToken ? { Authorization: `${session.tokenType} ${session.accessToken}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!RETRYABLE_STATUSES.has(response.status) || attempt === maxAttempts) {
      break;
    }

    await delay(800 * attempt);
  }

  const responseBody = await response.text();
  const parsedBody = parseJsonBody(responseBody);

  if (!response.ok) {
    const errorBody = parsedBody && typeof parsedBody === 'object' ? parsedBody : null;
    throw new Error(errorBody?.message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204 || !responseBody) {
    return null;
  }

  return parsedBody;
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function parseJsonBody(body) {
  if (!body) {
    return null;
  }

  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}
