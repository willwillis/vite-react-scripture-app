// Types for navigation
export interface ScriptureLocation {
  volumeName: string;
  bookName: string;
  chapterNumber: number;
  verseNumbers?: number[];
}

// Parse URL hash to extract scripture location
export function parseScriptureUrl(hash: string): ScriptureLocation | null {
  // Remove leading # and split by /
  const path = hash.replace(/^#/, '').split('/').filter(Boolean);
  
  if (path.length < 3) return null; // Need at least volume/book/chapter
  
  const [volumeName, bookName, chapterStr, verseStr] = path;
  
  // Parse chapter number
  const chapterNumber = parseInt(chapterStr, 10);
  if (isNaN(chapterNumber)) return null;
  
  // Parse verse numbers (support ranges like "1-3" or multiple like "1,3,5")
  let verseNumbers: number[] | undefined;
  if (verseStr) {
    verseNumbers = parseVerseNumbers(verseStr);
  }
  
  return {
    volumeName,
    bookName,
    chapterNumber,
    verseNumbers
  };
}

// Parse verse numbers from string
function parseVerseNumbers(verseStr: string): number[] {
  const verses: number[] = [];
  
  // Split by comma for multiple verses
  const parts = verseStr.split(',');
  
  for (const part of parts) {
    if (part.includes('-')) {
      // Handle ranges like "1-3"
      const [start, end] = part.split('-').map(v => parseInt(v.trim(), 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          verses.push(i);
        }
      }
    } else {
      // Single verse
      const verse = parseInt(part.trim(), 10);
      if (!isNaN(verse)) {
        verses.push(verse);
      }
    }
  }
  
  return verses.sort((a, b) => a - b);
}

// Generate URL hash for scripture location
export function generateScriptureUrl(
  volumeName: string,
  bookName: string,
  chapterNumber: number,
  verseNumbers?: number[]
): string {
  const urlVolumeName = volumeNameToUrl(volumeName);
  const urlBookName = bookName.toLowerCase().replace(/\s+/g, '-');
  let url = `#/${urlVolumeName}/${urlBookName}/${chapterNumber}`;
  
  if (verseNumbers && verseNumbers.length > 0) {
    url += `/${verseNumbers.join(',')}`;
  }
  
  return url;
}

// Convert volume name to URL-friendly format
export function volumeNameToUrl(volumeName: string): string {
  return volumeName.toLowerCase().replace(/\s+/g, '-');
}

// Convert URL format back to volume name
export function urlToVolumeName(urlName: string): string {
  return urlName.replace(/-/g, ' ');
}

// Find volume, book, and chapter by names and numbers
export function findScriptureLocation(
  volumes: any[],
  volumeName: string,
  bookName: string,
  chapterNumber: number
): { volume: any; book: any; chapter: any } | null {
  const volume = volumes.find(v => 
    volumeNameToUrl(v.name) === volumeName.toLowerCase()
  );
  
  if (!volume) return null;
  
  const book = volume.books.find((b: any) => 
    b.name.toLowerCase().replace(/\s+/g, '-') === bookName.toLowerCase()
  );
  
  if (!book) return null;
  
  const chapter = book.chapters.find((c: any) => c.number === chapterNumber);
  
  if (!chapter) return null;
  
  return { volume, book, chapter };
} 