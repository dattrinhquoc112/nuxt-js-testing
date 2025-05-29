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
export const TEMPLATES_SECTION = [
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
      urlImg: bgSectionImage,
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
      urlImg: bgSectionImage,
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
      urlImg: bgSectionImage,
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
      imgUrl: defaultImage,
      imgVideo: '',
    },
    backgroundSection: {
      urlImg: '',
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
      imgUrl: defaultImage,
      imgVideo: '',
    },
    backgroundSection: {
      urlImg: '',
      color: '#fff',
      class: 'bg-color',
      urlVideo: '',
    },
    imageDemo: sectionDemo5,
  },
];
export const TEMPLATES_AUDIO = [
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
          setting: {
            voiceModelId: null,
            pitch: null,
            speed: null,
            text: null,
            listPhrase: [
              {
                text: '',
                audioUrl: '',
              },
            ],
          },
        },
        urlBackground: '',
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
      urlImg: '',
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
          urlVideo: '',
          setting: {
            voiceModelId: null,
            pitch: null,
            speed: null,
            text: null,
            listPhrase: [
              {
                text: '',
                audioUrl: '',
              },
            ],
          },
        },
        urlBackground: '',
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
          urlVideo: '',
          setting: {
            voiceModelId: null,
            pitch: null,
            speed: null,
            text: null,
            listPhrase: [
              {
                text: '',
                audioUrl: '',
              },
            ],
          },
        },
        urlBackground: '',
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
      urlImg: '',
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
          urlVideo: '',
          setting: {
            voiceModelId: null,
            pitch: null,
            speed: null,
            text: null,
            listPhrase: [
              {
                text: '',
                audioUrl: '',
              },
            ],
          },
        },
        urlBackground: '',
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
          urlVideo: '',
          setting: {
            voiceModelId: null,
            pitch: null,
            speed: null,
            text: null,
            listPhrase: [
              {
                text: '',
                audioUrl: '',
              },
            ],
          },
        },
        urlBackground: '',
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
          urlVideo: '',
          setting: {
            voiceModelId: null,
            pitch: null,
            speed: null,
            text: null,
            listPhrase: [
              {
                text: '',
                audioUrl: '',
              },
            ],
          },
        },
        urlBackground: '',
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
      urlImg: '',
      color: '#fff',
      urlVideo: '',
      class: 'bg-color',
    },
  },
];
