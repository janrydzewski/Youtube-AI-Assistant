import React from "react";

export function parseCommentText(
  text: string,
  onSeek?: (seconds: number) => void
): React.ReactNode[] {
  const linkRegex = /<a\s+href="[^"]+"\s*>([^<]+)<\/a>/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const timeString = match[1];
    const seconds = convertTimeToSeconds(timeString);

    if (seconds !== null && onSeek) {
      parts.push(
        <button
          key={match.index}
          onClick={() => onSeek(seconds)}
          className="text-blue-600 underline hover:text-blue-800 focus:outline-none mx-1"
        >
          {timeString}
        </button>
      );
    } else {
      parts.push(
        <span key={match.index} className="text-blue-600 underline">
          {timeString}
        </span>
      );
    }

    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts; // <----- to było kluczowe
}

function convertTimeToSeconds(time: string): number | null {
  const parts = time.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return null;
}
