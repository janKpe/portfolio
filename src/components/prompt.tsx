import React, { useEffect } from 'react';
import { commandExists } from '../utils/commandExists';
import { History as HistoryInterface } from './history/interface';
import { shell } from '../utils/shell';
import { handleTabCompletion } from '../utils/tabCompletion';
import { Ps1 } from './Ps1';
import config from '../../config.json';
import * as bin from '../utils/bin';

export const Prompt = ({
  inputRef,
  containerRef,
  command,
  history,
  lastCommandIndex,
  setCommand,
  setHistory,
  setLastCommandIndex,
  clearHistory,
  togglePrompt: setComponentIndex,
}) => {
  const onSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    const commands: [string] = history
      .map(({ command }) => command)
      .filter((command: string) => command);

    if (event.key === 'Enter' || event.code === '13') {
      event.preventDefault();

      if (command === config.requested_password) {
        if (config['promptCommand'].startsWith('su root')) {
          setCommand('');
          setComponentIndex(1);
          config.logged_in_as_root = true;
          config.ps1_username = 'root';
          return;
        }
        var args: string[] = config['promptCommand'].split(' ');
        args.shift();

        if (args.length == 0) {
          setHistory(
            `shell: command not found: '' Try 'help' to get started.`,
            config['promptCommand'],
          );
        } else {
          args[0] = args[0].toLowerCase();
          if (Object.keys(bin).indexOf(args[0]) === -1) {
            setHistory(
              `shell: command not found: ${args[0]}. Try 'help' to get started.`,
              config['promptCommand'],
            );
          } else {
            const output = await bin[args[0]](
              args.slice(1),
              setComponentIndex,
              setCommand,
            );
            setHistory(output, config['promptCommand']);
          }
        }
      } else {
        setHistory('Password incorrect', config['promptCommand']);
      }

      setCommand('');
      setLastCommandIndex(0);
      setComponentIndex(1);
    }
  };

  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(value);
  };

  return (
    <div>
      <div className="flex flex-row space-x-2">
        <div className="flex-shrink">
          <Ps1 />
        </div>

        <div className="flex-grow">{config['promptCommand']} </div>
      </div>
      <div className="flex flex-row space-x-2">
        <label htmlFor="prompt">{config.prompt}</label>
        <input
          ref={inputRef}
          id="inputPrompt"
          type="password"
          className={`bg-light-background dark:bg-dark-background focus:outline-none flex-grow ${
            commandExists(command) || command === ''
              ? 'text-dark-green'
              : 'text-dark-red'
          }`}
          value={command}
          onChange={onChange}
          autoFocus
          onKeyDown={onSubmit}
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default Prompt;
