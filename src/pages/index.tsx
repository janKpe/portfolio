import Head from 'next/head';
import React from 'react';
import config from '../../config.json';
import { Input } from '../components/input';
import { Prompt } from '../components/prompt';
import { Decryption } from '../components/decryption';
import { useHistory } from '../components/history/hook';
import { History } from '../components/history/History';
import { banner } from '../utils/bin';

interface IndexPageProps {
  inputRef: React.MutableRefObject<HTMLInputElement>;
}

const IndexPage: React.FC<IndexPageProps> = ({ inputRef }) => {
  const [componentIndex, setComponentIndex] = React.useState<number>(1);

  const containerRef = React.useRef(null);
  // const
  const {
    history,
    command,
    lastCommandIndex,
    setCommand,
    setHistory,
    clearHistory,
    setLastCommandIndex,
  } = useHistory([]);

  const init = React.useCallback(() => setHistory(banner()), []);

  React.useEffect(() => {
    init();
  }, [init]);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollIntoView();
      inputRef.current.focus({ preventScroll: true });
    }
  }, [history]);

  return (
    <>
      <Head>
        <title>{config.title}</title>
      </Head>

      <div className="p-8 overflow-hidden h-full border-2 rounded border-light-yellow dark:border-dark-yellow flicker">
        <div ref={containerRef} className="overflow-y-auto h-full">
          <History history={history} />

          {
            [
              <Prompt
                inputRef={inputRef}
                containerRef={containerRef}
                command={command}
                history={history}
                lastCommandIndex={lastCommandIndex}
                setCommand={setCommand}
                setHistory={setHistory}
                setLastCommandIndex={setLastCommandIndex}
                clearHistory={clearHistory}
                togglePrompt={setComponentIndex}
              />,
              <Input
                inputRef={inputRef}
                containerRef={containerRef}
                command={command}
                history={history}
                lastCommandIndex={lastCommandIndex}
                setCommand={setCommand}
                setHistory={setHistory}
                setLastCommandIndex={setLastCommandIndex}
                clearHistory={clearHistory}
                togglePrompt={setComponentIndex}
              />,
              <Decryption inputRef={inputRef} />,
            ][componentIndex]
          }
        </div>
      </div>
    </>
  );
};

export default IndexPage;
