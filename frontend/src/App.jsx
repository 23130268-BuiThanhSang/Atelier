import { useEffect, useState } from 'react'
import axios from 'axios'

export default function App() {
    const [msg, setMsg] = useState('Đang kết nối...')

    useEffect(() => {
        axios.get('/api/v1/ping')
            .then((res) => setMsg(res.data.message))
            .catch(() => setMsg('Không kết nối được Backend'))
    }, [])

    return <h1>{msg}</h1>
}