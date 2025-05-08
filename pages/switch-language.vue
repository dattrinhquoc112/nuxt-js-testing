<template>
  <div class="app-container">
    <div class="header">
      <vi-typography type="subtitle-large">
        {{ $t('common-profile-button-button_general_setting') }}
      </vi-typography>
    </div>
    <div class="content">
      <vi-typography type="headline-s" class="py-24">
        {{ $t('common-profile-field-field_language_setting') }}
      </vi-typography>

      <div class="input-dropdown">
        <vi-dropdown
          v-model="language"
          size="small"
          :label="$t('common-profile-title-title_current_language')"
          :listOption="languageOptions"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useSwitchLanguage from '@/composables/switchLanguage';

definePageMeta({
  layout: 'app',
  middleware: ['auth'],
});
const { language, languageOptions } = useSwitchLanguage();
</script>
<style lang="scss" scoped>
.input-dropdown {
  width: 50%;
}
</style>
