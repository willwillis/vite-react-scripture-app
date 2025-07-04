import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Types for scripture data
type Chapter = {
  id: number;
  number: number;
  verses: string[];
};

interface VerseDisplayProps {
  chapter: Chapter;
  highlightedVerses?: number[];
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({ chapter, highlightedVerses = [] }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Chapter {chapter.number}
      </Typography>
      <Box sx={{ 
        textAlign: 'left', 
        lineHeight: 1.8,
        '& .verse': {
          marginBottom: 1,
          padding: 0.5,
          borderRadius: 1,
          transition: 'background-color 0.2s ease'
        },
        '& .verse.highlighted': {
          backgroundColor: 'rgba(255, 193, 7, 0.2)',
          borderLeft: '4px solid #ffc107',
          paddingLeft: 1
        }
      }}>
        {chapter.verses.map((verse: string, index: number) => {
          const verseNumber = index + 1;
          const isHighlighted = highlightedVerses.includes(verseNumber);
          
          return (
            <Box
              key={index}
              className={`verse ${isHighlighted ? 'highlighted' : ''}`}
              id={`verse-${verseNumber}`}
            >
              <Typography component="span" sx={{ fontWeight: 'bold' }}>
                {verseNumber}.
              </Typography>{' '}
              <Typography component="span">
                {verse}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default VerseDisplay; 