import defaultImage from '@/assets/images/img-media.png';
import bgSectionImage from '@/assets/images/defaultBG.png';
import sectionDemo1 from '@/assets/images/listSection/1.png';
import sectionDemo2 from '@/assets/images/listSection/2.png';
import sectionDemo3 from '@/assets/images/listSection/3.png';
import sectionDemo4 from '@/assets/images/listSection/4.png';
import sectionDemo5 from '@/assets/images/listSection/5.png';
import audioDemo1 from '@/assets/images/listSection/audio_1.png';
import audioDemo2 from '@/assets/images/listSection/audio_2.png';
import audioDemo3 from '@/assets/images/listSection/audio_3.png';
import audioCard from '@/assets/images/listSection/audio_card.png';

export interface TemplateProps {
  id: string;
  html: string;
}

interface STYLE {
  color?: string;
  fontFamily?: string;
  textAlign?: string;
  fontSize?: string;
  fontStyle?: string;
  fontWeight?: string;
  lineHeight?: string;
  whiteSpace?: string;
  backgroundColor?: string;
  width?: string;
}
export interface TEXT_ITEM {
  text: string;
  style: STYLE;
}
export interface BUTTON_EXTERNAL_ITEM {
  text: string;
  link: string;
  style: STYLE;
}
export interface BACKGROUND_SECTION {
  file: File | null;
  urlImage: string;
  color: string;
  urlVideo: string;
  class: string;
}
export interface BOX_IMAGE {
  urlImage: string;
  urlVideo: string;
  file: File | null;
}
export interface AUDIO_SETTING {
  urlImage: string;
  urlVideo: string;
  file: File | null;
  setting: {
    voiceModelId: any;
    pitch: number | null;
    speed: number | null;
    text: string;
    listPhrase: {
      id: string | number | null;
      text: string;
      audioUrl: string;
    }[];
  };
}
export interface AUDIO_ITEM {
  audio: AUDIO_SETTING;
  textSubtitle: TEXT_ITEM;
  textProduction: TEXT_ITEM;
}
export interface SECTION_ITEM {
  idApi?: string;
  id: string;
  textTitle?: TEXT_ITEM;
  textDes?: TEXT_ITEM;
  textProduct?: TEXT_ITEM;
  buttonExternal?: BUTTON_EXTERNAL_ITEM;
  backgroundSection?: BACKGROUND_SECTION;
  imageDemo?: string;
  boxImage?: BOX_IMAGE;
  listAudio?: AUDIO_ITEM[];
}
export type OBJ_SECTION_ITEM =
  | SECTION_ITEM[keyof SECTION_ITEM]
  | AUDIO_ITEM[keyof AUDIO_ITEM]
  | undefined;

export const TEMPLATES_SECTION: SECTION_ITEM[] = [
  {
    id: 'section-one-center',
    textProduct: {
      text: 'Production',
      style: {
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontSize: '18px',
        fontWeight: '400',
        whiteSpace: 'pre-line',
        lineHeight: 'normal',
      },
    },
    textTitle: {
      text: 'Empower \n Growth',
      style: {
        color: '#fff',
        fontFamily: 'Inter',
        textAlign: 'center',
        fontSize: '48px',
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 'normal',
        whiteSpace: 'pre-line',
      },
    },
    buttonExternal: {
      text: 'Learn More',
      link: '',
      style: {
        color: '#fff',
        fontFamily: 'Inter',
        fontSize: '28px',
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 'normal',
        backgroundColor: '#ff6e00',
        whiteSpace: 'pre-line',
        textAlign: 'center',
      },
    },
    backgroundSection: {
      file: null,
      urlImage: bgSectionImage,
      color: '',
      urlVideo: '',
      class: 'bg-img',
    },
    imageDemo: sectionDemo1,
  },
  {
    id: 'section-one-left',
    textTitle: {
      text: 'Empower \n Growth',
      style: {
        color: '#fff',
        fontFamily: 'Inter',
        textAlign: 'left',
        fontSize: '48px',
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 'normal',
        whiteSpace: 'pre-line',
      },
    },
    textDes: {
      text: 'Helvetica Light is an easy-to-read font, with tall and narrow letters, that works well on almost every site.',
      style: {
        color: '#fff',
        fontFamily: 'Inter',
        fontSize: '18px',
        fontWeight: '400',
        lineHeight: 'normal',
        textAlign: 'left',
      },
    },
    buttonExternal: {
      text: 'Learn More',
      link: '',
      style: {
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontSize: '28px',
        fontWeight: '600',
        lineHeight: 'normal',
        whiteSpace: 'pre-line',
        backgroundColor: '#ff6e00',
      },
    },
    backgroundSection: {
      file: null,
      urlImage: bgSectionImage,
      color: '',
      urlVideo: '',
      class: 'bg-img',
    },
    imageDemo: sectionDemo2,
  },
  {
    id: 'section-one-right',
    textTitle: {
      text: 'Empower \n Growth',
      style: {
        color: '#fff',
        fontFamily: 'Inter',
        textAlign: 'left',
        fontSize: '48px',
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 'normal',
        whiteSpace: 'pre-line',
      },
    },
    textDes: {
      text: 'Helvetica Light is an easy-to-read font, with tall and narrow letters, that works well on almost every site.',
      style: {
        color: '#fff',
        fontFamily: 'Inter',
        fontSize: '18px',
        fontWeight: '400',
        lineHeight: 'normal',
        textAlign: 'left',
      },
    },
    buttonExternal: {
      text: 'Learn More',
      link: '',
      style: {
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontSize: '28px',
        fontWeight: '600',
        lineHeight: 'normal',
        whiteSpace: 'pre-line',
        backgroundColor: '#ff6e00',
      },
    },
    backgroundSection: {
      file: null,
      urlImage: bgSectionImage,
      color: '',
      urlVideo: '',
      class: 'bg-img',
    },
    imageDemo: sectionDemo3,
  },
  {
    id: 'section-two',
    textProduct: {
      text: 'Production',
      style: {
        fontFamily: 'Inter',
        fontSize: '18px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 'normal',
        whiteSpace: 'pre-line',
        textAlign: 'center',
      },
    },
    textTitle: {
      text: 'Empower \n Growth',
      style: {
        fontFamily: 'Inter',
        fontSize: '48px',
        whiteSpace: 'pre-line',
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 'normal',
        textAlign: 'center',
      },
    },
    buttonExternal: {
      text: 'Learn More',
      link: '',
      style: {
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontSize: '28px',
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 'normal',
        backgroundColor: '#ff6e00',
        whiteSpace: 'pre-line',
        width: 'fit-content',
      },
    },
    boxImage: {
      urlImage: defaultImage,
      urlVideo: '',
      file: null,
    },
    backgroundSection: {
      file: null,
      urlImage: '',
      color: '#fff',
      urlVideo: '',
      class: 'bg-color',
    },
    imageDemo: sectionDemo4,
  },
  {
    id: 'section-two-reverse',
    textProduct: {
      text: 'Production',
      style: {
        fontFamily: 'Inter',
        fontSize: '18px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 'normal',
        whiteSpace: 'pre-line',
        textAlign: 'center',
      },
    },
    textTitle: {
      text: 'Empower \n Growth',
      style: {
        fontFamily: 'Inter',
        fontSize: '48px',
        whiteSpace: 'pre-line',
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 'normal',
        textAlign: 'center',
      },
    },
    buttonExternal: {
      text: 'Learn More',
      link: '',
      style: {
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontSize: '28px',
        fontStyle: 'normal',
        fontWeight: '600',
        whiteSpace: 'pre-line',
        lineHeight: 'normal',
        backgroundColor: '#ff6e00',
        width: 'fit-content',
      },
    },
    boxImage: {
      file: null,
      urlImage: defaultImage,
      urlVideo: '',
    },
    backgroundSection: {
      file: null,
      urlImage: '',
      color: '#fff',
      class: 'bg-color',
      urlVideo: '',
    },
    imageDemo: sectionDemo5,
  },
];
export const TEMPLATES_AUDIO: SECTION_ITEM[] = [
  {
    id: 'audio-section',
    textTitle: {
      text: 'Empower \n Growth',
      style: {
        color: '#000',
        fontFamily: 'Inter',
        textAlign: 'center',
        fontSize: '48px',
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 'normal',
        whiteSpace: 'pre-line',
      },
    },
    listAudio: [
      {
        audio: {
          urlImage: audioCard,
          urlVideo: '',
          file: null,
          setting: {
            voiceModelId: {},
            pitch: 1,
            speed: 1,
            text: '',
            listPhrase: [
              {
                id: null,
                text: '',
                audioUrl: '',
              },
            ],
          },
        },
        textSubtitle: {
          text: 'Subtitle',
          style: {
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '28px',
            fontStyle: 'normal',
            fontWeight: '600',
            lineHeight: 'normal',
            whiteSpace: 'pre-line',
            textAlign: 'center',
          },
        },
        textProduction: {
          text: 'Production',
          style: {
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 'normal',
            whiteSpace: 'pre-line',
            textAlign: 'center',
          },
        },
      },
    ],
    imageDemo: audioDemo1,
    backgroundSection: {
      file: null,
      urlImage: '',
      color: '#fff',
      urlVideo: '',
      class: 'bg-color',
    },
  },
  {
    id: 'audio-section',
    textTitle: {
      text: 'Empower \n Growth',
      style: {
        color: '#000',
        fontFamily: 'Inter',
        textAlign: 'center',
        fontSize: '48px',
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 'normal',
        whiteSpace: 'pre-line',
      },
    },
    listAudio: [
      {
        audio: {
          urlImage: audioCard,
          file: null,
          urlVideo: '',
          setting: {
            voiceModelId: {},
            pitch: 1,
            speed: 1,
            text: '',
            listPhrase: [
              {
                id: null,
                text: '',
                audioUrl: '',
              },
            ],
          },
        },
        textSubtitle: {
          text: 'Subtitle',
          style: {
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '28px',
            fontStyle: 'normal',
            fontWeight: '600',
            lineHeight: 'normal',
            whiteSpace: 'pre-line',
            textAlign: 'center',
          },
        },
        textProduction: {
          text: 'Production',
          style: {
            fontFamily: 'Inter',
            color: '#000',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 'normal',
            whiteSpace: 'pre-line',
            textAlign: 'center',
          },
        },
      },
      {
        audio: {
          urlImage: audioCard,
          file: null,
          urlVideo: '',
          setting: {
            voiceModelId: {},
            pitch: 1,
            speed: 1,
            text: '',
            listPhrase: [
              {
                id: 'null',
                text: '',
                audioUrl: '',
              },
            ],
          },
        },
        textSubtitle: {
          text: 'Subtitle',
          style: {
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '28px',
            fontStyle: 'normal',
            fontWeight: '600',
            lineHeight: 'normal',
            whiteSpace: 'pre-line',
            textAlign: 'center',
          },
        },
        textProduction: {
          text: 'Production',
          style: {
            fontFamily: 'Inter',
            color: '#000',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 'normal',
            whiteSpace: 'pre-line',
            textAlign: 'center',
          },
        },
      },
    ],
    imageDemo: audioDemo2,
    backgroundSection: {
      file: null,
      urlImage: '',
      color: '#fff',
      urlVideo: '',
      class: 'bg-color',
    },
  },
  {
    id: 'audio-section',
    textTitle: {
      text: 'Empower \n Growth',
      style: {
        color: '#000',
        fontFamily: 'Inter',
        textAlign: 'center',
        fontSize: '48px',
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 'normal',
        whiteSpace: 'pre-line',
      },
    },
    listAudio: [
      {
        audio: {
          urlImage: audioCard,
          file: null,
          urlVideo: '',
          setting: {
            voiceModelId: {},
            pitch: 1,
            speed: 1,
            text: '',
            listPhrase: [
              {
                id: null,
                text: '',
                audioUrl: '',
              },
            ],
          },
        },
        textSubtitle: {
          text: 'Subtitle',
          style: {
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '28px',
            fontStyle: 'normal',
            fontWeight: '600',
            lineHeight: 'normal',
            whiteSpace: 'pre-line',
            textAlign: 'center',
          },
        },
        textProduction: {
          text: 'Production',
          style: {
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 'normal',
            whiteSpace: 'pre-line',
            textAlign: 'center',
          },
        },
      },
      {
        audio: {
          urlImage: audioCard,
          file: null,
          urlVideo: '',
          setting: {
            voiceModelId: {},
            pitch: 1,
            speed: 1,
            text: '',
            listPhrase: [
              {
                id: null,
                text: '',
                audioUrl: '',
              },
            ],
          },
        },
        textSubtitle: {
          text: 'Subtitle',
          style: {
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '28px',
            fontStyle: 'normal',
            fontWeight: '600',
            lineHeight: 'normal',
            whiteSpace: 'pre-line',
            textAlign: 'center',
          },
        },
        textProduction: {
          text: 'Production',
          style: {
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 'normal',
            whiteSpace: 'pre-line',
            textAlign: 'center',
          },
        },
      },
      {
        audio: {
          urlImage: audioCard,
          file: null,
          urlVideo: '',
          setting: {
            voiceModelId: {},
            pitch: 1,
            speed: 1,
            text: '',
            listPhrase: [
              {
                id: null,
                text: '',
                audioUrl: '',
              },
            ],
          },
        },
        textSubtitle: {
          text: 'Subtitle',
          style: {
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '28px',
            fontStyle: 'normal',
            fontWeight: '600',
            lineHeight: 'normal',
            whiteSpace: 'pre-line',
            textAlign: 'center',
          },
        },
        textProduction: {
          text: 'Production',
          style: {
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 'normal',
            whiteSpace: 'pre-line',
            textAlign: 'center',
          },
        },
      },
    ],
    imageDemo: audioDemo3,
    backgroundSection: {
      file: null,
      urlImage: '',
      color: '#fff',
      urlVideo: '',
      class: 'bg-color',
    },
  },
];
