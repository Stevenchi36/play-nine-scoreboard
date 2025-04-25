import { ref, reactive } from 'vue';
import debounce from 'lodash.debounce';
import { openDB } from '../utils/IDB';

const DEBOUNCE_TIMEOUT = 2000; // 2s debounce delay
const DB_STORE_NAME = 'players';

interface PlayerScores {
  [playerName: string]: ( number | null )[];
}


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
    Object.keys( players ).forEach( ( player ) => {
      players[player] = Array( holes.value ).fill( null );
    } );
    debouncedSavePlayersToDB();
  }

  async function loadPlayerFromDB() {
    try {
      const db = await openDB(); // Wait for the database connection
      const transaction = db.transaction( DB_STORE_NAME, 'readonly' );
      const store = transaction.objectStore( DB_STORE_NAME );

      // Retrieve all rows (should only be one)
      const result = await new Promise<Record<string, ( number | null )[]>[]>( ( resolve, reject ) => {
        const getRequest = store.getAll();

        getRequest.onsuccess = () => {
          resolve( getRequest.result );
        };

        getRequest.onerror = ( event ) => {
          reject( event );
        };
      } );

      if ( result.length > 0 ) {
        if ( Object.keys( result[0] ).length > 0 ) {
          holes.value = Object.values( result[0] )[0].length;
        }
        Object.assign( players, result[0] );
      } else {
        console.log( 'No players data found in the database.' );
      }
    } catch ( error ) {
      console.error( 'Error loading players data:', error );
    }
  }

  const debouncedSavePlayersToDB = debounce( async () => {
    const db = await openDB();
    const playersData = toRaw( players );

    return new Promise( ( resolve, reject ) => {
      const transaction = db.transaction( DB_STORE_NAME, 'readwrite' );
      const store = transaction.objectStore( DB_STORE_NAME );

      // Add key 1 to make sure we ever only have one entry
      const addRequest = store.put( playersData, 1 );

      addRequest.onsuccess = () => {
          resolve( undefined );
        };

      addRequest.onerror = ( event ) => {
        reject( event );
      };
    } );
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
    loadPlayerFromDB,
  };
}