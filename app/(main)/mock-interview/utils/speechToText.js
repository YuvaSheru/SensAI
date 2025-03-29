export const convertSpeechToText = (audioBlob) => {
  return new Promise((resolve, reject) => {
    try {
      // Check if SpeechRecognition is available
      if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        throw new Error('Speech recognition is not supported in this browser');
      }

      // Create a URL for the audio blob
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Create speech recognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      // Handle recognition results
      recognition.onresult = (event) => {
        console.log('Recognition result:', event.results);
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          console.log('Transcribed text:', transcript);
          URL.revokeObjectURL(audioUrl);
          resolve(transcript);
        } else {
          URL.revokeObjectURL(audioUrl);
          reject(new Error('No transcription result received'));
        }
      };

      // Handle recognition errors
      recognition.onerror = (event) => {
        console.error('Recognition error:', event.error);
        URL.revokeObjectURL(audioUrl);
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      // Handle recognition end
      recognition.onend = () => {
        console.log('Recognition ended');
      };

      // Start recognition when audio starts playing
      audio.onplay = () => {
        console.log('Audio started playing, starting recognition');
        recognition.start();
      };

      // Stop recognition when audio ends
      audio.onended = () => {
        console.log('Audio ended, stopping recognition');
        recognition.stop();
      };

      // Handle audio errors
      audio.onerror = (error) => {
        console.error('Audio error:', error);
        URL.revokeObjectURL(audioUrl);
        reject(new Error('Failed to play audio'));
      };

      // Start playing the audio
      console.log('Starting audio playback');
      audio.play().catch(error => {
        console.error('Play error:', error);
        URL.revokeObjectURL(audioUrl);
        reject(new Error('Failed to play audio'));
      });
    } catch (error) {
      console.error('Speech to text error:', error);
      reject(error);
    }
  });
}; 