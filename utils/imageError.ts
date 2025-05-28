import ErrorImage from '@/assets/images/no-image.png';

export default (event: Event) => {
  const target = event.target as HTMLImageElement;
  if (target) {
    target.src = ErrorImage;
  }
};
