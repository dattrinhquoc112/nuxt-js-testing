import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import { MethodEnum } from './interface/api';

export const useProjectStore = defineStore('project', () => {
  const apiStore = useApiStore();

  async function getProjectList() {
    // TODO: waiting API
    // return apiStore.apiRequest({
    //   method: MethodEnum.GET,
    //   endpoint: '/api/v1/projects',
    //   proxy: true,
    // });

    // Mock data
    return {
      data: [
        {
          id: 'item_1',
          thumbnail: new URL(
            '@/assets/images/demo/page_thumbnail.png',
            import.meta.url
          ).href,
          statusActive: 'Pending Publication',
          titlePage: 'A Small Company Event',
          urlPage: 'https://campaign.dev.alice-ai.dev/eventpage/group/ccc',
          periodTime: '2025/01/01-2025/12/31',
          leftDays: 100,
          editedAt: '2025/01/01',
        },
        {
          id: 'item_2',
          thumbnail: new URL(
            '@/assets/images/demo/page_thumbnail.png',
            import.meta.url
          ).href,
          statusActive: 'Not Started',
          titlePage: 'Meow Meow',
          urlPage: 'https://campaign.dev.alice-ai.dev/eventpage/group/ccc',
          periodTime: '2025/01/01-2025/12/31',
          leftDays: 100,
          editedAt: '2025/01/01',
        },
        {
          id: 'item_3',
          thumbnail: new URL(
            '@/assets/images/demo/page_thumbnail.png',
            import.meta.url
          ).href,
          statusActive: 'Started',
          titlePage: 'A Small Company Event',
          urlPage: 'https://campaign.dev.alice-ai.dev/eventpage/group/ccc',
          periodTime: '2025/01/01-2025/12/31',
          leftDays: 100,
          editedAt: '2025/01/01',
        },
        {
          id: 'item_4',
          thumbnail: new URL(
            '@/assets/images/demo/page_thumbnail.png',
            import.meta.url
          ).href,
          statusActive: 'Pending Publication',
          titlePage: 'A Small Company Event',
          urlPage: 'https://campaign.dev.alice-ai.dev/eventpage/group/ccc',
          periodTime: '2025/01/01-2025/12/31',
          leftDays: 100,
          editedAt: '2025/01/01',
        },
        {
          id: 'item_5',
          thumbnail: new URL(
            '@/assets/images/demo/page_thumbnail.png',
            import.meta.url
          ).href,
          statusActive: 'Pending Publication',
          titlePage: 'A Small Company Event',
          urlPage: 'https://campaign.dev.alice-ai.dev/eventpage/group/ccc',
          periodTime: '2025/01/01-2025/12/31',
          leftDays: 100,
          editedAt: '2025/01/01',
        },
      ],
    };
  }

  return {
    getProjectList,
  };
});
