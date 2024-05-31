import axios from 'axios';

export interface Prediction {
  label: string;
  probability: number;
}

const baseURL = 'https://aiproject-backend.onrender.com';




export const uploadAudio = async (audioBlob: Blob) => {
  try {

    console.log(audioBlob.type)
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.mp3');

    return await axios.post<Prediction[]>(`${baseURL}/predict`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error('Error uploading audio:', error);
      return [];
    });


  } catch (err) {
    console.error('Error uploading audio:', err);
  }
}


