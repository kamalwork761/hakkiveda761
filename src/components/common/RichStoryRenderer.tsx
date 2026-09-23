import React from 'react';

interface RichStoryRendererProps {
  content: string;
  className?: string;
}

export const RichStoryRenderer: React.FC<RichStoryRendererProps> = ({ content, className = '' }) => {
  if (!content || !content.trim()) {
    return null;
  }

  // Split into raw blocks separated by blank lines
  const rawBlocks = content.split(/\n\s*\n/);

  const formatInlineText = (text: string): React.ReactNode[] => {
    // Regex for bold, italic, links, and code
    // Patterns:
    // **bold**
    // *italic* or _italic_
    // [text](url)
    // `code`
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*|_.*?_|\[.*?\]\(.*?\)|\`.*?\`)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    let subIndex = 0;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={`b-${subIndex++}`} className="font-semibold text-[var(--color-heading)]">
            {token.slice(2, -2)}
          </strong>
        );
      } else if ((token.startsWith('*') && token.endsWith('*')) || (token.startsWith('_') && token.endsWith('_'))) {
        parts.push(
          <em key={`i-${subIndex++}`} className="italic text-[var(--color-heading)]">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code
            key={`c-${subIndex++}`}
            className="px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-mono text-[var(--brand-gold)]"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
        const linkText = token.substring(1, token.indexOf(']('));
        const linkUrl = token.substring(token.indexOf('](') + 2, token.length - 1);
        parts.push(
          <a
            key={`a-${subIndex++}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--brand-gold)] hover:underline font-medium"
          >
            {linkText}
          </a>
        );
      } else {
        parts.push(token);
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  return (
    <div className={`space-y-6 text-base sm:text-lg leading-relaxed text-[var(--color-text-secondary)] ${className}`}>
      {rawBlocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Image: ![alt](url)
        if (trimmed.startsWith('![') && trimmed.includes('](') && trimmed.endsWith(')')) {
          const alt = trimmed.substring(2, trimmed.indexOf(']('));
          const src = trimmed.substring(trimmed.indexOf('](') + 2, trimmed.length - 1);
          return (
            <figure key={idx} className="my-8 rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
              <img src={src} alt={alt || 'Client Story Image'} className="w-full max-h-[480px] object-cover" />
              {alt && (
                <figcaption className="p-3 text-center text-xs text-[var(--color-text-secondary)] italic border-t border-[var(--color-border)]">
                  {alt}
                </figcaption>
              )}
            </figure>
          );
        }

        // H1 Heading
        if (trimmed.startsWith('# ')) {
          return (
            <h2
              key={idx}
              className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-heading)] tracking-tight pt-4 border-b border-[var(--color-border)] pb-2"
            >
              {formatInlineText(trimmed.replace(/^#\s+/, ''))}
            </h2>
          );
        }

        // H2 Heading
        if (trimmed.startsWith('## ')) {
          return (
            <h3
              key={idx}
              className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-heading)] tracking-tight pt-3 text-[var(--brand-gold)]"
            >
              {formatInlineText(trimmed.replace(/^##\s+/, ''))}
            </h3>
          );
        }

        // H3 Heading
        if (trimmed.startsWith('### ')) {
          return (
            <h4
              key={idx}
              className="font-serif text-lg sm:text-xl font-semibold text-[var(--color-heading)] tracking-tight pt-2"
            >
              {formatInlineText(trimmed.replace(/^###\s+/, ''))}
            </h4>
          );
        }

        // Blockquote
        if (trimmed.startsWith('>')) {
          const quoteLines = trimmed
            .split('\n')
            .map((line) => line.replace(/^>\s?/, ''))
            .join('\n');
          return (
            <blockquote
              key={idx}
              className="my-6 border-l-4 border-[var(--brand-gold)] pl-5 sm:pl-6 py-2 bg-[var(--color-surface)]/60 rounded-r-xl italic font-serif text-lg sm:text-xl text-[var(--color-heading)]"
            >
              <div className="whitespace-pre-line leading-relaxed">{formatInlineText(quoteLines)}</div>
            </blockquote>
          );
        }

        // Unordered List
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').filter((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '));
          return (
            <ul key={idx} className="my-4 space-y-2.5 pl-5 list-disc marker:text-[var(--brand-gold)]">
              {items.map((item, itemIdx) => {
                const itemText = item.trim().replace(/^[-*]\s+/, '');
                return (
                  <li key={itemIdx} className="leading-relaxed text-[var(--color-text-secondary)]">
                    {formatInlineText(itemText)}
                  </li>
                );
              })}
            </ul>
          );
        }

        // Standard Paragraph with support for internal line breaks
        const lines = trimmed.split('\n');
        return (
          <p key={idx} className="leading-relaxed">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {formatInlineText(line)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};
