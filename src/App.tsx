import React, { useState, useMemo, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import VolumeSelector from './components/VolumeSelector';
import BookSelector from './components/BookSelector';
import ChapterViewer from './components/ChapterViewer';
import InstallPrompt from './components/InstallPrompt';
import scripturesData from './data/lds-scriptures.json';
import { parseScriptureUrl, findScriptureLocation, generateScriptureUrl, volumeNameToUrl } from './utils/navigation';

// Types for scripture data
type Volume = {
  id: number;
  name: string;
  books: Book[];
};
type Book = {
  id: number;
  name: string;
  chapters: Chapter[];
};
type Chapter = {
  id: number;
  number: number;
  verses: string[];
};

// Raw verse data type
type RawVerse = {
  volume_title: string;
  book_title: string;
  book_short_title: string;
  chapter_number: number;
  verse_number: number;
  verse_title: string;
  verse_short_title: string;
  scripture_text: string;
};

const App: React.FC = () => {
  const [selectedVolume, setSelectedVolume] = useState<Volume | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [highlightedVerses, setHighlightedVerses] = useState<number[]>([]);
  const [isNavigatingFromUrl, setIsNavigatingFromUrl] = useState(false);

  // Process the flat data into hierarchical structure
  const volumes: Volume[] = useMemo(() => {
    const volumeMap = new Map<string, Map<string, Map<number, string[]>>>();
    
    // Group verses by volume, book, and chapter
    (scripturesData as RawVerse[]).forEach((verse) => {
      if (!volumeMap.has(verse.volume_title)) {
        volumeMap.set(verse.volume_title, new Map());
      }
      const bookMap = volumeMap.get(verse.volume_title)!;
      
      if (!bookMap.has(verse.book_title)) {
        bookMap.set(verse.book_title, new Map());
      }
      const chapterMap = bookMap.get(verse.book_title)!;
      
      if (!chapterMap.has(verse.chapter_number)) {
        chapterMap.set(verse.chapter_number, []);
      }
      chapterMap.get(verse.chapter_number)!.push(verse.scripture_text);
    });

    // Convert to the expected format
    const processedVolumes: Volume[] = [];
    let volumeId = 1;
    
    volumeMap.forEach((bookMap, volumeName) => {
      const books: Book[] = [];
      let bookId = 1;
      
      bookMap.forEach((chapterMap, bookName) => {
        const chapters: Chapter[] = [];
        let chapterId = 1;
        
        // Sort chapters by number
        const sortedChapters = Array.from(chapterMap.entries()).sort((a, b) => a[0] - b[0]);
        
        sortedChapters.forEach(([chapterNumber, verses]) => {
          chapters.push({
            id: chapterId++,
            number: chapterNumber,
            verses: verses
          });
        });
        
        books.push({
          id: bookId++,
          name: bookName,
          chapters: chapters
        });
      });
      
      processedVolumes.push({
        id: volumeId++,
        name: volumeName,
        books: books
      });
    });

    return processedVolumes;
  }, []);

  // Handle URL navigation
  useEffect(() => {
    const handleHashChange = () => {
      setIsNavigatingFromUrl(true);
      const location = parseScriptureUrl(window.location.hash);
      if (location) {
        const result = findScriptureLocation(volumes, location.volumeName, location.bookName, location.chapterNumber);
        if (result) {
          setSelectedVolume(result.volume);
          setSelectedBook(result.book);
          setSelectedChapter(result.chapter);
          setHighlightedVerses(location.verseNumbers || []);
          
          // Scroll to highlighted verse if any
          if (location.verseNumbers && location.verseNumbers.length > 0) {
            setTimeout(() => {
              const firstVerse = document.getElementById(`verse-${location.verseNumbers![0]}`);
              if (firstVerse) {
                firstVerse.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 100);
          }
        }
      }
      // Reset the flag after a short delay
      setTimeout(() => setIsNavigatingFromUrl(false), 100);
    };

    // Handle initial load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [volumes]);

  // Update URL when selections change (but not from URL navigation)
  useEffect(() => {
    if (!isNavigatingFromUrl) {
      let url = '';
      
      if (selectedVolume && selectedBook && selectedChapter) {
        // Full navigation: volume/book/chapter
        url = generateScriptureUrl(selectedVolume.name, selectedBook.name, selectedChapter.number);
      } else if (selectedVolume && selectedBook) {
        // Partial navigation: volume/book
        url = `#/${volumeNameToUrl(selectedVolume.name)}/${selectedBook.name.toLowerCase().replace(/\s+/g, '-')}`;
      } else if (selectedVolume) {
        // Volume only: volume
        url = `#/${volumeNameToUrl(selectedVolume.name)}`;
      }
      
      // Only update URL if it's different from current hash
      if (url && window.location.hash !== url) {
        // Use pushState to create a new history entry for user navigation
        window.history.pushState(null, '', url);
      }
    }
  }, [selectedVolume, selectedBook, selectedChapter, isNavigatingFromUrl]);

  // Reset lower selections when parent changes
  const handleSelectVolume = (volume: Volume) => {
    setSelectedVolume(volume);
    setSelectedBook(null);
    setSelectedChapter(null);
    setHighlightedVerses([]); // Clear highlights when changing volume
  };
  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setHighlightedVerses([]); // Clear highlights when changing book
    // Auto-select first chapter if book has only one chapter
    if (book.chapters.length === 1) {
      setSelectedChapter(book.chapters[0]);
    } else {
      setSelectedChapter(null);
    }
  };
  const handleSelectChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setHighlightedVerses([]); // Clear highlights when changing chapter
  };

  return (
    <Container maxWidth={false} sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'flex-start',
      px: { xs: 1, sm: 2, md: 3 } // Reduced responsive padding
    }}>
      <Box pt={{ xs: 1, sm: 2 }} pb={4} sx={{ width: '100%', flex: 1 }}>
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            mb: { xs: 2, sm: 3 }
          }}
        >
          The Scriptures
        </Typography>
        <VolumeSelector
          volumes={volumes}
          selectedVolume={selectedVolume}
          onSelect={handleSelectVolume}
        />
        {selectedVolume && (
          <BookSelector
            books={selectedVolume.books}
            selectedBook={selectedBook}
            onSelect={handleSelectBook}
          />
        )}
        {selectedBook && (
          <ChapterViewer
            book={selectedBook}
            selectedChapter={selectedChapter}
            onSelectChapter={handleSelectChapter}
            highlightedVerses={highlightedVerses}
            volumeName={selectedVolume?.name || ''}
          />
        )}
      </Box>
      <InstallPrompt />
    </Container>
  );
};

export default App;
