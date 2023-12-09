const playBtn = document.getElementById('playBtn');
const backward = document.getElementById('backward');
const header = document.querySelector('header');
const body = document.querySelector('body');
const player2Card = document.querySelector('.player2Card');
const player1Card = document.querySelector('.player1Card');

// INTRO
body.addEventListener('click', (event) => {
    if (event.target === playBtn) {
        header.classList.add('toggleHidden');
    } else if (event.target === backward) {
        header.classList.remove('toggleHidden');
    }
});

// PREPARE GAME
// Rounds
const nbRound = document.getElementById('nbRound');
const maxRounds = document.getElementById('maxRounds');
const player1Username = document.getElementById('player1Username');
const player2Username = document.getElementById('player2Username');

// gameOption
const gameOptn = document.getElementById('gameOptn');
const inputs = document.querySelectorAll('input');
const cards = document.querySelectorAll('.cards');
const player1Display = document.querySelector('#player1Display');
const player2Display = document.querySelector('#player2Display');
const player1 = document.querySelector('#player1');
const player2 = document.querySelector('#player2');

gameOptn.addEventListener('change', (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === 'vsComputer') {
        player1Username.style.display = 'none';
        player1.textContent = 'Computer';
        player2.textContent = 'Player 1';

        cards.forEach(card => {
            card.classList.remove('card');
        });
    } else {
        player1Username.style.display = 'block';
        player1.textContent = 'Player 1';
        player2.textContent = 'Player 2';
        player1Card.style.opacity = 1;
        player2Card.style.opacity = 0.5; 
        cards.forEach(card => {
            card.classList.add('card');
        });
    }
});


// Input Display Equivalence
const inputDisplayEquivalence = {
    'player2Username': 'player2',
    'player1Username': 'player1',
    'nbRound': 'maxRounds',
};

// Input Event Listeners
inputs.forEach(input => {
    input.addEventListener('input', (event) => {
        const inputId = event.target.id;
        const inputValue = event.target.value;
        localStorage.setItem(inputId, inputValue);

        const displayEquivalentId = inputDisplayEquivalence[inputId];
        const displayElement = document.getElementById(displayEquivalentId);

        displayElement.textContent = inputValue;

        if (inputId === 'player2Username') {
            const player2Display = document.querySelector('#player2Display');
            if (player2Display) {
                player2Display.textContent = player2Username.value;
            }
        } else if (inputId === 'player1Username') {
            const player1Display = document.querySelector('#player1Display');
            if (player1Display) {
                player1Display.textContent = player1Username.value;
            }
        }
    });
});

maxRounds.classList.add('maxRounds');

// COMPUTER SELECTED CARD
const computerChoice = () => {
    const computerCards = document.querySelectorAll('.player1Card .cards');
    const randomChoice = Math.floor(Math.random() * computerCards.length);
    return computerCards[randomChoice].getAttribute('data-name');
}

// Players selected card
const cardsContainer = document.querySelector('.card-container');
let computerSelectedChoice = null;
let hasClicked = true;
const Rounds = document.querySelector('.Rounds')
const message = document.querySelector('aside h2')

let currentRound = Number(Rounds.innerHTML)

let player1Choice = ''

const resetCardOpacity = () => {
    cards.forEach(card => {
        card.style.opacity = 1;
    });
};

cards.forEach(card => {
    card.addEventListener('click', (e) => {
        if (hasClicked && e.target.parentElement === player2Card && gameOptn.value === 'vsComputer') {
            // Click only one time
            hasClicked = !hasClicked;

            // Store the player's choice
            const player2Choice = card.getAttribute('data-name');

            // Store the computer's choice
            const computerSelectedChoice = computerChoice();
            const computerCard = document.querySelector(`.player1Card .cards[data-name="${computerSelectedChoice}"]`);

            roundsWinner(player2Choice, computerSelectedChoice, card, computerCard);

            if (currentRound < maxRounds.innerText) {
                currentRound+=1
                Rounds.innerHTML = currentRound
                setTimeout(() => {
                    message.textContent = 'Make your Choice'
                    }, 1500);
            }

            if (currentRound >= maxRounds.innerHTML) {
                hasClicked = !hasClicked;
                finalWinner(computerScore, playerScore)
            } // stop the game after reaching the maxRounds

            // Determine the winner after a delay
            setTimeout(() => {
                // Reset all values
                hasClicked = !hasClicked;
                [card, computerCard].forEach(c => {
                    c.classList.remove('winner', 'looser', 'tie');
                });
            }, 1500);
        }

        if (gameOptn.value !== 'vsComputer') {
            hasClicked = true
            if (hasClicked && e.target.parentElement === player1Card){
                player1Card.style.opacity = 0.5;
                player2Card.style.opacity = 1;
                hasClicked = !hasClicked;
                player1Choice = e.target.dataset.name
            } else if (hasClicked && e.target.parentElement === player2Card) {
                player1Card.style.opacity = 1;
                player2Card.style.opacity = 0.5;        
                let player2Choice = e.target.dataset.name
                const player1cards = document.querySelector(`.player1Card .cards[data-name="${player1Choice}"]`);
                hasClicked = !hasClicked

                
                if (currentRound < maxRounds.innerText) {
                    currentRound+=1

                    roundsWinner(player1Choice, player2Choice, player1cards, card)
                    player1Card.classList.add('opacity')
                    player2Card.classList.add('opacity')
                    Rounds.innerHTML = currentRound
                    setTimeout(() => {
                        message.textContent = 'Make your Choice'
                        player1Card.classList.remove('opacity')
                        player2Card.classList.remove('opacity')
                        }, 1500);
                }

                if (currentRound >= maxRounds.innerHTML) {
                    hasClicked = !hasClicked;
                    finalWinner(computerScore, playerScore)
                } // stop the game after reaching the maxRounds
    
                // Determine the winner after a delay
                setTimeout(() => {
                    // Reset all values
                    hasClicked = !hasClicked;
                    [card, player1cards].forEach(c => {
                        c.classList.remove('winner', 'looser', 'tie');
                    });
                }, 1500);
            }
        }
    });
});

const player1Score = document.querySelector('.player1Score')
const player2Score = document.querySelector('.player2Score')
let computerScore = Number(player1Score.innerHTML)
let playerScore = Number(player2Score.innerHTML)


// Determine Winner in each round (vs computer)
const roundsWinner = (playerChoice, computerChoice, playerCard, computerCard) => {
    console.log(computerCard)
    if (playerChoice === computerChoice) {
        // Draw
        playerCard.classList.add('tie');
        computerCard.classList.add('tie');
        playerCard.style.opacity = 1
        computerCard.style.opacity = 1
        message.innerHTML = 'This is a tie'
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        // Player wins
        playerCard.classList.add('winner');
        computerCard.classList.add('looser');
        playerCard.style.opacity = 1
        computerCard.style.opacity = 1
        playerScore+=1
        player2Score.innerHTML = playerScore
        message.textContent = `${player2.textContent} wins this round`

    } else {
        // Computer wins
        computerCard.classList.add('winner');
        playerCard.classList.add('looser');
        playerCard.style.opacity = 1
        computerCard.style.opacity = 1
        computerScore+=1
        player1Score.innerHTML = computerScore
        message.textContent = `${player1.textContent} wins this round`
    }
}


// Determine the Final Winner

const finalWinner = (computerScore, playerScore) => {
    const tieEffect = new Audio('./asset/audio/tie.mp3')
    const winEffect = new Audio('./asset/audio/win.mp3')
    const looseEffect = new Audio('./asset/audio/loose.mp3')
    const restartGame = document.querySelector('.restartGame')
    if (computerScore === playerScore) {
        body.classList.add('final-tie')
        tieEffect.play()
        message.textContent = 'This is a Tie...'

    } else if (playerScore > computerScore) {
        body.classList.add('final-winner')
        canvas.width = W;
        canvas.height = H;
        Draw();
        winEffect.play()
        message.textContent = `${player2.textContent} wins the game`
    } else {
        body.classList.add('final-looser')
        looseEffect.play()
        message.textContent = `${player1.textContent} wins the game`

    }
    setTimeout(() => {
        restartGame.style.zIndex= 5;
        restartGame.style.opacity= 1;
    }, 1500)

}

const restartGaming = () => {
    location.reload()
}


// CONFETTI https://www.codepel.com/animation/animated-confetti-background/

let W = window.innerWidth;
let H = document.getElementById('confetti').clientHeight;
const canvas = document.getElementById('confetti');
const context = canvas.getContext("2d");
const maxConfettis = 25;
const particles = [];

const possibleColors = [
  "#ff7336",
  "#f9e038",
  "#02cca4",
  "#383082",
  "#fed3f5",
  "#b1245a",
  "#f2733f"
];

function randomFromTo(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

function confettiParticle() {
  this.x = Math.random() * W; // x
  this.y = Math.random() * H - H; // y
  this.r = randomFromTo(11, 33); // radius
  this.d = Math.random() * maxConfettis + 11;
  this.color =
    possibleColors[Math.floor(Math.random() * possibleColors.length)];
  this.tilt = Math.floor(Math.random() * 33) - 11;
  this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
  this.tiltAngle = 0;

  this.draw = function() {
    context.beginPath();
    context.lineWidth = this.r / 2;
    context.strokeStyle = this.color;
    context.moveTo(this.x + this.tilt + this.r / 3, this.y);
    context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
    return context.stroke();
  };
}

function Draw() {
  const results = [];

  // Magical recursive functional love
  requestAnimationFrame(Draw);

  context.clearRect(0, 0, W, window.innerHeight);

  for (var i = 0; i < maxConfettis; i++) {
    results.push(particles[i].draw());
  }

  let particle = {};
  let remainingFlakes = 0;
  for (var i = 0; i < maxConfettis; i++) {
    particle = particles[i];

    particle.tiltAngle += particle.tiltAngleIncremental;
    particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
    particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

    if (particle.y <= H) remainingFlakes++;

    // If a confetti has fluttered out of view,
    // bring it back to above the viewport and let if re-fall.
    if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
      particle.x = Math.random() * W;
      particle.y = -30;
      particle.tilt = Math.floor(Math.random() * 10) - 20;
    }
  }

  return results;
}

window.addEventListener(
  "resize",
  function() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  },
  false
);

// Push new confetti objects to `particles[]`
for (var i = 0; i < maxConfettis; i++) {
  particles.push(new confettiParticle());
}
