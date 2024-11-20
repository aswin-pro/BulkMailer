import { useState } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx'

function App() {

  const [subject, setsubject] = useState("")
  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState(false)
  const [EmailList, setEmailList] = useState([])

  function handlesubject(e) {
    setsubject(e.target.value)
  }

  function handlemsg(e) {
    setmsg(e.target.value)
  }

  function handlefile(event) {
    const file = event.target.files[0]
    const reader = new FileReader()   //creating FileReader object for reading a file

    reader.onload = function (event) {
      const data = event.target.result  //binary format result -raw data
      const workbook = XLSX.read(data, { type: "binary" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
      const totalemail = emailList.map((item) => {
        return item.A
      })
      setEmailList(totalemail)
    }

    reader.readAsBinaryString(file) //Reads the file as a binary string
  }

  function send() {
    setstatus(true) //this is for button status
    setmsg("")
    setsubject("")
    axios.post("http://localhost:5000/sendemail", { sub: subject, msg: msg, emailList: EmailList })
      .then((data) => {
        if (data.data == true) {
          alert("Email Sent Successfully...")
          setstatus(false)
        }
        else {
          alert("Failed to sent email... ")
        }
      })
  }

  return (
    <div className='flex flex-col m-2 mt-16 bg-slate-400 rounded-lg'>
      <div className='border text-center'>
        <h1 className='text-2xl font-medium px-5 py-5'>BulkMail</h1>
      </div>

      <div className='border text-center'>
        <h1 className='text-2xl font-medium px-5 py-5'>We can help your business with sending multiple emails at once</h1>
      </div>

      <div className='border text-center'>
        <textarea onChange={handlesubject} value={subject} className='md:w-[30%] mt-2 py-2 px-2 border border-black focus:outline-none rounded-md ' placeholder='Enter the Subject....'></textarea>
      </div>

      <div className='border flex flex-col items-center px-5 py-3'>
        <textarea onChange={handlemsg} value={msg} className='w-[80%] h-32 py-2 px-2 border border-black focus:outline-none rounded-md ' placeholder='Enter the email text....'></textarea>

        <div>
          <input type="file" onChange={handlefile} className='border-4  border-dashed p-2 py-4 md:px-4 mt-5 mb-5' />
        </div>

        <p>Total Emails in the file: {EmailList.length} </p>
        <button onClick={send} className='bg-blue-800 py-2 px-2 mt-2 text-white font-medium rounded-md w-[100px]'>{status ? "Sending..." : "Send"}</button>
      </div>

    </div>
  )
}

export default App
