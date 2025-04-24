<script setup lang="ts">
const {
  players,
  holes,
  addPlayer,
  removePlayer,
  addHole,
  removeHole,
  updatePlayerScore,
} = usePlayers();
const cards = reactive<[number | null, number | null][]>( [
  [null, null],
  [null, null],
  [null, null],
  [null, null],
] );

const selectedCard = ref<number>( 0 );
const score = ref<number>( 0 );

const isModalVisible = ref<boolean>( false );

function updateSelectedCardWithValue( card: number ) {
  if ( selectedCard.value === null ) {
    selectedCard.value = 0;
    return;
  }

  if ( card === -5 && cards.flat().filter( ( c ) => c === -5 ).length >= 4 ) {
    alert( 'You can only have 4 "-5" cards in the game.' );
    return;
  }

  const cardSet = selectedCard.value % cards.length;
  const cardFromSet = selectedCard.value < cards.length ? 0 : 1;
  cards[cardSet][cardFromSet] = card;
  updateTotalScore();
  if ( selectedCard.value < cards.length * 2 - 1 ) {
    selectedCard.value++;
  } else {
    selectedCard.value = 0;
  }
}

function updateTotalScore() {
  let totalScore = 0;
  const matchedSets: Record<number, number> = {};

  cards.forEach( ( [topCard, bottomCard] ) => {
    if ( topCard === bottomCard && topCard !== null ) {
      matchedSets[topCard] = ( matchedSets[topCard] || 0 ) + 1;
    } else {
      totalScore += ( topCard ?? 0 ) + ( bottomCard ?? 0 );
    }
  } );

  Object.keys( matchedSets ).forEach( ( key ) => {
    const matchedNumber = parseInt( key );
    if ( matchedNumber === -5 ) {
      totalScore -= 5 * 2 * matchedSets[matchedNumber];
      if ( matchedSets[matchedNumber] > 1 ) {
        totalScore -= 10;
      }
    } else if ( matchedSets[matchedNumber] > 1 ) {
      totalScore -= 5 * matchedSets[matchedNumber];
    }
  } );

  score.value = totalScore;
}

function resetBoard() {
  cards.forEach( ( row ) => row.fill( null ) );
  selectedCard.value = 0;
  score.value = 0;
}

function openAddScoreModal() {
  isModalVisible.value = true;
}

onMounted( () => {
  // Initialize the game with one player
  addPlayer( 'Player 1' );
} );
</script>

<template>
  <div>
    <PlayingCardsGrid
      v-model:selected-card="selectedCard"
      :cards="cards"
      class="playing-cards-grid"
      />
    <div class="score">
      <h2>Total Score: {{ score }}</h2>
    </div>
    <CardPicker
      @update:selected-card="updateSelectedCardWithValue"
      />
    <div class="reset-container">
      <button
        :disabled="false && cards.flat().some(card => card === null)"
        @click="openAddScoreModal"
        >
        Add Score to Player
      </button>
      <button
        class="danger"
        @click="resetBoard">Reset</button>
    </div>
    <GolfScoreboard
      :players="players"
      :holes="holes"
      @update:score="updatePlayerScore"
      @add-player="addPlayer"
      @remove-player="removePlayer"
      @add-hole="addHole"
      @remove-hole="removeHole"
      />
    <AddScoreToPlayerModal
      v-if="isModalVisible"
      :is-visible="isModalVisible"
      :players="players"
      :score="score"
      @close="isModalVisible = false"
      @add-score="updatePlayerScore"
      />
  </div>
</template>

<style scoped>
.score {
  position: absolute;
  top: 15px;
  left: 15px;
  
  h2 {
    padding: 0;
    margin: 0;
  }

  @media screen and (max-width: 750px) {
    position: static;
    font-size: 0.75rem;
    text-align: center;
    margin-bottom: 8px;
  }
}

.reset-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
</style>

<style>
body {
  font-family: Arial, Helvetica, sans-serif;
}
.card {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  background-color: #f9f9f9;
  aspect-ratio: 5 / 7;
  cursor: pointer;
  transition: background-color 0.3s;
  height: 120px;
  box-sizing: border-box;
  font-size: 1.5rem;
  color: rgb(17, 17, 17);
  margin: 0;
}
.card:hover {
  background-color: #ecebeb;
}

@media screen and (max-width: 550px) {
  .card {
    font-size: 1.2rem;
    height: 85px;
  }
}

button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 0 5px;
  }
  button.danger {
    background-color: #dc3545;
  }
  button.danger:hover {
    background-color: #c82333;
  }
  button:hover {
    background-color: #0056b3;
  }
</style>