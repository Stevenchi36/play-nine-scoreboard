<script setup lang="ts">
interface Players {
  [playerName: string]: ( number | null )[];
}

// Props
const props = defineProps<{
  isVisible: boolean;
  players: Players;
  score: number;
}>();

// Emits
const emit = defineEmits<{
  ( event: 'close' ): void;
  ( event: 'add-score', player: string, hole: number, score: number ): void;
}>();

// Reactive State
const selectedPlayer = ref<string | null>( null );
const selectedHole = ref<number | null>( null );
const editableScore = ref<number>( 0 );

// Watchers
watch(
  selectedPlayer,
  ( newPlayer ) => {
    if ( !newPlayer ) {
      selectedHole.value = null;
      return;
    }
    selectedHole.value = props.players[newPlayer].findIndex( ( score ) => score === null );
  },
);

// Lifecycle Hook
onMounted( () => {
  const playerWithMostNulls = Object.keys( props.players ).reduce( ( maxPlayer, player ) => {
    const nullCount = props.players[player].filter( ( score ) => score === null ).length;
    const maxNullCount = props.players[maxPlayer]?.filter( ( score ) => score === null ).length || 0;
    return nullCount > maxNullCount ? player : maxPlayer;
  }, '' );

  selectedPlayer.value = playerWithMostNulls;
  editableScore.value = props.score;
} );

// Methods
function closeModal() {
  emit( 'close' );
}

function submitScore() {
  if ( selectedPlayer.value && selectedHole.value !== null ) {
    emit( 'add-score', selectedPlayer.value, selectedHole.value, editableScore.value );
    closeModal();
  } else {
    alert( 'Please select a player and a hole.' );
  }
}
</script>

<template>
  <ModalTemplate
    :is-visible="isVisible"
    :show-action-buttons="true"
    @close="closeModal"
    @submit="submitScore"
    >
    <h3>Add {{ score }} to player</h3>
    <div>
      <label for="player-select">Select Player:</label>
      <select
        id="player-select"
        v-model="selectedPlayer"
        >
        <option
          v-for="(scores, player) in players"
          :key="player"
          :value="player"
          >
          {{ player }}
        </option>
      </select>
      <label for="hole-select">Select Hole:</label>
      <select
        id="hole-select"
        v-model="selectedHole"
        >
        <option
          v-for="(holeScore, holeNumber) in players[selectedPlayer || '']"
          :key="holeNumber"
          :value="holeNumber"
          >
          Hole {{ holeNumber + 1 }}
        </option>
      </select>
      <label for="score-input">Score:</label>
      <input
        id="score-input"
        v-model.number="editableScore"
        type="number"
        min="0"
        >
    </div>
  </ModalTemplate>
</template>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

select {
  width: 100%;
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 10px;
}
</style>