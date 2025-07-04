import React, { useState, useMemo } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import VolumeSelector from './components/VolumeSelector';
import BookSelector from './components/BookSelector';
import ChapterViewer from './components/ChapterViewer';
import InstallPrompt from './components/InstallPrompt';
import scripturesData from './data/lds-scriptures.json';

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

  // Reset lower selections when parent changes
  const handleSelectVolume = (volume: Volume) => {
    setSelectedVolume(volume);
    setSelectedBook(null);
    setSelectedChapter(null);
  };
  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setSelectedChapter(null);
  };
  const handleSelectChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
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
          Scripture Reader
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
          />
        )}
      </Box>
      <InstallPrompt />
    </Container>
  );
};

export default App;
