export const playWinSound = () => {
    const winSound = new Audio("../../public/sounds/six.m4a");
    winSound.play();
};

export const playLoseSound = () => {
    const loseSound = new Audio("../../public/sounds/two.m4a");
    loseSound.play();
};