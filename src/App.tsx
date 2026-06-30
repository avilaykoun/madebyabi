import { Navigate, Route, Routes } from 'react-router-dom'
import RecipeList from './components/RecipeList'
import RecipeDetail from './components/RecipeDetail'
import StepMode from './components/StepMode'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RecipeList />} />
      <Route path="/recipe/:id" element={<RecipeDetail />} />
      <Route path="/recipe/:id/bake" element={<StepMode />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
