<template>
  <div class="home">
    <h1>{{ msg }}</h1>
    <p>Welcome to your Vue.js website</p>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Hello Vue!'
    }
  }
}
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>    