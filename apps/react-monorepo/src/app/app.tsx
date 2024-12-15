import NxWelcome from './nx-welcome';
import { Ui } from '@react-monorepo/ui';
import Button from '@mui/material/Button';

export function App() {
  return (
    <div>
      <Ui />
      <Button variant="contained">Hello World</Button>
      <h1 className="text-4xl font-bold text-blue-500">Hello World</h1>
      <NxWelcome title="react-monorepo" />
    </div>
  );
}

export default App;
