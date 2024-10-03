export const playWinSound = () => {
    const winSound = new Audio("/sounds/six.m4a");
    winSound.play();
};

export const playLoseSound = () => {
    const loseSound = new Audio("/sounds/two.m4a");
    loseSound.play();
};