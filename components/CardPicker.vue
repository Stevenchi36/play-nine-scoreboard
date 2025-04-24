<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// Props
defineProps<{
  selectedCard?: number | null;
}>();

// Emits
const emit = defineEmits<{
  ( event: 'update:selectedCard', card: number ): void;
}>();

// Reactive State
const cards = [-5, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Methods
function selectCard( card: number ) {
  emit( 'update:selectedCard', card );
}
</script>


<template>
  <div class="card-picker-grid">
    <button
      v-for="card in cards"
      :key="card"
      class="card"
      :class="{ selected: selectedCard === card }"
      @click="selectCard(card)"
      >
      {{ card }}
    </button>
  </div>
</template>

<style scoped>
.card-picker-grid {
  display: grid;
  grid-template-columns: repeat(14, max-content);
  justify-content: center;
  gap: 8px;
}

@media screen and (max-width: 1500px) {
  .card-picker-grid {
    grid-template-columns: repeat(7, max-content);
  }
}

@media screen and (max-width: 750px) {
  .card-picker-grid {
    grid-template-columns: repeat(4, max-content);
  }

  .card-picker-grid > :nth-last-child(2) {
    grid-column: 2
  }
  .card-picker-grid > :last-child {
    grid-column: 3;
  }
}

.card.selected {
  background-color: #d1e7dd;
  border-color: #0f5132;
}
</style>