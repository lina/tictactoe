import React from 'react';
import ReactDOM from 'react-dom';

// Import components
import Board from './board.jsx';

// import css stylesheet
import './stylesheets/main.scss';

// render the loading screen
ReactDOM.render( <Board/>, document.getElementById('tic-tac-toe-view-placeholder'));
