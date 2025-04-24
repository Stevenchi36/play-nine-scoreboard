<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// Props
defineProps<{
  cards: [number | null, number | null][];
  selectedCard?: number | null;
}>();

// Emits
const emit = defineEmits<{
  ( event: 'update:selectedCard', index: number ): void;
}>();

// Methods
function selectCard( index: number ) {
  emit( 'update:selectedCard', index );
}
</script>

<template>
  <div class="playing-cards-grid">
    <div
      v-for="(card, index) in cards"
      :key="index"
      :class="{
        'match': card[0] === card[1] && card[0] !== null,
      }"
      class="card-sets"
      >
      <div
        class="card"
        :class="{
          selected: selectedCard === index,
        }"
        @click="selectCard(index)"
        >
        {{ card[0] ?? '-' }}
      </div>
      <div
        class="card"
        :class="{ selected: selectedCard === index + cards.length }"
        @click="selectCard(index + cards.length)"
        >
        {{ card[1] ?? '-' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.playing-cards-grid {
  display: flex;
  justify-content: center;

  .card {
    margin: 8px 4px;
    transition: box-shadow 0.3s ease;
  }
}

.card.selected {
  background-color: #d1e7dd; /* Highlight selected card */
  border-color: #0f5132;
}

.match .card {
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.322);
}
</style>