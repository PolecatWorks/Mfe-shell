import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('nginx-view SERVE_ROOT & CORS Configuration', () => {
  const templatePath = path.resolve(__dirname, '../../../charts/nginx-view/config/configs/default.conf.template');
  const templateContent = fs.readFileSync(templatePath, 'utf-8');

  it('POSITIVE: template uses configurable ${SERVE_ROOT}/ prefix for MFE location', () => {
    expect(templateContent).toContain('location ^~ ${SERVE_ROOT}/');
  });

  it('POSITIVE: template sets CORS headers always inside ${SERVE_ROOT}/ location block', () => {
    const serveRootBlockMatch = templateContent.match(/location \^~ \$\{SERVE_ROOT\}\/\s*\{([^}]+(\{[^}]*\}[^}]*)*)\}/);
    expect(serveRootBlockMatch).toBeTruthy();
    const block = serveRootBlockMatch![0];

    expect(block).toContain("add_header 'Access-Control-Allow-Origin' $cors_origin always;");
    expect(block).toContain("add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;");
    expect(block).toContain("add_header 'Access-Control-Allow-Headers'");
    expect(block).toContain("if ($request_method = 'OPTIONS')");
    expect(block).toContain('return 204;');
  });

  it('POSITIVE: preserves root /alive and /ready endpoints independent of SERVE_ROOT', () => {
    expect(templateContent).toContain('location /alive { return 200; access_log off; }');
    expect(templateContent).toContain('location /ready { return 200; access_log off; }');
  });

  it('NEGATIVE: rejects missing leading slash or missing trailing slash in SERVE_ROOT values', () => {
    const validRoots = ['/mfe/mfe1', '/mfe/angry-agent', '/mfe/aad', '/mfe/data-engine'];
    const invalidRoots = [
      'mfe/mfe1', // missing leading slash
      '/mfe/mfe1/', // trailing slash would produce double slash with ${SERVE_ROOT}/
      '', // empty root without slash
      'http://localhost:8080/mfe', // full URL instead of path prefix
    ];

    for (const valid of validRoots) {
      expect(valid.startsWith('/')).toBe(true);
      expect(valid.endsWith('/')).toBe(false);
      expect(/^(\/[a-z0-9-_]+)+$/.test(valid)).toBe(true);
    }

    for (const invalid of invalidRoots) {
      const isValid = invalid.startsWith('/') && !invalid.endsWith('/') && /^(\/[a-z0-9-_]+)+$/.test(invalid);
      expect(isValid).toBe(false);
    }
  });

  it('POSITIVE: correctly evaluates variable substitution for SERVE_ROOT', () => {
    const serveRoot = '/mfe/angry-agent';
    const resolved = templateContent.replace(/\$\{SERVE_ROOT\}/g, serveRoot);
    expect(resolved).toContain('location ^~ /mfe/angry-agent/ {');
    expect(resolved).not.toContain('${SERVE_ROOT}');
  });
});
