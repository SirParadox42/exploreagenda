import {useState} from 'react';
import {REACT_APP_BACKEND_URL} from '@env';

export default function useHttp() {
    const [isLoading, setIsLoading] = useState(false);

    const sendRequest = async(path, method = 'GET', body = null, headers = {}, backend = true) => {
        setIsLoading(true);
  
        try {
            const response = backend ? await fetch(`${REACT_APP_BACKEND_URL}/${path}`, {method, body, headers}) : await fetch(path);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setIsLoading(false);
            return data;
        } catch(err) {
            setIsLoading(false);
            throw err;
        }
    };

    return [isLoading, sendRequest];
}