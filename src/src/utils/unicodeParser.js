export const parseUnicodeTeluguText = (rawText) => {
  if (!rawText) return { headline: '', subHeadline: '', location: '', body: '' };

  const lines = rawText.trim().split('\n').filter(line => line.trim() !== '');

  let headline = '';
  let subHeadline = '';
  let location = '';
  let body = '';

  if (lines.length > 0) {
    headline = lines[0].trim();
  }
  if (lines.length > 1) {
    subHeadline = lines[1].trim();
  }

  const remainingLines = lines.slice(2).join('\n');

  // లొకేషన్ / డేట్‌లైన్ గుర్తింపు (ఉదా: పాడేరు -)
  const locationMatch = remainingLines.match(/^([^:-]+[-:])\s*(.*)/s);
  if (locationMatch) {
    location = locationMatch[1].trim();
    body = locationMatch[2].trim();
  } else {
    body = remainingLines;
  }

  return {
    headline,
    subHeadline,
    location,
    body
  };
};

// 1వ పేజీ నుండి 2వ పేజీకి వార్త లింక్ చేసే ఫార్మాటర్
export const formatTextThread = (text, maxLength, currentPage, targetPage) => {
  if (text.length <= maxLength) {
    return { text, overflowText: '' };
  }

  const mainPart = text.substring(0, maxLength);
  const overflowPart = text.substring(maxLength);

  return {
    text: `${mainPart}\n\n[తరువాయి ${targetPage}వ పేజీలో...]`,
    overflowText: `[${currentPage}వ పేజీ తరువాయి...]\n\n${overflowPart}`
  };
};
