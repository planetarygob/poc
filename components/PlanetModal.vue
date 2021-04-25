<template>
    <section v-if="isDisplayed">
        <div class="ui-gradient ui-gradient--top"></div>
        <div class="wrapper">
            <h2>{{ content.title }}</h2>
            <div class="container">
                <div class="text-content">
                    <p>Née dans les années 1960, la mini-jupe est devenue en France un symbole stylistique célébrant une femme affranchie des codes vestimentaires conservateurs.</p>
                    <p>Si aujourd'hui on la croise sans qu'elle ne fasse sourciller, il n'en n'a pas toujours été ainsi. Lorsqu'elle débarque sur le sol français en 1964, la mini-jupe est un OMNI (objet mode non-identifié) qui, s'il séduit la jeunesse s'attire rapidement les foudres des plus conservateurs.</p>
                    <p>Pour bien comprendre le bouleversement occasionné par ce petit bout de tissu, il faut rappeler qu'à cette époque, les femmes portaient des jupes longues et que le comble de l'indécence était de laisser apparaître un genou. Dans cette ère ultra-conservatrice, une femme a pourtant osé braver les interdits.</p>
                </div>
                <div class="img-content">
                    <div class="img img--large"></div>
                    <div class="img img--small"></div>
                    <div class="img img--small"></div>
                </div>
            </div>
            <div class="container">
                <div class="video"></div>
            </div>
            <div class="container">
                <div class="text-content">
                    <p>Elle s'appelle Mary Quant. Elle est britannique et styliste de profession. Pour séduire les clientes de sa boutique, la jeune femme décide de raccourcir les jupes qu'elle vend et d'appeler sa création "mini-jupe" en référence, dit-on, à la voiture Mini dont elle raffole.</p>
                </div>
                <div class="text-content">
                    <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit aliqua dolor.</p>
                </div>
            </div>
            <button @click="isDisplayed = false">Terminer la lecture</button>
        </div>
        <div class="ui-gradient ui-gradient--bot"></div>
    </section>
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
        // TODO : Listen to EventBus.emit(UIEvents.SHOW_PLANET_DETAILS, this.open(planetInfos))
        // NOTE : planetInfos should contain :
        // title: string
        // paragraph : [string]
        // imageUrl: [string]
        // videoUrl: string
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
    section {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        width: 80%;
        height: calc(100% - 8rem);
        border-radius: 2rem;
        background: #26272b;
        color: white;
        overflow-y: scroll;
    }

    .ui-gradient {
        position: sticky;
        left: 0;
        background: linear-gradient(#26272b, #9198e500);
        width: 100%;
        height: 10rem;
    }

    .ui-gradient--top {
        top: -1rem;
    }

    .ui-gradient--bot {
        bottom: -1rem;
        transform: rotate(180deg);
    }

    .wrapper {
        padding: 2rem 4rem;
    }

    .container {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: fit-content;
        margin: 2rem auto;
    }

    h2 {
        font-weight: bold;
        text-transform: uppercase;
        font-size: 32px;
    }

    .text-content {
        width: calc(50% - 2rem);
    }

    .text-content > p {
        margin-bottom: 1rem;
    }

    .img-content {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        width: calc(50% - 2rem);
    }

    .img {
        background-color: red;
        width: 50px;
        height: 50px;
        border-radius: 1rem;
    }

    .img--large {
        width: 100%;
        height: calc(100%/3*2 - 1rem);
    }
    
    .img--small {
        width: calc(50% - .5rem);
        height: calc(100%/3);
        align-self: flex-end;
    }

    .video {
        background-color: blue;
        width: 100%;
        height: 300px;
        border-radius: 1rem;
    }

    button {
        text-transform: uppercase;
        font-weight: bold;
        padding: .5rem 2rem;
        border: 1px solid white;
        border-radius: 2rem;
        margin: auto;
        width: fit-content;
        display: block;
    }
</style>
