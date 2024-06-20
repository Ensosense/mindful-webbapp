<template>
  <img src="../assets/3.jpg" alt="Example Image" />
  <div class="home">
    <div class="prompt-form-container">
      <PromptForm @hokku-received="handleHokkuReceived" />
    </div>
    <div v-for="hokku in hokkus" :key="hokku.id">
      <div class="blog">
        <h3>{{ hokku.title }}</h3>
        <p>{{ hokku.text }}</p>
        <div class="icons">
          <span class="icons-text">upvote or downvote this article: </span>
          <span class="material-icons">thumb_up</span>
          <span class="material-icons">thumb_down</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import PromptForm from "@/components/PromptForm.vue";

export default {
  components: {
    PromptForm,
  },
  setup() {
    const hokkus = ref([
      {
        title: "Summer Haiku",
        id: 1,
        text: "Gentle breeze whispers, natures song in harmony, summers sweet embrace.",
      },
      {
        title: "Summer melancholy",
        id: 2,
        text: "Sun-kissed fields of gold, natures warm embrace, summers song.",
      },
      { title: "Dreamy summer", id: 3, text: "Cicadas hum loud..." },
    ]);

    const store = useStore();

    const handleHokkuReceived = (hokku) => {
      if (store.state.authToken) {
        // Add the received hokku to the list of blogs
        hokkus.value.push({
          title: hokku.title,
          id: hokkus.value.length + 1, // Generate a unique id
        });
      } else {
        alert("You need to log in to save your hokku.");
      }
    };

    onMounted(async () => {
      if (store.state.authToken) {
        // Fetch hokkus from the backend if the user is authenticated
        await store.dispatch("fetchHokkus");
      }
    });

    return {
      hokkus,
      handleHokkuReceived,
    };
  },
};
</script>

<style scoped>
img {
  border-radius: 5px;
  width: 30%;
  height: auto;
  margin-left: 75%;
  margin-bottom: 5%;
  margin-top: 3%;
}
</style>

