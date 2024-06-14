<template>
  <div>
    <button @click="toggleFormVisibility" class="btn btn-secondary mt-3">{{ showForm ? 'Hide Form' : 'Generate Haiku' }}</button>
    <div v-if="showForm" class="prompt-form-container start-50 translate-middle-x p-1">
      <form @submit.prevent="generateResponse">
        <!-- Theme Input -->
        <div class="mb-3">
          <label for="themeInput" class="form-label">Theme:</label>
          <input
            type="text"
            class="form-control"
            id="themeInput"
            v-model="theme"
            placeholder="Enter the theme..."
            required
          />
        </div>

        <!-- Mood Input -->
        <div class="mb-3">
          <label for="moodInput" class="form-label">Your Mood Today:</label>
          <input
            type="text"
            class="form-control"
            id="moodInput"
            v-model="mood"
            placeholder="Describe your mood..."
            required
          />
        </div>

        <button type="submit" class="btn btn-primary">Generate</button>
      </form>
      <div v-if="hokku" class="hokku-response mt-3">
        <h5>Generated Hokku:</h5>
        <p>{{ hokku.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PromptForm",
  data() {
    return {
      theme: "",
      mood: "",
      hokku: null,
      showForm: false
    };
  },
  methods: {
    generateResponse() {
      const url = "http://localhost:8082/hokku"; // Replace with your actual endpoint
      axios
        .post(url, null, {
          params: {
            theme: this.theme,
            mood: this.mood,
          },
        })
        .then((response) => {
          this.hokku = response.data; // Handle the response data
          console.log("Hokku received:", this.hokku);
          this.$emit("hokku-received", this.hokku); // Emit the received hokku
          this.theme = ""; // Reset the theme
          this.mood = ""; // Reset the mood if necessary
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    toggleFormVisibility() {
      this.showForm = !this.showForm;
    }
  },
};
</script>

<style scoped>
.prompt-form-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 5px;
  width: 500px;
  margin: 0 auto; /* Center horizontally */
  margin-top: 20px; /* Add margin to fit with other content */
  margin-bottom: 100px;
  z-index: 1000; /* Ensures the form is layered above other elements */
}

.hokku-response {
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 5px;
  margin-top: 20px;
}

.hokku-response h5 {
  font-weight: bold;
}

.hokku-response h7 {
  font-style: italic;
}
</style>