import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { QuickCourse } from './pages/QuickCourse'
import { AnalysisCourse } from './pages/AnalysisCourse'
import { FoodAnalysis } from './pages/FoodAnalysis'
import { MyCourse } from './pages/MyCourse'

export const RoutesConfig = () => {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/quick-course' element={<QuickCourse />} />
			<Route path='/analysis-course' element={<AnalysisCourse />} />
			<Route path='/food-analysis' element={<FoodAnalysis />} />
			<Route path='/my-course' element={<MyCourse />} />
		</Routes>
	)
}
