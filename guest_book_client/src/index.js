import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'
import './styles/main.css'
import { Note } from './components/note'


const baseURL = 'http://localhost:8000'

const App = () => {
    const [modalVisible, setModalVisible] = useState(false)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [posts, setPosts] = useState([])

    const createNote = async (event) => {
        event.preventDefault()

        const newRequest = new Request(
            `${baseURL}/posts/`,
            {
                body:JSON.stringify({title, content}),
                headers: {"Content-Type": "Application/Json"},
                method: "POST",
            }
        )

        const response = await fetch(newRequest);
        const data = await response.json()

        if (response.ok) {
            console.log(data)
        } else {
            console.log('Failed Network Request')
        }

        setTitle('')
        setContent('')

        getAllPosts()
        setModalVisible(false)
    }

    const deleteItem = async (noteId) => {
        console.log(noteId)

        const response = await fetch(`${baseURL}/posts/${noteId}/`, {method: "DELETE"})

        if (response.ok) {
            console.log(response.status)
        }

        getAllPosts()
    }

    const getAllPosts = async () => {
        const response = await fetch(`${baseURL}/posts/`)
        const data = await response.json()

        if (response.ok) {
            console.log(data)
            setPosts(data)
        } else {
            console.log('Failed Network Request')
        }
    }

    useEffect(() => {
        getAllPosts()
    },[])

    return (
        <div>
            <div className="header">
                <div className="logo">
                    <p className="title">Guest Book</p>
                </div>
                <div className="add-section">
                    <a className="add-btn" href='#' onClick={()=>setModalVisible(true)}>
                        Add Note
                    </a>
                </div>
            </div>
            {
                posts.length > 0 ?
                    (
                        <div className="post-list">
                            {
                                posts.map((item) => (
                                    <Note title={item.title}
                                          content={item.content}
                                          remove={() => deleteItem(item.id)}
                                          key={item.id}
                                    />
                                ))
                            }
                        </div>
                    )
                    :
                    (
                        <div className="posts">
                            <p className="center-text">No Posts Yet</p>
                        </div>
                    )
            }
            <div className={modalVisible? "modal" : "modal-not-visible"}>
                <div className="form">
                    <div className="form-header">
                        <div>
                            <p className="form-header-text">Create a Note</p>
                        </div>
                        <div>
                            <a className="close-btn" href="#" onClick={()=>setModalVisible(!modalVisible)}>X</a>
                        </div>
                    </div>
                    <form action="">
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input className="form-control" type="text" name="title" id="title" value={title} onChange={(e)=>setTitle(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="content">Content</label>
                            <textarea
                                className="form-control"
                                name="content"
                                id="content"
                                // col="30"
                                rows="10"
                                value={content}
                                onChange={(e)=>setContent(e.target.value)}>
                            </textarea>
                        </div>
                        <div className="form-group">
                            <input className="btn" type="submit" value="Save" onClick={createNote} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)