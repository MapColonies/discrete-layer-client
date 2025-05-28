import { useEffect, useState } from 'react';

const SECOND = 1000;

const useDateNow = (): Date => {
    const [dateNow, setDateNow] = useState<Date>(new Date());

    useEffect(() => {
        const secondInterval = setInterval(() => {
            setDateNow(new Date());
        }, SECOND);

        return (): void => {
            clearInterval(secondInterval);
        }
    }, [])

    return dateNow;
}

export default useDateNow;