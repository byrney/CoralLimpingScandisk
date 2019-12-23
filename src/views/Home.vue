<template>
  <div class="home">
  <p> This is an edit</p>
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg=" to Your Vue.js Application"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  }
}
</script>
