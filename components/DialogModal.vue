<template>
    <article v-if="isDisplayed">
        <p>Sa longueur doit permettre aux femmes de se déplacer librement, qu’elle soit pratique.</p>
    </article>
</template>

<script lang="ts">
import EventBusManager from '~/assets/js/managers/EventBusManager'

export default {
    data() {
        return {
            isDisplayed: true,
            content: {
                title : ""
            }
        }
    },
    mounted() {
        EventBusManager.getInstance().emitter.on("ui:display_planet_modal", () => this.isDisplayed = true)
    },
    methods: {
        open(title: string) {
            this.content.title = title
        },
        close() {
            console.log("je ferme")
        }
    }
}

</script>

<style scoped>
    article {
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: #26272b;
        color: white;
        font-size: .8em;
        line-height: 1.75;
        padding: 2rem 2rem;
        margin-bottom: 75px;
        cursor: default;
        border-left: 5px solid #7956b2;
    }

    article::after {
        content: '';
        margin-top: -2.5rem;
        padding-top: 0px;
        position: relative;
        bottom: -4rem;
        left: 0;
        border-width: 2.5rem 0 0 2.5rem;
        border-style: solid;
        border-color: #26272b transparent;
        display: block;
        width: 0;
    }

    p:before {
        content: "“";
        font-family: Georgia;
        font-size: 40px;
        line-height: 0;
        display: inline-block;
        display: -webkit-inline-box;
    }
</style>
