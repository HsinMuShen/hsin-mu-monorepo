import { Box, Button } from '@mui/material';

interface SortingButtonsProps {
  onSortPriority: () => void;
  onSortNonPriority: () => void;
  onRefreshTabs: () => void;
}

export function SortingButtons({
  onSortPriority,
  onSortNonPriority,
  onRefreshTabs,
}: SortingButtonsProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <Button
        variant="outlined"
        onClick={onSortPriority}
        sx={{ fontSize: '0.75rem' }}
      >
        Sort Priority Tabs
      </Button>
      <Button
        variant="outlined"
        onClick={onSortNonPriority}
        sx={{ fontSize: '0.75rem' }}
      >
        Sort Non-Priority Tabs (A–Z)
      </Button>
      <Button
        variant="outlined"
        onClick={onRefreshTabs}
        sx={{ fontSize: '0.75rem' }}
      >
        Refresh Tabs
      </Button>
    </Box>
  );
}
