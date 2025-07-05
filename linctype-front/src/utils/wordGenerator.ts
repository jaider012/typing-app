// Common English words for typing practice
const commonWords = [
  'the', 'of', 'and', 'a', 'to', 'in', 'is', 'you', 'that', 'it',
  'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'i',
  'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'word',
  'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said',
  'there', 'each', 'which', 'she', 'do', 'how', 'their', 'if', 'will', 'up',
  'other', 'about', 'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her',
  'would', 'make', 'like', 'into', 'him', 'has', 'two', 'more', 'very', 'what',
  'know', 'just', 'first', 'get', 'over', 'think', 'also', 'your', 'work', 'life',
  'only', 'new', 'years', 'way', 'may', 'say', 'come', 'use', 'her', 'than',
  'now', 'well', 'man', 'here', 'where', 'much', 'go', 'good', 'before', 'right',
  'too', 'any', 'same', 'tell', 'boy', 'follow', 'came', 'want', 'show', 'also',
  'around', 'farm', 'three', 'small', 'set', 'put', 'end', 'why', 'again', 'turn',
  'here', 'off', 'went', 'old', 'number', 'great', 'tell', 'men', 'say', 'small',
  'every', 'found', 'still', 'between', 'name', 'should', 'home', 'big', 'give',
  'air', 'line', 'set', 'own', 'under', 'read', 'last', 'never', 'us', 'left',
  'end', 'along', 'while', 'might', 'next', 'sound', 'below', 'saw', 'something',
  'thought', 'both', 'few', 'those', 'always', 'looked', 'show', 'large', 'often',
  'together', 'asked', 'house', 'don', 'world', 'going', 'want', 'school', 'important',
  'until', 'form', 'food', 'keep', 'children', 'feet', 'land', 'side', 'without',
  'boy', 'once', 'animal', 'life', 'enough', 'took', 'sometimes', 'four', 'head',
  'above', 'kind', 'began', 'almost', 'live', 'page', 'got', 'earth', 'need', 'far',
  'hand', 'high', 'year', 'mother', 'light', 'country', 'father', 'let', 'night',
  'picture', 'being', 'study', 'second', 'soon', 'story', 'since', 'white', 'ever',
  'paper', 'hard', 'near', 'sentence', 'better', 'best', 'across', 'during', 'today',
  'however', 'sure', 'knew', 'it', 'try', 'told', 'young', 'sun', 'thing', 'whole',
  'hear', 'example', 'heard', 'several', 'change', 'answer', 'room', 'sea', 'against',
  'top', 'turned', 'learn', 'point', 'city', 'play', 'toward', 'five', 'himself',
  'usually', 'money', 'seen', 'didn', 'car', 'morning', 'I', 'given', 'order',
  'red', 'door', 'sure', 'become', 'top', 'ship', 'across', 'today', 'during',
  'short', 'better', 'best', 'however', 'low', 'hours', 'black', 'products', 'happened',
  'whole', 'measure', 'remember', 'early', 'waves', 'reached', 'listen', 'wind',
  'rock', 'space', 'covered', 'fast', 'several', 'hold', 'himself', 'toward', 'five',
  'step', 'morning', 'passed', 'vowel', 'true', 'hundred', 'against', 'pattern',
  'numeral', 'table', 'north', 'slowly', 'money', 'map', 'farm', 'pulled', 'draw',
  'voice', 'seen', 'cold', 'cried', 'plan', 'notice', 'south', 'sing', 'war',
  'ground', 'fall', 'king', 'town', 'I', 'unit', 'figure', 'certain', 'field',
  'travel', 'wood', 'fire', 'upon'
];

export const generateWords = (count: number = 100): string[] => {
  const words: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * commonWords.length);
    words.push(commonWords[randomIndex]);
  }
  
  return words;
};

export const generateQuote = (): string => {
  const quotes = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.",
    "Programming is not about typing, it's about thinking. But good typing skills certainly help you express your thoughts faster.",
    "The best way to learn typing is through consistent practice and maintaining proper form throughout your sessions.",
    "Speed comes naturally with accuracy. Focus on getting every keystroke right before worrying about your words per minute.",
    "A good typist is like a good musician - rhythm, accuracy, and muscle memory all come together in perfect harmony."
  ];
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return randomQuote;
};