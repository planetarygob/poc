<template>
    <WebGL />
</template>

<script lang="ts">
import WebGL from '../../components/WebGL.vue'
import GL from '../../assets/js/webgl/GL'
import * as THREE from 'three'


export default {
    components: {
        WebGL
    },
    data() {
        return {
            gl: null as unknown as GL
        }
    },
    mounted() {
        const gl = GL.getInstance()
        
    },
    methods: {
    }
}
</script>

<style>
</style>