'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CloneSnippetProps {
  httpsUrl: string;
  sshUrl?: string;
}

export function CloneSnippet({ httpsUrl, sshUrl }: CloneSnippetProps) {
  const [protocol, setProtocol] = useState<'https' | 'ssh'>('https');
  const [copied, setCopied] = useState(false);

  const formattedHttpsUrl = httpsUrl.endsWith('.git') ? httpsUrl : `${httpsUrl}.git`;
  const command = protocol === 'https' ? `git clone ${formattedHttpsUrl}` : `git clone ${sshUrl || formattedHttpsUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-2">
      {/* Switcher */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setProtocol('https')}
            className={`px-2 py-0.5 rounded transition-colors ${
              protocol === 'https'
                ? 'bg-radar-950 text-radar-300 border border-radar-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            HTTPS
          </button>
          {sshUrl && (
            <button
              type="button"
              onClick={() => setProtocol('ssh')}
              className={`px-2 py-0.5 rounded transition-colors ${
                protocol === 'ssh'
                  ? 'bg-radar-950 text-radar-300 border border-radar-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SSH
            </button>
          )}
        </div>
      </div>

      {/* Code Bar */}
      <div className="flex items-center justify-between gap-2 rounded-lg border border-dark-border bg-dark-bg px-3 py-2 text-xs font-mono text-slate-300">
        <span className="truncate selection:bg-radar-500/40">{command}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy clone command"
          className="flex items-center gap-1 rounded bg-dark-card border border-dark-border px-2 py-1 text-slate-400 hover:text-white hover:border-radar-400 transition-colors shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span className="text-[10px]">Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
