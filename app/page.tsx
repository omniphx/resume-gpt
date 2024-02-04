import App from './App';
import Chat from './Chat';

export const metadata = {
  title: 'Matthew Mitchener | ResumeGPT',
};

export default function Home() {
  return (
    <main>
      <App>
        <Chat />
      </App>
    </main>
  );
}
