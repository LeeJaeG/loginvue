<template>
    <div>
        <div v-for="button in props.buttons" :key="button.id" class="" :class="props.buttonClass"
            :style="buttonStyles[button.id]" @click="handleClick(button)">
            {{ button.label }}
        </div>
    </div>
</template>
  
<script setup>
import { ref, computed, defineProps } from 'vue';

const emit = defineEmits(['buttonClick'])

const props = defineProps({
    buttons: {
        type: Array,
        required: true,
    },
    buttonStyle: {
        type: Object,
        required: false,
        default() {
            return {
                'bgColor': 'white',
                'activeBgColor': '#0bc279',
                'Color': 'black',
                'activeColor': 'white',
            }
        }
    },
    buttonClass: {
        type: Array,
        required: false,
    }
});

const activeButtonId = ref(null);

const handleClick = (button) => {
    const id = button.id
    emit('buttonClick', button.label)

    // deactivate previously active button if different from current
    if (activeButtonId.value !== null && activeButtonId.value !== id) {
        const previouslyActiveButton = props.buttons.find(button => button.id === activeButtonId.value);
        previouslyActiveButton.active = false;
    }

    // activate or deactivate the clicked button
    const clickedButton = props.buttons.find(button => button.id === id);
    clickedButton.active = !clickedButton.active;

    if (clickedButton.active) {
        activeButtonId.value = id;
    } else {
        activeButtonId.value = null;
    }
};

const buttonStyles = computed(() => {
    const styles = {};
    props.buttons.forEach(button => {
        styles[button.id] = {
            backgroundColor: (button.active && props.buttonStyle.activeBgColor) ? props.buttonStyle.activeBgColor : props.buttonStyle.bgColor,
            color: (button.active && props.buttonStyle.activeColor) ? props.buttonStyle.activeColor : props.buttonStyle.Color,
            'border-bottom': (button.active && props.buttonStyle.activeBorderBottom) ? props.buttonStyle.activeBorderBottom : props.buttonStyle.BorderBottom,
            'border-top': (button.active && props.buttonStyle.activeBorderTop) ? props.buttonStyle.activeBorderTop : props.buttonStyle.BorderTop,
            cursor: 'pointer',
        }
    });
    return styles;
});
</script>
  
<style scoped>
.hovercolor:hover {
    background-color: #81f18ca5 !important;
}
</style>
  