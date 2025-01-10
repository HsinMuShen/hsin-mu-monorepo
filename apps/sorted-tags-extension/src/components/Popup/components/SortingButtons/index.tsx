import { Box, Button } from '@mui/material';

interface SortingButtonsProps {
  onSortPriority: () => void;
  onSortNonPriority: () => void;
  onSortByOpenTime: () => void;
  onRefreshTabs: () => void;
}

export function SortingButtons({
  onSortPriority,
  onSortNonPriority,
  onSortByOpenTime,
  onRefreshTabs,
}: SortingButtonsProps) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
      <Button
        variant="outlined"
        onClick={onSortPriority}
        sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
      >
        Sort Priority Tabs
      </Button>
      <Button
        variant="outlined"
        onClick={onSortNonPriority}
        sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
      >
        Sort Non-Priority Tabs (A–Z)
      </Button>
      <Button
        variant="outlined"
        onClick={onSortByOpenTime}
        sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
      >
        Sort Non-Priority Tabs (Open Time)
      </Button>
      <Button
        variant="outlined"
        onClick={onRefreshTabs}
        sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
      >
        Refresh Tabs
      </Button>
    </Box>
  );
}
