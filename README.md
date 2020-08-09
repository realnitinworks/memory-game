# Memory Game App

This project is a game application developed using React and Bootstrap4.

## GamePlay

The user is presented with a set of unexposed cards when the game is launched. Each card holds a random number beneath. There are exactly 2 cards holding the same number.

![Game Launch](/screenshots/memory_card_game_react_initial_screen.jpg)

The user needs to flip a card to expose the number it holds. He then has to find a corresponding matching card. If the cards match, the cards remain exposed, otherwise they get flipped back. At any stage during the game, the user could reset the game.

![Game Progress](/screenshots/memory_card_game_react_game_in_progress.jpg)

The game continues until all the cards are exposed. The user wins when all cards are exposed. He is then presented with the button to play again.

![Game Won](/screenshots/memory_card_game_react_game_won.jpg)

## How to run the app

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Project bootstrap

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). It uses Bootstrap4 to nicely render the GUI.

