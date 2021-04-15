<template>
  <canvas class="webgl"></canvas>
</template>

<script lang="ts">
import GL from '../assets/js/webgl/GL'

export default {
    data() {
        return {
            gl: null as unknown as GL
        }
    },
    mounted() {
        console.log('webGL Mounted', );
        const gl = GL.getInstance()
    },
    methods: {
    }
}

</script>

<style>
</style>
