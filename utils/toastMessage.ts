type messageType = 'success' | 'error' | 'guide';

const showToastMessage = (title: string, type?: messageType) => {
  const options = {
    title,
    type: type || 'success',
    width: '348px',
    placement: 'bottom-right',
  };
  window.VIUIKit.VIMessage(options);
};

export default showToastMessage;
