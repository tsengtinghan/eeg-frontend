import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const EEGComponent = () => {
  const [message, setMessage] = useState('default message');
  const buffer = useRef([]);

  useEffect(() => {
    const socket = io('http://127.0.0.1:5000');

    socket.on('eegData', (data) => {
      buffer.current.push(data);

      if (buffer.current.length >= 50) { // Adjust based on data rate
        const sum = buffer.current.reduce((acc, val) => acc + parseInt(val, 10), 0);
        const avg = sum / buffer.current.length;

        if (avg > 0.5) {
          performActionForMostlyOnes();
        } else {
          performActionForMostlyZeros();
        }

        buffer.current = []; // Clear the buffer
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.close();
    };
  }, []);

  const performActionForMostlyOnes = () => {
    setMessage('Mostly 1s received');
    // Add the action to be performed
  };

  const performActionForMostlyZeros = () => {
    setMessage('Mostly 0s received');
    // Add the action to be performed
  };

  return (
    <div>
      <h1>EEG Data Analysis</h1>
      <p>{message}</p>
    </div>
  );
};

export default EEGComponent;
