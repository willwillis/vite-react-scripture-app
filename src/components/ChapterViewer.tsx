import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type Chapter = {
  id: number;
  number: number;
  verses: string[];
};

type Book = {
  id: number;
  name: string;
  chapters: Chapter[];
};

type Props = {
  book: Book;
  selectedChapter: Chapter | null;
  onSelectChapter: (chapter: Chapter) => void;
};

const ChapterViewer: React.FC<Props> = ({ book, selectedChapter, onSelectChapter }) => (
  <Box>
    <Box mb={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
      {book.chapters.map((chapter) => (
        <Button
          key={chapter.id}
          variant={selectedChapter?.id === chapter.id ? 'contained' : 'outlined'}
          onClick={() => onSelectChapter(chapter)}
          size="small"
          sx={{ 
            minWidth: { xs: 36, sm: 40 },
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          {chapter.number}
        </Button>
      ))}
    </Box>
    {selectedChapter && (
      <Box>
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          {book.name} {selectedChapter.number}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: { xs: 1.5, sm: 1 },
          px: { xs: 1, sm: 0 }
        }}>
          {selectedChapter.verses.map((verse, idx) => (
            <Typography 
              key={idx} 
              variant="body1"
              sx={{ 
                fontSize: { xs: '1rem', sm: '1rem' },
                lineHeight: { xs: 1.6, sm: 1.5 },
                textAlign: 'justify'
              }}
            >
              <strong>{idx + 1}</strong> {verse}
            </Typography>
          ))}
        </Box>
      </Box>
    )}
  </Box>
);

export default ChapterViewer; 