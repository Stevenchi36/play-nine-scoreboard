import { ref, reactive } from 'vue';
import debounce from 'lodash.debounce';

interface PlayerScores {
  [playerName: string]: ( number | null )[];
}

const DEBOUNCE_TIMEOUT = 2000; // 2s debounce delay

export function usePlayers() {
  const players = reactive<PlayerScores>( {} );
  const holes = ref<number>( 9 );

  function updatePlayerScore( player: string, holeNumber: number, value: number ) {
    if ( !players[player] ) return;
    players[player][holeNumber] = parseInt( value.toString() ) || 0;
    debouncedSavePlayersToDB();
  }

  function addPlayer( playerNames: string ) {
    const playerList = playerNames.split( ',' ).map( ( name ) => name.trim() );
    playerList.forEach( ( playerName ) => {
      if ( !players[playerName] ) {
        players[playerName] = Array( holes.value ).fill( null );
        debouncedSavePlayersToDB();
      } else {
        alert( `Player "${playerName}" already exists.` );
      }
    } );
  }

  function removePlayer( playerName: string ) {
    if ( players[playerName] ) {
      delete players[playerName];
      debouncedSavePlayersToDB();
    } else {
      alert( 'Player not found.' );
    }
  }

  function addHole() {
    holes.value++;
    Object.keys( players ).forEach( ( player ) => {
      players[player].push( null );
    } );
    debouncedSavePlayersToDB();
  }

  function removeHole() {
    if ( holes.value > 1 ) {
      holes.value--;
      Object.keys( players ).forEach( ( player ) => {
        players[player].pop();
      } );
      debouncedSavePlayersToDB();
    } else {
      alert( 'You must have at least one hole.' );
    }
  }


  function clearAllScores() {
    console.log( 'Resetting all scores' );
    Object.keys( players ).forEach( ( player ) => {
      players[player] = Array( holes.value ).fill( null );
    } );
    debouncedSavePlayersToDB();
  }
  // Debounced Save Function
  const debouncedSavePlayersToDB = debounce( () => {
    console.log( 'Saving players to DB:', players );
  }, DEBOUNCE_TIMEOUT );

  return {
    players,
    holes,
    updatePlayerScore,
    addPlayer,
    removePlayer,
    addHole,
    removeHole,
    clearAllScores,
  };
}