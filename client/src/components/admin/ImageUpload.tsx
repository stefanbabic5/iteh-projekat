import axios from "axios";
import { useState } from "react";

interface ImageUploadProps {
    onSuccess: (response: any) => void;
}

export default function ImageUpload(props: ImageUploadProps) {
    const [image, setImage] = useState('');
    //@ts-ignore
    function handleImage(e) {
        console.log(e.target.files);
        setImage(e.target.files[0])
    }
    function handleApi() {
        const formData = new FormData()
        formData.append('img', image)
        axios.post('http://localhost:8000/upload', formData).then((res) => {
            console.log(res)
            props.onSuccess(res);
        })
    }
    return (
        <div>
            <input type="file" name="file" onChange={handleImage}/>
            <button onClick={handleApi}>Submit</button>
        </div>
    )
}