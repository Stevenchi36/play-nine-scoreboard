<script setup lang="ts">
import { computed, ref } from 'vue';

// Props
const props = defineProps<{
  players: Record<string, ( number | null )[]>;
  holes: number;
}>();

// Emits
const emit = defineEmits<{
  ( event: 'update:score', player: string, holeNumber: number, value: number ): void;
  ( event: 'add-player' | 'remove-player', playerName: string ): void;
  ( event: 'add-hole' | 'remove-hole' ): void;
}>();

// Reactive State
const lockPreviousHoles = ref( true );

// Computed Properties
const currentHole = computed( () => {
  const firstNull = Math.min(
    ...Object.values( props.players ).map( ( scores ) => {
      const firstNull = scores.findIndex( ( score ) => score === null );
      return firstNull > -1 ? firstNull : props.holes - 1;
    } ),
  );
  const lastNonNull = Math.max(
    ...Object.values( props.players ).map( ( scores ) => {
      return scores.findLastIndex( ( score ) => score !== null );
    } ),
  );
  return Math.min( firstNull, lastNonNull === -1 ? props.holes - 1 : lastNonNull );
} );

const playerRanks = computed( () => {
  const validHoles: number[] = [];
  for ( let holeIndex = 0; holeIndex < props.holes; holeIndex++ ) {
    const allPlayersHaveValue = Object.values( props.players ).every(
      ( scores ) => scores[holeIndex] !== null,
    );
    if ( allPlayersHaveValue ) {
      validHoles.push( holeIndex );
    }
  }

  if ( validHoles.length === 0 ) {
    return [];
  }

  return Object.entries( props.players )
    .map( ( [player, scores] ) => ( {
      player,
      total: validHoles.reduce( ( total, holeIndex ) => total + ( scores[holeIndex] || 0 ), 0 ),
    } ) )
    .sort( ( a, b ) => a.total - b.total );
} );

// Methods
function calculateTotal( scores: ( number | null )[] ) {
  return scores.reduce( ( total, score ) => ( total ?? 0 ) + ( score || 0 ), 0 );
}

function getPlayerRankClass( player: string ) {
  if ( playerRanks.value.length === 0 ) {
    return '';
  }

  const ranks: { player: string; rank: number }[] = [];
  let currentRank = 0;
  let lastScore: number | null = null;

  playerRanks.value.forEach( ( entry ) => {
    if ( entry.total !== lastScore ) {
      currentRank = ranks.length;
    }
    ranks.push( { player: entry.player, rank: currentRank } );
    lastScore = entry.total;
  } );

  const playerRank = ranks.find( ( entry ) => entry.player === player )?.rank;

  if ( playerRank === 0 ) return 'gold';
  if ( playerRank === 1 ) return 'silver';
  if ( playerRank === 2 ) return 'bronze';
  return '';
}

function getPlayerRowClass( player: string, scores: ( number | null )[] ) {
  const allHolesPlayed = scores.every( ( score ) => score !== null );
  if ( !allHolesPlayed ) {
    return '';
  }
  return getPlayerRankClass( player );
}

function emitAddPlayer() {
  const playerName = prompt( 'Enter the new player\'s name:' );
  if ( playerName ) {
    emit( 'add-player', playerName );
  }
}

function emitRemovePlayer( player: string ) {
  if ( !confirm( `Are you sure you want to remove ${player}?` ) ) {
    return;
  }
  emit( 'remove-player', player );
}

function emitAddHole() {
  emit( 'add-hole' );
}

function emitRemoveHole() {
  emit( 'remove-hole' );
}
</script>

<template>
  <div class="scoreboard">
    <h1>Scoreboard</h1>
    <div class="controls">
      <label>
        <input
          v-model="lockPreviousHoles"
          type="checkbox"
          >
        Lock previous holes
      </label>
      <div class="buttons">
        <button @click="emitAddPlayer">Add Player</button>
        <button @click="emitAddHole">Add Hole</button>
        <button @click="emitRemoveHole">Remove Hole</button>
      </div>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th
              v-for="hole in holes"
              :key="hole"
              >
              {{ hole }}
            </th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(scores, player) in players"
            :key="player"
            :class="getPlayerRowClass(player, scores)"
            >
            <td
              :class="getPlayerRankClass(player)"
              class="player-name">
              <button
                class="delete-button"
                @click="emitRemovePlayer(player)"
                >
                &times;
              </button>
              {{ player }}
            </td>
            <td
              v-for="(score, holeNumber) in scores"
              :key="holeNumber"
              >
              <input
                :value="score"
                :disabled="lockPreviousHoles && holeNumber < currentHole"
                type="number"
                @input="$emit('update:score', player, holeNumber, ($event.target as HTMLInputElement)?.valueAsNumber ?? 0)"
                >
            </td>
            <td>{{ calculateTotal(scores) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.scoreboard {
  font-family: Arial, sans-serif;
  margin: 20px;
}

.controls {
  margin-bottom: 10px;
}

.buttons {
  margin-top: 10px;
}

.buttons button {
  margin-right: 10px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
}

.player-name {
  position: relative;
}

.delete-button {
  display:flex;
  align-items: center;
  justify-content: center;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 100%;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: -6px;
  width: 16px;
  height: 16px;
  font-size: 8px;
  padding: 0
}

.delete-button:hover {
  background-color: #cc0000;
}

.table-container {
  overflow-x: auto; /* Enable horizontal scrolling */
}

table {
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

td:not(:first-child):not(:last-child),
th:not(:first-child):not(:last-child) {
  width: 50px;
}

input[type="number"] {
  width: 40px;
  text-align: center;
}

th {
  background-color: #f4f4f4;
}

td:first-child,
th:first-child {
  position: sticky;
  left: 0px;
  background-color: #f4f4f4;
  z-index: 1;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

td:last-child,
th:last-child {
  position: sticky;
  right: 0px;
  background-color: #f4f4f4;
  z-index: 1;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

/* Rank-specific styles */
.gold {
  background-color: gold !important;
  color: black;
  font-weight: bold;
  
}

.silver {
  background-color: silver !important;
  color: black;
  font-weight: bold;
}

.bronze {
  background-color: #cd7f32 !important;
  color: black;
  font-weight: bold;
}
</style>