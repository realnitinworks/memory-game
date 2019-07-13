import React, {Component} from 'react';
import './App.css';


const MAX_MOVES = 20;
const NUM_DECKS = 2;
const CARDS_PER_DECK = 8;
const NUM_CARDS = NUM_DECKS * CARDS_PER_DECK;
const CARD_MASK = "?";
const GAME_STATES = {
  START: 0,
  CLICK1: 1,
  CLICK2: 2
}
const MASK_STATES = {
  MASK: true,
  NO_MASK: false
}
const GAME_RESULT = {
  IN_PROGRESS: 0,
  WON: 1
}

class App extends Component {
  constructor(props) {
    super(props);
    this.numbers = [];
    this.state = {
      cards: []
    }
  }

  componentDidMount() {
    this.resetGame();
  }

  resetGame = () => {
    this.numbers = this.generate_random_card_numbers(NUM_DECKS);
    this.gameState = GAME_STATES.START;
    this.click1Card = null;
    this.click2Card = null;

    
    const cards = [];
    for (const [index, number] of this.numbers.entries()) {
      cards.push(<button className="btn btn-warning btn-lg text-dark mx-2" id={`card_${index}`} onClick={this.cardClick} key={index} value={number}>{CARD_MASK}</button>)
    }
    this.setState({
      cards: cards,
      moves: 0,
      result: GAME_RESULT.IN_PROGRESS
    })
  }

  check_game_result = (cards, moves) => {
    let allCardsDisabled = true;
    for (let card of cards) {
      if (!card.props.hasOwnProperty('disabled')){
        allCardsDisabled = false;
        break;
      }
    } 

    if (allCardsDisabled) {
      return GAME_RESULT.WON;
    }
    return GAME_RESULT.IN_PROGRESS;
  }

  updateCards = (cards, masks, disabled) => {
    let newCards = [];

    for (let orgCard of this.state.cards) {
      let id = orgCard.props.id;
      let onClick = orgCard.props.onClick;
      let key = orgCard.key;
      let value = orgCard.props.value;
      let innerHTML = orgCard.props.children;
      let button = <button className="btn btn-warning btn-lg text-dark mx-2" id={id} onClick={onClick} key={key} value={value}>{innerHTML}</button>;
      if (orgCard.props.hasOwnProperty('disabled')) {
        button = <button className="btn btn-warning btn-lg text-dark mx-2" id={id} onClick={onClick} key={key} value={value} disabled>{innerHTML}</button>;
      }
      if (cards.includes(orgCard.props.id)) {
        let mask = masks[cards.indexOf(orgCard.props.id)];
        innerHTML = (mask)? CARD_MASK: value;
        button = <button className="btn btn-warning btn-lg text-dark mx-2" id={id} onClick={onClick} key={key} value={value}>{innerHTML}</button>;
        let disable = disabled[cards.indexOf(orgCard.props.id)];
        
        if (disable) {
          button = <button className="btn btn-warning btn-lg text-dark mx-2" id={id} onClick={onClick} key={key} value={value} disabled>{innerHTML}</button>
        }
      }
      newCards.push(button);
    }
    
    return newCards;  
  }

  cardClick = (event) => {
    let target = event.target;
    let newCards = [];
    let moves = this.state.moves;
    let game_result = this.state.result;
        
    if(this.gameState === GAME_STATES.START) {
      this.click1Card = target;
      newCards = this.updateCards([this.click1Card.id], [MASK_STATES.NO_MASK], [true]);
      this.gameState = GAME_STATES.CLICK1;
    }
    else if (this.gameState === GAME_STATES.CLICK1) {
      this.click2Card = target;
      newCards = this.updateCards([this.click1Card.id, this.click2Card.id], [MASK_STATES.NO_MASK, MASK_STATES.NO_MASK], [true, true]);
      this.gameState = GAME_STATES.CLICK2;
      game_result = this.check_game_result(newCards, moves);
    }
    else { 
      let cards = [this.click1Card.id, this.click2Card.id, target.id];
      let masks = [MASK_STATES.MASK, MASK_STATES.MASK, MASK_STATES.NO_MASK];
      let disabled = [false, false, true]

      if (this.click1Card.value === this.click2Card.value) {
        masks = [MASK_STATES.NO_MASK, MASK_STATES.NO_MASK, MASK_STATES.NO_MASK];
        disabled = [true, true, true]
      }
      
      newCards = this.updateCards(cards, masks, disabled);
      this.click1Card = target;
      this.gameState = GAME_STATES.CLICK1;

      // Every third click is a move (comprising the previous 2 clicks)
      moves = moves + 1;
      
      game_result = this.check_game_result(newCards, moves);
      console.log("Game Result= ", game_result)
    } 

    this.setState({
      cards: newCards,
      moves: moves,
      result: game_result
    });
  }

  shuffle = (range=CARDS_PER_DECK) => {
    let shuffled = []

    while(true) {
        let num = this.random(range)
        if (shuffled.includes(num)) {
            continue;
        }
        else {
            shuffled.push(num);
            if (shuffled.length === range){
                break;
            }
        }
    }
    return shuffled;
  }

  random = range => {
    let min = 1;
    let max = range + 1;
    let random = Math.floor(Math.random() * (+max - +min)) + +min;
    return random;
  }

  generate_random_card_numbers = numDecks => {
    let cards = [];
    for (let i= 0; i < numDecks; i++) {
        cards = cards.concat(this.shuffle(CARDS_PER_DECK));
    }

    let random_cards = [];
    let random_indices = this.generate_random_indices();
    for (let index of random_indices) {
      random_cards.push(cards[index - 1]); // Random indices start from 1, but 'cards' array start from index 0
    }
     
    return random_cards;
  }

  generate_random_indices = (range=NUM_CARDS) => {
    return this.shuffle(NUM_CARDS);
  }  

  render () {
    
    return (
      <div className="App">
        <div className="jumbotron jumbotron-fluid bg-primary text-white">
          <div className="container">
            <h1 className="display-1">Memory Game</h1>
            <p className="lead display-5">Test your memory in {MAX_MOVES} moves</p>
          </div>
        </div>        
        <div className="mt-5">
          {this.state.cards}
        </div>        
        <div className="mt-3 text-info display-3">
          MOVES: {this.state.moves}
        </div>  
        {this.state.result === GAME_RESULT.WON && 
          <div className="mt-3 text-success display-4 lead">
            You won in {this.state.moves} moves. <button className="reset btn btn-sm btn-outline-secondary" onClick={this.resetGame}>Play Again</button>
          </div>
        }
        {this.state.result !== GAME_RESULT.WON && 
          <div className="mt-3">
            <button className="reset btn btn-sm btn-outline-danger" onClick={this.resetGame}>RESET GAME</button>
          </div>
        }               
      </div>
    );
  }
}

export default App;
