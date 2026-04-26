import { Buffer } from 'node:buffer';

async function main() {
  console.error('[CLI] Reading JSON payload from stdin...');
  
  let input = '';
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  if (!input.trim()) {
    console.error('[CLI] Error: No input received on stdin.');
    process.exit(1);
  }

  try {
    const payload = JSON.parse(input);
    const port = process.env.PORT || 3000;
    const url = `http://127.0.0.1:${port}/api/generate`;

    console.error(`[CLI] Sending request to ${url}...`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[CLI] API Error (${response.status}): ${errorText}`);
      process.exit(1);
    }

    const buffer = await response.arrayBuffer();
    process.stdout.write(Buffer.from(buffer));
    console.error('[CLI] Success! Image written to stdout.');
  } catch (err: any) {
    console.error(`[CLI] Critical Error: ${err.message}`);
    process.exit(1);
  }
}

main();
