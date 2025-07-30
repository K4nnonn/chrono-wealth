export const checkBrowserSupport = () => {
  const unsupported = [];
  
  if (!navigator.mediaDevices?.getUserMedia) {
    unsupported.push('Microphone access');
  }
  
  // Type-safe check for speech recognition
  const globalWindow = window as any;
  if (!globalWindow.speechRecognition && !globalWindow.webkitSpeechRecognition) {
    unsupported.push('Speech recognition');
  }
  
  return {
    isSupported: unsupported.length === 0,
    unsupportedFeatures: unsupported
  };
};