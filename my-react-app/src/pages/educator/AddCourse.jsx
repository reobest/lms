import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill';
import { assets } from '../../assets/assets/assets';
import uniqid from 'uniqid'
import { Link } from 'react-router-dom'
const AddCourse = () => {
  const [addChapter, setAddChapter] = useState(false)
  const [lecturePopUp, setLecturePopUp] = useState(false)
  const [image, setImage] = useState("")
  const [title, setTitle] = useState("")
  const [heading, setHeading] = useState("")
  const [discount, setDiscount] = useState("")
  const [coursePrice, setCoursePrice] = useState("")


  const [colapse, setColapse] = useState(false)

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureURL: "",
    isPreviewFree: false,
  })
  const [chapter, setChapter] = useState([])
  const [currentChapterId, setCurrentChapterId] = useState('')
  const editorRef = useRef(null)
  const quillInstance = useRef(null);
  const handleChapter = () => {
    setAddChapter(true)
    const name = prompt("Enter Chapter Name")
    const newId = uniqid()
    setCurrentChapterId(newId)
    const newChapter = {
      chapterId: newId,
      chapterTitle: name,
      chapterContent: [],
      chapterOrder: Number(chapter.length + 1),
    }
    setChapter([...chapter, newChapter])
  }
  // console.log(lecturePopUp);
  const handleSubmitLectures = (e) => {
    e.preventDefault()
    setChapter((prevChapters) =>
      prevChapters.map((chap) => {
        if (chap.chapterId === currentChapterId) {
          return {
            ...chap,
            chapterContent: [
              ...chap.chapterContent,
              {
                ...lectureDetails,
                lectureOrder:
                  chap.chapterContent.length > 0
                    ? chap.chapterContent.slice(-1)[0].lectureOrder + 1
                    : 1,
                lectureId: uniqid(),
              },
            ],
          };
        }
        return chap;
      })
    )


    setLecturePopUp(false)
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureURL: "",
      isPreviewFree: false,
    })
  }
  const deleteChapter = (id) => {
    console.log(id);

    const undeletedChapters = chapter.filter((ch) => ch.chapterId != id)
    setChapter(undeletedChapters)
  }
  const handleDeleteLecture = (chapterId, lectureId) => {
    setChapter((prevChapters) =>
      prevChapters.map((chap) => {
        if (chap.chapterId === chapterId) {
          return {
            ...chap,
            chapterContent: chap.chapterContent.filter(
              (lecture) => lecture.lectureId !== lectureId
            ),
          };
        }
        return chap;
      })
    );
  }
  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
  }, [])
  useEffect(() => {
    console.log("Updated Chapters:", chapter);
  }, [chapter]);
  return (
    <div>
      <form className='flex items-start flex-col p-8 gap-6'>
        <div className='flex flex-col gap-2'>
          <label htmlFor="title" className='text-gray-500 text-md'>
            Course title
          </label>
          <input type="text" id='title' placeholder='Type here' value={title} onChange={(e) => setTitle(e.target.value)}
            className='outline-none border border-gray-500/70 rounded-md w-[310px] md:w-[480px] h-[40px] pl-3' />
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor="heading" className='text-gray-500 text-md'>
            Course Headings
          </label>
          <input type="text" id='heading' placeholder='Type here' value={heading} onChange={(e) => setHeading(e.target.value)}
            className='outline-none border border-gray-500/70 rounded-md  w-[310px] md:w-[480px] h-[40px] pl-3' />
        </div>
        <div className=' w-[310px] md:w-[480px] h-[80px]'>
          <div ref={editorRef} ></div>
        </div>
        <div className='flex items-center mt-[100px] md:mt-[50px] gap-22 md:gap-36'>
          <div className='flex flex-col gap-2'>
            <label htmlFor="course-price" className='text-gray-500 text-md'>
              Course Price
            </label>
            <input type="number" id='course-price' value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)}
              className='w-[70px] md:w-[140px] border border-gray-500/80 h-[40px] rounded-sm pl-4 text-gray-500' defaultValue="0" />
          </div>
          <div className='flex items-center gap-3'>
            <label htmlFor="image" className='text-[14px] text-gray-500 cursor-pointer'>
              Course Thumbnail
              <input type="file" id='image' className="hidden" onChange={(e) => setImage(e.target.files[0])} />
            </label>
            <img src={assets.file_upload_icon} alt="dropdown" className='w-7 h-7' />
            <img src={image ? URL.createObjectURL(image) : ''} alt="image" className='w-7 h-7' />
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor="discount" className='text-gray-500 text-md'>
            Discount
          </label>
          <input type="number" min={0} max={100} defaultValue={0} id='discount' placeholder='Type here' value={discount} onChange={(e) => setDiscount(e.target.value)}
            className='w-[140px] border border-gray-500/80 h-[40px] rounded-sm pl-4 text-gray-500' />
        </div>
        {addChapter && chapter && chapter.map((chapt, i) => (
          <div key={i} className={`flex flex-col w-[310px] md:w-[480px] rounded-md bg-gray-500/5`}>
            <div className='flex justify-between bg-gray-400/10 py-4 px-3 border-x-white border-t-white border border-b-gray-300'>
              <div className='flex items-center gap-2'>
                <img src={assets.down_arrow_icon} alt="arrow-down" className='cursor-pointer' onClick={() => setColapse(prev => !prev)} />
                <p className='text-gray-800 text-[16px]'>{chapt.name}</p>
              </div>
              <p className='text-gray-800 text-[16px]'>{chapt.chapterContent?.length || 0}</p>
              <img src={assets.cross_icon} alt="croos-icon" className='cursor-pointer' onClick={() => deleteChapter(chapt.chapterId)} />
            </div>
            <div className={`p-4 ${colapse ? 'hidden' : 'block'}`}>
              {chapter && chapt?.chapterContent?.map((lecture, index) => {
                return <div key={index} className={`flex justify-between items-center ${colapse ? 'h-0' : ''}`}>
                  <p className='text-gray-500 flex items-center text-[16px] font-ligh'>
                    <span>{index + 1}-{lecture.lectureTitle}-</span>
                    <span>{lecture.lectureDuration}-</span>
                    <Link to={`/${lecture.lectureURL}`} className='text-blue-500'>Link-</Link>
                    <span className='text-blue-500'>{lecture.isPreviewFree ? 'Preview' : ''}</span>
                  </p>
                  <img src={assets.cross_icon} className='cursor-pointer' alt="cross-icon" onClick={() => handleDeleteLecture(chapt.chapterId, lecture.lectureId)} />
                </div>
              })}
              <div className={`p-4`}>
                <button onClick={(e) => {
                  e.preventDefault()
                  setCurrentChapterId(chapt.chapterId);
                  setLecturePopUp(true)
                }} className='text-gray-800 bg-gray-400/40 text-[16px] h-[40px] w-[140px] cursor-pointer hover:bg-gray-400/80'>+ Add Lectures</button>
              </div>
            </div>

          </div>
        ))}
        <button onClick={handleChapter} type='button'
          className='h-[40px] w-[310px] md:w-[480px] rounded-md bg-blue-600 text-white cursor-pointer hover:bg-blue-500'>+ Add Chapter</button>
        {lecturePopUp && (
          <div className='bg-black/50 fixed bottom-0 top-0 left-0 right-0 z-50 flex justify-center items-center'>
            <div className='w-[350px] h-[450px] bg-white rounded-md flex flex-col p-4'>
              <div className='flex justify-between items-center'>
                <p>Add Lecture</p>
                <img src={assets.cross_icon} className='cursor-pointer' alt="cross" onClick={() => setLecturePopUp(false)} />
              </div>
              <div className='flex flex-col gap-2 mt-[20px]'>
                <label htmlFor="ltitle" className='text-gray-500 text-md'>
                  Lecture title
                </label>
                <input type="text" id='ltitle' placeholder='Type here' value={lectureDetails.lectureTitle} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                  className='outline-none border border-gray-500/70 rounded-md  h-[40px] pl-3' />
              </div>
              <div className='flex flex-col gap-2 mt-[20px]'>
                <label htmlFor="duration" className='text-gray-500 text-md'>
                  Duration  Minutes
                </label>
                <input type="text" id='duration' placeholder='Type here' value={lectureDetails.lectureDuration} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                  className='outline-none border border-gray-500/70 rounded-md  h-[40px] pl-3' />
              </div>
              <div className='flex flex-col gap-2 mt-[20px]'>
                <label htmlFor="url" className='text-gray-500 text-md'>
                  Lecture URL
                </label>
                <input type="text" id='url' placeholder='Type here' value={lectureDetails.lectureURL} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureURL: e.target.value })}
                  className='outline-none border border-gray-500/70 rounded-md  h-[40px] pl-3' />
              </div>
              <div className='flex items-center gap-2 mt-[20px]'>
                <label htmlFor="preview" className='text-gray-500 text-md'>
                  Is preview Free?
                </label>
                <input type="checkbox" id='preview' placeholder='Type here' value={lectureDetails.isPreviewFree} onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                  className='outline-none border border-gray-500/70 rounded-md  h-[20px] pl-3' />
              </div>
              <button className='bg-blue-600 text-white h-[40px] mt-[40px] hover:bg-blue-500' onClick={handleSubmitLectures}>Add</button>
            </div>
          </div>
        )
        }
        <button className='w-[90px] h-[40px] bg-black text-white'>ADD</button>
      </form>

    </div>
  )
}

export default AddCourse