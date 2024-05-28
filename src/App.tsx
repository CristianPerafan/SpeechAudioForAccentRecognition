import { useState, useRef } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { uploadAudio } from "./services/axios-client";
import * as lamejs from '@breezystack/lamejs';
import { Prediction } from "./services/axios-client";





function App() {

  /* Audio Recording Management */
  const [result, setResult] = useState<Prediction[]>(); // [1
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {

    setResult(undefined);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log(audioUrl);
        setAudioUrl(audioUrl);

        const reader = new FileReader();

        reader.onload = async function (event) {
          const audioData = new Uint8Array(event.target?.result as ArrayBuffer);
          const int16Array = new Int16Array(audioData); // Convert Uint8Array to Int16Array
          const mp3Encoder = new lamejs.Mp3Encoder(1, 44100, 64);
          const mp3Data = mp3Encoder.encodeBuffer(int16Array); // Use the converted Int16Array
          const mp3Blob = new Blob([mp3Data], { type: 'audio/mpeg' });
          const mp3Url = URL.createObjectURL(mp3Blob);

          console.log(mp3Url);
          // Ahora puedes subir mp3Blob en lugar de audioBlob

          const response = await uploadAudio(mp3Blob);

          if (response) {
            console.log(response);

            // Access to the first element of the array

            setResult(response);
          }
        };
        reader.readAsArrayBuffer(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);


    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  };




  const result_2 = {
    overall: 33,
    pronunciation: 55,
    fluency: 63,
    integrity: 40,
    rhythm: 53,
    speed: 220
  };


  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };


  /* Sentence Management */

  const sentenceList = [
    "It is an old book that has been passed down through generations.",
    "The cat is sleeping peacefully on the cozy windowsill.",
    "The sun is shining brightly in the clear, blue sky.",
    "I like to play soccer with my friends on weekends.",
    "I am going to the store to buy some fresh vegetables and fruits.",
    "The dog is barking loudly at the stranger passing by our house.",
    "The flowers are blooming beautifully in the garden this spring.",
    "The sky is blue with only a few scattered white clouds.",
    "The birds are singing melodious tunes early in the morning.",
    "The children are playing joyfully in the park near our home.",
    "The car is driving smoothly along the winding mountain road.",
    "The rain is falling gently, creating a soothing sound on the roof.",
    "The moon is shining brightly, casting a silver glow over the landscape."
  ];

  const getRandomSentence = () => {
    return sentenceList[Math.floor(Math.random() * sentenceList.length)];
  }

  const [sentence, setSentence] = useState<string>(getRandomSentence());

  const handleSentenceChange = () => {
    setSentence(getRandomSentence());
  };


  function getFlagSrc(label: string) {
    switch (label) {
      case 'australia':
        return 'https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg';
      case 'england':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colombia.svg/200px-Flag_of_Colombia.svg.png';
      case 'indian':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_India.svg/2560px-Flag_of_India.svg.png';
      case 'us':
        return 'https://cdn.britannica.com/33/4833-004-828A9A84/Flag-United-States-of-America.jpg';
    }
  }



  return (
    <>
      <Navbar>
        <NavbarBrand>
          <img className="w-10 h-10 mr-1" src="https://lh3.googleusercontent.com/l-3GewW9Sh1BrPkUWGIrDS9X2jq5Rrsok5nqc6oOkOTwZYjDu2ybePqWBMcZVI4ZZdBm54WEp-Co0W1T2D5C" />
          <p className="font-bold text-inherit">Accent Analyzer</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="#">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="#" aria-current="page">
              Features
            </Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="min-h-screen  bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-4">Speech Assessment of English Accent</h1>
          <p className="mb-4">Please click the microphone and read aloud the following sentence.</p>
          <div className="mb-4">
            <p className="text-3xl font-bold">{sentence}</p>
          </div>
          <Button color="primary" variant="bordered" onClick={handleSentenceChange}>
            Try another one
          </Button>
          <div className="mt-4">
            <Button radius="full" color={isRecording ? "danger" : "primary"} className=" text-white shadow-lg rounded-full w-20 h-20"
              onClick={isRecording ? stopRecording : startRecording} >
              {isRecording ? <FaStop className="w-10 h-10" /> : <FaMicrophone className="w-10 h-10" />}
            </Button>
          </div>



          <div className="mt-8 flex flex-col items-center border-b-2 border-gray-300 pb-4">
            <h2 className="text-xl font-semibold">Results</h2>
            {result && result.map((prediction) => (
              <Card className=" h-20 w-10/12 mt-2 " key={prediction.label}>
                <CardHeader className="flex justify-between items-center">

                  <div className="flex flex-col justify-start">
                    <h1 className="font-bold text-large">{prediction.label.toUpperCase()}</h1>
                    <h2 className="text-tiny uppercase font-bold">Accuracy</h2>
                    <p className="text-tiny font-bold">{(prediction.probability * 100).toFixed(2)}%</p>
                  </div>

                  <div className="flex items-end justify-center">
                    <Image
                      height={70}
                      width={70}
                      src={getFlagSrc(prediction.label)}
                    />
                  </div>

                </CardHeader>
                <CardBody className="overflow-visible py-2">
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>


  )
}

export default App
