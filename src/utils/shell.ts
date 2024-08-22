import React from 'react';
import * as bin from './bin';
import config from '../../config.json';

export const shell = async (
  command: string,
  setHistory: (value: string) => void,
  clearHistory: () => void,
  setCommand: React.Dispatch<React.SetStateAction<string>>,
  setComponentIndex: (componentIndex: number) => void,
) => {
  const args = command.split(' ');
  args[0] = args[0].toLowerCase();

  config['promptCommand'] = command;
  if (args[0] === 'clear') {
    clearHistory();
    setCommand('');
  } else if (command.startsWith('sudo')) {
    config.prompt = '[sudo] password for user5617:';
    config.requested_password = config.passwords.password;

    setCommand('');
    setComponentIndex(0);
  } else if (command.startsWith('su ')) {
    config.prompt = 'Password: ';
    config.requested_password = config.passwords.root_password;

    if (args[1] != 'root') {
      setHistory(
        `su: user ${args[1]} does not exist or the user entry does not contain all the required fields`,
      );
    } else {
      setCommand('');
      setComponentIndex(0);
    }
  } else if (command === '') {
    setHistory('');
  } else if (
    !config['logged_in_as_root'] &&
    !config.commands_to_run_without_sudo.includes(args[0])
  ) {
    setCommand('');
    setHistory(`Error: The command '${args[0]}' could not be executed.
You may not have the necessary permissions. Try running the command with 'sudo'?
        
sudo ${args[0]}`);
  } else {
    if (Object.keys(bin).indexOf(args[0]) === -1) {
      setHistory(
        `shell: command not found: ${args[0]}. Try 'help' to get started.`,
      );
      setCommand('');
    } else {
      const output = await bin[args[0]](
        args.slice(1),
        setComponentIndex,
        setCommand,
      );
      setHistory(output);
      setCommand('');
    }
  }
};
