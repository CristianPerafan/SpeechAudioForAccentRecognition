import axios from 'axios';

export interface Prediction {
  label: string;
  probability: number;
}

const baseURL = 'http://3.86.23.109';




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


