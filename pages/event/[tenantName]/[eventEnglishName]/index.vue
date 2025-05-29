<script lang="ts" setup>
import { useEventStore } from '~/stores/event';

const { getEvent } = useEventStore();
onMounted(() => {
  getEvent();
});
</script>
