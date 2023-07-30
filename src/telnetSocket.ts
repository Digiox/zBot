import { Telnet } from 'telnet-client';
import { telnet_username, telnet_password, game_server_address, game_server_port, telnet_port } from '../config.json';

interface TelnetClient {
  getActualTime: () => Promise<string>;
  getBloodMoonFrequency: () => Promise<number>;
  getDayNightLengthTime: () => Promise<number>;
  closeSocket: () => Promise<void>;
}

const telnetClient = async (): Promise<TelnetClient> => {
  const connection = new Telnet();

  const params = {
    host: game_server_address,
    port: telnet_port,
    timeout: 15000,
    username: telnet_username,
    password: telnet_password,
    passwordPrompt: /Please enter password:/i,
    shellPrompt: /\r\n$/,
    debug: true,
  };

  try {
    await connection.connect(params);
  } catch (error) {
    throw error;
  }

  const getActualTime = async (): Promise<string> => {
    const res = await connection.send('gettime');
    const time = res.match(/Day.*\d{1,2}, \d{1,2}:\d{1,2}/)?.[0];
    return time || '';
  };

  const getBloodMoonFrequency = async (): Promise<number> => {
    try {
      const message = await connection.send('getgamepref BloodMoonFrequency');
      const match = message.match(/GamePref\.BloodMoonFrequency = (\d+)/);
      if (match && match[1]) {
        const number = parseInt(match[1], 10);
        return number;
      } else {
        console.log('Number not found.');
        throw new Error('Number not found.');
      }
    } catch (error) {
      console.error('GetBloodMoonFrequency error:', error);
      throw error;
    }
  };

  const getDayNightLengthTime = async (): Promise<number> => {
    try {
      const message = await connection.send('getgamepref DayNightLength');
      const match = message.match(/GamePref\.DayNightLength = (\d+)/);
      if (match && match[1]) {
        const number = parseInt(match[1], 10);
        return number;
      } else {
        console.log('Number not found.');
        throw new Error('Number not found.');
      }
    } catch (error) {
      console.error('getDayNightLengthTime error:', error);
      throw error;
    }
  };

  const closeSocket = async (): Promise<void> => {
    await connection.end();
  };

  return { getActualTime, getBloodMoonFrequency, closeSocket, getDayNightLengthTime };
};

export default telnetClient;
