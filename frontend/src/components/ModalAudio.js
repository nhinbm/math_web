import React, { useRef, useState } from "react";
import axios from "axios";

const mimeType = "audio/mpeg";

const ModalAudio = ({ open, onClose, onProcessData }) => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);

  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [form, setForm] = useState([]);

  const handleClose = () => {
    setAudio(null);
    onClose(false);
  };

  // const onDownloadCropClick = async (data) => {
  //   await axios
  //     .post("http://127.0.0.1:5000/audio", {
  //       audio: data,
  //     })
  //     .then(function (response) {
  //       console.log(response);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };

  const onDownloadCropClick = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/audio", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      onProcessData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("API MediaRecorder không được hỗ trợ trong trình duyệt của bạn.");
    }
  };

  const startRecording = async () => {
    setRecordingStatus("recording");
    //create new Media recorder instance using the stream
    const media = new MediaRecorder(stream, { type: mimeType });
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();
    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log(audioBlob);
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.mp3");
      // formData.append('audio', audioBlob)
      console.log(formData);

      // onDownloadCropClick(formData)
      setAudio(audioUrl);
      setForm(formData);
      setAudioChunks([]);
    };
  };

  if (!open) return null;
  return (
    <div onClick={handleClose} className="modal-overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modal-container"
      >
        <div className="modal-header">
          <div>Ghi âm câu hỏi của bạn</div>
          <div onClick={handleClose}>X</div>
        </div>

        <main className="modal-audio-button-wrapper">
          <div className="audio-controls">
            {!permission ? (
              <button
                onClick={getMicrophonePermission}
                type="button"
                className="modal-button-cut"
              >
                Cho phép nhận micro
              </button>
            ) : null}

            {permission && recordingStatus === "inactive" ? (
              <button
                onClick={startRecording}
                type="button"
                className="modal-button-cut"
              >
                Bắt đầu ghi âm
              </button>
            ) : null}

            {recordingStatus === "recording" ? (
              <button
                onClick={stopRecording}
                type="button"
                className="modal-button-cut"
              >
                Dừng ghi âm
              </button>
            ) : null}

            {audio ? (
              <div className="audio-container">
                <audio src={audio} controls></audio>
              </div>
            ) : null}
          </div>
        </main>

        {audio ? (
          <button className="modal-button-cut" onClick={onDownloadCropClick}>
            Gửi audio
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ModalAudio;
