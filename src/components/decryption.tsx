import React, { useEffect, useState } from 'react';
import config from '../../config.json';
import Ps1 from './Ps1';

export const Decryption = ({ inputRef }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i_string = 0;
    let i_letters = 0;
    let currentString = '';
    let letters = 'abcdefghijklmnopqrstuvwxyz 1234567890$-#{}:_£?=.,&@+"';

    const createBorder = (length) => {
      const borderChar = '=';
      const header = 'DECRYPTING';
      const borderLength = length + 12; // 6 spaces on each side of the string
      const halfBorder = borderChar.repeat(
        Math.max(0, (borderLength - header.length) / 2),
      );
      return `${halfBorder}[${header}]${halfBorder}\n`;
    };

    const formatText = (text) => {
      const padding = ' '.repeat(6);
      return padding + text + padding;
    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const decrypt = async () => {
      let string = config.password_to_decrypt;
      const borderStart = createBorder(string.length);
      const borderEnd = '='.repeat(borderStart.length - 1); // Adjust length based on borderStart

      setDisplayText(
        borderStart + formatText('x'.repeat(string.length)) + '\n' + borderEnd,
      );

      while (currentString !== string.toLowerCase()) {
        let current_letter = letters[i_letters];
        await delay(14); // 14ms delay
        let partiallyDecrypted =
          currentString +
          current_letter +
          'x'.repeat(string.length - currentString.length - 1);
        setDisplayText(
          borderStart + formatText(partiallyDecrypted) + '\n' + borderEnd,
        );

        var test = string[i_string].toLowerCase();
        if (test === current_letter) {
          currentString += current_letter;
          i_string++;
          i_letters = 0;
        } else {
          i_letters++;
        }
        if (i_letters >= letters.length) {
          i_letters = 0;
        }
      }

      setDisplayText(
        borderStart + formatText(currentString) + '\n' + borderEnd,
      ); // Set final result
    };

    decrypt(); // Run the decryption animation
  }, []);

  // Additional useEffect to ensure the scroll happens after the text update
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollIntoView();
    }
  }, [displayText, inputRef]);

  return (
    <div>
      <div className="flex flex-row space-x-2">
        <div className="flex-shrink">
          <Ps1 />
        </div>
        <div className="flex-grow">{config['promptCommand']} </div>
      </div>
      <div className="flex flex-row space-x-2">
        <p
          ref={inputRef}
          className="whitespace-pre-wrap mb-2"
          style={{ lineHeight: 'normal' }}
        >
          {displayText}
        </p>
      </div>
    </div>
  );
};

export default Decryption;
