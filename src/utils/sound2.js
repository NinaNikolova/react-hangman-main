
import two from "../sounds/six.m4a";



export const handleUserWin2 = () => {
    const audio = new Audio(two);
    audio.volume = 0.2;
    audio.play().catch((error) => {
        console.log('Playback prevented: ', error);
    });

};

