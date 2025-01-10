import { Box, Typography, Select, MenuItem } from '@mui/material';

interface DomainSelectorProps {
  domains: string[];
  priorityDomains: string[];
  onDomainSelection: (selectedDomains: string[]) => void;
}

export function DomainSelector({
  domains,
  priorityDomains,
  onDomainSelection,
}: DomainSelectorProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Select Domains to Prioritize
      </Typography>
      <Select
        multiple
        value={priorityDomains}
        onChange={(e) => onDomainSelection(e.target.value as string[])}
        renderValue={(selected) => (selected as string[]).join(', ')}
        fullWidth
      >
        {domains.map((domain) => (
          <MenuItem key={domain} value={domain}>
            {domain}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
