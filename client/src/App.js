import React, { Fragment, useState, useRef } from 'react';
import axios from "axios";


function App() {

  const [file, setFile] = useState(null)
  const [imageList, setImageList] = useState([])

  const selectedHandler = e => {
    setFile(e.target.files[0])
  }

  const getImage = () => {
    axios(
      "http://localhost:9000/images/get"
    ).then(response => {

      console.log(response.data.data)
      let names = response.data.data;
      var sendingData = '';
      for (let i = 0; i < names.length; i++) {
        sendingData += names[i].name
        if (i != names.length - 1)
          sendingData += ','
      }
      axios(
        "https://n7jc5nj8bh.execute-api.us-east-1.amazonaws.com/test/presigned-url?fileNames=" + sendingData
      ).then(res => {
        var value = res.data;
        var imageListInfo = [];
        for (let i = 0; i < value.length; i++) {
          var img = value[i].data
          let b64 = new Buffer(img).toString('base64')
          imageListInfo.push("data:image/png;base64, " + b64)
        }
        setImageList(imageListInfo)
      })
        .catch(err => {
        });
    })
  }

  const sendHandler = () => {
    if (!file) {
      alert('you must upload file')
      return
    }

    axios(
      "https://a94t4vajo7.execute-api.us-east-1.amazonaws.com/test/presigned-url?fileName=" +
      file.name
    ).then(response => {
      // Getting the url from response
      const url = response.data.fileUploadURL;

      axios({
        method: "PUT",
        url: url,
        data: file,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(res => {
          const saveData = {
            name: file.name,
            s3bucket: 's3bucket/image',
            s3path: '/',
            timestamp: new Date()
          }

          axios.post('http://localhost:9000/images/post', {
            body: saveData
          }).then(res => {
            alert('image is uploaded')
          }).catch(err => {
            console.error(err)
          })

          document.getElementById('fileinput').value = null

          setFile(null)

          this.setState({
            uploadSuccess: "File upload successfull",
            error: undefined
          });
        })
        .catch(err => {

        });
    });





  }

  return (
    <Fragment>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <a href="#!" className="navbar-brand">Image App</a>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="card p-3">
          <div className="row">
            <div className="col-10">
              <input id="fileinput" onChange={selectedHandler} className="form-control" type="file" />
            </div>
            <div className="col-2">
              <button onClick={sendHandler} type="button" className="btn btn-primary col-12">Upload</button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <div className='row'>
          <div className="col-10">
            <h3>click to show images</h3>
          </div>
          <div className="col-2">
            <button onClick={getImage} type="button" className="btn btn-primary col-12 mb-3">show Image</button>
          </div>
        </div>
        <div className="card p-3">
          <div className="row">

            <div className="col-12">
              <div >
                {
                  imageList.map(image => {
                    return (
                      <img style={{ width: "18%", margin: "1%" }} src={image} />
                    )
                  })
                }

              </div>
            </div>

          </div>

        </div>
      </div>
    </Fragment>
  );
}

export default App;
