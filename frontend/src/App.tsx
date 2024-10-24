import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'
import NavBar from './components/NavBar'
import HomePage from './components/HomePage'
import CollectionsPage from './components/CollectionsPage'
import CollectionCardsPage from './components/CollectionCardsPage'
import MintCardPage from './components/MintCardPage'
import UsersPage from './components/UsersPage'

type Canceler = () => void
const useAffect = (
  asyncEffect: () => Promise<Canceler | void>,
  dependencies: any[] = []
) => {
  const cancelerRef = useRef<Canceler | void>()
  useEffect(() => {
    asyncEffect()
      .then(canceler => (cancelerRef.current = canceler))
      .catch(error => console.warn('Uncatched error', error))
    return () => {
      if (cancelerRef.current) {
        cancelerRef.current()
        cancelerRef.current = undefined
      }
    }
  }, dependencies)
}

const useWallet = () => {
  const [details, setDetails] = useState<ethereum.Details>()
  const [contract, setContract] = useState<main.Main>()
  useAffect(async () => {
    const details_ = await ethereum.connect('metamask')
    if (!details_) return
    setDetails(details_)
    const contract_ = await main.init(details_)
    if (!contract_) return
    setContract(contract_)
  }, [])
  return useMemo(() => {
    if (!details || !contract) return
    return { details, contract }
  }, [details, contract])
}
export const App = () => {
  const wallet = useWallet() // Ajout de `loading`
  const [users, setUsers] = useState<string[]>([])
  const [selectedUser, setSelectedUser] = useState<string>('')

  const addUser = (user: string) => {
    if (!users.includes(user)) {
      setUsers([...users, user])
    }
  }

  const [newUser, setNewUser] = useState('')

  const handleAddUser = () => {
    if (newUser) {
      addUser(newUser)
      setNewUser('')
    }
  }

  return (
    <>
      <Router>
        <NavBar
          addUser={addUser}
          setSelectedUser={setSelectedUser}
          users={users}
          selectedUser={selectedUser}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UsersPage users={users}/>} /> 
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:id" element={<CollectionCardsPage />} />
          <Route path="/mint" element={<MintCardPage users={users} />} />
        </Routes>
      </Router>
    </>
  )
}
