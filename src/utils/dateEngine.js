// src/utils/dateEngine.js

// మరుసటి రోజు తేదీని (Tomorrow's Date) ఆటోమేటిక్‌గా లెక్కించే ఫంక్షన్
export const getNewspaperDate = () => {
  const now = new Date();
  
  // ఉదయం 12:00 నుండి రాత్రి 12:00 లోపు ఎప్పుడు అప్‌లోడ్ చేసినా మరుసటి రోజు తేదీ రావాలి కాబట్టి (+1 day) కలపాలి.
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  
  return {
    dateString: tomorrow.toLocaleDateString('te-IN', options), // తెలుగులో తేది మరియు వారం
    rawDate: tomorrow
  };
};

// సంపుటి మరియు సంచిక ఆటో-ఇంక్రిమెంట్ లాజిక్
export const getPublicationMetadata = (lastVolume, lastIssue, lastDateString) => {
  const { rawDate } = getNewspaperDate();
  const currentDateStr = rawDate.toISOString().split('T')[0];

  let volume = lastVolume || 1;
  let issue = lastIssue || 1;

  if (lastDateString && lastDateString !== currentDateStr) {
    issue += 1;
  }

  return {
    volume,
    issue,
    currentDateStr
  };
};
