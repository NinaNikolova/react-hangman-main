
import two from "../sounds/six.m4a";


export const handleUserWin6 = () => {
    const audio = new Audio(six);
    audio.volume = 0.2;
    audio.play().catch((error) => {
        console.log('Playback prevented: ', error);
    });

};