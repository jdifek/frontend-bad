import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { QuickCourse } from './pages/QuickCourse'
import { AnalysisCourse } from './pages/AnalysisCourse'
import { FoodAnalysis } from './pages/FoodAnalysis'
import { MyCourse } from './pages/MyCourse'
import { Feedback } from './pages/Feedback'
import Admin from './pages/Admin'
import Subscription from './pages/Subscription'
import { AdminPanel } from './pages/AdminPanel'

export const RoutesConfig = () => {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/quick-course' element={<QuickCourse />} />
			<Route path='/admin-panel' element={<AdminPanel />} />
			<Route path='/analysis-course' element={<AnalysisCourse />} />
			<Route path='/food-analysis' element={<FoodAnalysis />} />
			<Route path='/my-course' element={<MyCourse />} />
			<Route path='/feedback' element={<Feedback />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/subscription" element={<Subscription />} />


		</Routes>
	)
}
