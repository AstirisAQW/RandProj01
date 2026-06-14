import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Minesweeper.css'
import Minesweeper from './presentation/Minesweeper'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Minesweeper />
  </StrictMode>,
)