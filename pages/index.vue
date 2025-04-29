<template>
  <main>
    <div class="container">
      <h1 class="title">{{ $t('title') }}</h1>

      <div class="sample">
        <h2>Get Data Sample</h2>
        <div>sampleData: {{ sampleData }}</div>
        <div>
          sampleStore.sampleRequesting: {{ sampleStore.sampleRequesting }}
        </div>
        <div>sampleStore.sampleData: {{ sampleStore.sampleData }}</div>
        <button @click="sampleGetDataClient()">sampleGetDataClient</button>
        <button @click="sampleGetDataServer()">sampleGetDataServer</button>
      </div>

      <div class="unleash">
        <h2>Unleash Feature Flag</h2>
        <div>flag name: {{ unleashFlagName }}</div>
        <div>flag enabled: {{ enableUnleashFlag }}</div>
      </div>

      <div class="log">
        <h2>Server Log</h2>
        <div>
          <label for="log-level">log level:</label>
          <select id="log-level" name="log-level" v-model="logLevel">
            <option v-for="(option, index) in logLevelOptions" :key="index">
              {{ option.value }}
            </option>
          </select>
        </div>
        <div>
          <label for="log-message">log message:</label>
          <input
            type="text"
            id="log-message"
            name="log-message"
            v-model="logMessage"
          />
        </div>
        <button @click="submitLog()">submit</button>

        <vi-button
          @click="changeLang('en')"
          iconBefore="ic_ai_section"
          type="dangerous-primary"
          >Button</vi-button
        >
        <button @click="changeLang()">changeLang</button>
        <vi-typography type="featured-extra-large">
          featured-extra-large
        </vi-typography>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useFlag } from '@unleash/proxy-client-vue';
import { useSampleStore } from '@/stores/sample';
import {
  LogApplicationSideEnum,
  LogLevelEnum,
  UnleashFlagNameEnum,
} from '@/types/enum';
import { useLogStore } from '@/stores/log';

const sampleData = ref();
const sampleStore = useSampleStore();
async function sampleGetDataClient() {
  await sampleStore.getSampleData({
    proxy: false,
  });
}
async function sampleGetDataServer() {
  await sampleStore.getSampleData({
    proxy: true,
  });
}

const unleashFlagName = UnleashFlagNameEnum.EXAMPLE_FLAG;
const enableUnleashFlag = useFlag(unleashFlagName);

const logStore = useLogStore();
const logLevelOptions = Object.values(LogLevelEnum).map((level) => ({
  value: level,
  text: level,
}));
const logLevel = ref(LogLevelEnum.INFO);
const logMessage = ref('');
async function submitLog() {
  await logStore.submitLog({
    level: logLevel.value as LogLevelEnum,
    applicationSide: LogApplicationSideEnum.CLIENT,
    req: { message: logMessage.value },
  });
}

// TEST LIBRARY
const changeLang = (type = 'zh') => {
  if (process.client) {
    window.VIUIKit.setConfig({ language: type });
  }
};
</script>

<style scoped lang="scss">
.container {
  padding: 10px;

  .title {
    color: $green;
  }

  .sample,
  .unleash,
  .log {
    padding-top: 10px;
  }
}
</style>
