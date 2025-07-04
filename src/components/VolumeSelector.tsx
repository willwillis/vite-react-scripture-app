import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

type Volume = {
  id: number;
  name: string;
  books: any[];
};

type Props = {
  volumes: Volume[];
  selectedVolume: Volume | null;
  onSelect: (volume: Volume) => void;
};

// Short names for mobile display
const getVolumeShortName = (name: string) => {
  const shortNames: { [key: string]: string } = {
    'Old Testament': 'OT',
    'New Testament': 'NT', 
    'Book of Mormon': 'BOM',
    'Doctrine and Covenants': 'D&C',
    'Pearl of Great Price': 'POGP'
  };
  return shortNames[name] || name;
};

const VolumeSelector: React.FC<Props> = ({ volumes, selectedVolume, onSelect }) => (
  <Box 
    mb={3} 
    sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'row', sm: 'row' },
      gap: { xs: 1, sm: 2 },
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}
  >
    {volumes.map((volume) => (
      <Button
        key={volume.id}
        variant={selectedVolume?.id === volume.id ? 'contained' : 'outlined'}
        onClick={() => onSelect(volume)}
        size="medium"
        sx={{ 
          minWidth: { xs: '120px', sm: 'auto' },
          fontSize: { xs: '0.875rem', sm: '1rem' },
          whiteSpace: 'nowrap'
        }}
      >
        <Box sx={{ display: { xs: 'block', sm: 'block' } }}>
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            {getVolumeShortName(volume.name)}
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {volume.name}
          </Box>
        </Box>
      </Button>
    ))}
  </Box>
);

export default VolumeSelector; 