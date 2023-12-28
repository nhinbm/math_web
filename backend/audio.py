import whisper
import requests
import os


def transform_audio(raw_link):
    model = whisper.load_model("base")
    file_name = download_blob(raw_link)
    if file_name != None:
        link = "./data/" + file_name
        result = model.transcribe(link, fp16=False)
        print(result)
        return result

def download_blob(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            file_extension = os.path.splitext(url)[1]
            file_name = f"blob_{file_extension}.mp3"

            # Open a file with the specified name in binary write mode
            with open("./data", "wb") as file:
                file.write(response.content)
            print(f"Blob downloaded successfully")
            return file_name
        else:
            print(f"Failed to download blob")
    except Exception as e:
        print(f"Error downloading blob: {e}")
