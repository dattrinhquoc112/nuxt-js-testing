<template>
  <div
    ref="popupElement"
    class="popup-setting-color"
    :style="{
      visibility: isShow ? 'visible' : 'hidden',
      left: positionControlCurrent?.pageX
        ? `${positionControlCurrent?.pageX}px`
        : '',
      top: positionControlCurrent?.pageY
        ? `${positionControlCurrent?.pageY}px`
        : '',
    }"
  >
    <div class="header">
      <vi-icon name="ic_color" size="24" color="#fff"></vi-icon>
      <div class="ml-8 mr-auto neutral-white-alpha-90-text">
        <vi-typography type="subtitle-large">{{
          $t('landing-editor-modal-color_setting')
        }}</vi-typography>
      </div>
      <vi-icon
        class="neutral-white-alpha-60-text cursor-pointer"
        name="ic_close"
        size="24"
        @click="emit('close')"
      ></vi-icon>
    </div>
    <div class="pa-16">
      <!-- Main Color Box -->
      <div
        class="color-box"
        ref="colorBoxRef"
        :style="{ background: `hsl(${hue}, 100%, 50%)` }"
        @mousedown="startDrag"
      >
        <div class="overlay"></div>
        <div
          class="color-indicator"
          :style="{
            left: `${saturation}%`,
            top: `${100 - lightness}%`,
          }"
        ></div>
      </div>

      <input
        type="range"
        min="0"
        max="360"
        v-model.number="hue"
        class="slider hue"
      />
      <div class="wrap-slider-opacity">
        <div class="color-opacity"></div>
        <input
          type="range"
          min="0"
          max="100"
          v-model.number="opacity"
          class="slider opacity"
          :style="{ '--rgb-color': `${rgb.r},${rgb.g},${rgb.b}` }"
        />
      </div>

      <!-- HEX + Opacity Input -->
      <div class="input-group">
        <vi-typography>{{
          $t('landing-editor-modal-color_hex')
        }}</vi-typography>
        <div class="input-group input-hex">
          <input type="text" v-model="hex" class="hex-input" />
          <vi-divider direction="vertical" width="20px" />
          <div class="opacity-input-group">
            <input
              v-model.number="opacity"
              class="opacity-input"
              @input="onInputPercent"
            />
            <span class="percent-sign">%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useCheckHeightPopup from '~/composables/checkHeightPopupSetting';

const props = defineProps({
  positionControlCurrent: {
    type: Object,
    default: () => ({}),
  },
  isShow: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'close',
  'move-popup-to-top',
  'move-popup-to-bottom',
  'change-color',
]);

const hue = ref<number>(180);
const saturation = ref<number>(50);
const lightness = ref<number>(50);
const opacity = ref<number>(100);
const hex = ref<string>('#FF6E00');
const colorBoxRef = ref<HTMLElement | null>(null);
const rgb = ref<{ r: number; g: number; b: number }>({ r: 255, g: 110, b: 0 });

const popupElement = ref<HTMLElement>();
useCheckHeightPopup(props, popupElement, emit);

watch([hue, saturation, lightness], () => {
  const result = hslToRgb(
    hue.value / 360,
    saturation.value / 100,
    lightness.value / 100
  );
  rgb.value = result;
  hex.value = rgbToHex(result.r, result.g, result.b);
  if (props.isShow) {
    emit('change-color', { ...rgb.value, a: opacity.value });
  }
});
watch(opacity, () => {
  if (props.isShow) {
    emit('change-color', { ...rgb.value, a: opacity.value });
  }
});
watch(hex, () => {
  const rgbConvert = hexToRgb(hex.value);
  if (props.isShow) {
    emit('change-color', { ...rgbConvert, a: opacity.value });
  }
});

watch(
  () => props.isShow,
  () => {
    if (!props.isShow) {
      hue.value = 180;
      saturation.value = 50;
      lightness.value = 50;
      opacity.value = 100;
      hex.value = '#FF6E00';
      rgb.value = { r: 255, g: 110, b: 0 };
    }
  }
);

const isDragging = ref(false);

function updateColor(event: MouseEvent): void {
  if (!colorBoxRef.value) return;

  const rect = colorBoxRef.value.getBoundingClientRect();
  const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
  const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);

  const sat = (x / rect.width) * 100;
  const light = 100 - (y / rect.height) * 100;

  saturation.value = sat;
  lightness.value = light;
}

function startDrag(event: MouseEvent): void {
  isDragging.value = true;
  updateColor(event);
  window.addEventListener('mousemove', updateColor);
  window.addEventListener('mouseup', stopDrag);
}

function stopDrag(): void {
  isDragging.value = false;
  window.removeEventListener('mousemove', updateColor);
  window.removeEventListener('mouseup', stopDrag);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const hexPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;

  if (!hexPattern.test(hex)) {
    return null;
  }

  let hexConvert = hex.slice(1);

  if (hexConvert.length === 3) {
    hexConvert = hexConvert
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const r = parseInt(hexConvert.slice(0, 2), 16);
  const g = parseInt(hexConvert.slice(2, 4), 16);
  const b = parseInt(hexConvert.slice(4, 6), 16);

  return { r, g, b };
}

function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
      .toUpperCase()
  );
}

const onInputPercent = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value.trim();

  if (value === '') {
    target.value = '';
    return;
  }

  if (!/^\d+$/.test(value)) {
    target.value = '';
    return;
  }

  const number = Number(value);

  if (number < 0) {
    target.value = '0';
  } else if (number > 100) {
    target.value = '100';
  } else {
    target.value = number.toString();
  }
};
</script>

<style lang="scss" scoped>
.popup-setting-color {
  position: fixed;
  z-index: 20;
  width: 322px;
  padding-bottom: 16px;
  border-radius: 8px;
  border: 1px solid $neutral-white-alpha-10;
  background: $brand-navy-800;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25),
    0px 0px 4px 0px rgba(0, 0, 0, 0.15);
  &.show-on-top {
    transform: translateX(-50%) translateY(-100%);
  }
  &.show-on-bottom {
    transform: translateX(-50%);
  }
  &.for-bg-section {
    transform: translateX(calc(-100% + 56px));
  }
  .header {
    padding: 16px 16px 8px 16px;
    display: flex;
    align-items: center;
    width: 100%;
  }

  .color-box {
    position: relative;
    width: 100%;
    height: 160px;
    border-radius: 6px;
    cursor: crosshair;
    margin-bottom: 10px;

    .overlay {
      position: absolute;
      inset: 0;
      border-radius: 6px;
      background: linear-gradient(to right, #fff, transparent),
        linear-gradient(to top, #000, transparent);
    }
    .color-indicator {
      position: absolute;
      width: 12px;
      height: 12px;
      border: 2px solid #fff;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
  }

  .slider {
    width: 100%;
    -webkit-appearance: none;
    background: transparent;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #fff;
      cursor: pointer;
      border: 1px solid #333;
    }

    &::-webkit-slider-runnable-track {
      height: 16px;
      border-radius: 4px;
    }
    &.hue {
      background: linear-gradient(
        to right,
        #f00 0%,
        #ff0 17%,
        #0f0 33%,
        #0ff 50%,
        #00f 67%,
        #f0f 83%,
        #f00 100%
      );
    }
    &.opacity {
      background: linear-gradient(
        to right,
        rgba(var(--rgb-color), 0) 0%,
        rgba(var(--rgb-color), 1) 100%
      );
    }
  }
  .wrap-slider-opacity {
    position: relative;
    height: fit-content;
    margin-top: 10px;
    margin-bottom: 10px;
    height: 16px;
    input {
      position: absolute;
      top: 0;
      left: 0;
    }
    .color-opacity {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: calc(100% - 1px);
      background-position: 0 0, 0 5px, 5px -5px, -5px 0;
      background-size: 10px 10px;
      background-image: linear-gradient(45deg, #ced3d6 25%, #0000 0),
        linear-gradient(-45deg, #ced3d6 25%, #0000 0),
        linear-gradient(45deg, #0000 75%, #ced3d6 0),
        linear-gradient(-45deg, #0000 75%, #ced3d6 0);
    }
  }

  .input-group {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;

    .input-hex {
      background-color: $neutral-white-alpha-7;
      border: 0.5px solid $neutral-white-alpha-10;
      border-radius: 4px;
      padding: 6px 8px;
    }

    .hex-input {
      background-color: transparent;
      border: none;
      border-radius: 4px;
      border: none;
      outline: none;
      color: #fff;
      flex: 1;
      width: 0px;
    }

    .opacity-input-group {
      display: flex;
      align-items: center;
      gap: 8px;

      .opacity-input {
        width: 30px;
        background-color: transparent;
        border: none;
        outline: none;
        border-radius: 4px;
        color: #fff;
        text-align: right;
      }

      .percent-sign {
        margin-left: 4px;
      }
    }
  }
}
</style>
