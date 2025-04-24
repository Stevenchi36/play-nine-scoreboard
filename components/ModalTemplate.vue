<script setup lang="ts">
// Props
defineProps<{
  isVisible: boolean;
  showActionButtons?: boolean;
}>();

// Emits
const emit = defineEmits<( event: 'close' | 'submit' ) => void>();

// Methods
function closeModal() {
  emit( 'close' );
}

function submitAction() {
  emit( 'submit' );
}
</script>

<template>
  <div
    v-if="isVisible"
    class="modal-overlay"
    @click="closeModal"
    >
    <div
      class="modal-content"
      @click.stop
      >
      <slot />
      <div
        v-if="showActionButtons"
        class="modal-actions"
        >
        <button
          class="close-button"
          @click="closeModal"
          >
          Close
        </button>
        <button
          class="submit-button"
          @click="submitAction"
          >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
}

.close-button,
.submit-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.close-button {
  background-color: #f5f5f5;
  color: #333;
}

.close-button:hover {
  background-color: #e0e0e0;
}

.submit-button {
  background-color: #007bff;
  color: white;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>