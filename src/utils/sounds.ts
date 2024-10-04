export const playWinSound = () => {
    const winSound = new Audio("/sounds/six.m4a");
    winSound.play();
};

export const playLoseSound = () => {
    const loseSound = new Audio("/sounds/two.m4a");
    loseSound.play();
};

export const playNextLevelSound = () => {
    const loseSound = new Audio("/sounds/next-level.mp3");
    loseSound.play();
};
export const playFinishLevel1Sound = () => {
    const loseSound = new Audio("/sounds/success.mp3");
    loseSound.play();
};

export const playFinishLevel2Sound = () => {
    const loseSound = new Audio("/sounds/finish.m4a");
    loseSound.play();
};